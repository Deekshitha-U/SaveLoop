import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  url: { type: String, required: true, maxlength: 2048 },
  canonicalUrl: { type: String, required: true },
  platform: { type: String, required: true, default: 'website' },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  notes: { type: String, default: '', maxlength: 3000 },
  description: { type: String, default: '', maxlength: 3000 },
  tags: [{ type: String, maxlength: 30 }],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  categoryName: { type: String, default: 'Uncategorised' },
  status: { type: String, enum: ['pending', 'completed', 'archived'], default: 'pending' },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  savedAt: { type: Date, default: Date.now, immutable: true },
  embedding: { type: [Number], select: false, default: undefined },
  embeddingStatus: { type: String, enum: ['pending', 'ready', 'skipped', 'failed'], default: 'skipped' },
}, { timestamps: true });
schema.index({ userId: 1, canonicalUrl: 1 }, { unique: true });
schema.index({ userId: 1, savedAt: -1 });
schema.index({ userId: 1, platform: 1, status: 1 });
export default mongoose.model('Bookmark', schema);
