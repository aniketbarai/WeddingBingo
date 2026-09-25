import Glimpse from "../models/Glimpse.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";

// Public: items shown in the homepage Glimpse section, in admin-defined order.
export const getGlimpse = async (req, res) => {
  try {
    const items = await Glimpse.find({ active: true }).sort({ order: 1, _id: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load glimpse items" });
  }
};

// Admin: list everything, including inactive, newest first for management.
export const adminListGlimpse = async (req, res) => {
  try {
    const items = await Glimpse.find().sort({ order: 1, _id: -1 });
    return res.status(200).json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load glimpse items" });
  }
};

// Admin: upload a photo or short video (multipart, field name "media").
// Runs behind requireAdminAuth + glimpseUpload middleware. The file never
// touches local disk — it's held in memory by multer and streamed straight
// to ImageKit, which returns a permanent CDN URL (and, for video, a
// generated thumbnail frame).
export const adminUploadGlimpse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }
    if (!isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const title = (req.body.title || "").trim();
    const caption = (req.body.caption || "").trim();
    const alt = (req.body.alt || "").trim();

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "/weddingbingo/glimpse",
      useUniqueFileName: true,
    });

    // ImageKit auto-generates a thumbnail frame for video uploads; for
    // images the source itself doubles as the thumbnail.
    const thumbnail = isVideo
      ? uploadResult.thumbnailUrl || `${uploadResult.url}/ik-thumbnail.jpg`
      : uploadResult.url;

    const lastItem = await Glimpse.findOne().sort({ order: -1 });
    const nextOrder = (lastItem?.order ?? -1) + 1;

    const item = await Glimpse.create({
      src: uploadResult.url,
      fileId: uploadResult.fileId,
      type: isVideo ? "video" : "image",
      thumbnail,
      title,
      caption,
      alt: alt || title,
      order: nextOrder,
    });

    return res.status(201).json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload media" });
  }
};

// Admin: update title/caption/alt/order/active without re-uploading.
export const adminUpdateGlimpse = async (req, res) => {
  try {
    const allowedFields = ["title", "caption", "alt", "order", "active"];
    const payload = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }
    const item = await Glimpse.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update item" });
  }
};

// Admin: reorder items in one shot. Body: { order: [id1, id2, id3, ...] }
// in the desired display sequence.
export const adminReorderGlimpse = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.order) ? req.body.order : [];
    if (!ids.length) return res.status(400).json({ success: false, message: "order must be a non-empty array of ids" });

    await Promise.all(ids.map((id, index) => Glimpse.findByIdAndUpdate(id, { $set: { order: index } })));
    const items = await Glimpse.find().sort({ order: 1, _id: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to reorder items" });
  }
};

// Admin: delete a photo/video. Removes the asset from ImageKit too so
// storage doesn't accumulate orphaned files.
export const adminDeleteGlimpse = async (req, res) => {
  try {
    const item = await Glimpse.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    if (item.fileId && isImageKitConfigured()) {
      imagekit.deleteFile(item.fileId).catch(() => {}); // best-effort; ignore if already gone
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete item" });
  }
};
