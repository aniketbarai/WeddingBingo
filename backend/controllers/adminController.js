import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import Admin from '../models/Admin.js';
import { sendAdminResetEmail, sendAdminForgotEmail } from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdminAuth } from '../middlewares/authJwt.js';

const signToken = (admin) => {
  return jwt.sign({ id: admin._id.toString(), email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
};

// Create/verify admin credentials
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = signToken(admin);
  return res.status(200).json({ success: true, token });
});

export const logoutAdmin = (req, res) => {
  // Client discards token; optional server blacklist can be added later.
  return res.status(200).json({ success: true });
};

export const changePassword = [
  requireAdminAuth,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const ok = await bcrypt.compare(oldPassword, admin.passwordHash);
    if (!ok) return res.status(400).json({ success: false, message: 'Old password is incorrect' });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    admin.passwordChangedAt = new Date();
    admin.resetTokenHash = null;
    admin.resetTokenExpiresAt = null;
    await admin.save();

    return res.status(200).json({ success: true });
  }),
];

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;


  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  // Always respond success to prevent account enumeration
  if (!admin) return res.status(200).json({ success: true });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  admin.resetTokenHash = resetTokenHash;
  admin.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await admin.save();

  await sendAdminForgotEmail({ email: admin.email, resetToken });

  return res.status(200).json({ success: true });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const admin = await Admin.findOne({
    resetTokenHash,
    resetTokenExpiresAt: { $gt: new Date() },
  });

  if (!admin) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  admin.passwordChangedAt = new Date();
  admin.resetTokenHash = null;
  admin.resetTokenExpiresAt = null;
  await admin.save();

  await sendAdminResetEmail({ email: admin.email });

  return res.status(200).json({ success: true });
});

