import "dotenv/config";
import express from "express";
import cors from "cors";

import { requireAuth, assertUserMatch } from "./auth";
import { pool, withTransaction } from "./db";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "db unavailable" });
  }
});

app.post("/v1/users/:userId/mood-entries", requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  const entry = req.body as {
    id: string;
    timestamp: number;
    mood: string;
    energy?: string;
    note?: string;
  };

  try {
    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO app_user (external_auth_id)
         VALUES ($1)
         ON CONFLICT (external_auth_id) DO NOTHING`,
        [userId],
      );

      await client.query(
        `INSERT INTO mood_entry (id, user_id, timestamp_ms, mood, energy, note)
         VALUES (
           $1,
           (SELECT id FROM app_user WHERE external_auth_id = $2),
           $3, $4, $5, $6
         )
         ON CONFLICT (id) DO UPDATE
         SET mood = EXCLUDED.mood,
             energy = EXCLUDED.energy,
             note = EXCLUDED.note`,
        [entry.id, userId, entry.timestamp, entry.mood, entry.energy ?? null, entry.note ?? null],
      );
    });

    return res.status(204).send();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to write mood entry" });
  }
});

app.get("/v1/users/:userId/mood-entries", requireAuth, async (req, res) => {
  const { userId } = req.params;
  const limitRaw = Number(req.query.limit ?? 500);
  const rowLimit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 1000) : 500;

  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT me.id, me.timestamp_ms AS timestamp, me.mood, me.energy, me.note
       FROM mood_entry me
       JOIN app_user u ON u.id = me.user_id
       WHERE u.external_auth_id = $1
       ORDER BY me.timestamp_ms DESC
       LIMIT $2`,
      [userId, rowLimit],
    );

    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to load mood entries" });
  }
});

app.post("/v1/users/:userId/phq-assessments", requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  const assessment = req.body as {
    id: string;
    timestamp: number;
    score: number;
    severity: "minimal" | "minor" | "moderate" | "moderatelySevere" | "severe";
    answers: number[];
  };

  try {
    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO app_user (external_auth_id)
         VALUES ($1)
         ON CONFLICT (external_auth_id) DO NOTHING`,
        [userId],
      );

      await client.query(
        `INSERT INTO phq_assessment (id, user_id, questionnaire_id, taken_at, score, severity, answers)
         VALUES (
           $1,
           (SELECT id FROM app_user WHERE external_auth_id = $2),
           (SELECT id FROM questionnaire WHERE code = 'PHQ9' ORDER BY version DESC LIMIT 1),
           TO_TIMESTAMP($3 / 1000.0),
           $4,
           $5,
           $6::jsonb
         )
         ON CONFLICT (id) DO UPDATE
         SET score = EXCLUDED.score,
             severity = EXCLUDED.severity,
             answers = EXCLUDED.answers`,
        [
          assessment.id,
          userId,
          assessment.timestamp,
          assessment.score,
          assessment.severity,
          JSON.stringify(assessment.answers),
        ],
      );
    });

    return res.status(204).send();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to write assessment" });
  }
});

app.get("/v1/users/:userId/phq-assessments", requireAuth, async (req, res) => {
  const { userId } = req.params;
  const limitRaw = Number(req.query.limit ?? 100);
  const rowLimit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 1000) : 100;

  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         pa.id,
         (EXTRACT(EPOCH FROM pa.taken_at) * 1000)::bigint AS timestamp,
         pa.score,
         pa.severity,
         pa.answers
       FROM phq_assessment pa
       JOIN app_user u ON u.id = pa.user_id
       WHERE u.external_auth_id = $1
       ORDER BY pa.taken_at DESC
       LIMIT $2`,
      [userId, rowLimit],
    );

    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to load assessments" });
  }
});

app.patch("/v1/users/:userId/profile", requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  const body = req.body as { hasOnboarded?: boolean };

  try {
    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO app_user (external_auth_id)
         VALUES ($1)
         ON CONFLICT (external_auth_id) DO NOTHING`,
        [userId],
      );

      if (typeof body.hasOnboarded === "boolean") {
        await client.query(
          `UPDATE app_user
           SET updated_at = NOW()
           WHERE external_auth_id = $1`,
          [userId],
        );
      }
    });

    return res.status(204).send();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to update profile" });
  }
});

app.get("/v1/users/:userId/profile", requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT external_auth_id FROM app_user WHERE external_auth_id = $1 LIMIT 1`,
      [userId],
    );

    return res.json({ hasOnboarded: rows.length > 0 });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to load profile" });
  }
});

app.post("/v1/users/:userId/sensor-buckets/upsert", requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (!assertUserMatch(req, userId)) {
    return res.status(403).json({ error: "forbidden" });
  }

  const body = req.body as {
    sensorType: "location" | "accelerometer" | "microphone";
    bucketStart: string;
    count: number;
    sampleReadings?: unknown[];
    [key: string]: unknown;
  };

  try {
    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO app_user (external_auth_id)
         VALUES ($1)
         ON CONFLICT (external_auth_id) DO NOTHING`,
        [userId],
      );

      await client.query(
        `INSERT INTO sensor_event (user_id, sensor, captured_at, source_device_time_ms, latitude, longitude, metering_db, payload)
         VALUES (
           (SELECT id FROM app_user WHERE external_auth_id = $1),
           $2::sensor_type,
           $3::timestamptz,
           EXTRACT(EPOCH FROM $3::timestamptz) * 1000,
           $4,
           $5,
           $6,
           $7::jsonb
         )`,
        [
          userId,
          body.sensorType,
          body.bucketStart,
          typeof body.avgLat === "number" ? body.avgLat : null,
          typeof body.avgLng === "number" ? body.avgLng : null,
          typeof body.avgDb === "number" ? body.avgDb : null,
          JSON.stringify(body),
        ],
      );
    });

    return res.status(204).send();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "failed to upsert sensor bucket" });
  }
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
