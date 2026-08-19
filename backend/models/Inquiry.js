import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 40 },
  weddingDate: Date,
  location: { type: String, trim: true, maxlength: 240 },
  venue: { type: String, trim: true, maxlength: 240 },
  eventType: { type: String, trim: true, maxlength: 120 },
  budget: { type: String, trim: true, maxlength: 120 },
  guestCount: { type: Number, min: 1, max: 10000 },
  message: { type: String, maxlength: 5000 },
  source: { type: String, default: "website", maxlength: 80 },
  status: { type: String, enum: ["New", "Contacted", "Follow-up", "Qualified", "Proposal Sent", "Booked", "Lost", "Archived"], default: "New", index: true },
  notes: [{ body: { type: String, maxlength: 3000 }, author: String, createdAt: { type: Date, default: Date.now } }],
  timeline: [{ event: String, status: String, author: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

inquirySchema.index({ email: 1, createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Inquiry", inquirySchema);
