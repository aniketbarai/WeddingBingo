import multer from "multer";
import path from "path";

// Images only for this section (no video) — memory storage, streamed
// straight to ImageKit, same pattern as the gallery `upload` middleware.
const storage = multer.memoryStorage();

const allowed = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
]);

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.has(file.mimetype) || !allowed.get(file.mimetype).includes(ext)) {
    return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
  }
  cb(null, true);
};

const uploader = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });

// One request can update any combination of the three slides, so accept
// up to one image per slide field, all optional.
export const aboutStoryUpload = uploader.fields([
  { name: "slide1Image", maxCount: 1 },
  { name: "slide2Image", maxCount: 1 },
  { name: "slide3Image", maxCount: 1 },
]);
