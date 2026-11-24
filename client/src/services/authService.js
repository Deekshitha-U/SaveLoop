import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth, DEMO_MODE, firebaseReady } from '../config/firebase';
import { api } from './api';
import { demoSession } from './demoService';
export async function login(email, password) {
  if (DEMO_MODE) return demoSession.login(email?.toLowerCase().includes('admin') ? 'admin' : 'user');
  if (!firebaseReady) throw new Error('Firebase web credentials are not configured');
  await signInWithEmailAndPassword(auth, email, password);
  const { data } = await api.post('/users/sync'); return data.user;
}
export async function signup(name, email, password) {
  if (DEMO_MODE) return demoSession.login('user');
  if (!firebaseReady) throw new Error('Firebase web credentials are not configured');
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credentials.user, { displayName: name });
  const { data } = await api.post('/users/sync');
  // Name is controlled by profile update, not by role input.
  const result = await api.patch('/users/me', { name });
  return result.data.user || data.user;
}
export async function logout() { if (DEMO_MODE) demoSession.logout(); else await signOut(auth); }
export async function resetPassword(email) { if (DEMO_MODE) return; if (!firebaseReady) throw new Error('Firebase is not configured'); await sendPasswordResetEmail(auth, email); }
export async function saveProfile(body) { if (DEMO_MODE) return demoSession.update(body); const { data } = await api.patch('/users/me', body); return data.user; }
