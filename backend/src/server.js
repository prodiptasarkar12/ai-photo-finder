import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
import 'dotenv/config';
import { query } from './db.js';
import { listImageFiles } from './googleDrive.js';
import { normalizeSource } from './sourceUtils.js';

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
const frontendOrigin = (() => { try { return new URL(frontendUrl).origin; } catch { return '*'; } })();
app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  let database = 'ok';
  try { await query('SELECT 1'); } catch { database = 'error'; }
  res.status(database === 'ok' ? 200 : 503).json({ ok: database === 'ok', service: 'ai-photo-finder-api', database });
});

app.get('/api/events', async (_req, res) => {
  try {
    const { rows } = await query(`SELECT e.*, COUNT(p.id)::int AS photo_count FROM events e LEFT JOIN photos p ON p.event_id=e.id GROUP BY e.id ORDER BY event_date DESC NULLS LAST, created_at DESC`);
    for (const event of rows) {
      const sources = await query('SELECT id,type,name,config,status,last_synced_at FROM event_sources WHERE event_id=$1 ORDER BY created_at', [event.id]);
      event.sources = sources.rows;
    }
    res.json(rows);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Unable to load events' }); }
});

app.post('/api/events', async (req, res) => {
  const { name, eventDate, location, sources = [] } = req.body ?? {};
  if (!name || !Array.isArray(sources) || sources.length === 0) return res.status(400).json({ error: 'name and at least one photo source are required' });
  const normalized = sources.map(s => normalizeSource(s.type, s.config));
  const client = await (await import('./db.js')).pool.connect();
  try {
    await client.query('BEGIN');
    const eventResult = await client.query(`INSERT INTO events (name,event_date,location) VALUES ($1,$2,$3) RETURNING *`, [name,eventDate||null,location||null]);
    const event = eventResult.rows[0];
    for (const source of normalized) {
      await client.query(`INSERT INTO event_sources (event_id,type,name,config) VALUES ($1,$2,$3,$4)`, [event.id,source.type,source.type==='google_drive'?'Google Drive':source.type==='cloud_upload'?'Cloud Upload':'PC Local Folder',source.config]);
    }
    await client.query('COMMIT');
    res.status(201).json(event);
  } catch (error) { await client.query('ROLLBACK'); console.error(error); res.status(500).json({ error: 'Unable to create event' }); }
  finally { client.release(); }
});

app.get('/api/events/:id/sources', async (req,res) => {
  try { const {rows}=await query('SELECT id,type,name,config,status,last_synced_at FROM event_sources WHERE event_id=$1 ORDER BY created_at',[req.params.id]); res.json(rows); }
  catch(error){ res.status(500).json({error:'Unable to load sources'}); }
});

app.post('/api/events/:id/sources', async (req,res) => {
  try {
    const source = normalizeSource(req.body?.type, req.body?.config || {});
    const {rows}=await query(`INSERT INTO event_sources(event_id,type,name,config) VALUES($1,$2,$3,$4) RETURNING *`,[req.params.id,source.type,source.type==='google_drive'?'Google Drive':source.type==='cloud_upload'?'Cloud Upload':'PC Local Folder',source.config]);
    res.status(201).json(rows[0]);
  } catch(error){ res.status(400).json({error:error.message}); }
});

app.post('/api/events/:id/sync', async (req,res) => {
  try {
    const {rows: sources}=await query(`SELECT * FROM event_sources WHERE event_id=$1 AND type='google_drive' AND status='active'`,[req.params.id]);
    let synced=0;
    for(const source of sources){
      const files=await listImageFiles(source.config.folderId);
      for(const file of files){ await query(`INSERT INTO photos(event_id,source_id,external_file_id,filename,mime_type,size_bytes,modified_at,thumbnail_url,source_type) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'google_drive') ON CONFLICT(event_id,source_type,external_file_id) DO UPDATE SET filename=EXCLUDED.filename,size_bytes=EXCLUDED.size_bytes,modified_at=EXCLUDED.modified_at,thumbnail_url=EXCLUDED.thumbnail_url`,[req.params.id,source.id,file.id,file.name,file.mimeType,file.size?Number(file.size):null,file.modifiedTime||null,file.thumbnailLink||null]); synced++; }
      await query('UPDATE event_sources SET last_synced_at=NOW() WHERE id=$1',[source.id]);
    }
    await query('UPDATE events SET last_synced_at=NOW() WHERE id=$1',[req.params.id]);
    res.json({eventId:req.params.id,synced});
  } catch(error){ console.error(error); res.status(500).json({error:'Photo source sync failed',detail:error.message}); }
});

app.get('/api/events/:id/photos', async (req,res) => { try { const {rows}=await query('SELECT * FROM photos WHERE event_id=$1 ORDER BY modified_at DESC NULLS LAST',[req.params.id]); res.json(rows); } catch(error){ res.status(500).json({error:'Unable to load photos'}); } });

app.get('/api/events/:id/qr', async (req,res) => { const guestUrl=`${frontendUrl.replace(/\/$/,'')}/?event=${encodeURIComponent(req.params.id)}&view=guest`; try { const dataUrl=await QRCode.toDataURL(guestUrl,{width:900,margin:2}); res.json({eventId:req.params.id,guestUrl,dataUrl}); } catch(error){ res.status(500).json({error:'Unable to generate QR code'}); } });

const port=Number(process.env.PORT||8080); app.listen(port,()=>console.log(`AI Photo Finder API listening on :${port}`));
