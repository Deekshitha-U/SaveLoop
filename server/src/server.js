import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import { initFirebaseAdmin } from './config/firebaseAdmin.js';
import { app } from './app.js';
try {
  initFirebaseAdmin();
  await connectDatabase();
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => console.log(`🚀 SaveLoop API running on http://localhost:${port}`));
} catch (err) {
  console.error('❌ Backend startup failed:', err.message);
  process.exitCode = 1;
}
