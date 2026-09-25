import mongoose from "mongoose";

// Dedicated collection for the homepage "Glimpse" section. Kept separate
// from the general gallery Image model so the two can be managed and
// re-ordered independently, and so this is the only place a video can
// ever appear.
const glimpseSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    // ImageKit's file id, needed to delete the asset from ImageKit itself.
    fileId: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], default: "image", index: true },
    // For videos, ImageKit can generate a thumbnail frame; used as the
    // poster image so the admin grid and homepage don't have to download
    // the whole video just to show a preview.
    thumbnail: { type: String, default: "" },
    title: { type: String, default: "", trim: true, maxlength: 160 },
    caption: { type: String, default: "", trim: true, maxlength: 400 },
    alt: { type: String, default: "", trim: true, maxlength: 240 },
    // Lower numbers show first on the homepage; new uploads are appended
    // to the end by default (see controller) but can be reordered by admin.
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

glimpseSchema.index({ active: 1, order: 1 });

export default mongoose.model("Glimpse", glimpseSchema);
