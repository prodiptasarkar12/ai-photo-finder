# Production AI engine decision

The repository uses a model-agnostic runtime boundary. Do not treat the placeholder engine as biometric recognition. Before production launch, benchmark a detector + face-embedding model on representative event photography (frontal, profile, low light, glasses, blur, group shots).

The selected model must output the embedding dimension configured in PostgreSQL (`vector(512)` currently). If the chosen model uses another dimension, migrate the vector column before indexing.

Search must always be scoped to `event_id` (and tenant/account where applicable). Return photo IDs, not raw biometric vectors.
