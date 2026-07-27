import express from "express";
import { getImages, adminUploadImage, adminListImages, adminDeleteImage } from "../controllers/imageController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Public
router.get("/images", getImages);

// Admin (protected)
router.get("/admin/images", requireAdminAuth, adminListImages);
router.post("/admin/images", requireAdminAuth, upload.single("image"), adminUploadImage);
router.delete("/admin/images/:id", requireAdminAuth, adminDeleteImage);

export default router;