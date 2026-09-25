import AboutStory from "../models/AboutStory.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";

// The site shipped with these hardcoded slides. They're used to seed the
// singleton document the first time it's created, so the homepage and the
// admin form both show real content immediately instead of blank slides.
const DEFAULT_STORY = {
  slide1: {
    eyebrow: "The Visionary",
    heading: "Pradeep Jartarghar",
    text: "Dedicated to capturing raw emotions, timeless traditions, and the singular essence of every couple. Blending high-fashion elegance with unscripted documentary storytelling.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop",
    fileId: "",
    alt: "Pradeep Jartarghar",
  },
  slide2: {
    eyebrow: "",
    heading: "",
    text: "Capturing moments that exist between seconds.",
    image: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=80&w=1170&auto=format&fit=crop",
    fileId: "",
    alt: "Wedding celebration detail",
  },
  slide3: {
    eyebrow: "",
    heading: "",
    text: "Capturing The Kind Of Love That Makes Ordinary Moments Feel Beautiful And Forever.",
    image: "https://images.unsplash.com/photo-1735052712425-f44a4d4b6cd7?q=80&w=1170&auto=format&fit=crop",
    fileId: "",
    alt: "Wedding portrait",
  },
};

// There is only ever one AboutStory document. Create it (seeded with the
// site's original content) on first access so both the public homepage and
// the admin form always have something sensible to read.
const getOrCreateStory = async () => {
  let story = await AboutStory.findOne();
  if (!story) story = await AboutStory.create(DEFAULT_STORY);
  return story;
};

// Public: consumed by the homepage About Horizontal section.
export const getAboutStory = async (req, res) => {
  try {
    const story = await getOrCreateStory();
    return res.json({ success: true, story });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load about content" });
  }
};

// Admin: same content, behind auth, for prefilling the edit form.
export const adminGetAboutStory = async (req, res) => {
  try {
    const story = await getOrCreateStory();
    return res.json({ success: true, story });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load about content" });
  }
};

// Admin: update any combination of the three slides in one request.
// Text fields: slide1Eyebrow, slide1Heading, slide1Text, slide2Text, slide3Text
// Files (optional, multipart field names): slide1Image, slide2Image, slide3Image
export const adminUpdateAboutStory = async (req, res) => {
  try {
    const story = await getOrCreateStory();
    const body = req.body || {};
    const files = req.files || {};

    const textFieldsBySlide = {
      slide1: ["Eyebrow", "Heading", "Text"],
      slide2: ["Text"],
      slide3: ["Text"],
    };

    for (const slideKey of ["slide1", "slide2", "slide3"]) {
      // Apply text edits for this slide, if sent.
      for (const suffix of textFieldsBySlide[slideKey]) {
        const bodyKey = `${slideKey}${suffix}`;
        if (body[bodyKey] !== undefined) {
          story[slideKey][suffix.toLowerCase()] = String(body[bodyKey]).trim();
        }
      }

      // Apply a new image for this slide, if one was uploaded.
      const uploadedFile = files[`${slideKey}Image`]?.[0];
      if (uploadedFile) {
        if (!isImageKitConfigured()) {
          return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
        }
        const uploadResult = await imagekit.upload({
          file: uploadedFile.buffer.toString("base64"),
          fileName: uploadedFile.originalname,
          folder: "/weddingbingo/about-story",
          useUniqueFileName: true,
        });

        // Best-effort cleanup of the asset this image is replacing.
        const oldFileId = story[slideKey].fileId;
        if (oldFileId && isImageKitConfigured()) {
          imagekit.deleteFile(oldFileId).catch(() => {});
        }

        story[slideKey].image = uploadResult.url;
        story[slideKey].fileId = uploadResult.fileId;
        if (!story[slideKey].alt) story[slideKey].alt = story[slideKey].heading || story[slideKey].text || "Wedding Bingo";
      }
    }

    await story.save();
    return res.json({ success: true, story });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to update about content" });
  }
};
