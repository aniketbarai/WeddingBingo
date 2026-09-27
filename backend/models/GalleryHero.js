import mongoose from "mongoose";

// Singleton — the one fixed hero shown at the top of the /gallery page
// ("Aarav weds Isha" style banner): a couple name over a poster image with
// an optional background video.
const galleryHeroSchema = new mongoose.Schema(
  {
    coupleName: { type: String, default: "", trim: true, maxlength: 120 },
    poster: { type: String, default: "" },
    posterFileId: { type: String, default: "" },
    video: { type: String, default: "" },
    videoFileId: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("GalleryHero", galleryHeroSchema);
