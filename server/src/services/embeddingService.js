import { embedText } from './aiProviderService.js';
import { AI_CONFIG } from '../config/aiConfig.js';
import Bookmark from '../models/Bookmark.js';
export async function updateBookmarkEmbedding(bookmark) {
  if (!AI_CONFIG.enabled) return;
  const text = [bookmark.title, bookmark.description, bookmark.notes, bookmark.platform, bookmark.categoryName, ...(bookmark.tags || [])].join(' ');
  await Bookmark.updateOne({ _id: bookmark._id, userId: bookmark.userId }, { embeddingStatus: 'pending' });
  try {
    const embedding = await embedText(text);
    if (embedding) await Bookmark.updateOne({ _id: bookmark._id, userId: bookmark.userId }, { embedding, embeddingStatus: 'ready' });
  } catch (error) {
    console.warn('Embedding was unavailable:', error.message);
    await Bookmark.updateOne({ _id: bookmark._id, userId: bookmark.userId }, { embeddingStatus: 'failed' });
  }
}
