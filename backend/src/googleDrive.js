import { google } from 'googleapis';
import 'dotenv/config';

function getDriveClient() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
  return google.drive({ version: 'v3', auth });
}

export async function listImageFiles(folderId = process.env.GOOGLE_DRIVE_FOLDER_ID) {
  if (!folderId) throw new Error('Google Drive folder ID is required');
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !(process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)) {
    throw new Error('Google service-account credentials are not configured');
  }
  const drive = getDriveClient();
  const files = [];
  let pageToken;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,webContentLink,thumbnailLink)',
      pageSize: 1000,
      pageToken,
      orderBy: 'createdTime desc'
    });
    files.push(...(response.data.files ?? []));
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return files;
}
