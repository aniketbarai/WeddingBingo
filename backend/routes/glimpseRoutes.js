import express from "express";
import {
  getGlimpse,
  adminListGlimpse,
  adminUploadGlimpse,
  adminUpdateGlimpse,
  adminReorderGlimpse,
  adminDeleteGlimpse,
} from "../controllers/glimpseController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { glimpseUpload } from "../middlewares/glimpseUpload.js";

const router = express.Router();

// Public — consumed by the homepage Glimpse section.
router.get("/glimpse", getGlimpse);

// Admin (protected)
router.get("/admin/glimpse", requireAdminAuth, adminListGlimpse);
router.post("/admin/glimpse", requireAdminAuth, glimpseUpload.single("media"), adminUploadGlimpse);
router.patch("/admin/glimpse/reorder", requireAdminAuth, adminReorderGlimpse);
router.patch("/admin/glimpse/:id", requireAdminAuth, adminUpdateGlimpse);
router.delete("/admin/glimpse/:id", requireAdminAuth, adminDeleteGlimpse);

export default router;
