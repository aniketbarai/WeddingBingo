import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

/**
 * Seeds a single admin account from env.
 * Requires:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 */
export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({
    email: email.toLowerCase().trim(),
    passwordHash,
  });
}

