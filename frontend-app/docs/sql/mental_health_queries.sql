-- Mental Health App: operational SQL queries (PostgreSQL 14+)
-- Depends on schema in docs/sql/mental_health_schema.sql
--
-- Parameter style used below:
--   :user_id, :questionnaire_code, :cycle_days, :questions_per_cycle, etc.
-- Replace with your DB client / backend parameter syntax.

-- -----------------------------------------------------------------------------
-- 1) Create next cycle for a user
-- -----------------------------------------------------------------------------
-- Creates the next cycle number atomically and returns cycle id + boundaries.
-- Suggested defaults:
--   :cycle_days = 9
--   :status = 'active'

BEGIN;

WITH q AS (
  SELECT id
  FROM questionnaire
  WHERE code = :questionnaire_code
    AND is_active = TRUE
  ORDER BY version DESC
  LIMIT 1
), next_cycle AS (
  INSERT INTO question_cycle (
    user_id,
    questionnaire_id,
    cycle_number,
    starts_at,
    ends_at,
    status,
    scheduled_count,
    answered_count
  )
  SELECT
    :user_id,
    q.id,
    COALESCE((
      SELECT MAX(cycle_number)
      FROM question_cycle c
      WHERE c.user_id = :user_id
        AND c.questionnaire_id = q.id
    ), 0) + 1,
    NOW(),
    NOW() + (:cycle_days || ' days')::INTERVAL,
    :status::cycle_status,
    0,
    0
  FROM q
  RETURNING id, user_id, questionnaire_id, cycle_number, starts_at, ends_at, status
)
SELECT * FROM next_cycle;

COMMIT;

-- -----------------------------------------------------------------------------
-- 2) Schedule question instances for a cycle
-- -----------------------------------------------------------------------------
-- Inputs expected:
--   :cycle_id UUID
--   :questionnaire_code TEXT (for safety check)
--   :rows JSONB array with shape:
--   [
--     {
--       "slot_index": 1,
--       "question_order": 3,
--       "scheduled_for": "2026-04-10T09:00:00Z",
--       "notification_id": "mental_q_2026-04-10_0"
--     }
--   ]

WITH c AS (
  SELECT c.id AS cycle_id, c.questionnaire_id
  FROM question_cycle c
  JOIN questionnaire q ON q.id = c.questionnaire_id
  WHERE c.id = :cycle_id
    AND q.code = :questionnaire_code
), payload AS (
  SELECT
    (e->>'slot_index')::SMALLINT AS slot_index,
    (e->>'question_order')::SMALLINT AS question_order,
    (e->>'scheduled_for')::TIMESTAMPTZ AS scheduled_for,
    NULLIF(e->>'notification_id', '') AS notification_id
  FROM jsonb_array_elements(:rows::JSONB) e
), mapped AS (
  SELECT
    c.cycle_id,
    qq.id AS question_id,
    p.slot_index,
    p.scheduled_for,
    p.notification_id
  FROM c
  JOIN payload p ON TRUE
  JOIN questionnaire_question qq
    ON qq.questionnaire_id = c.questionnaire_id
   AND qq.question_order = p.question_order
)
INSERT INTO cycle_question_instance (
  cycle_id,
  question_id,
  slot_index,
  notification_id,
  scheduled_for
)
SELECT
  cycle_id,
  question_id,
  slot_index,
  notification_id,
  scheduled_for
FROM mapped
ON CONFLICT (cycle_id, slot_index) DO NOTHING;

-- Keep scheduled_count aligned with actual rows.
UPDATE question_cycle c
SET scheduled_count = sub.cnt,
    updated_at = NOW()
FROM (
  SELECT cycle_id, COUNT(*)::SMALLINT AS cnt
  FROM cycle_question_instance
  WHERE cycle_id = :cycle_id
  GROUP BY cycle_id
) sub
WHERE c.id = sub.cycle_id;

-- -----------------------------------------------------------------------------
-- 3) Fetch unanswered questions in current active cycle
-- -----------------------------------------------------------------------------
-- Returns only pending questions ordered by scheduled time.

SELECT
  c.id AS cycle_id,
  c.cycle_number,
  c.starts_at,
  c.ends_at,
  c.status,
  c.answered_count,
  c.scheduled_count,
  i.id AS instance_id,
  i.slot_index,
  i.notification_id,
  i.scheduled_for,
  qq.question_order,
  qq.question_text
FROM question_cycle c
JOIN questionnaire q
  ON q.id = c.questionnaire_id
JOIN cycle_question_instance i
  ON i.cycle_id = c.id
JOIN questionnaire_question qq
  ON qq.id = i.question_id
WHERE c.user_id = :user_id
  AND q.code = :questionnaire_code
  AND c.status = 'active'
  AND i.answered_at IS NULL
ORDER BY i.scheduled_for ASC, i.slot_index ASC;

-- -----------------------------------------------------------------------------
-- 4) Save a notification answer by notification_id
-- -----------------------------------------------------------------------------
-- This is idempotent: it only writes if not already answered.

UPDATE cycle_question_instance i
SET
  answered_at = COALESCE(i.answered_at, NOW()),
  selected_score = :selected_score,
  selected_label = :selected_label,
  asked_at = COALESCE(i.asked_at, NOW()),
  updated_at = NOW()
WHERE i.notification_id = :notification_id
  AND i.answered_at IS NULL
RETURNING i.id, i.cycle_id, i.slot_index, i.answered_at, i.selected_score;

-- -----------------------------------------------------------------------------
-- 5) Auto-complete cycle when all scheduled questions are answered
-- -----------------------------------------------------------------------------

UPDATE question_cycle c
SET
  status = CASE
    WHEN c.scheduled_count > 0 AND c.answered_count >= c.scheduled_count THEN 'completed'::cycle_status
    ELSE c.status
  END,
  updated_at = NOW()
WHERE c.id = :cycle_id
RETURNING c.id, c.status, c.answered_count, c.scheduled_count;

-- -----------------------------------------------------------------------------
-- 6) Insert full PHQ assessment snapshot (Quick Check)
-- -----------------------------------------------------------------------------
-- :answers_json should be a JSON array, e.g. [0,1,2,1,0,0,2,1,0]

INSERT INTO phq_assessment (
  user_id,
  questionnaire_id,
  cycle_id,
  taken_at,
  score,
  severity,
  answers
)
SELECT
  :user_id,
  q.id,
  :cycle_id,
  COALESCE(:taken_at::TIMESTAMPTZ, NOW()),
  :score,
  :severity::phq_severity,
  :answers_json::JSONB
FROM questionnaire q
WHERE q.code = :questionnaire_code
ORDER BY q.version DESC
LIMIT 1
RETURNING id, user_id, cycle_id, taken_at, score, severity;

-- -----------------------------------------------------------------------------
-- 7) Weekly PHQ-9 trend (last 12 weeks)
-- -----------------------------------------------------------------------------
-- Returns average score and latest severity snapshot per week.

WITH weekly AS (
  SELECT
    date_trunc('week', a.taken_at) AS week_start,
    COUNT(*) AS assessments,
    AVG(a.score)::NUMERIC(10,2) AS avg_score,
    MAX(a.taken_at) AS latest_taken_at
  FROM phq_assessment a
  JOIN questionnaire q ON q.id = a.questionnaire_id
  WHERE a.user_id = :user_id
    AND q.code = :questionnaire_code
    AND a.taken_at >= NOW() - INTERVAL '12 weeks'
  GROUP BY date_trunc('week', a.taken_at)
), latest_severity AS (
  SELECT DISTINCT ON (date_trunc('week', a.taken_at))
    date_trunc('week', a.taken_at) AS week_start,
    a.severity,
    a.score AS latest_score,
    a.taken_at
  FROM phq_assessment a
  JOIN questionnaire q ON q.id = a.questionnaire_id
  WHERE a.user_id = :user_id
    AND q.code = :questionnaire_code
    AND a.taken_at >= NOW() - INTERVAL '12 weeks'
  ORDER BY date_trunc('week', a.taken_at), a.taken_at DESC
)
SELECT
  w.week_start,
  w.assessments,
  w.avg_score,
  l.severity AS latest_severity,
  l.latest_score,
  l.taken_at AS latest_taken_at
FROM weekly w
LEFT JOIN latest_severity l ON l.week_start = w.week_start
ORDER BY w.week_start ASC;

-- -----------------------------------------------------------------------------
-- 8) Daily sensor summary (last N days)
-- -----------------------------------------------------------------------------
-- For location: avg_latitude/avg_longitude if available
-- For microphone: avg_metering_db if available

SELECT
  s.user_id,
  s.sensor,
  date_trunc('day', s.captured_at) AS day,
  COUNT(*) AS samples,
  AVG(s.latitude) AS avg_latitude,
  AVG(s.longitude) AS avg_longitude,
  AVG(s.metering_db) AS avg_metering_db,
  MIN(s.captured_at) AS first_sample_at,
  MAX(s.captured_at) AS last_sample_at
FROM sensor_event s
WHERE s.user_id = :user_id
  AND s.captured_at >= NOW() - (:days || ' days')::INTERVAL
GROUP BY s.user_id, s.sensor, date_trunc('day', s.captured_at)
ORDER BY day DESC, s.sensor;

-- -----------------------------------------------------------------------------
-- 9) Find missed questions in expired or completed cycles
-- -----------------------------------------------------------------------------

SELECT
  c.id AS cycle_id,
  c.cycle_number,
  c.status,
  i.slot_index,
  i.scheduled_for,
  qq.question_order,
  qq.question_text
FROM question_cycle c
JOIN cycle_question_instance i ON i.cycle_id = c.id
JOIN questionnaire_question qq ON qq.id = i.question_id
JOIN questionnaire q ON q.id = c.questionnaire_id
WHERE c.user_id = :user_id
  AND q.code = :questionnaire_code
  AND c.status IN ('expired', 'completed')
  AND i.answered_at IS NULL
ORDER BY c.cycle_number DESC, i.slot_index ASC;
