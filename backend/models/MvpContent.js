import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  coupleNames: { type: String, required: true, trim: true, maxlength: 160 },
  email: { type: String, trim: true, lowercase: true, maxlength: 254 },
  weddingDate: { type: Date, index: true },
  venue: { type: String, trim: true, maxlength: 240 },
  location: { type: String, trim: true, maxlength: 240 },
  packageName: { type: String, trim: true, maxlength: 160 },
  assignedPhotographer: { type: String, trim: true, maxlength: 160 },
  status: { type: String, enum: ["Inquiry", "Confirmed", "Contracted", "Upcoming", "Completed", "Cancelled"], default: "Inquiry", index: true },
  notes: { type: String, maxlength: 5000 },
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  coupleName: { type: String, required: true, trim: true, maxlength: 160 },
  testimonial: { type: String, required: true, trim: true, maxlength: 5000 },
  image: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  wedding: String,
  location: String,
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false, index: true },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

testimonialSchema.index({ published: 1, featured: -1, order: 1 });

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, maxlength: 5000 },
  price: { type: String, trim: true, maxlength: 80 },
  coverImage: String,
  features: [{ type: String, trim: true, maxlength: 240 }],
  active: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

packageSchema.index({ active: 1, order: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export const Package = mongoose.model("Package", packageSchema);
