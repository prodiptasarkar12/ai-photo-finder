export function cosineDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || !a.length) throw new Error('Invalid embeddings');
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2; }
  if (!aa || !bb) return 1;
  return 1 - dot / (Math.sqrt(aa) * Math.sqrt(bb));
}

export function isMatch(distance, threshold = 0.42) {
  return Number(distance) <= Number(threshold);
}

export function groupPhotoMatches(photoFaces, queryEmbedding, threshold = 0.42) {
  const byPhoto = new Map();
  for (const face of photoFaces) {
    const distance = cosineDistance(face.embedding, queryEmbedding);
    if (isMatch(distance, threshold)) {
      const previous = byPhoto.get(face.photoId);
      if (!previous || distance < previous.distance) byPhoto.set(face.photoId, { photoId: face.photoId, distance });
    }
  }
  return [...byPhoto.values()].sort((a, b) => a.distance - b.distance);
}
