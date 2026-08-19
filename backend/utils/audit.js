import AuditLog from "../models/AuditLog.js";

export const recordAudit = (req, action, entity, entityId = "", metadata = {}) => {
  const actor = req?.admin || {};
  return AuditLog.create({
    action,
    entity,
    entityId: entityId?.toString?.() || "",
    adminId: actor.id || actor._id || null,
    adminEmail: actor.email || "",
    metadata,
    ip: req?.ip || req?.headers?.["x-forwarded-for"] || "",
    userAgent: req?.get?.("user-agent") || "",
  }).catch((error) => console.error("Audit log failed:", error.message));
};
