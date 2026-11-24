import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';

export function initFirebaseAdmin() {
  if (admin.apps.length) return admin.app();
  let credential;
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (filePath) {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`Firebase service account not found: ${absolutePath}`);
    credential = admin.credential.cert(JSON.parse(fs.readFileSync(absolutePath, 'utf8')));
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } else {
    throw new Error('Configure Firebase Admin credentials in server/.env');
  }
  return admin.initializeApp({ credential });
}
export const firebaseAdmin = admin;
