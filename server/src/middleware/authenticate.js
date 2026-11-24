import { firebaseAdmin } from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw httpError(401, 'Please log in');
  const token = header.slice(7);
  let decoded;
  try { decoded = await firebaseAdmin.auth().verifyIdToken(token, true); }
  catch { throw httpError(401, 'Invalid or expired session. Log in again'); }
  const user = await User.findOne({ firebaseUid: decoded.uid });
  // Only the profile-sync route may create an initial profile.
  if (!user && req.path !== '/sync') throw httpError(403, 'Account profile not configured');
  if (user?.status === 'disabled') throw httpError(403, 'This account is disabled');
  req.uid = decoded.uid;
  req.firebaseUser = decoded;
  req.appUser = user;
  next();
});
