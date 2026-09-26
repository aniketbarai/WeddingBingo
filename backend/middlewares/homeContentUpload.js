import multer from "multer";
import path from "path";

// Images only — memory storage, streamed straight to ImageKit, same pattern
// as the gallery/about-story upload middlewares.
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

// One request can update the hero background plus any combination of the 6
// category preview photos (2 each for wedding / pre-wedding / film), all optional.
export const homeContentUpload = uploader.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "wedding_0", maxCount: 1 },
  { name: "wedding_1", maxCount: 1 },
  { name: "preWedding_0", maxCount: 1 },
  { name: "preWedding_1", maxCount: 1 },
  { name: "film_0", maxCount: 1 },
  { name: "film_1", maxCount: 1 },
]);
