import express from "express";
import { getGalleryHero, adminGetGalleryHero, adminUpdateGalleryHero } from "../controllers/galleryHeroController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { galleryHeroUpload } from "../middlewares/galleryHeroUpload.js";

const router = express.Router();

router.get("/gallery-hero", getGalleryHero);

router.get("/admin/gallery-hero", requireAdminAuth, adminGetGalleryHero);
router.put("/admin/gallery-hero", requireAdminAuth, galleryHeroUpload, adminUpdateGalleryHero);

export default router;
