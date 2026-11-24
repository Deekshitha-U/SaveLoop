import { Router } from 'express';
import { listCategories, createCategory, patchCategory, removeCategory } from '../controllers/categoryController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { categorySchema, categoryPatchSchema } from '../validators/schemas.js';
const router = Router();
router.route('/').get(listCategories).post(validateBody(categorySchema), createCategory);
router.route('/:id').patch(validateBody(categoryPatchSchema), patchCategory).delete(removeCategory);
export default router;
