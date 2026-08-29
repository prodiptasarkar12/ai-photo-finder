import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import 'dotenv/config';
import { query } from './db.js';
import { listImageFiles } from './googleDrive.js';

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
const frontendOrigin = (() => {
  try { return new URL(frontendUrl).origin; } catch { return '*'; }
})();

app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  let database = 'ok';
  try { await query('SELECT 1'); } catch { database = 'error'; }
  res.status(database === 'ok' ? 200 : 503).json({ ok: database === 'ok', service: 'ai-photo-finder-api', database });
});

app.get('/api/events', async (_req, res) => {
  try {
    const { rows } = await query('SELECT id, name, event_date, location, drive_folder_id, status, created_at FROM events ORDER BY event_date DESC NULLS LAST, created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load events' });
  }
});

app.post('/api/events', async (req, res) => {
  const { name, eventDate, location, driveFolderId } = req.body ?? {};
  if (!name || !driveFolderId) return res.status(400).json({ error: 'name and driveFolderId are required' });
  try {
    const { rows } = await query(
      `INSERT INTO events (name, event_date, location, drive_folder_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, eventDate || null, location || null, driveFolderId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create event' });
  }
});

app.post('/api/events/:id/sync', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    const event = rows[0];
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const files = await listImageFiles(event.drive_folder_id);
    for (const file of files) {
      await query(
        `INSERT INTO photos (event_id, drive_file_id, filename, mime_type, size_bytes, modified_at, thumbnail_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (event_id, drive_file_id) DO UPDATE SET filename=EXCLUDED.filename, size_bytes=EXCLUDED.size_bytes, modified_at=EXCLUDED.modified_at, thumbnail_url=EXCLUDED.thumbnail_url`,
        [event.id, file.id, file.name, file.mimeType, file.size ? Number(file.size) : null, file.modifiedTime || null, file.thumbnailLink || null]
      );
    }
    await query('UPDATE events SET last_synced_at = NOW() WHERE id = $1', [event.id]);
    res.json({ eventId: event.id, synced: files.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Google Drive sync failed', detail: error.message });
  }
});

app.get('/api/events/:id/photos', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, drive_file_id, filename, mime_type, size_bytes, modified_at, thumbnail_url FROM photos WHERE event_id = $1 ORDER BY modified_at DESC NULLS LAST',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load photos' });
  }
});

app.get('/api/events/:id/qr', async (req, res) => {
  const guestUrl = `${frontendUrl.replace(/\/$/, '')}/?event=${encodeURIComponent(req.params.id)}&view=guest`;
  try {
    const dataUrl = await QRCode.toDataURL(guestUrl, { width: 900, margin: 2 });
    res.json({ eventId: req.params.id, guestUrl, dataUrl });
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate QR code' });
  }
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`AI Photo Finder API listening on :${port}`));
