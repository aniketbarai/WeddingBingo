import GalleryHero from "../models/GalleryHero.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";

// Seed so the hero shows real content immediately, matching what shipped
// before this became admin-editable.
const DEFAULTS = {
  coupleName: "Aarav weds Isha",
  poster: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
  video: "",
};

const getOrCreate = async () => {
  let hero = await GalleryHero.findOne();
  if (!hero) hero = await GalleryHero.create(DEFAULTS);
  return hero;
};

export const getGalleryHero = async (req, res) => {
  try {
    const hero = await getOrCreate();
    return res.json({ success: true, hero });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load gallery hero" });
  }
};

export const adminGetGalleryHero = async (req, res) => {
  try {
    const hero = await getOrCreate();
    return res.json({ success: true, hero });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load gallery hero" });
  }
};

export const adminUpdateGalleryHero = async (req, res) => {
  try {
    const hero = await getOrCreate();
    const body = req.body || {};
    const files = req.files || {};

    if (body.coupleName !== undefined) hero.coupleName = String(body.coupleName).trim();

    const posterFile = files.poster?.[0];
    const videoFile = files.video?.[0];

    if ((posterFile || videoFile) && !isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    if (posterFile) {
      const uploadResult = await imagekit.upload({
        file: posterFile.buffer.toString("base64"),
        fileName: posterFile.originalname,
        folder: "/weddingbingo/gallery-hero",
        useUniqueFileName: true,
      });
      if (hero.posterFileId) imagekit.deleteFile(hero.posterFileId).catch(() => {});
      hero.poster = uploadResult.url;
      hero.posterFileId = uploadResult.fileId;
    }

    if (videoFile) {
      const uploadResult = await imagekit.upload({
        file: videoFile.buffer.toString("base64"),
        fileName: videoFile.originalname,
        folder: "/weddingbingo/gallery-hero",
        useUniqueFileName: true,
      });
      if (hero.videoFileId) imagekit.deleteFile(hero.videoFileId).catch(() => {});
      hero.video = uploadResult.url;
      hero.videoFileId = uploadResult.fileId;
    }

    if (body.removeVideo === "true") {
      if (hero.videoFileId) imagekit.deleteFile(hero.videoFileId).catch(() => {});
      hero.video = "";
      hero.videoFileId = "";
    }

    await hero.save();
    return res.json({ success: true, hero });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to update gallery hero" });
  }
};
