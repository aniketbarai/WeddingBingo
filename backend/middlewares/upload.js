import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const storageDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, storageDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomBytes(18).toString("hex")}${ext}`);
  },
});

const allowed = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
]);

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(file.mimetype) || !allowed.get(file.mimetype).includes(ext)) return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    cb(null, true);
  },
});
