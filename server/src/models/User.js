import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, default: 'SaveLoop User', trim: true, maxlength: 80 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  preferences: { theme: { type: String, enum: ['dark', 'light'], default: 'dark' } },
  lastSeenAt: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model('User', schema);
