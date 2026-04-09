# Backend (Data Connect / Relational API)

This backend receives mobile sync calls and writes to PostgreSQL tables.

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Set `DATABASE_URL` in `.env`.

3. Install deps:

```bash
npm install
```

4. Run DB schema from frontend docs:

- `../frontend-app/docs/sql/mental_health_schema.sql`

5. Start dev server:

```bash
npm run dev
```

Server default URL: `http://localhost:8080`

## API routes used by mobile app

- `POST /v1/users/:userId/mood-entries`
- `GET /v1/users/:userId/mood-entries?limit=500`
- `POST /v1/users/:userId/phq-assessments`
- `GET /v1/users/:userId/phq-assessments?limit=100`
- `PATCH /v1/users/:userId/profile`
- `GET /v1/users/:userId/profile`
- `POST /v1/users/:userId/sensor-buckets/upsert`

All routes require Firebase Auth bearer token in `Authorization: Bearer <idToken>`.

## Mobile config

Frontend reads base URL from app config:

- `frontend-app/app.json` -> `expo.extra.dataConnectApiBaseUrl`

For Android emulator, `http://10.0.2.2:8080` points to local machine.
