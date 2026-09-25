import mongoose from "mongoose";

// A single slide's editable content: one photo + its accompanying text.
const slideSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "", trim: true, maxlength: 80 }, // small uppercase label above the heading (slide 1 only)
    heading: { type: String, default: "", trim: true, maxlength: 200 }, // slide 1 only ("Meet Pradeep Jartarghar")
    text: { type: String, default: "", trim: true, maxlength: 1000 }, // paragraph / quote shown on the slide
    image: { type: String, default: "" }, // ImageKit CDN url
    fileId: { type: String, default: "" }, // ImageKit file id, needed to delete/replace the asset
    alt: { type: String, default: "", trim: true, maxlength: 240 },
  },
  { _id: false },
);

// Singleton document — there is only ever one AboutStory record, holding
// all three horizontal-scroll slides on the homepage About section.
const aboutStorySchema = new mongoose.Schema(
  {
    slide1: { type: slideSchema, default: () => ({}) },
    slide2: { type: slideSchema, default: () => ({}) },
    slide3: { type: slideSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export default mongoose.model("AboutStory", aboutStorySchema);
