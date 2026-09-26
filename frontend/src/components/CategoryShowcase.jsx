import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import Footer from "./Footer";

/**
 * Shared template for the three "View more" detail pages linked from the
 * homepage Wedding/Pre-Wedding/Film section. Handles both photo items
 * (type: "image") and video items (type: "video", with a poster frame) in
 * the same masonry grid + lightbox, so Films can show playable clips while
 * Wedding/Pre-Wedding show photos, using one consistent component.
 */

function Hero({ eyebrow, title, tagline, image }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.25]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} data-navbar-theme="dark" className="relative h-[85vh] w-full overflow-hidden bg-black sm:h-screen">
      <motion.img
        style={{ scale: imgScale, y: imgY }}
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      <motion.div style={{ opacity: textOpacity }} className="absolute inset-x-0 bottom-0 px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.5em] text-[#C6A75E]"
        >
          <span className="h-[1px] w-10 bg-[#C6A75E]" />
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif text-6xl italic leading-[0.95] text-white sm:text-8xl lg:text-9xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 max-w-xl text-sm font-light leading-relaxed text-white/70 sm:text-base"
        >
          {tagline}
        </motion.p>
      </motion.div>
    </section>
  );
}

function MediaCard({ item, index, onClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      style={{ transitionDelay: `${(index % 6) * 70}ms` }}
      className={`group relative mb-4 block w-full overflow-hidden break-inside-avoid bg-black text-left transition-all duration-700 ease-out hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A75E] ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      aria-label={item.type === "video" ? `Play ${item.alt}` : `Open ${item.alt}`}
    >
      <img
        src={item.type === "video" ? item.poster : item.src}
        alt={item.alt}
        loading="lazy"
        className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
      {item.type === "video" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-black/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play size={20} fill="currentColor" />
          </span>
        </span>
      )}
    </button>
  );
}

function Lightbox({ item, onClose, onPrev, onNext }) {
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    setPlaying(true);
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20"
        aria-label="Close viewer"
      >
        <X size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:left-6"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>

      <figure className="flex max-h-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {item.type === "video" ? (
          <div className="relative">
            <video
              key={item.src}
              src={item.src}
              poster={item.poster}
              autoPlay={playing}
              controls
              className="max-h-[75vh] max-w-full shadow-2xl"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </div>
        ) : (
          <img src={item.src} alt={item.alt} className="max-h-[80vh] max-w-full object-contain shadow-2xl" />
        )}
        {item.caption && <figcaption className="mt-3 max-w-lg text-center text-xs leading-5 text-zinc-300">{item.caption}</figcaption>}
      </figure>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:right-6"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default function CategoryShowcase({ eyebrow, title, tagline, heroImage, intro, media, ctaLabel = "Enquire About Your Date" }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex === null ? null : media[selectedIndex];

  const close = () => setSelectedIndex(null);
  const prev = () => setSelectedIndex((i) => (i === null ? 0 : (i - 1 + media.length) % media.length));
  const next = () => setSelectedIndex((i) => (i === null ? 0 : (i + 1) % media.length));

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white">
      <Hero eyebrow={eyebrow} title={title} tagline={tagline} image={heroImage} />

      {/* Intro copy */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10">
        <p className="text-base font-light leading-relaxed text-white/60 sm:text-lg">{intro}</p>
      </section>

      {/* Masonry media grid — natural aspect ratios, nothing cropped */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {media.map((item, index) => (
            <MediaCard key={item.src} item={item} index={index} onClick={() => setSelectedIndex(index)} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-24 text-center sm:px-10">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.5em] text-[#C6A75E]">Wedding Bingo</p>
        <h2 className="mx-auto max-w-2xl font-serif text-3xl font-light italic leading-tight sm:text-5xl">
          Let's create something timeless for your story.
        </h2>
        <Link
          to="/contact"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#C6A75E]/40 px-8 py-4 text-xs font-bold uppercase tracking-[0.35em] text-[#C6A75E] transition-all duration-500 hover:bg-[#C6A75E] hover:text-black"
        >
          {ctaLabel}
          <ArrowUpRight size={14} />
        </Link>
      </section>

      <Footer />

      {selected && <Lightbox item={selected} onClose={close} onPrev={prev} onNext={next} />}
    </div>
  );
}
