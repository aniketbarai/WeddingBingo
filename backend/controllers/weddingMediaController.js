import Wedding from "../models/Wedding.js";
import Image from "../models/Image.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";
import { recordAudit } from "../utils/audit.js";

const notFound = (res) => res.status(404).json({ success: false, message: "Wedding not found" });

// --- Cover image -----------------------------------------------------

export const adminUploadWeddingCover = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    if (!isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/weddingbingo/weddings/${wedding._id}/cover`,
      useUniqueFileName: true,
    });

    if (wedding.coverFileId) imagekit.deleteFile(wedding.coverFileId).catch(() => {});

    wedding.coverImage = uploadResult.url;
    wedding.coverFileId = uploadResult.fileId;
    await wedding.save();

    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload cover image" });
  }
};

export const adminDeleteWeddingCover = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);

    if (wedding.coverFileId) imagekit.deleteFile(wedding.coverFileId).catch(() => {});
    wedding.coverImage = "";
    wedding.coverFileId = "";
    await wedding.save();

    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to remove cover image" });
  }
};

// --- Highlight video ---------------------------------------------------

export const adminUploadWeddingVideo = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);
    if (!req.file) return res.status(400).json({ success: false, message: "No video file provided" });
    if (!isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/weddingbingo/weddings/${wedding._id}/video`,
      useUniqueFileName: true,
    });

    if (wedding.videoFileId) imagekit.deleteFile(wedding.videoFileId).catch(() => {});

    wedding.video = uploadResult.url;
    wedding.videoFileId = uploadResult.fileId;
    await wedding.save();

    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload video" });
  }
};

export const adminDeleteWeddingVideo = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);

    if (wedding.videoFileId) imagekit.deleteFile(wedding.videoFileId).catch(() => {});
    wedding.video = "";
    wedding.videoFileId = "";
    await wedding.save();

    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to remove video" });
  }
};

// --- Photo gallery -------------------------------------------------------
// Each gallery photo becomes its own Image document (same collection the
// general Gallery/Portfolio uses) and its id is referenced from the
// wedding's `gallery` array — so these behave like normal library images
// but are only ever attached to this one story.

export const adminAddWeddingGalleryImage = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);
    if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
    if (!isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    const uploadResult = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: `/weddingbingo/weddings/${wedding._id}/gallery`,
      useUniqueFileName: true,
    });

    const image = await Image.create({
      src: uploadResult.url,
      fileId: uploadResult.fileId,
      title: (req.body.title || "").trim() || wedding.coupleNames,
    });

    wedding.gallery.push(image._id);
    await wedding.save();
    await wedding.populate("gallery");

    return res.status(201).json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to upload photo" });
  }
};

export const adminRemoveWeddingGalleryImage = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);

    const { imageId } = req.params;
    if (!wedding.gallery.some((id) => String(id) === String(imageId))) {
      return res.status(404).json({ success: false, message: "Photo not found on this story" });
    }

    wedding.gallery = wedding.gallery.filter((id) => String(id) !== String(imageId));
    await wedding.save();

    // This image only ever belonged to this story's gallery, so clean it up
    // fully (DB record + ImageKit asset) rather than leaving it orphaned.
    const image = await Image.findByIdAndDelete(imageId);
    if (image?.fileId && isImageKitConfigured()) {
      imagekit.deleteFile(image.fileId).catch(() => {});
    }

    await wedding.populate("gallery");
    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to remove photo" });
  }
};

export const adminReorderWeddingGallery = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return notFound(res);

    const ids = Array.isArray(req.body.order) ? req.body.order : [];
    const current = new Set(wedding.gallery.map((id) => String(id)));
    if (!ids.length || ids.some((id) => !current.has(String(id))) || ids.length !== current.size) {
      return res.status(400).json({ success: false, message: "order must contain exactly this story's current photo ids" });
    }

    wedding.gallery = ids;
    await wedding.save();
    await wedding.populate("gallery");

    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to reorder photos" });
  }
};

// --- Delete a whole story, cleaning up every asset it owns ---------------

export const adminDeleteWeddingWithCleanup = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id).populate("gallery");
    if (!wedding) return notFound(res);

    if (wedding.coverFileId) imagekit.deleteFile(wedding.coverFileId).catch(() => {});
    if (wedding.videoFileId) imagekit.deleteFile(wedding.videoFileId).catch(() => {});
    for (const image of wedding.gallery) {
      if (image?.fileId) imagekit.deleteFile(image.fileId).catch(() => {});
    }
    const galleryIds = wedding.gallery.map((image) => image._id);
    if (galleryIds.length) await Image.deleteMany({ _id: { $in: galleryIds } });

    await Wedding.findByIdAndDelete(req.params.id);
    await recordAudit(req, "crud.delete", "weddings", wedding._id);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete story" });
  }
};

// Admin: fetch a single wedding with its gallery populated, for the editor.
export const adminGetWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id).populate("gallery");
    if (!wedding) return notFound(res);
    return res.json({ success: true, wedding });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load story" });
  }
};
