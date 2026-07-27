import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  src: String,
  title: { type: String, default: "" },
  clicks: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [String],
}, { timestamps: true });

export default mongoose.model("Image", imageSchema);