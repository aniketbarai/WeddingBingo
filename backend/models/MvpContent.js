import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  coupleNames: { type: String, required: true, trim: true }, email: String, weddingDate: Date, venue: String, location: String, packageName: String,
  assignedPhotographer: String, status: { type: String, enum: ["Inquiry", "Confirmed", "Contracted", "Upcoming", "Completed", "Cancelled"], default: "Inquiry", index: true }, notes: String,
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  coupleName: { type: String, required: true, trim: true }, testimonial: { type: String, required: true }, image: String, rating: { type: Number, min: 1, max: 5, default: 5 }, wedding: String, location: String, featured: { type: Boolean, default: false }, published: { type: Boolean, default: false }, order: { type: Number, default: 0 },
}, { timestamps: true });

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, description: String, price: String, coverImage: String, features: [String], active: { type: Boolean, default: true }, order: { type: Number, default: 0 },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export const Package = mongoose.model("Package", packageSchema);
