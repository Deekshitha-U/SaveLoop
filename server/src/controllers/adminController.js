import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
export const stats = asyncHandler(async (_req, res) => {
  const [totalUsers, activeUsers, totalBookmarks, platformCounts, last30Days] = await Promise.all([
    User.countDocuments(), User.countDocuments({ status: 'active' }), Bookmark.countDocuments(),
    Bookmark.aggregate([{ $group: { _id: '$platform', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]),
    User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } }),
  ]);
  res.json({ stats: { totalUsers, activeUsers, totalBookmarks, newUsersLast30Days: last30Days, platformCounts } });
});
export const listUsers = asyncHandler(async (req, res) => {
  const query = String(req.query.q || '').trim().slice(0, 100);
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = query ? { $or: [{ name: { $regex: safe, $options: 'i' } }, { email: { $regex: safe, $options: 'i' } }] } : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  const counts = await Bookmark.aggregate([{ $match: { userId: { $in: users.map((u) => u.firebaseUid) } } }, { $group: { _id: '$userId', count: { $sum: 1 } } }]);
  res.json({ users: users.map((u) => ({ ...u, bookmarkCount: counts.find((x) => x._id === u.firebaseUid)?.count || 0 })) });
});
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) throw httpError(404, 'User not found');
  const bookmarkCount = await Bookmark.countDocuments({ userId: user.firebaseUid });
  res.json({ user: { ...user, bookmarkCount } });
});
export const patchUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) throw httpError(404, 'User not found');
  if (target.firebaseUid === req.uid && req.validated.status === 'disabled') throw httpError(400, 'You cannot disable your own account');
  target.status = req.validated.status;
  await target.save();
  res.json({ user: target });
});
