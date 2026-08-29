# AI Photo Finder API — Phase 2

Node.js/Express backend for event management, PostgreSQL persistence, Google Drive image ingestion, and QR generation.

## Local setup

1. Install Node.js 20+.
2. Create a PostgreSQL database.
3. Run `schema.sql` against that database.
4. Copy `.env.example` to `.env` and fill in the values.
5. Create a Google Cloud service account with Drive API access and share each event's Drive folder with the service-account email as Viewer.
6. Run:

```bash
npm install
npm start
```

The API runs on `http://localhost:8080` by default.

## Endpoints

- `GET /api/health`
- `GET /api/events`
- `POST /api/events` — `{ name, eventDate, location, driveFolderId }`
- `POST /api/events/:id/sync` — imports image metadata from Drive
- `GET /api/events/:id/photos`
- `GET /api/events/:id/qr`

## Security notes

Never commit `.env`, Google private keys, service-account JSON, database credentials, or guest selfies. Production should add photographer authentication, event access tokens, rate limiting, audit logs, and explicit biometric consent/retention controls before real face recognition is enabled.
