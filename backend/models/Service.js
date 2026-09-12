import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  number: { type: String, required: true, trim: true, maxlength: 8 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  image: { type: String, required: true, trim: true },
  imageFileId: { type: String, default: "", trim: true },
  detailHeading: { type: String, trim: true, maxlength: 200 },
  detailSubheading: { type: String, trim: true, maxlength: 300 },
  detailParagraphs: [{ type: String, trim: true, maxlength: 3000 }],
  detailImages: [{ url: { type: String, trim: true }, fileId: { type: String, trim: true } }],
  includedPackages: [{ type: String, trim: true, maxlength: 160 }],
  includedPackageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
  pageLayout: {
    heroAlign: { type: String, enum: ["left", "center", "right"], default: "left" },
    accent: { type: String, default: "#C6A75E", trim: true },
    blocks: [{ type: { type: String, enum: ["hero", "story", "packages", "gallery"], required: true }, visible: { type: Boolean, default: true }, order: { type: Number, default: 0 } }],
  },
  active: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true });

serviceSchema.index({ active: 1, order: 1 });

export default mongoose.model("Service", serviceSchema);
