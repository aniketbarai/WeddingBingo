import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the first admin.");
    return;
  }
  const existing = await Admin.findOne({ email });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash, role: "super_admin", name: process.env.ADMIN_NAME || "WeddingBingo Owner", status: "active" });
  console.log(`Seeded super admin: ${email}`);
}
