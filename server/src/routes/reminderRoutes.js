import { Router } from 'express';
import { listReminders, createReminder, patchReminder, removeReminder } from '../controllers/reminderController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { reminderSchema, reminderPatchSchema } from '../validators/schemas.js';
const router = Router();
router.route('/').get(listReminders).post(validateBody(reminderSchema), createReminder);
router.route('/:id').patch(validateBody(reminderPatchSchema), patchReminder).delete(removeReminder);
export default router;
