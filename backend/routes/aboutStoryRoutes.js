import express from "express";
import { getAboutStory, adminGetAboutStory, adminUpdateAboutStory } from "../controllers/aboutStoryController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { aboutStoryUpload } from "../middlewares/aboutStoryUpload.js";

const router = express.Router();

// Public — consumed by the homepage About Horizontal section.
router.get("/about-story", getAboutStory);

// Admin (protected)
router.get("/admin/about-story", requireAdminAuth, adminGetAboutStory);
router.put("/admin/about-story", requireAdminAuth, aboutStoryUpload, adminUpdateAboutStory);

export default router;
