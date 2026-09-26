import CategoryShowcase from "../components/CategoryShowcase";

// NOTE: the two `type: "video"` entries below use publicly hosted sample
// clips (Google's Creative-Commons demo videos) purely as placeholders so
// the page has real, playable video to preview. Swap `src` for your actual
// wedding-film URLs (e.g. hosted on ImageKit) before going live.
const media = [
  {
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    alt: "Cinematic wedding film reel",
    caption: "A cinematic wedding film — placeholder clip, replace with your own reel.",
  },
  { type: "image", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop", alt: "Wedding film still", caption: "Every frame, composed like a scene." },
  { type: "image", src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop", alt: "Candid wedding film moment", caption: "Documentary storytelling, not staged re-takes." },
  {
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=80&w=1200&auto=format&fit=crop",
    alt: "Wedding highlight film",
    caption: "A short highlight film — placeholder clip, replace with your own reel.",
  },
  { type: "image", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", alt: "Wedding reception cinematic shot", caption: "The atmosphere, preserved in motion." },
  { type: "image", src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop", alt: "Bride cinematic film still", caption: "Light, movement, and quiet anticipation." },
];

export default function FilmsCategory() {
  return (
    <CategoryShowcase
      eyebrow="Cinematic Videography"
      title="Film"
      tagline="Your wedding day, relived in motion — every frame scored to the emotion it deserves."
      heroImage="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop"
      intro="Photographs freeze a moment; film lets you hear it again — the vows, the laughter, the music. We shoot documentary-style, then edit every film like a short story with a beginning, middle, and an ending worth waiting for."
      media={media}
      ctaLabel="Discuss Your Film"
    />
  );
}
