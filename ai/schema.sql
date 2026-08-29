-- Enable pgvector in production PostgreSQL.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS photo_faces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  face_index INTEGER NOT NULL,
  bbox JSONB,
  embedding vector(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(photo_id, face_index)
);

CREATE INDEX IF NOT EXISTS photo_faces_event_idx ON photo_faces(event_id);
-- Choose the index/operator after benchmarking the selected embedding model.
-- Example for cosine search at sufficient scale:
-- CREATE INDEX photo_faces_embedding_hnsw ON photo_faces USING hnsw (embedding vector_cosine_ops);
