import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  bookmarkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark', required: true },
  remindAt: { type: Date, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });
schema.index({ userId: 1, remindAt: 1 });
export default mongoose.model('Reminder', schema);
