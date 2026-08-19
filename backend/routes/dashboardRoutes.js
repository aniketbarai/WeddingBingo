import express from "express";
import { requireAdminAuth, requirePermission } from "../middlewares/authJwt.js";
import Image from "../models/Image.js";
import Wedding from "../models/Wedding.js";
import Inquiry from "../models/Inquiry.js";
import { Booking, Testimonial, Package } from "../models/MvpContent.js";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();
router.get("/dashboard", requireAdminAuth, requirePermission("dashboard.view"), async (req, res) => {
  const now = new Date();
  const [weddings, photos, inquiries, newInquiries, bookings, upcomingBookings, testimonials, publishedTestimonials, packages, activity] = await Promise.all([
    Wedding.countDocuments(), Image.countDocuments(), Inquiry.countDocuments(), Inquiry.countDocuments({ status: "New" }), Booking.countDocuments(), Booking.countDocuments({ weddingDate: { $gte: now }, status: { $nin: ["Cancelled", "Completed"] } }), Testimonial.countDocuments(), Testimonial.countDocuments({ published: true }), Package.countDocuments(), AuditLog.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5).lean();
  const upcoming = await Booking.find({ weddingDate: { $gte: now }, status: { $nin: ["Cancelled", "Completed"] } }).sort({ weddingDate: 1 }).limit(5).lean();
  res.json({ success: true, stats: { weddings, photos, inquiries, newInquiries, bookings, upcomingBookings, testimonials, publishedTestimonials, packages }, recentInquiries, upcomingBookings: upcoming, activity });
});
export default router;
