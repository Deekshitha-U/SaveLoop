import Bookmark from '../models/Bookmark.js';
import Reminder from '../models/Reminder.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';
export const listReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ userId: req.uid }).populate('bookmarkId', 'title url platform status').sort({ remindAt: 1 });
  res.json({ reminders });
});
export const createReminder = asyncHandler(async (req, res) => {
  const { bookmarkId, remindAt } = req.validated;
  if (!await Bookmark.exists({ _id: bookmarkId, userId: req.uid })) throw httpError(404, 'Bookmark not found');
  const reminder = await Reminder.create({ userId: req.uid, bookmarkId, remindAt: new Date(remindAt) });
  await reminder.populate('bookmarkId', 'title url platform status');
  res.status(201).json({ reminder });
});
export const patchReminder = asyncHandler(async (req, res) => {
  const { remindAt, completed } = req.validated;
  const update = {};
  if (remindAt !== undefined) update.remindAt = new Date(remindAt);
  if (completed !== undefined) update.completed = completed;
  const reminder = await Reminder.findOneAndUpdate({ _id: req.params.id, userId: req.uid }, { $set: update }, { new: true, runValidators: true }).populate('bookmarkId', 'title url platform status');
  if (!reminder) throw httpError(404, 'Reminder not found');
  res.json({ reminder });
});
export const removeReminder = asyncHandler(async (req, res) => {
  const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.uid });
  if (!deleted) throw httpError(404, 'Reminder not found');
  res.json({ message: 'Reminder deleted' });
});
