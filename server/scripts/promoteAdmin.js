// Run from the server folder: node scripts/promoteAdmin.js firebase-uid
// NEVER expose this operation as a public API endpoint.
import 'dotenv/config';
import { connectDatabase } from '../src/config/db.js';
import User from '../src/models/User.js';
import mongoose from 'mongoose';
const uid = process.argv[2];
if (!uid) { console.error('Usage: npm run ... or node scripts/promoteAdmin.js FIREBASE_UID'); process.exit(1); }
try {
  await connectDatabase();
  const user = await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { role: 'admin' } }, { new: true });
  if (!user) throw new Error('No MongoDB user for this UID. Log in once first.');
  console.log(`✅ ${user.email} promoted to admin`);
} catch (err) { console.error(err.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
