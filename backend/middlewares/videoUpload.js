import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowed = new Map([
  ["video/mp4", [".mp4"]],
  ["video/webm", [".webm"]],
  ["video/quicktime", [".mov"]],
]);

export const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(file.mimetype) || !allowed.get(file.mimetype).includes(ext)) {
      return cb(new Error("Only MP4, WebM, or MOV videos are allowed"));
    }
    cb(null, true);
  },
});
