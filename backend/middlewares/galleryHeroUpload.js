import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const imageTypes = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
]);

const videoTypes = new Map([
  ["video/mp4", [".mp4"]],
  ["video/webm", [".webm"]],
  ["video/quicktime", [".mov"]],
]);

const matches = (map, file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  return map.has(file.mimetype) && map.get(file.mimetype).includes(ext);
};

const uploader = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "poster" && !matches(imageTypes, file)) {
      return cb(new Error("Poster must be a JPEG, PNG, WebP, or GIF image"));
    }
    if (file.fieldname === "video" && !matches(videoTypes, file)) {
      return cb(new Error("Video must be MP4, WebM, or MOV"));
    }
    cb(null, true);
  },
});

export const galleryHeroUpload = uploader.fields([
  { name: "poster", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
