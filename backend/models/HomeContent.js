import mongoose from "mongoose";

// One rotating headline phrase shown in the hero typewriter effect.
const rotatingPhraseSchema = new mongoose.Schema(
  {
    text: { type: String, default: "", trim: true, maxlength: 80 },
    color: { type: String, default: "gold", enum: ["gold", "white"] },
  },
  { _id: false },
);

// One of the 3 "story highlight" cards on the homepage About section
// (tag / title / short paragraph, no image).
const highlightSchema = new mongoose.Schema(
  {
    tag: { type: String, default: "", trim: true, maxlength: 40 },
    title: { type: String, default: "", trim: true, maxlength: 80 },
    text: { type: String, default: "", trim: true, maxlength: 400 },
  },
  { _id: false },
);

// One photo card inside a homepage category preview grid (Wedding /
// Pre-Wedding / Film) — image + alt text + caption shown in the lightbox.
const categoryItemSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    fileId: { type: String, default: "" }, // ImageKit file id, needed to delete/replace the asset
    alt: { type: String, default: "", trim: true, maxlength: 240 },
    caption: { type: String, default: "", trim: true, maxlength: 240 },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    items: { type: [categoryItemSchema], default: () => [{}, {}] },
  },
  { _id: false },
);

const heroSchema = new mongoose.Schema(
  {
    subtitle: { type: String, default: "", trim: true, maxlength: 200 },
    ctaLabel: { type: String, default: "", trim: true, maxlength: 40 },
    rotatingPhrases: { type: [rotatingPhraseSchema], default: () => [] },
    backgroundImage: { type: String, default: "" },
    backgroundFileId: { type: String, default: "" },
  },
  { _id: false },
);

// Singleton document — there is only ever one HomeContent record, holding
// everything above the sliding Banner section on the homepage: the hero,
// the 3 "story highlight" cards, and the Wedding/Pre-Wedding/Film preview grids.
const homeContentSchema = new mongoose.Schema(
  {
    hero: { type: heroSchema, default: () => ({}) },
    highlights: { type: [highlightSchema], default: () => [{}, {}, {}] },
    categories: {
      wedding: { type: categorySchema, default: () => ({}) },
      preWedding: { type: categorySchema, default: () => ({}) },
      film: { type: categorySchema, default: () => ({}) },
    },
  },
  { timestamps: true },
);

export default mongoose.model("HomeContent", homeContentSchema);
