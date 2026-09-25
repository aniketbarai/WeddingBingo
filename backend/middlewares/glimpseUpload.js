import multer from "multer";
import path from "path";

// Same memory-storage approach as the gallery `upload` middleware — nothing
// touches local disk, everything streams straight to ImageKit — but this
// one also accepts video files for the homepage Glimpse section.
const storage = multer.memoryStorage();

const allowed = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
  ["video/mp4", [".mp4"]],
  ["video/webm", [".webm"]],
  ["video/quicktime", [".mov"]],
]);

export const glimpseUpload = multer({
  storage,
  // Videos need more headroom than photos; 100MB keeps short clips workable
  // without letting someone park a feature-length file on the server.
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(file.mimetype) || !allowed.get(file.mimetype).includes(ext)) {
      return cb(new Error("Only JPEG, PNG, WebP, GIF images or MP4, WebM, MOV videos are allowed"));
    }
    cb(null, true);
  },
});
