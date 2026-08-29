# AI Photo Finder API — Phase 2

Node.js/Express backend for event management, PostgreSQL persistence, Google Drive image ingestion, and QR generation.

## Your Google Drive folder

The folder supplied for this project is:

`10wRXIJvlNs-w15YRPJ0Mpw60rhylPmW9`

The API can use this as `GOOGLE_DRIVE_FOLDER_ID` for the default event folder, or you can provide a different folder ID when creating an event.

Google Drive access is authenticated server-side. The folder must be shared with the Google service-account email used by the backend. Google Drive permissions on a folder propagate to its child files.

## Local setup

1. Install Node.js 20+.
2. Create a PostgreSQL database, or run `docker compose up -d postgres`.
3. Copy `.env.example` to `.env` and fill in the database and Google service-account credentials.
4. Enable the Google Drive API in the Google Cloud project.
5. Share the event folder with the service-account email as Viewer.
6. Run `npm install` then `npm start`.

The API runs on `http://localhost:8080` by default. `npm start` applies `schema.sql` automatically before starting the server.

## Docker

From `backend/`:

```bash
docker compose up --build
```

## Production deployment

`render.yaml` contains a deployment blueprint for a Node service plus PostgreSQL. The hosting provider still needs to be connected to the GitHub repository and the private Google service-account values must be entered as protected environment variables. Do not commit those values to GitHub.

Required production variables:

- `DATABASE_URL`
- `DATABASE_SSL=true`
- `FRONTEND_URL=https://prodiptasarkar12.github.io/ai-photo-finder`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (or `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`)
- `GOOGLE_DRIVE_FOLDER_ID=10wRXIJvlNs-w15YRPJ0Mpw60rhylPmW9`

## Endpoints

- `GET /api/health`
- `GET /api/events`
- `POST /api/events` — `{ name, eventDate, location, driveFolderId }`
- `POST /api/events/:id/sync` — imports image metadata from Drive
- `GET /api/events/:id/photos`
- `GET /api/events/:id/qr`

## Security notes

Never commit `.env`, Google private keys, service-account JSON, database credentials, or guest selfies. Production should add photographer authentication, event access tokens, rate limiting, audit logs, and explicit biometric consent/retention controls before real face recognition is enabled.
