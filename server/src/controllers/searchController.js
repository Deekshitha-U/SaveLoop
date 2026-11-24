import { asyncHandler } from '../utils/asyncHandler.js';
import { searchBookmarks } from '../services/searchService.js';
export const search = asyncHandler(async (req, res) => res.json({ bookmarks: await searchBookmarks(req.uid, req.query) }));
