import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, lowercase: true, trim: true }, phone: String,
  weddingDate: Date, location: String, venue: String, eventType: String, budget: String, guestCount: Number, message: String, source: { type: String, default: "website" },
  status: { type: String, enum: ["New", "Contacted", "Follow-up", "Qualified", "Proposal Sent", "Booked", "Lost", "Archived"], default: "New", index: true },
  notes: [{ body: String, author: String, createdAt: { type: Date, default: Date.now } }],
  timeline: [{ event: String, status: String, author: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });
inquirySchema.index({ email: 1, createdAt: -1 });
export default mongoose.model("Inquiry", inquirySchema);
