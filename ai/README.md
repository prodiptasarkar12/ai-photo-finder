# LensFind Phase 3 — Face Search

This package defines the production AI pipeline for event-photo face search.

## Pipeline

1. Decode photo/selfie and detect faces.
2. Generate a face embedding for each detected face.
3. Store embeddings with `event_id`, `photo_id`, and `face_index` in a vector-capable database.
4. For a guest selfie, generate one embedding and search only inside the selected event.
5. Apply a configurable similarity threshold and return matching photo IDs.
6. Group photos work automatically because every detected face in the same photo is indexed separately.

## Privacy requirements

- Obtain clear user consent before biometric processing.
- Do not use the selfie as a public gallery asset.
- Keep embeddings isolated by event/tenant.
- Provide deletion/retention controls.
- Avoid logging raw selfies or embedding vectors.

## Implementation boundary

The repository currently contains the AI contract and database shape, not a claim of production-grade biometric accuracy. A real model/runtime must be benchmarked on the target event photography data before launch.
