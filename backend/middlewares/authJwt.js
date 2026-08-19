import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { hasPermission, permissionsForRole } from "../utils/permissions.js";

export const SESSION_COOKIE = "weddingbingo_admin_session";

export const cookieOptions = (remember = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
  path: "/",
});

export const requireAdminAuth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
    const token = req.cookies?.[SESSION_COOKIE] || bearer;
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select("email name role permissions status sessionVersion").lean();
    if (!admin || admin.status !== "active" || admin.sessionVersion !== payload.sessionVersion) {
      return res.status(401).json({ success: false, message: "Session expired" });
    }

    req.admin = { ...admin, permissions: admin.permissions?.length ? admin.permissions : permissionsForRole(admin.role) };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};

export const requirePermission = (permission) => (req, res, next) => {
  if (!hasPermission(req.admin, permission)) return res.status(403).json({ success: false, message: "Insufficient permissions" });
  next();
};
