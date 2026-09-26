// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";

// Fallback shown until the API responds (or if it's unreachable), so the
// section never renders empty. Mirrors the site's original 3 cards.
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

// Rollercoaster Card Component with Responsive 3D Motion
function RollercoasterCard({ item, index, progress }) {
  // Adjusted timing gaps so card animations feel distinct on scroll
  const start = index * 0.28;
  const apex = start + 0.2;
  const exit = apex + 0.2;

  // Reduced translation distances for mobile safety
  const rawY = useTransform(progress, [start, apex, exit], [120, 0, -100]);
  const rawRotateX = useTransform(progress, [start, apex, exit], [40, 0, -25]);
  const rawRotateZ = useTransform(
    progress,
    [start, apex, exit],
    [index % 2 === 0 ? -8 : 8, 0, index % 2 === 0 ? 5 : -5]
  );
  const rawScale = useTransform(progress, [start, apex, exit], [0.85, 1, 0.9]);
  const rawOpacity = useTransform(
    progress,
    [start, start + 0.08, apex, exit - 0.08, exit],
    [0, 1, 1, 0.9, 0]
  );

  const springConfig = { stiffness: 160, damping: 24, mass: 0.8 };

  const y = useSpring(rawY, springConfig);
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateZ = useSpring(rawRotateZ, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);

  return (
    <motion.div
      style={{
        y,
        rotateX,
        rotateZ,
        scale,
        opacity,
        transformPerspective: 1000
      }}
      className="absolute inset-0 m-auto h-fit w-full rounded-2xl border border-white/80 bg-white/80 p-6 md:p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-10px_rgba(198,167,94,0.25)]"
    >
      {/* Dynamic Gold Accent Line */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent opacity-80" />

      {/* Card Header Tag */}
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A75E]/30 bg-[#C6A75E]/10 px-3 py-1 text-[9px] font-bold tracking-[0.25em] text-[#A38238] md:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6A75E] animate-pulse" />
          {item.tag}
        </span>
        <span className="font-serif text-xs italic text-gray-400">
          0{index + 1}
        </span>
      </div>

      <h2 className="mb-2 font-serif text-xl md:text-3xl font-light italic text-gray-900">
        {item.title}
      </h2>

      <p className="text-xs md:text-base font-light leading-relaxed text-gray-600">
        {item.text}
      </p>

      {/* Subtle Corner Badge */}
      <div className="pointer-events-none absolute bottom-3 right-4 font-serif text-[9px] italic text-[#C6A75E]/50 md:text-[10px]">
        Velocity Pass
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const [highlights, setHighlights] = useState(DEFAULT_HIGHLIGHTS);

  useEffect(() => {
    let active = true;
    api
      .get("/api/home-content")
      .then(({ data }) => {
        const items = data?.content?.highlights;
        if (active && Array.isArray(items) && items.length) setHighlights(items);
      })
      .catch(() => {
        // Keep the default 3 cards on error.
      });
    return () => {
      active = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  const imgRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-6, 0, 6]);
  const imgRotateX = useTransform(smoothProgress, [0, 0.5, 1], [4, 0, -4]);
  const imgScale = useTransform(smoothProgress, [0, 0.5, 1], [0.98, 1.02, 0.98]);

  return (
    <section
      ref={containerRef}
      data-navbar-theme="light"
      className="relative h-[300vh] bg-[#fcfcfc] text-black px-4 sm:px-6 selection:bg-[#C6A75E] selection:text-white"
    >
      {/* Background Subtle Watermark */}
      <div className="pointer-events-none absolute top-8 left-4 select-none opacity-[0.03] sm:top-12 sm:left-10">
        <h1 className="font-serif text-[28vw] md:text-[22vw] italic leading-none">Est. 2024</h1>
      </div>

      {/* Sticky Container Frame */}
      <div className="sticky top-0 flex h-screen min-h-[600px] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 md:grid-cols-12 md:gap-10 lg:gap-14">
          
          {/* LEFT: IMAGE PREVIEW (Hidden or resized appropriately on tiny screens) */}
          <div className="hidden sm:block md:col-span-5 h-[260px] sm:h-[340px] md:h-[440px] w-full">
            <motion.div
              style={{
                rotateY: imgRotateY,
                rotateX: imgRotateX,
                scale: imgScale,
                transformPerspective: 1000
              }}
              className="relative h-full w-full group"
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                {/* MacOS Header Bar */}
                <div className="absolute top-0 inset-x-0 z-20 flex items-center gap-1.5 bg-black/40 px-4 py-2.5 backdrop-blur-md">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>

                <img
                  src="https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=1000&auto=format&fit=crop&q=80"
                  alt="Studio Aesthetic"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-3 -right-3 hidden rounded-lg bg-[#C6A75E] px-3.5 py-2 text-black shadow-lg lg:block">
                <p className="text-[9px] font-black uppercase tracking-[0.25em]">
                  Authentic Storytelling
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: CARDS STACK */}
          <div className="relative col-span-12 md:col-span-7 flex h-[380px] sm:h-[420px] md:h-[460px] w-full flex-col justify-center perspective-1000">
            {highlights.map((item, index) => (
              <RollercoasterCard
                key={index}
                item={item}
                index={index}
                progress={smoothProgress}
              />
            ))}

            {/* CTA Connect Link Fixed to Bottom */}
            <div className="absolute -bottom-6 left-2 z-30 sm:bottom-0">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
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