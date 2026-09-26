import CategoryShowcase from "../components/CategoryShowcase";

const media = [
  { type: "image", src: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=1200&auto=format&fit=crop", alt: "Couple pre-wedding portrait", caption: "Just the two of you, before it all begins." },
  { type: "image", src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop", alt: "Couple walking outdoors", caption: "A quiet walk, a shared secret." },
  { type: "image", src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop", alt: "Romantic sunset couple shoot", caption: "Golden light, effortless romance." },
  { type: "image", src: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1200&auto=format&fit=crop", alt: "Couple candid laughter", caption: "The laugh that gave it away." },
  { type: "image", src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop&flip=h", alt: "Couple by the water", caption: "Where the story quietly begins." },
  { type: "image", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop", alt: "Engagement ring close-up", caption: "The promise, in detail." },
  { type: "image", src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop", alt: "Couple in nature setting", caption: "Set against landscapes as timeless as the moment." },
  { type: "image", src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop", alt: "Couple candid pre-wedding portrait", caption: "Unscripted, unposed, unforgettable." },
];

export default function PreWeddingCategory() {
  return (
    <CategoryShowcase
      eyebrow="Pre-Wedding Shoots"
      title="Pre-Wedding"
      tagline="The quiet chapter before the big day — intimate, unscripted, and entirely yours."
      heroImage="https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=1600&auto=format&fit=crop"
      intro="Before the guest list and the schedule takes over, there's just the two of you. Our pre-wedding sessions are built around real connection, set against locations that feel like an extension of your story."
      media={media}
    />
  );
}
