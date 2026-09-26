import express from "express";
import {
  getBanner,
  adminListBanner,
  adminUploadBanner,
  adminUpdateBanner,
  adminReorderBanner,
  adminDeleteBanner,
} from "../controllers/bannerController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Public — consumed by the homepage sliding hero banner.
router.get("/banner", getBanner);

// Admin (protected)
router.get("/admin/banner", requireAdminAuth, adminListBanner);
router.post("/admin/banner", requireAdminAuth, upload.single("image"), adminUploadBanner);
router.patch("/admin/banner/reorder", requireAdminAuth, adminReorderBanner);
router.patch("/admin/banner/:id", requireAdminAuth, adminUpdateBanner);
router.delete("/admin/banner/:id", requireAdminAuth, adminDeleteBanner);

export default router;
