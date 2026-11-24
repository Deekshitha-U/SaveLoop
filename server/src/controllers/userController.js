import User from '../models/User.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const defaults = ['Technology','Education','Career','Food','Health','Finance','Travel','Entertainment','Lifestyle','Design','Other'];
export const syncUser = asyncHandler(async (req, res) => {
  const uid = req.uid;
  const incomingName = req.firebaseUser.name || req.firebaseUser.email?.split('@')[0] || 'SaveLoop User';
  const user = await User.findOneAndUpdate({ firebaseUid: uid }, {
    $setOnInsert: { email: req.firebaseUser.email || '', name: incomingName, role: 'user', status: 'active' },
    $set: { lastSeenAt: new Date() },
  }, { upsert: true, new: true, runValidators: true });
  if (user.status === 'disabled') return res.status(403).json({ error: 'This account is disabled' });
  await Promise.all(defaults.map((name) => Category.updateOne({ userId: uid, name }, { $setOnInsert: { userId: uid, name, isDefault: true } }, { upsert: true })));
  res.json({ user });
});
export const getMe = asyncHandler(async (req, res) => res.json({ user: req.appUser }));
export const updateMe = asyncHandler(async (req, res) => {
  const updated = await User.findOneAndUpdate({ firebaseUid: req.uid }, { $set: req.validated }, { new: true, runValidators: true });
  res.json({ user: updated });
});
