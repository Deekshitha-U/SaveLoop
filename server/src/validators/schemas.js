import { z } from 'zod';
const categoryId = z.union([z.string().regex(/^[a-f\d]{24}$/i), z.null()]).optional();
export const bookmarkSchema = z.object({
  url: z.string().trim().min(8).max(2048), title: z.string().trim().max(200).optional(),
  notes: z.string().max(3000).optional(), description: z.string().max(3000).optional(), tags: z.union([z.array(z.string()), z.string()]).optional(),
  categoryId, status: z.enum(['pending', 'completed', 'archived']).optional(), priority: z.enum(['low','normal','high']).optional(),
});
export const bookmarkPatchSchema = bookmarkSchema.partial();
export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60), parentId: categoryId,
});
export const categoryPatchSchema = categorySchema.partial();
export const reminderSchema = z.object({ bookmarkId: z.string().regex(/^[a-f\d]{24}$/i), remindAt: z.string().datetime({ offset: true }) });
export const reminderPatchSchema = z.object({ remindAt: z.string().datetime({ offset: true }).optional(), completed: z.boolean().optional() });
export const chatSchema = z.object({ message: z.string().trim().min(2).max(500) });
export const categorizeSchema = z.object({ url: z.string().min(8).max(2048), title: z.string().max(200).optional(), description: z.string().max(3000).optional(), notes: z.string().max(3000).optional(), tags: z.union([z.array(z.string()), z.string()]).optional() });
export const userPatchSchema = z.object({ name: z.string().trim().min(2).max(80).optional(), preferences: z.object({ theme: z.enum(['dark','light']) }).optional() });
export const adminUserPatchSchema = z.object({ status: z.enum(['active','disabled']) });
