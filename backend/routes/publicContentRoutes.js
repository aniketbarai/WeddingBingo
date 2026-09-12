import express from "express";
import Wedding from "../models/Wedding.js";
import { Testimonial, Package } from "../models/MvpContent.js";
import Service from "../models/Service.js";

const router = express.Router();
router.get("/weddings", async (req, res) => res.json({ success: true, items: await Wedding.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean() }));
router.get("/testimonials", async (req, res) => res.json({ success: true, items: await Testimonial.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).lean() }));
router.get("/packages", async (req, res) => res.json({ success: true, items: await Package.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean() }));
router.get("/services", async (req, res) => res.json({ success: true, items: await Service.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean() }));
router.get("/services/:slug", async (req, res) => {
  const item = await Service.findOne({ slug: req.params.slug, active: true }).lean();
  if (!item) return res.status(404).json({ success: false, message: "Service not found" });
  const ids = Array.isArray(item.includedPackageIds) ? item.includedPackageIds : [];
  const names = Array.isArray(item.includedPackages) ? item.includedPackages : [];
  const packageQuery = ids.length || names.length ? { $or: [{ _id: { $in: ids } }, { title: { $in: names } }] } : null;
  const includedPackageRecords = packageQuery ? await Package.find(packageQuery).lean() : [];
  return res.json({ success: true, item: { ...item, includedPackageRecords } });
});
export default router;
