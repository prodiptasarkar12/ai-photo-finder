import { query } from './db.js';

// Production search contract. The actual embedding is supplied by the AI runtime.
// Keep the query event-scoped so one event can never search another event's faces.
export async function searchEventFaces(eventId, embedding, threshold = 0.42, limit = 100) {
  if (!Array.isArray(embedding) || embedding.length !== 512) throw new Error('Expected a 512-dimensional embedding');
  const values = `[${embedding.map(Number).join(',')}]`;
  const { rows } = await query(`
    SELECT DISTINCT ON (pf.photo_id)
      pf.photo_id, pf.face_index,
      (pf.embedding <=> $2::vector) AS distance
    FROM photo_faces pf
    WHERE pf.event_id = $1
      AND (pf.embedding <=> $2::vector) <= $3
    ORDER BY pf.photo_id, distance ASC
    LIMIT $4
  `, [eventId, values, Number(threshold), Number(limit)]);
  return rows;
}
