import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import { api } from "../api/client.js";

const DEFAULT_HIGHLIGHTS = [
  {
    tag: "THE ORIGIN",
    title: "Our Beginning",
    text: "What started as a raw passion for visual storytelling has evolved into a dedicated pursuit of capturing the fleeting, honest moments that define a wedding day."
  },
  {
    tag: "THE BELIEF",
    title: "Our Philosophy",
    text: "We don't just take photographs; we document legacies. Every couple carries a unique frequency of love that deserves to be framed with absolute authenticity and timeless elegance."
  },
  {
    tag: "THE PROMISE",
    title: "Our Vision",
    text: "Our goal is to create cinematic archives that don't just look beautiful today, but feel profoundly emotional and nostalgic when you look back decades from now."
  }
];

// How much of the shared scroll timeline each card's own animation uses.
// apex sits at the midpoint of the card's slot; exit runs slightly past the
// start of the next card's slot for a short cross-fade, same feel as the
// original fixed 0.32/0.18/0.18 numbers but now scaled to however many
// highlight cards actually exist instead of assuming exactly three.
const CARD_TIMING = {
  apexFraction: 0.5,
  exitFraction: 1.05
};

const RollercoasterCard = memo(function RollercoasterCard({ item, index, total, progress }) {
  const segment = 1 / total;
  const start = index * segment;
  const apex = start + segment * CARD_TIMING.apexFraction;
  const exit = Math.min(start + segment * CARD_TIMING.exitFraction, 1);
  const isLast = index === total - 1;

  // Every value here is a plain transform of the single shared
  // (already-springed) scroll value — no per-card springs — so adding
  // more highlight cards doesn't add more animation overhead per frame.
  const y = useTransform(progress, [start, apex, exit], [180, 0, -140]);
  const rotateX = useTransform(progress, [start, apex, exit], [28, 0, -18]);
  const rotateZ = useTransform(
    progress,
    [start, apex, exit],
    [index % 2 === 0 ? -6 : 6, 0, index % 2 === 0 ? 4 : -4]
  );
  const scale = useTransform(progress, [start, apex, exit], [0.88, 1, 0.92]);

  const opacity = useTransform(
    progress,
    isLast
      ? [start, start + segment * 0.25, apex, 0.92, 1]
      : [start, start + segment * 0.25, apex, exit - segment * 0.18, exit],
    isLast ? [0, 1, 1, 1, 1] : [0, 1, 1, 0.8, 0]
  );

  return (
    <motion.div
      style={{ y, rotateX, rotateZ, scale, opacity }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-auto max-h-[75%] w-full rounded-2xl border border-white/80 bg-white/90 p-6 md:p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_30px_60px_-10px_rgba(198,167,94,0.2)]"
    >
      {/* Accent gradient line */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent opacity-80" />

      {/* Header tag */}
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A75E]/30 bg-[#C6A75E]/10 px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-[#A38238] md:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6A75E] animate-pulse" />
          {item.tag || "HIGHLIGHT"}
        </span>
        <span className="font-serif text-xs italic text-gray-400">0{index + 1}</span>
      </div>

      <h2 className="mb-3 font-serif text-xl sm:text-2xl md:text-3xl font-light italic text-gray-900 leading-tight">
        {item.title}
      </h2>

      <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-gray-600 line-clamp-4 md:line-clamp-none">
        {item.text}
      </p>

      {/* Corner badge */}
      <div className="pointer-events-none absolute bottom-3 right-4 font-serif text-[9px] italic text-[#C6A75E]/50 md:text-[10px]">
        Velocity Pass
      </div>
    </motion.div>
  );
});

// Plain, non-scroll-jacked fallback for reduced-motion users — the stacked
// card animation has no gentle version that still avoids vestibular
// triggers, so this renders every highlight at once instead.
function StaticFallback({ highlights }) {
  return (
    <section className="bg-[#fcfcfc] px-4 py-24 text-black sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {highlights.map((item, index) => (
          <article
            key={item.tag || item.title || index}
            className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] md:p-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A75E]/30 bg-[#C6A75E]/10 px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-[#A38238]">
              {item.tag || "HIGHLIGHT"}
            </span>
            <h2 className="mb-3 mt-4 font-serif text-2xl font-light italic text-gray-900 leading-tight">
              {item.title}
            </h2>
            <p className="text-sm font-light leading-relaxed text-gray-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const [highlights, setHighlights] = useState(DEFAULT_HIGHLIGHTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    api
      .get("/api/home-content")
      .then(({ data }) => {
        const items = data?.content?.highlights;
        if (active && Array.isArray(items) && items.length > 0) {
          setHighlights(items);
        }
      })
      .catch(() => {
        // Fallback to default cards
      })
      .finally(() => {
        if (active) setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalCards = useMemo(() => highlights.length, [highlights]);

  // Scroll distance now scales with how many cards there actually are,
  // instead of a flat 400vh that left a long stretch of empty scroll
  // after the last card with only three highlights (or too little room
  // to read each one comfortably with more).
  const sectionHeightVh = 130 + totalCards * 130;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001
  });

  const imgRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-4, 0, 4]);
  const imgRotateX = useTransform(smoothProgress, [0, 0.5, 1], [2, 0, -2]);

  if (!totalCards) return null;

  if (prefersReducedMotion) {
    return <StaticFallback highlights={highlights} />;
  }

  return (
    <section
      ref={containerRef}
      data-navbar-theme="light"
      style={{ height: `${sectionHeightVh}vh` }}
      className="relative bg-[#fcfcfc] text-black px-4 sm:px-6 selection:bg-[#C6A75E] selection:text-white"
    >
      {/* Background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-4 select-none opacity-[0.03] sm:top-12 sm:left-10"
      >
        <h1 className="font-serif text-[28vw] md:text-[22vw] italic leading-none">Est. 2024</h1>
      </div>

      <div className="sticky top-0 flex h-screen min-h-[600px] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 md:grid-cols-12 md:gap-10 lg:gap-14">
          {/* Left side image — same height as the card stack at every
              breakpoint so the grid row doesn't stretch to fit whichever
              column is taller, which is what left the empty gap before. */}
          <div className="hidden sm:block md:col-span-5 h-[420px] sm:h-[460px] md:h-[500px] w-full">
            <motion.div
              style={{ rotateY: imgRotateY, rotateX: imgRotateX }}
              className="relative h-full w-full [perspective:1000px] group"
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                <div className="absolute top-0 inset-x-0 z-20 flex items-center gap-1.5 bg-black/40 px-4 py-2.5 backdrop-blur-md">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>

                <img
                  src="https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=1000&auto=format&fit=crop&q=80"
                  alt="Studio Aesthetic"
                  width={1000}
                  height={1334}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-3 -right-3 hidden rounded-lg bg-[#C6A75E] px-3.5 py-2 text-black shadow-lg lg:block">
                <p className="text-[9px] font-black uppercase tracking-[0.25em]">
                  Authentic Storytelling
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side card stack */}
          <div className="relative col-span-12 md:col-span-7 flex h-[420px] sm:h-[460px] md:h-[500px] w-full flex-col justify-center [perspective:1000px]">
            <motion.div
              key={isLoaded ? "api-content" : "default-content"}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative h-full w-full"
            >
              {highlights.map((item, index) => (
                <RollercoasterCard
                  key={item.tag || item.title || index}
                  item={item}
                  index={index}
                  total={totalCards}
                  progress={smoothProgress}
                />
              ))}
            </motion.div>

            {/* CTA connect link */}
            <div className="absolute -bottom-4 left-2 z-30 sm:bottom-0">
              <button
                type="button"
                aria-label="Connect with us section"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 transition-colors hover:text-[#C6A75E]"
              >
                <span>Let's connect</span>
                <span className="h-[2px] w-8 bg-[#C6A75E] transition-all duration-300 group-hover:w-12" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}