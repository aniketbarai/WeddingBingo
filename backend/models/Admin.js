import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true, default: "" },
    role: { type: String, enum: ["super_admin", "admin", "editor", "content_manager"], default: "admin", index: true },
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ["active", "suspended"], default: "active", index: true },
    sessionVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: "" },
    passwordChangedAt: { type: Date, default: Date.now },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
