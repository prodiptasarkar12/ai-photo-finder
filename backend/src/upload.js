import multer from 'multer';
import path from 'node:path';

const allowed = new Set(['image/jpeg','image/png','image/webp']);
const storage = multer.memoryStorage();
export const photoUpload = multer({
  storage,
  limits: { files: 100, fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, allowed.has(file.mimetype))
});

export function safeFilename(name = 'photo') {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '_');
}
