# LensFind — AI Photo Finder

Phase 1 prototype for an event-photography product where guests scan a QR code, take a selfie, and eventually receive only the event photos they appear in.

## Current build

- Photographer dashboard
- Event cards and event creation modal
- Guest selfie-search experience
- Demo AI-match results gallery
- Event QR/share page
- Mobile-responsive styling
- No credentials or biometric data are stored in this prototype

## Roadmap

### Phase 2 — Functional
Backend/API, PostgreSQL, Google Drive integration, QR generation and background photo ingestion.

### Phase 3 — AI
Face detection, face embeddings/recognition, group-photo matching, configurable similarity threshold and vector search.

### Phase 4 — Deployment
Environment configuration, database migrations, HTTPS/domain setup, production deployment and monitoring documentation.

## Run locally

This first phase is intentionally dependency-free. Open `index.html` in a browser or serve the repository with any static web server.

## Privacy

Production face-search functionality must implement clear consent, event-level access control, secure handling of selfies/embeddings, retention and deletion policies, and applicable biometric/privacy requirements.
