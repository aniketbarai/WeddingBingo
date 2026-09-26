import HomeContent from "../models/HomeContent.js";
import imagekit, { isImageKitConfigured } from "../config/imagekit.js";

const CATEGORY_KEYS = ["wedding", "preWedding", "film"];

// The site shipped with this hardcoded content. It seeds the singleton
// document the first time it's created, so the homepage and the admin form
// both show real content immediately instead of a blank hero/grid.
const DEFAULT_HOME_CONTENT = {
  hero: {
    subtitle: "Luxury Wedding Photography that tells your timeless love story.",
    ctaLabel: "View Testimonials",
    backgroundImage: "https://ik.imagekit.io/weddingbingo/wb_hero.jpg",
    backgroundFileId: "",
    rotatingPhrases: [
      { text: "One Moment at a Time", color: "gold" },
      { text: "Crafting Unforgettable Stories", color: "white" },
      { text: "Preserving Every Sacred Emotion", color: "gold" },
      { text: "Turning Memories into Pure Art", color: "white" },
      { text: "Framing Your Eternal Romance", color: "gold" },
      { text: "Celebrating Love in Every Detail", color: "white" },
    ],
  },
  highlights: [
    {
      tag: "THE ORIGIN",
      title: "Our Beginning",
      text: "What started as a raw passion for visual storytelling has evolved into a dedicated pursuit of capturing the fleeting, honest moments that define a wedding day.",
    },
    {
      tag: "THE BELIEF",
      title: "Our Philosophy",
      text: "We don't just take photographs; we document legacies. Every couple carries a unique frequency of love that deserves to be framed with absolute authenticity and timeless elegance.",
    },
    {
      tag: "THE PROMISE",
      title: "Our Vision",
      text: "Our goal is to create cinematic archives that don't just look beautiful today, but feel profoundly emotional and nostalgic when you look back decades from now.",
    },
  ],
  categories: {
    wedding: {
      items: [
        {
          image: "https://rachnaniranjan.com/wp-content/uploads/2026/01/Top-Destination-Wedding-Photographer-in-India-International-1.webp",
          alt: "Destination wedding couple portrait",
          caption: "Destination wedding photography, capturing the feeling of every celebration.",
        },
        {
          image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-07.webp",
          alt: "Joyful wedding ceremony moment",
          caption: "Candid wedding moments filled with joy, movement, and emotion.",
        },
      ],
    },
    preWedding: {
      items: [
        {
          image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-banner-08.webp",
          alt: "Pre-wedding romantic portrait",
          caption: "Timeless pre-wedding frames set against stunning natural landscapes.",
        },
        {
          image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-01.webp",
          alt: "Candid pre-wedding shoot",
          caption: "Intimate and effortless moments shared before the big day.",
        },
      ],
    },
    film: {
      items: [
        {
          image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-04.webp",
          alt: "Cinematic wedding film frame",
          caption: "Cinematic wedding films brought to life with emotion and atmosphere.",
        },
        {
          image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-05.webp",
          alt: "Storytelling wedding video detail",
          caption: "Documentary-style wedding films preserving your rarest memories.",
        },
      ],
    },
  },
};

// There is only ever one HomeContent document. Create it (seeded with the
// site's original content) on first access so both the public homepage and
// the admin form always have something sensible to read.
const getOrCreateHomeContent = async () => {
  let content = await HomeContent.findOne();
  if (!content) content = await HomeContent.create(DEFAULT_HOME_CONTENT);
  return content;
};

// Public: consumed by LandingPage, AboutSection, and the Wedding preview grid.
export const getHomeContent = async (req, res) => {
  try {
    const content = await getOrCreateHomeContent();
    return res.json({ success: true, content });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load homepage content" });
  }
};

// Admin: same content, behind auth, for prefilling the edit form.
export const adminGetHomeContent = async (req, res) => {
  try {
    const content = await getOrCreateHomeContent();
    return res.json({ success: true, content });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to load homepage content" });
  }
};

// Uploads one image to ImageKit and, if a previous file occupied this slot,
// best-effort deletes it afterwards so storage doesn't accumulate orphans.
const replaceImage = async (file, folder, previousFileId) => {
  const uploadResult = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: file.originalname,
    folder,
    useUniqueFileName: true,
  });
  if (previousFileId) imagekit.deleteFile(previousFileId).catch(() => {});
  return { url: uploadResult.url, fileId: uploadResult.fileId };
};

// Admin: update any combination of hero text/image, the 3 highlight cards,
// and the 6 category preview photos/captions in one request.
// Text fields (JSON strings): rotatingPhrases, highlights, categoryText
// Plain text fields: subtitle, ctaLabel
// Files (multipart, optional): heroImage, wedding_0, wedding_1,
// preWedding_0, preWedding_1, film_0, film_1
export const adminUpdateHomeContent = async (req, res) => {
  try {
    const content = await getOrCreateHomeContent();
    const body = req.body || {};
    const files = req.files || {};
    const hasNewFile = Object.values(files).some((arr) => arr?.length);

    if (hasNewFile && !isImageKitConfigured()) {
      return res.status(503).json({ success: false, message: "Image hosting is not configured. Set the IMAGEKIT_* environment variables." });
    }

    if (body.subtitle !== undefined) content.hero.subtitle = String(body.subtitle).trim();
    if (body.ctaLabel !== undefined) content.hero.ctaLabel = String(body.ctaLabel).trim();

    if (body.rotatingPhrases !== undefined) {
      try {
        const parsed = JSON.parse(body.rotatingPhrases);
        if (Array.isArray(parsed)) {
          content.hero.rotatingPhrases = parsed
            .map((p) => ({ text: String(p?.text || "").trim(), color: p?.color === "white" ? "white" : "gold" }))
            .filter((p) => p.text);
        }
      } catch {
        return res.status(400).json({ success: false, message: "Invalid rotatingPhrases payload" });
      }
    }

    if (body.highlights !== undefined) {
      try {
        const parsed = JSON.parse(body.highlights);
        if (Array.isArray(parsed)) {
          content.highlights = parsed.slice(0, 3).map((h) => ({
            tag: String(h?.tag || "").trim(),
            title: String(h?.title || "").trim(),
            text: String(h?.text || "").trim(),
          }));
        }
      } catch {
        return res.status(400).json({ success: false, message: "Invalid highlights payload" });
      }
    }

    if (body.categoryText !== undefined) {
      try {
        const parsed = JSON.parse(body.categoryText);
        for (const key of CATEGORY_KEYS) {
          const items = parsed?.[key];
          if (!Array.isArray(items)) continue;
          items.slice(0, 2).forEach((item, index) => {
            if (!content.categories[key].items[index]) content.categories[key].items[index] = {};
            if (item?.alt !== undefined) content.categories[key].items[index].alt = String(item.alt).trim();
            if (item?.caption !== undefined) content.categories[key].items[index].caption = String(item.caption).trim();
          });
        }
      } catch {
        return res.status(400).json({ success: false, message: "Invalid categoryText payload" });
      }
    }

    if (files.heroImage?.[0]) {
      const { url, fileId } = await replaceImage(files.heroImage[0], "/weddingbingo/hero", content.hero.backgroundFileId);
      content.hero.backgroundImage = url;
      content.hero.backgroundFileId = fileId;
    }

    for (const key of CATEGORY_KEYS) {
      for (let index = 0; index < 2; index += 1) {
        const file = files[`${key}_${index}`]?.[0];
        if (!file) continue;
        if (!content.categories[key].items[index]) content.categories[key].items[index] = {};
        const previousFileId = content.categories[key].items[index].fileId;
        const { url, fileId } = await replaceImage(file, `/weddingbingo/categories/${key}`, previousFileId);
        content.categories[key].items[index].image = url;
        content.categories[key].items[index].fileId = fileId;
        if (!content.categories[key].items[index].alt) {
          content.categories[key].items[index].alt = content.categories[key].items[index].caption || "Wedding Bingo";
        }
      }
    }

    await content.save();
    return res.json({ success: true, content });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Failed to update homepage content" });
  }
};
