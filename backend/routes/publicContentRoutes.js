import express from "express";
import Wedding from "../models/Wedding.js";
import { Testimonial, Package } from "../models/MvpContent.js";

const router = express.Router();
router.get("/weddings", async (req, res) => res.json({ success: true, items: await Wedding.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean() }));
router.get("/testimonials", async (req, res) => res.json({ success: true, items: await Testimonial.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).lean() }));
router.get("/packages", async (req, res) => res.json({ success: true, items: await Package.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean() }));
export default router;
