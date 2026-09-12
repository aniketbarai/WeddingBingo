import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  src: String,
  // ImageKit's file id, needed to delete the asset from ImageKit itself
  // (not just the database record). Empty for any legacy locally-stored image.
  fileId: { type: String, default: "" },
  title: { type: String, default: "" },
  clicks: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [String],
}, { timestamps: true });

export default mongoose.model("Image", imageSchema);