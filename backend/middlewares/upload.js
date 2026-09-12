import multer from "multer";
import path from "path";

// Files are held in memory only, then streamed straight to ImageKit —
// nothing is written to local disk, so this works unmodified on any
// stateless/ephemeral host (Vercel, Render, containers, etc).
const storage = multer.memoryStorage();

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
