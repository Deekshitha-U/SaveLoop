import Bookmark from '../models/Bookmark.js';
import { httpError } from '../utils/httpError.js';
const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function buildBookmarkFilter(userId, query = {}) {
  const filter = { userId };
  if (query.platform && query.platform !== 'all') filter.platform = String(query.platform);
  if (query.status && query.status !== 'all') filter.status = String(query.status);
  if (query.priority && query.priority !== 'all') filter.priority = String(query.priority);
  if (query.categoryId && /^[a-f\d]{24}$/i.test(query.categoryId)) filter.categoryId = query.categoryId;
  if (query.tag) filter.tags = String(query.tag).toLowerCase();
  if (query.from || query.to) {
    filter.savedAt = {};
    if (query.from) {
      const from = new Date(query.from);
      if (isNaN(from.getTime())) throw httpError(400, 'Invalid start date');
      filter.savedAt.$gte = from;
    }
    if (query.to) {
      const to = new Date(query.to);
      if (isNaN(to.getTime())) throw httpError(400, 'Invalid end date');
      to.setUTCHours(23, 59, 59, 999);
      filter.savedAt.$lte = to;
    }
  }
  if (query.q && String(query.q).trim()) {
    const regex = new RegExp(escapeRe(String(query.q).trim().slice(0, 120)), 'i');
    filter.$or = [{ title: regex }, { description: regex }, { notes: regex }, { tags: regex }, { categoryName: regex }, { platform: regex }];
  }
  return filter;
}
export async function searchBookmarks(userId, query = {}) {
  const filter = buildBookmarkFilter(userId, query);
  const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 200);
  const sorts = { oldest: { savedAt: 1 }, title: { title: 1 }, newest: { savedAt: -1 } };
  return Bookmark.find(filter).sort(sorts[query.sort] || sorts.newest).limit(limit).lean();
}
