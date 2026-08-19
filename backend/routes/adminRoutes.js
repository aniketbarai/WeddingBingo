import express from "express";
import rateLimit from "express-rate-limit";
import {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/adminController.js";
import { requireAdminAuth, requirePermission } from "../middlewares/authJwt.js";
import { loginValidator, changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/adminValidators.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many login attempts. Try again later." } });

router.post("/login", loginLimiter, loginValidator, validateRequest, loginAdmin);
router.post("/logout", requireAdminAuth, logoutAdmin);
router.get("/me", requireAdminAuth, getCurrentAdmin);
router.post("/change-password", requireAdminAuth, changePasswordValidator, validateRequest, changePassword);
router.post("/forgot-password", forgotPasswordValidator, validateRequest, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidator, validateRequest, resetPassword);
router.get("/audit-logs", requireAdminAuth, requirePermission("audit_logs.view"), async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);
  const [logs, total] = await Promise.all([
    AuditLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    AuditLog.countDocuments(),
  ]);
  res.json({ success: true, logs, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

export default router;
