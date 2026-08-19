import mongoose from "mongoose";

const weddingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, trim: true, index: true },
  coupleNames: { type: String, required: true, trim: true }, location: String, venue: String, weddingDate: Date, description: String,
  coverImage: String, gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], featured: { type: Boolean, default: false }, published: { type: Boolean, default: false },
  seoTitle: String, metaDescription: String, tags: [String],
}, { timestamps: true });
export default mongoose.model("Wedding", weddingSchema);
