import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { api } from "../api/client.js";

// Fallback hero content shown until the API responds (or if it's
// unreachable), so the section never renders empty. Mirrors the site's
// original 6 alternating sentences, subtitle, background, and CTA.
const DEFAULT_HERO = {
  subtitle: "Luxury Wedding Photography that tells your timeless love story.",
  ctaLabel: "View Testimonials",
  backgroundImage: "https://ik.imagekit.io/weddingbingo/wb_hero.jpg",
  rotatingPhrases: [
    { text: "One Moment at a Time", color: "gold" },
    { text: "Crafting Unforgettable Stories", color: "white" },
    { text: "Preserving Every Sacred Emotion", color: "gold" },
    { text: "Turning Memories into Pure Art", color: "white" },
    { text: "Framing Your Eternal Romance", color: "gold" },
    { text: "Celebrating Love in Every Detail", color: "white" },
  ],
};

const colorClass = (color) => (color === "white" ? "text-white" : "text-[#C6A75E]");

const LandingPage = () => {
  const { scrollY } = useScroll();
  const [hero, setHero] = useState(DEFAULT_HERO);

  useEffect(() => {
    let active = true;
    api
      .get("/api/home-content")
      .then(({ data }) => {
        const content = data?.content?.hero;
        if (!active || !content) return;
        setHero({
          subtitle: content.subtitle || DEFAULT_HERO.subtitle,
          ctaLabel: content.ctaLabel || DEFAULT_HERO.ctaLabel,
          backgroundImage: content.backgroundImage || DEFAULT_HERO.backgroundImage,
          rotatingPhrases: Array.isArray(content.rotatingPhrases) && content.rotatingPhrases.length
            ? content.rotatingPhrases
            : DEFAULT_HERO.rotatingPhrases,
        });
      })
      .catch(() => {
        // Keep the default hero content on error.
      });
    return () => {
      active = false;
    };
  }, []);

  const WORDS = hero.rotatingPhrases;

  // Parallax background, zoom & opacity scroll effects
  const yBg = useTransform(scrollY, [0, 600], [0, 180]);
  const scaleBg = useTransform(scrollY, [0, 600], [1, 1.12]);
  const opacityText = useTransform(scrollY, [0, 350], [1, 0]);
  const yText = useTransform(scrollY, [0, 350], [0, -50]);

  // Infinite Typewriter State
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Clamp in case WORDS shrank (e.g. right after the API content loads).
    const safeIndex = wordIndex < WORDS.length ? wordIndex : 0;
    const currentWordObj = WORDS[safeIndex];
    const fullText = currentWordObj.text;

    // Typing / Deleting speed timing
    const typingSpeed = isDeleting ? 30 : 65;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
        if (displayedText === fullText) {
          // Pause at the end before erasing
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
        if (displayedText === "") {
          setIsDeleting(false);
          // Advance to next sentence
          setWordIndex(() => (safeIndex + 1) % WORDS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex]);

  // Scroll to Testimonials
  const handleScrollToTestimonials = () => {
    const section = document.getElementById("testimonials");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      data-navbar-theme="dark"
      data-scroll
      data-scroll-speed="-1.3"
      className="relative min-h-[100dvh] h-screen w-full overflow-hidden bg-black selection:bg-[#C6A75E] selection:text-black"
    >
      {/* Parallax Background (ORIGINAL IMAGE PRESERVED) */}
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 h-full w-full">
        <img
          rel="preload"
          src={hero.backgroundImage}
          alt="Wedding"
          className="h-[120%] w-full object-cover object-center"
        />
        {/* Multi-Layer Overlay Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.85)_100%)]" />
      </motion.div>

      {/* Soft Gold Radiance Spotlight */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[60vw] w-[60vw] max-w-[500px] max-h-[500px] sm:h-[35vw] sm:w-[35vw] rounded-full bg-[#C6A75E]/15 blur-[90px] sm:blur-[130px]" />
      </div>

      {/* Content Container */}
      <motion.div
        style={{ opacity: opacityText, y: yText }}
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center"
      >
        {/* Dynamic Heading with Responsive Scaling */}
        <h1 className="max-w-4xl font-serif text-3xl leading-[1.18] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight">
          Capturing Love,
          {/* ROTATING TYPEWRITER TEXT */}
          <span className="mt-2 block min-h-[2.5em] sm:min-h-[1.8em] md:min-h-[1.4em] font-serif italic tracking-tight">
            <span className={`inline-block transition-colors duration-500 ${colorClass(WORDS[wordIndex < WORDS.length ? wordIndex : 0]?.color)}`}>
              {displayedText}
            </span>
            {/* Blinking Cursor */}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block ml-1 font-sans text-[#C6A75E] font-extralight opacity-90"
            >
              |
            </motion.span>
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-md md:max-w-xl text-sm sm:text-base md:text-lg font-light leading-relaxed text-neutral-300">
          {hero.subtitle}
        </p>

        {/* ACTION BUTTON WITH SWEEP & ARROW ANIMATION */}
        <div className="mt-8 sm:mt-10 flex gap-6 flex-wrap justify-center">
          <button
            onClick={handleScrollToTestimonials}
            className="group relative inline-flex items-center gap-2.5 sm:gap-3 overflow-hidden rounded-full bg-[#C6A75E] px-7 py-3.5 sm:px-9 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-black shadow-[0_10px_30px_rgba(198,167,94,0.3)] transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_40px_rgba(198,167,94,0.5)] active:scale-95"
          >
            {/* Left to Right Light Shine Effect */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
            />

            <span className="relative z-10">{hero.ctaLabel}</span>

            {/* Emergent Up-Right Arrow Icon */}
            <ArrowUpRight
              className="relative z-10 size-4 sm:size-5 -translate-x-1 translate-y-1 opacity-70 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
            />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPage;