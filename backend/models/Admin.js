import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordChangedAt: { type: Date, default: Date.now },

    // Reset password (token hashed)
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);

