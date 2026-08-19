import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true },
  entity: { type: String, required: true, index: true },
  entityId: { type: String, default: "" },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  adminEmail: { type: String, default: "" },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: { type: String, default: "" },
  userAgent: { type: String, default: "" },
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
export default mongoose.model("AuditLog", auditLogSchema);
