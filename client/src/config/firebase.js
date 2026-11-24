import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};
export const firebaseReady = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
export const firebaseApp = !DEMO_MODE && firebaseReady ? initializeApp(config) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
