import Category from '../models/Category.js';
import ChatMessage from '../models/ChatMessage.js';
import { normalizeUrl } from '../utils/urlUtils.js';
import { analyzeBookmark } from '../services/bookmarkAnalyzerService.js';
import { retrieveForQuestion } from '../services/ragService.js';
import { groundedSummary } from '../services/aiProviderService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const categorize = asyncHandler(async (req, res) => {
  const { url, title, description, notes, tags } = req.validated;
  const normalized = normalizeUrl(url);
  const available = await Category.find({ userId: req.uid }).select('name').lean();
  const result = await analyzeBookmark({ url: normalized, title, description, notes, tags }, available);
  res.json(result);
});
export const chat = asyncHandler(async (req, res) => {
  const question = req.validated.message;
  const matches = await retrieveForQuestion(req.uid, question);
  let answer = matches.length ? `I found ${matches.length} relevant saved ${matches.length === 1 ? 'link' : 'links'}. Open any card below to visit the original resource.` :
    'I could not find a matching item in your library. Try adding a title or tags, or searching with broader keywords.';
  if (matches.length) {
    try { answer = await groundedSummary(question, matches) || answer; }
    catch (err) { console.warn('AI answer unavailable; using grounded fallback:', err.message); }
  }
  const bookmarks = matches.map((doc) => ({ id: String(doc._id), url: doc.url, title: doc.title, platform: doc.platform,
    categoryName: doc.categoryName, status: doc.status, priority: doc.priority, savedAt: doc.savedAt, tags: doc.tags }));
  await ChatMessage.insertMany([
    { userId: req.uid, role: 'user', content: question },
    { userId: req.uid, role: 'assistant', content: answer, bookmarkIds: matches.map((m) => m._id) },
  ]);
  res.json({ answer, bookmarks, source: matches.length ? 'database' : 'no-results' });
});

export const chatHistory = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ userId: req.uid }).sort({ createdAt: -1 }).limit(30).lean();
  res.json({ messages: messages.reverse().map((m) => ({ id: String(m._id), role: m.role, text: m.content })) });
});
