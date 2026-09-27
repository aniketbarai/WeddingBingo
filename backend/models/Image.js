import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  src: String,
  // ImageKit's file id, needed to delete the asset from ImageKit itself
  // (not just the database record). Empty for any legacy locally-stored image.
  fileId: { type: String, default: "" },
  title: { type: String, default: "" },
  // Optional link to one couple story. A linked image remains in the general
  // gallery and is also rendered in that story's gallery.
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", default: null, index: true },
  clicks: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [String],
}, { timestamps: true });

export default mongoose.model("Image", imageSchema);
