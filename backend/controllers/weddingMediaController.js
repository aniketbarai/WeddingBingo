import Wedding from "../models/Wedding.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";
import { recordAudit } from "../utils/audit.js";

// All uploads here go to /weddingbingo/weddings/<slug>/ — a folder per couple,
// kept separate from the shared /weddingbingo/gallery pool used by the
// general Admin > Gallery screen.

const ensureImageKit = (res) => {
  if (!isImageKitConfigured()) {
    res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    return false;
  }
  return true;
};

// Admin: add a photo to this couple's own story gallery.
export const addWeddingMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    if (!ensureImageKit(res)) return;
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return res.status(404).json({ success: false, message: "Story not found" });

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/weddingbingo/weddings/${wedding.slug}`,
      useUniqueFileName: true,
    });

    wedding.media.push({ url: uploadResult.url, fileId: uploadResult.fileId });
    await wedding.save();
    await recordAudit(req, "wedding.media_added", "weddings", wedding._id);
    return res.status(201).json({ success: true, item: wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload image" });
  }
};

// Admin: remove one photo from this couple's story gallery.
export const deleteWeddingMedia = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return res.status(404).json({ success: false, message: "Story not found" });
    const item = wedding.media.id(req.params.mediaId);
    if (!item) return res.status(404).json({ success: false, message: "Media item not found" });
    if (item.fileId && isImageKitConfigured()) imagekit.deleteFile(item.fileId).catch(() => {});
    item.deleteOne();
    await wedding.save();
    await recordAudit(req, "wedding.media_removed", "weddings", wedding._id);
    return res.json({ success: true, item: wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to delete image" });
  }
};

// Admin: set/replace the story's cover image (used on the gallery card + as video poster).
export const setWeddingCoverImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    if (!ensureImageKit(res)) return;
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return res.status(404).json({ success: false, message: "Story not found" });

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/weddingbingo/weddings/${wedding.slug}`,
      useUniqueFileName: true,
    });

    if (wedding.coverImageFileId && isImageKitConfigured()) imagekit.deleteFile(wedding.coverImageFileId).catch(() => {});
    wedding.coverImage = uploadResult.url;
    wedding.coverImageFileId = uploadResult.fileId;
    await wedding.save();
    await recordAudit(req, "wedding.cover_updated", "weddings", wedding._id);
    return res.json({ success: true, item: wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload cover image" });
  }
};

// Admin: upload/replace the hero video shown at the top of the story page.
export const setWeddingVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No video file provided" });
    if (!ensureImageKit(res)) return;
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return res.status(404).json({ success: false, message: "Story not found" });

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/weddingbingo/weddings/${wedding.slug}`,
      useUniqueFileName: true,
    });

    if (wedding.videoFileId && isImageKitConfigured()) imagekit.deleteFile(wedding.videoFileId).catch(() => {});
    wedding.videoUrl = uploadResult.url;
    wedding.videoFileId = uploadResult.fileId;
    await wedding.save();
    await recordAudit(req, "wedding.video_updated", "weddings", wedding._id);
    return res.json({ success: true, item: wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload video" });
  }
};

// Admin: remove the hero video.
export const deleteWeddingVideo = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return res.status(404).json({ success: false, message: "Story not found" });
    if (wedding.videoFileId && isImageKitConfigured()) imagekit.deleteFile(wedding.videoFileId).catch(() => {});
    wedding.videoUrl = "";
    wedding.videoFileId = "";
    await wedding.save();
    await recordAudit(req, "wedding.video_removed", "weddings", wedding._id);
    return res.json({ success: true, item: wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to remove video" });
  }
};
