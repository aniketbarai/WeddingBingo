import mongoose from "mongoose";

// One photo belonging to this couple's own story gallery — kept on the
// Wedding document itself (own ImageKit folder) so it never mixes with the
// shared /admin/gallery pool of the general Image collection.
const weddingMediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileId: { type: String, default: "" },
}, { _id: true });

const weddingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, trim: true, index: true },
  coupleNames: { type: String, required: true, trim: true }, location: String, venue: String, weddingDate: Date, description: String,
  coverImage: String, coverImageFileId: { type: String, default: "" },
  // Hero video shown at the top of this couple's dedicated story page.
  videoUrl: { type: String, default: "" }, videoFileId: { type: String, default: "" },
  // This couple's own photo set, separate from the shared gallery pool.
  media: [weddingMediaSchema],
  // Legacy field kept for backward compatibility; no longer used by the story page.
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], featured: { type: Boolean, default: false }, published: { type: Boolean, default: false },
  seoTitle: String, metaDescription: String, tags: [String],
}, { timestamps: true });
export default mongoose.model("Wedding", weddingSchema);
