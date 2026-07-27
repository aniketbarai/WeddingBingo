import Image from "../models/Image.js";
import fs from "fs";
import path from "path";

export const getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortMode = req.query.sort || "newest";
    const skip = (page - 1) * limit;

    const total = await Image.countDocuments();
    const pages = Math.max(Math.ceil(total / limit), 1);

    if (sortMode === "popular") {
      const images = await Image.aggregate([
        { $addFields: { score: { $add: [{ $multiply: ["$likes", 3] }, "$clicks"] } } },
        { $sort: { score: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
      return res.json({ images, total, page, pages });
    }

    const images = await Image.find().sort({ _id: -1 }).skip(skip).limit(limit);
    res.json({ images, total, page, pages });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Admin: upload a new photo (multipart, field name "image") with a title.
// Runs behind requireAdminAuth + the multer `upload` middleware (see routes).
export const adminUploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const title = (req.body.title || "").trim();
    const src = `/uploads/${req.file.filename}`;

    const image = await Image.create({ src, title });
    return res.status(201).json({ success: true, image });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to upload image" });
  }
};

// Admin: list all images (no pagination needed for the management view).
export const adminListImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 });
    return res.status(200).json({ success: true, images });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load images" });
  }
};

// Admin: delete a photo. Also removes the file from disk so uploads/
// doesn't accumulate orphaned files.
export const adminDeleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    if (image.src) {
      const filePath = path.join(process.cwd(), image.src.replace(/^\//, ""));
      fs.unlink(filePath, () => {}); // best-effort; ignore if already gone
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete image" });
  }
};