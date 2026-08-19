import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { sendAdminResetEmail, sendAdminForgotEmail } from "../services/adminService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions, SESSION_COOKIE } from "../middlewares/authJwt.js";
import { permissionsForRole } from "../utils/permissions.js";
import { recordAudit } from "../utils/audit.js";

const signToken = (admin, remember = false) => jwt.sign(
  { id: admin._id.toString(), email: admin.email, role: admin.role, sessionVersion: admin.sessionVersion },
  process.env.JWT_SECRET,
  { expiresIn: remember ? "30d" : (process.env.JWT_EXPIRES_IN || "2h") },
);

const publicAdmin = (admin) => ({
  id: admin._id,
  email: admin.email,
  name: admin.name,
  role: admin.role,
  permissions: admin.permissions?.length ? admin.permissions : permissionsForRole(admin.role),
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password, remember = false } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  const valid = admin && admin.status === "active" && await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    await recordAudit(req, "auth.login_failed", "Admin", "", { email: email.toLowerCase().trim() });
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  admin.lastLoginAt = new Date();
  admin.lastLoginIp = req.ip || "";
  await admin.save();
  const token = signToken(admin, Boolean(remember));
  res.cookie(SESSION_COOKIE, token, cookieOptions(Boolean(remember)));
  await recordAudit(req, "auth.login", "Admin", admin._id, { role: admin.role });
  return res.status(200).json({ success: true, admin: publicAdmin(admin) });
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  if (req.admin) await recordAudit(req, "auth.logout", "Admin", req.admin._id);
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  return res.status(200).json({ success: true });
});

export const getCurrentAdmin = asyncHandler(async (req, res) => res.json({ success: true, admin: publicAdmin(req.admin) }));

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id);
  if (!admin || !(await bcrypt.compare(oldPassword, admin.passwordHash))) return res.status(400).json({ success: false, message: "Old password is incorrect" });
  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  admin.passwordChangedAt = new Date();
  admin.sessionVersion += 1;
  admin.resetTokenHash = null;
  admin.resetTokenExpiresAt = null;
  await admin.save();
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  await recordAudit(req, "auth.password_changed", "Admin", admin._id);
  return res.json({ success: true });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email.toLowerCase().trim() });
  if (admin) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await admin.save();
    await sendAdminForgotEmail({ email: admin.email, resetToken });
    await recordAudit(req, "auth.password_reset_requested", "Admin", admin._id);
  }
  return res.json({ success: true, message: "If an account exists, reset instructions have been sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = req.body.resetToken || req.params.token;
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const admin = await Admin.findOne({ resetTokenHash, resetTokenExpiresAt: { $gt: new Date() } });
  if (!admin) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  admin.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
  admin.passwordChangedAt = new Date();
  admin.sessionVersion += 1;
  admin.resetTokenHash = null;
  admin.resetTokenExpiresAt = null;
  await admin.save();
  await sendAdminResetEmail({ email: admin.email });
  await recordAudit(req, "auth.password_reset", "Admin", admin._id);
  return res.json({ success: true });
});
