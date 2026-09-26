import express from "express";
import { getHomeContent, adminGetHomeContent, adminUpdateHomeContent } from "../controllers/homeContentController.js";
import { requireAdminAuth } from "../middlewares/authJwt.js";
import { homeContentUpload } from "../middlewares/homeContentUpload.js";

const router = express.Router();

// Public — consumed by LandingPage, AboutSection, and the Wedding preview grid
// (everything above the homepage's sliding Banner section).
router.get("/home-content", getHomeContent);

// Admin (protected)
router.get("/admin/home-content", requireAdminAuth, adminGetHomeContent);
router.put("/admin/home-content", requireAdminAuth, homeContentUpload, adminUpdateHomeContent);

export default router;
