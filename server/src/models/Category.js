import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });
schema.index({ userId: 1, name: 1 }, { unique: true });
export default mongoose.model('Category', schema);
