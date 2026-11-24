import { Router } from 'express';
import { listBookmarks, createBookmark, getBookmark, patchBookmark, removeBookmark } from '../controllers/bookmarkController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { bookmarkSchema, bookmarkPatchSchema } from '../validators/schemas.js';
const router = Router();
router.route('/').get(listBookmarks).post(validateBody(bookmarkSchema), createBookmark);
router.route('/:id').get(getBookmark).patch(validateBody(bookmarkPatchSchema), patchBookmark).delete(removeBookmark);
export default router;
