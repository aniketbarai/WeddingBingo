import CategoryShowcase from "../components/CategoryShowcase";

const media = [
  { type: "image", src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", alt: "Bride and groom portrait", caption: "A quiet moment amid the celebration." },
  { type: "image", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop", alt: "Wedding ceremony", caption: "The vows, captured as they happen." },
  { type: "image", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", alt: "Wedding reception dance", caption: "Joy on the dance floor." },
  { type: "image", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop", alt: "Wedding rings detail", caption: "The smallest details, remembered forever." },
  { type: "image", src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop", alt: "Bride getting ready", caption: "Anticipation, in golden light." },
  { type: "image", src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop", alt: "Wedding couple candid laugh", caption: "Real laughter, unposed." },
  { type: "image", src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop", alt: "Wedding table decor", caption: "Every table, a story in itself." },
  { type: "image", src: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?q=80&w=1200&auto=format&fit=crop", alt: "Traditional wedding ceremony", caption: "Tradition, colour, and celebration." },
  { type: "image", src: "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=80&w=1200&auto=format&fit=crop", alt: "Wedding couple portrait sunset", caption: "Golden hour, just the two of you." },
];

export default function WeddingCategory() {
  return (
    <CategoryShowcase
      eyebrow="Wedding Photography"
      title="Wedding"
      tagline="Every ceremony, every celebration — captured exactly as it felt, not just as it looked."
      heroImage="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
      intro="From the first ritual to the last dance, we document the full arc of your wedding day — the nerves, the tears, the laughter, and everything in between. No two weddings look the same, and neither should the photographs."
      media={media}
    />
  );
}
