import Image from "../models/Image.js";
import fs from "fs";
import path from "path";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";

export const incrementImageLikes = async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, projection: { likes: 1 } },
    );
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    return res.json({ success: true, newLikes: image.likes });
  } catch (err) {
    if (err?.name === "CastError") return res.status(400).json({ success: false, message: "Invalid image id" });
    return res.status(500).json({ success: false, message: "Failed to like image" });
  }
};

export const incrementImageClicks = async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true, projection: { clicks: 1 } },
    );
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    return res.json({ success: true, clicks: image.clicks });
  } catch (err) {
    if (err?.name === "CastError") return res.status(400).json({ success: false, message: "Invalid image id" });
    return res.status(500).json({ success: false, message: "Failed to record image view" });
  }
};

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
// The file never touches local disk — it's held in memory by multer and
// streamed straight to ImageKit, which returns a permanent CDN URL.
export const adminUploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    if (!isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    const title = (req.body.title || "").trim();
    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "/weddingbingo/gallery",
      useUniqueFileName: true,
    });

    const image = await Image.create({ src: uploadResult.url, fileId: uploadResult.fileId, title });
    return res.status(201).json({ success: true, image });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload image" });
  }
};

export const adminUploadServiceImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    if (!isImageKitConfigured()) return res.status(503).json({ success: false, message: "Image hosting is not configured." });
    const uploadResult = await imagekit.upload({ file: req.file.buffer.toString("base64"), fileName: req.file.originalname, folder: "/weddingbingo/services", useUniqueFileName: true });
    return res.status(201).json({ success: true, image: { url: uploadResult.url, fileId: uploadResult.fileId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload service image" });
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

// Admin: delete a photo. Removes the asset from ImageKit (or, for any
// legacy image uploaded before the ImageKit migration, from local disk)
// so storage doesn't accumulate orphaned files.
export const adminDeleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    if (image.fileId && isImageKitConfigured()) {
      imagekit.deleteFile(image.fileId).catch(() => {}); // best-effort; ignore if already gone
    } else if (image.src && image.src.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), image.src.replace(/^\//, ""));
      fs.unlink(filePath, () => {}); // legacy local file
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete image" });
  }
};
