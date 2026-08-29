# LensFind — AI Photo Finder

A photographer-first event gallery concept: **scan a QR → take a selfie → find the photos you're in.**

## Phase 1 — UI / Prototype ✅

- Photographer dashboard with event statistics
- Live event cards and event management view
- Create-event modal with prototype state
- Guest photo-search landing page
- Browser selfie/camera capture UI
- Demo AI match results with filters
- Event QR/share page
- Responsive mobile navigation and layouts

## Phase 2 — Functional Website 🚧

The repository now contains the backend foundation for the real application:

- Node.js + Express REST API
- PostgreSQL schema for events and photo metadata
- Google Drive image ingestion using a service account
- Idempotent Drive sync (`POST /api/events/:id/sync`)
- Real QR generation endpoint (`GET /api/events/:id/qr`)
- Event and photo API endpoints
- Environment-variable configuration with secrets excluded from Git

See [`backend/README.md`](backend/README.md) for setup and API details.

### Phase 2 flow

```text
Photographer creates event + Drive folder ID
                ↓
          PostgreSQL event
                ↓
      Google Drive sync API
                ↓
      Photo metadata in DB
                ↓
       Guest QR / event URL
```

## Phase 3 — AI

- Face detection
- Face embeddings / recognition
- Group-photo matching
- Configurable similarity threshold
- Fast vector search

## Phase 4 — Deployment

- Production environment configuration
- Database setup and migrations
- Backend hosting + domain/HTTPS configuration
- Monitoring and operational documentation

## Important

The GitHub Pages site is only the frontend. A real Phase 2 deployment needs a separately hosted backend and PostgreSQL database. Google service-account credentials and database secrets must be stored in the backend host's secret manager/environment variables, never in this repository.

Production biometric processing must include clear user consent, secure handling of selfies/face embeddings, event-level access controls, retention/deletion policies, and compliance with applicable privacy laws.
