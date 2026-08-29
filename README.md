# LensFind — AI Photo Finder

A photographer-first event gallery concept: **scan a QR → take a selfie → find the photos you're in.**

## Phase 1 — UI / Prototype ✅

The current GitHub Pages prototype includes:

- Photographer dashboard with event statistics
- Live event cards and event management view
- Create-event modal with prototype state
- Guest photo-search landing page
- Browser selfie/camera capture UI
- Demo AI match results with 42 mock photos
- Result filters for All / Candid / Group / Stage
- Event QR/share page and guest-link copy interaction
- Responsive mobile navigation and layouts
- No real credentials or biometric data stored in the repository

## Phase 2 — Functional Website

- Backend/API
- PostgreSQL database
- Google Drive integration
- Real QR generation
- Background photo ingestion and processing

## Phase 3 — AI

- Face detection
- Face embeddings / recognition
- Group-photo matching
- Configurable similarity threshold
- Fast vector search

## Phase 4 — Deployment

- Production environment configuration
- Database setup and migrations
- Domain + HTTPS configuration
- Monitoring and operational documentation

## Run locally

The Phase 1 prototype is static and can be served with any static web server. Open `index.html` through a local server for camera access testing.

## Privacy note

Production biometric processing must include clear user consent, secure handling of selfies/face embeddings, event-level access controls, retention/deletion policies, and compliance with applicable privacy laws.
