-- Mental Health App database schema (PostgreSQL 14+)
-- Purpose:
-- 1) Store high-volume sensor readings
-- 2) Track PHQ-9-style question cycles and responses over time
-- 3) Preserve complete assessment snapshots for analytics

BEGIN;

-- UUID generation helper
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- Core user table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_auth_id TEXT UNIQUE,
  email TEXT,
  display_name TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Mood entries
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood_type') THEN
    CREATE TYPE mood_type AS ENUM ('happy', 'good', 'okay', 'sad');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'energy_level') THEN
    CREATE TYPE energy_level AS ENUM ('high', 'medium', 'low');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS mood_entry (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  timestamp_ms BIGINT NOT NULL,
  mood mood_type NOT NULL,
  energy energy_level,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mood_entry_user_time
  ON mood_entry (user_id, timestamp_ms DESC);

-- -----------------------------------------------------------------------------
-- Sensor data
-- Strategy: one event table + typed payload in JSONB for flexibility.
-- Keep a small set of common columns indexed for fast time-range queries.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sensor_type') THEN
    CREATE TYPE sensor_type AS ENUM ('location', 'accelerometer', 'microphone');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS sensor_event (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  sensor sensor_type NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  source_device_time_ms BIGINT,

  -- Optional denormalized fields for common filtering/analytics
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  metering_db DOUBLE PRECISION,

  -- Full reading payload from app SDK
  payload JSONB NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_event_user_sensor_time
  ON sensor_event (user_id, sensor, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_event_user_time
  ON sensor_event (user_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_event_payload_gin
  ON sensor_event USING GIN (payload);

-- -----------------------------------------------------------------------------
-- PHQ-9 question metadata
-- version allows future questionnaire changes without data loss
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questionnaire (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,              -- e.g. 'PHQ9'
  title TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (code, version)
);

CREATE TABLE IF NOT EXISTS questionnaire_question (
  id BIGSERIAL PRIMARY KEY,
  questionnaire_id BIGINT NOT NULL REFERENCES questionnaire(id) ON DELETE CASCADE,
  question_order SMALLINT NOT NULL,
  question_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (questionnaire_id, question_order)
);

CREATE TABLE IF NOT EXISTS questionnaire_option (
  id BIGSERIAL PRIMARY KEY,
  questionnaire_id BIGINT NOT NULL REFERENCES questionnaire(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 3),
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (questionnaire_id, score)
);

-- -----------------------------------------------------------------------------
-- Cycles: the key unit for "questions asked every cycle"
-- One record per cycle per user.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cycle_status') THEN
    CREATE TYPE cycle_status AS ENUM ('scheduled', 'active', 'completed', 'expired', 'cancelled');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS question_cycle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  questionnaire_id BIGINT NOT NULL REFERENCES questionnaire(id) ON DELETE RESTRICT,
  cycle_number INTEGER NOT NULL CHECK (cycle_number > 0),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  status cycle_status NOT NULL DEFAULT 'scheduled',
  scheduled_count SMALLINT NOT NULL DEFAULT 0,
  answered_count SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, questionnaire_id, cycle_number)
);

CREATE INDEX IF NOT EXISTS idx_question_cycle_user_status_start
  ON question_cycle (user_id, status, starts_at DESC);

-- -----------------------------------------------------------------------------
-- Each scheduled question inside a cycle
-- slot_index tracks order in cycle (1..N)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cycle_question_instance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES question_cycle(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES questionnaire_question(id) ON DELETE RESTRICT,
  slot_index SMALLINT NOT NULL CHECK (slot_index > 0),
  notification_id TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  asked_at TIMESTAMPTZ,

  -- Response fields (nullable until answered)
  answered_at TIMESTAMPTZ,
  selected_score SMALLINT CHECK (selected_score BETWEEN 0 AND 3),
  selected_label TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (cycle_id, slot_index),
  UNIQUE (notification_id)
);

CREATE INDEX IF NOT EXISTS idx_cycle_question_cycle_schedule
  ON cycle_question_instance (cycle_id, scheduled_for);

CREATE INDEX IF NOT EXISTS idx_cycle_question_unanswered
  ON cycle_question_instance (cycle_id, answered_at)
  WHERE answered_at IS NULL;

-- -----------------------------------------------------------------------------
-- Optional: completed full PHQ-9 assessments (from Quick Check screen)
-- Answers stored as JSON array for simplicity: [0,1,2,1,0,0,2,1,0]
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'phq_severity') THEN
    CREATE TYPE phq_severity AS ENUM ('minimal', 'minor', 'moderate', 'moderatelySevere', 'severe');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS phq_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  questionnaire_id BIGINT NOT NULL REFERENCES questionnaire(id) ON DELETE RESTRICT,
  cycle_id UUID REFERENCES question_cycle(id) ON DELETE SET NULL,
  taken_at TIMESTAMPTZ NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 27),
  severity phq_severity NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phq_assessment_user_time
  ON phq_assessment (user_id, taken_at DESC);

CREATE INDEX IF NOT EXISTS idx_phq_assessment_user_severity
  ON phq_assessment (user_id, severity, taken_at DESC);

-- -----------------------------------------------------------------------------
-- Trigger: keep question_cycle.answered_count in sync automatically
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_cycle_answered_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE question_cycle qc
  SET answered_count = sub.cnt,
      updated_at = NOW()
  FROM (
    SELECT cycle_id, COUNT(*)::SMALLINT AS cnt
    FROM cycle_question_instance
    WHERE cycle_id = COALESCE(NEW.cycle_id, OLD.cycle_id)
      AND answered_at IS NOT NULL
    GROUP BY cycle_id
  ) sub
  WHERE qc.id = sub.cycle_id;

  -- In case count became 0, ensure reset.
  UPDATE question_cycle
  SET answered_count = 0,
      updated_at = NOW()
  WHERE id = COALESCE(NEW.cycle_id, OLD.cycle_id)
    AND NOT EXISTS (
      SELECT 1
      FROM cycle_question_instance
      WHERE cycle_id = COALESCE(NEW.cycle_id, OLD.cycle_id)
        AND answered_at IS NOT NULL
    );

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_cycle_answered_count_on_cqi ON cycle_question_instance;

CREATE TRIGGER trg_cycle_answered_count_on_cqi
AFTER INSERT OR UPDATE OR DELETE ON cycle_question_instance
FOR EACH ROW
EXECUTE FUNCTION fn_update_cycle_answered_count();

-- -----------------------------------------------------------------------------
-- Seed PHQ-9 metadata (idempotent)
-- -----------------------------------------------------------------------------
INSERT INTO questionnaire (code, title, version, description)
VALUES ('PHQ9', 'Patient Health Questionnaire-9', 1, 'Standard PHQ-9 questionnaire')
ON CONFLICT (code) DO NOTHING;

WITH q AS (
  SELECT id AS questionnaire_id
  FROM questionnaire
  WHERE code = 'PHQ9'
  LIMIT 1
)
INSERT INTO questionnaire_option (questionnaire_id, score, label)
SELECT q.questionnaire_id, v.score, v.label
FROM q
JOIN (
  VALUES
    (0, 'Not at all'),
    (1, 'Several days'),
    (2, 'More than half the days'),
    (3, 'Nearly every day')
) AS v(score, label)
ON TRUE
ON CONFLICT (questionnaire_id, score) DO NOTHING;

WITH q AS (
  SELECT id AS questionnaire_id
  FROM questionnaire
  WHERE code = 'PHQ9'
  LIMIT 1
)
INSERT INTO questionnaire_question (questionnaire_id, question_order, question_text)
SELECT q.questionnaire_id, v.question_order, v.question_text
FROM q
JOIN (
  VALUES
    (1, 'Little interest or pleasure in doing things'),
    (2, 'Feeling down, depressed, or hopeless'),
    (3, 'Trouble falling or staying asleep, or sleeping too much'),
    (4, 'Feeling tired or having little energy'),
    (5, 'Poor appetite or overeating'),
    (6, 'Feeling bad about yourself, or that you are a failure or have let yourself or your family down'),
    (7, 'Trouble concentrating on things, such as reading or watching television'),
    (8, 'Moving or speaking slowly, or being so fidgety/restless that others could notice'),
    (9, 'Thoughts that you would be better off dead, or of hurting yourself in some way')
) AS v(question_order, question_text)
ON TRUE
ON CONFLICT (questionnaire_id, question_order) DO NOTHING;

COMMIT;
