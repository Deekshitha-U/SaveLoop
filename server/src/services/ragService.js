import Bookmark from '../models/Bookmark.js';
import { AI_CONFIG } from '../config/aiConfig.js';
import { embedText } from './aiProviderService.js';
import { extractFilters } from './queryParserService.js';
export { extractFilters } from './queryParserService.js';
export async function retrieveForQuestion(userId, question) {
  const parsed = extractFilters(question);
  const baseFilter = { userId };
  if (parsed.platform) baseFilter.platform = parsed.platform;
  if (parsed.status) baseFilter.status = parsed.status;
  if (parsed.priority) baseFilter.priority = parsed.priority;
  if (parsed.from || parsed.to) {
    baseFilter.savedAt = {};
    if (parsed.from) baseFilter.savedAt.$gte = new Date(parsed.from);
    if (parsed.to) baseFilter.savedAt.$lte = new Date(`${parsed.to}T23:59:59.999Z`);
  }
  const regex = parsed.keywords.length ? new RegExp(parsed.keywords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i') : null;
  const lexicalFilter = regex ? { ...baseFilter, $or: [{ title: regex }, { description: regex }, { notes: regex }, { categoryName: regex }, { tags: regex }] } : baseFilter;
  const lexical = await Bookmark.find(lexicalFilter).sort({ savedAt: -1 }).limit(12).lean();
  let semantic = [];
  if (AI_CONFIG.enabled && parsed.keywords.length) {
    try {
      const vector = await embedText(question);
      if (vector) semantic = await Bookmark.aggregate([
        { $vectorSearch: { index: AI_CONFIG.vectorIndex, path: 'embedding', queryVector: vector, numCandidates: 100, limit: 8, filter: baseFilter } },
        { $project: { userId: 1, url: 1, title: 1, platform: 1, status: 1, priority: 1, categoryName: 1, tags: 1, notes: 1, description: 1, savedAt: 1, score: { $meta: 'vectorSearchScore' } } },
      ]);
    } catch (err) { console.warn('Vector search unavailable, using text search:', err.message); }
  }
  const seen = new Set();
  return [...lexical, ...semantic].filter((doc) => {
    if (doc.userId !== userId || seen.has(String(doc._id))) return false;
    seen.add(String(doc._id)); return true;
  }).slice(0, 10);
}
