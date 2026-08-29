export function extractDriveFolderId(input = '') {
  const value = String(input).trim();
  if (/^[A-Za-z0-9_-]{10,}$/.test(value)) return value;
  const match = value.match(/\/folders\/([A-Za-z0-9_-]+)/);
  return match?.[1] || null;
}

export function normalizeSource(type, config = {}) {
  const allowed = new Set(['google_drive', 'cloud_upload', 'local_folder']);
  if (!allowed.has(type)) throw new Error(`Unsupported photo source: ${type}`);
  const result = { type, config: {} };
  if (type === 'google_drive') {
    const folderId = extractDriveFolderId(config.folderId || config.url);
    if (!folderId) throw new Error('A valid Google Drive folder URL or folder ID is required');
    result.config.folderId = folderId;
  }
  if (type === 'cloud_upload') result.config = { provider: config.provider || 'lensfind', bucket: config.bucket || null };
  if (type === 'local_folder') result.config = { path: config.path || null, agentId: config.agentId || null };
  return result;
}
