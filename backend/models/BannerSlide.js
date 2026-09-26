import mongoose from "mongoose";

// Homepage sliding hero banner. Admin must keep between 3 and 10 active
// slides — enforced in the controller, not here, so a bad direct DB write
// doesn't hard-fail schema validation on read.
const bannerSlideSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    // ImageKit's file id, needed to delete the asset from ImageKit itself.
    fileId: { type: String, default: "" },
    alt: { type: String, default: "", trim: true, maxlength: 240 },
    // Lower numbers show first in the slideshow.
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

bannerSlideSchema.index({ active: 1, order: 1 });

export default mongoose.model("BannerSlide", bannerSlideSchema);
