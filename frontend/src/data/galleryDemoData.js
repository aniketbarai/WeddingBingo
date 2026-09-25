// Demo content for the new Gallery page structure.
// Everything here is placeholder — swap for real admin-fed data later
// (images/videos come from CMS, `slug` becomes the couple's real story id).

const decodeUrl = (encodedUrl) => {
  try {
    return window.atob(encodedUrl);
  } catch {
    return "";
  }
};

// Reusing the same royalty-free MDN sample clip everywhere as a stand-in
// for real wedding films — swap `videoSrc` per couple once real footage exists.
const DEMO_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const img = (b64) => decodeUrl(b64);

// ---- Hero (single fixed couple, full height/width video + name) ----
export const heroStory = {
  coupleName: "Aarav weds Isha",
  videoSrc: DEMO_VIDEO,
  poster: img(
    "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDEvVG9wLURlc3RpbmF0aW9uLVdlZGRpbmctUGhvdG9ncmFwaGVyLWluLUluZGlhLUludGVybmF0aW9uYWwtMS53ZWJw",
  ),
};

// ---- Mosaic / portfolio grid shown right under the hero ----
export const portfolioItems = [
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA3LndlYnA=",
    ),
    alt: "Joyful wedding ceremony moment",
    caption: "Candid wedding moments filled with joy, movement, and emotion.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLWJhbm5lci0wOC53ZWJw",
    ),
    alt: "Elegant wedding portrait",
    caption: "Elegant portraits made personal through natural connection.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAxLndlYnA=",
    ),
    alt: "Traditional Indian wedding ceremony",
    caption: "Tradition, colour, and the little in-between moments.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAyLndlYnA=",
    ),
    alt: "Bride and groom wedding photograph",
    caption: "A quiet frame from a day full of beautiful chaos.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAzLndlYnA=",
    ),
    alt: "Emotional wedding celebration",
    caption: "The honest, emotional stories behind the grand celebration.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA0LndlYnA=",
    ),
    alt: "Cinematic wedding scene",
    caption: "Cinematic frames that let you relive the atmosphere.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA1LndlYnA=",
    ),
    alt: "Wedding couple in a candid moment",
    caption: "Real laughter, real intimacy, remembered beautifully.",
  },
  {
    url: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDEvVG9wLURlc3RpbmF0aW9uLVdlZGRpbmctUGhvdG9ncmFwaGVyLWluLUluZGlhLUludGVybmF0aW9uYWwtMS53ZWJw",
    ),
    alt: "Destination wedding couple portrait",
    caption:
      "Destination wedding photography, capturing the feeling of every celebration.",
  },
];

// ---- Stories: one entry per couple. Clicking a story card routes to
// /gallery/story/:slug which renders StoryDetail.jsx with this data. ----
export const stories = [
  {
    slug: "aarav-isha",
    coupleName: "Aarav & Isha",
    location: "Udaipur, Rajasthan",
    date: "February 2026",
    cover: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDEvVG9wLURlc3RpbmF0aW9uLVdlZGRpbmctUGhvdG9ncmFwaGVyLWluLUluZGlhLUludGVybmF0aW9uYWwtMS53ZWJw",
    ),
    videoSrc: DEMO_VIDEO,
    excerpt:
      "A lakeside destination wedding full of colour, tradition and quiet in-between moments.",
    gallery: [
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDEvVG9wLURlc3RpbmF0aW9uLVdlZGRpbmctUGhvdG9ncmFwaGVyLWluLUluZGlhLUludGVybmF0aW9uYWwtMS53ZWJw",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA3LndlYnA=",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLWJhbm5lci0wOC53ZWJw",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAxLndlYnA=",
      ),
    ],
  },
  {
    slug: "rohan-meera",
    coupleName: "Rohan & Meera",
    location: "Goa",
    date: "November 2025",
    cover: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAyLndlYnA=",
    ),
    videoSrc: DEMO_VIDEO,
    excerpt:
      "A beachside celebration — real laughter, golden light, and an evening that ran long.",
    gallery: [
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAyLndlYnA=",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAzLndlYnA=",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA0LndlYnA=",
      ),
    ],
  },
  {
    slug: "kabir-ananya",
    coupleName: "Kabir & Ananya",
    location: "Jaipur, Rajasthan",
    date: "January 2026",
    cover: img(
      "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA1LndlYnA=",
    ),
    videoSrc: DEMO_VIDEO,
    excerpt:
      "A regal city-palace wedding, shot cinematically from the baraat to the last dance.",
    gallery: [
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA1LndlYnA=",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDEvVG9wLURlc3RpbmF0aW9uLVdlZGRpbmctUGhvdG9ncmFwaGVyLWluLUluZGlhLUludGVybmF0aW9uYWwtMS53ZWJw",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAxLndlYnA=",
      ),
      img(
        "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA3LndlYnA=",
      ),
    ],
  },
];
