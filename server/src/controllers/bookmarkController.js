import Bookmark from '../models/Bookmark.js';
import Category from '../models/Category.js';
import Reminder from '../models/Reminder.js';
import { normalizeUrl } from '../utils/urlUtils.js';
import { parseTags } from '../utils/hashtagUtils.js';
import { detectPlatform } from '../services/platformService.js';
import { permittedMetadata } from '../services/metadataService.js';
import { analyzeBookmark } from '../services/bookmarkAnalyzerService.js';
import { updateBookmarkEmbedding } from '../services/embeddingService.js';
import { searchBookmarks } from '../services/searchService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
const loadCategory = async (uid, categoryId) => {
  if (!categoryId) return null;
  const category = await Category.findOne({ _id: categoryId, userId: uid });
  if (!category) throw httpError(400, 'Category not found in your account');
  return category;
};
export const listBookmarks = asyncHandler(async (req, res) => res.json({ bookmarks: await searchBookmarks(req.uid, req.query) }));
export const getBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.uid });
  if (!bookmark) throw httpError(404, 'Bookmark not found');
  res.json({ bookmark });
});
export const createBookmark = asyncHandler(async (req, res) => {
  const body = req.validated;
  const url = normalizeUrl(body.url);
  const duplicate = await Bookmark.findOne({ userId: req.uid, canonicalUrl: url });
  if (duplicate) return res.status(409).json({ error: 'You have already saved this URL', existingId: duplicate._id });
  // URL-only saving works even when the user skips the Analyse button.
  // Respect every manually entered field, and never force a guessed category.
  const available = await Category.find({ userId: req.uid }).select('name').lean();
  const needsAnalysis = !body.title?.trim() || !body.categoryId || !parseTags(body.tags).length;
  const analysis = needsAnalysis ? await analyzeBookmark({ url, title: body.title || '', description: body.description || '', notes: body.notes || '', tags: body.tags || [] }, available, { useLLM: false }) : null;
  let category = await loadCategory(req.uid, body.categoryId);
  if (!category && analysis?.suggestedCategory && analysis.suggestedCategory !== 'Uncategorised') {
    category = available.find((c) => c.name.toLowerCase() === analysis.suggestedCategory.toLowerCase()) || null;
  }
  const tags = parseTags(body.tags);
  const autoTags = analysis ? parseTags([...analysis.extractedTags, ...analysis.suggestedTags]) : [];
  const doc = await Bookmark.create({
    userId: req.uid, url, canonicalUrl: url, platform: analysis?.platform || detectPlatform(url),
    title: body.title?.trim() || analysis?.title || permittedMetadata(url).title,
    description: body.description?.trim() || analysis?.description || '',
    notes: body.notes || '', tags: tags.length ? tags : autoTags,
    categoryId: category?._id || null, categoryName: category?.name || 'Uncategorised',
    status: body.status || 'pending', priority: body.priority || 'normal',
  });
  // Best-effort embedding must not block saving (metadata+embedding can exceed API timeout).
  void updateBookmarkEmbedding(doc).catch((error) => console.warn('Embedding job failed:', error.message));
  res.status(201).json({ bookmark: doc });
});
export const patchBookmark = asyncHandler(async (req, res) => {
  const doc = await Bookmark.findOne({ _id: req.params.id, userId: req.uid });
  if (!doc) throw httpError(404, 'Bookmark not found');
  const body = req.validated;
  if (body.url !== undefined) {
    const normalized = normalizeUrl(body.url);
    if (normalized !== doc.canonicalUrl && await Bookmark.exists({ userId: req.uid, canonicalUrl: normalized })) throw httpError(409, 'You have already saved this URL');
    doc.url = normalized; doc.canonicalUrl = normalized; doc.platform = detectPlatform(normalized);
  }
  if (body.categoryId !== undefined) {
    const category = await loadCategory(req.uid, body.categoryId);
    doc.categoryId = category?._id || null; doc.categoryName = category?.name || 'Uncategorised';
  }
  if (body.title !== undefined) doc.title = body.title || permittedMetadata(doc.url).title;
  if (body.notes !== undefined) doc.notes = body.notes;
  if (body.description !== undefined) doc.description = body.description;
  if (body.tags !== undefined) doc.tags = parseTags(body.tags);
  if (body.status !== undefined) doc.status = body.status;
  if (body.priority !== undefined) doc.priority = body.priority;
  await doc.save();
  if (['url','description','notes','title','tags','categoryId'].some((key) => body[key] !== undefined)) {
    void updateBookmarkEmbedding(doc).catch((error) => console.warn('Embedding job failed:', error.message));
  }
  res.json({ bookmark: doc });
});
export const removeBookmark = asyncHandler(async (req, res) => {
  const doc = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.uid });
  if (!doc) throw httpError(404, 'Bookmark not found');
  await Reminder.deleteMany({ userId: req.uid, bookmarkId: doc._id });
  res.json({ message: 'Bookmark deleted' });
});
