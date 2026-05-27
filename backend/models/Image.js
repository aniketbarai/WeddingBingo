import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  src: String,
  clicks: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [String],
});

export default mongoose.model("Image", imageSchema);