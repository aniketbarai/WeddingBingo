import BannerSlide from "../models/BannerSlide.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";

export const MIN_SLIDES = 3;
export const MAX_SLIDES = 10;

// Public: active slides in order, for the homepage hero.
export const getBanner = async (req, res) => {
  try {
    const items = await BannerSlide.find({ active: true }).sort({ order: 1, _id: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load banner slides" });
  }
};

// Admin: list everything (including inactive), for the management view.
export const adminListBanner = async (req, res) => {
  try {
    const items = await BannerSlide.find().sort({ order: 1, _id: -1 });
    return res.status(200).json({ success: true, items, min: MIN_SLIDES, max: MAX_SLIDES });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load banner slides" });
  }
};

// Admin: upload a new slide image (multipart, field name "image").
export const adminUploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const total = await BannerSlide.countDocuments();
    if (total >= MAX_SLIDES) {
      return res.status(400).json({ success: false, message: `You can have at most ${MAX_SLIDES} banner slides. Remove one before adding another.` });
    }
    if (!isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    const alt = (req.body.alt || "").trim();
    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "/weddingbingo/banner",
      useUniqueFileName: true,
    });

    const lastItem = await BannerSlide.findOne().sort({ order: -1 });
    const nextOrder = (lastItem?.order ?? -1) + 1;

    const item = await BannerSlide.create({
      src: uploadResult.url,
      fileId: uploadResult.fileId,
      alt,
      order: nextOrder,
    });

    return res.status(201).json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload slide" });
  }
};

// Admin: reorder slides. Body: { order: [id1, id2, ...] } in display order.
export const adminReorderBanner = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.order) ? req.body.order : [];
    if (!ids.length) return res.status(400).json({ success: false, message: "order must be a non-empty array of ids" });

    await Promise.all(ids.map((id, index) => BannerSlide.findByIdAndUpdate(id, { $set: { order: index } })));
    const items = await BannerSlide.find().sort({ order: 1, _id: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to reorder slides" });
  }
};

// Admin: update alt text / active state without re-uploading.
export const adminUpdateBanner = async (req, res) => {
  try {
    const allowedFields = ["alt", "order", "active"];
    const payload = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }
    const item = await BannerSlide.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Slide not found" });
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update slide" });
  }
};

// Admin: delete a slide. Blocked if it would drop the count below the
// minimum required for the slideshow to make sense.
export const adminDeleteBanner = async (req, res) => {
  try {
    const total = await BannerSlide.countDocuments();
    if (total <= MIN_SLIDES) {
      return res.status(400).json({ success: false, message: `You must keep at least ${MIN_SLIDES} banner slides. Add another before removing this one.` });
    }

    const item = await BannerSlide.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Slide not found" });

    if (item.fileId && isImageKitConfigured()) {
      imagekit.deleteFile(item.fileId).catch(() => {}); // best-effort; ignore if already gone
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete slide" });
  }
};
