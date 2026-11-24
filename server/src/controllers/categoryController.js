import Category from '../models/Category.js';
import Bookmark from '../models/Bookmark.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ userId: req.uid }).sort({ name: 1 }).lean();
  const counts = await Bookmark.aggregate([{ $match: { userId: req.uid } }, { $group: { _id: '$categoryId', count: { $sum: 1 } } }]);
  res.json({ categories: categories.map((c) => ({ ...c, count: counts.find((x) => String(x._id) === String(c._id))?.count || 0 })) });
});
async function validateParent(uid, parentId, selfId) {
  if (!parentId) return null;
  if (String(parentId) === String(selfId)) throw httpError(400, 'A category cannot be its own parent');
  const parent = await Category.findOne({ _id: parentId, userId: uid });
  if (!parent) throw httpError(400, 'Parent category was not found');
  if (parent.parentId) throw httpError(400, 'MVP supports one subcategory level');
  return parent;
}
export const createCategory = asyncHandler(async (req, res) => {
  const { name, parentId } = req.validated;
  await validateParent(req.uid, parentId);
  const category = await Category.create({ userId: req.uid, name, parentId: parentId || null });
  res.status(201).json({ category });
});
export const patchCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, userId: req.uid });
  if (!category) throw httpError(404, 'Category not found');
  const { name, parentId } = req.validated;
  if (parentId !== undefined) {
    if (await Category.exists({ userId: req.uid, parentId: category._id })) throw httpError(400, 'A category with subcategories cannot become a child');
    await validateParent(req.uid, parentId, category._id); category.parentId = parentId;
  }
  if (name !== undefined) category.name = name;
  await category.save();
  if (name !== undefined) await Bookmark.updateMany({ userId: req.uid, categoryId: category._id }, { $set: { categoryName: name } });
  res.json({ category });
});
export const removeCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, userId: req.uid });
  if (!category) throw httpError(404, 'Category not found');
  if (await Category.exists({ userId: req.uid, parentId: category._id })) throw httpError(400, 'Delete subcategories first');
  await Bookmark.updateMany({ userId: req.uid, categoryId: category._id }, { $set: { categoryId: null, categoryName: 'Uncategorised' } });
  await category.deleteOne();
  res.json({ message: 'Category deleted; bookmarks preserved as Uncategorised' });
});
