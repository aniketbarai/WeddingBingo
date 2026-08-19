import express from "express";
import {
  getImages,
  incrementImageLikes,
  incrementImageClicks,
  adminUploadImage,
  adminListImages,
  adminDeleteImage,
} from "../controllers/imageController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Public
router.get("/images", getImages);
router.post("/like/:id", incrementImageLikes);
router.post("/click/:id", incrementImageClicks);

// Admin (protected)
router.get("/admin/images", requireAdminAuth, adminListImages);
router.post("/admin/images", requireAdminAuth, upload.single("image"), adminUploadImage);
router.delete("/admin/images/:id", requireAdminAuth, adminDeleteImage);

export default router;