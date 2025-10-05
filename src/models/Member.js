// src/models/Member.js
import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, default: '' },
  team: { type: String, default: '' },
  empId: { type: String, default: '' },
  onboarded: { type: Boolean, default: false },
  onboarding_token: { type: String, default: null },
  onboarding_token_expires: { type: Date, default: null },
  created_at: { type: Date, default: Date.now }
});

// Avoid model compile overwrite errors in Next dev HMR:
export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
