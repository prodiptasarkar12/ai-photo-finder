# LensFind Desktop Sync Agent

A small local agent will watch a photographer-selected folder and upload new image files to the LensFind API. The agent is intentionally separate from the browser app because browsers cannot reliably watch arbitrary local folders.

## Planned flow

`Camera/PC folder -> Sync Agent -> POST /api/events/:eventId/uploads -> cloud/object storage -> photo processing`

## Local configuration

The agent will use an event ID and API base URL. It must never store Google/Dropbox credentials or biometric data locally unless explicitly required and protected.

## Phase 2 status

This package contains the contract and folder-watching design. Packaging a signed Windows/macOS executable is a deployment step after the API upload endpoint is configured.
