import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const visionaryImage =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop";
const storyImage1 =
  "https://images.unsplash.com/photo-1587271636175-90d58cdad458?q=80&w=1170&auto=format&fit=crop";
const storyImage2 =
  "https://images.unsplash.com/photo-1735052712425-f44a4d4b6cd7?q=80&w=1170&auto=format&fit=crop";

export default function AboutHorizontal() {
  const ref = useRef(null);

  // 1. Scroll Progress
  const { scrollYProgress } = useScroll({ target: ref });

  // 2. Responsive Fast Spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 24,
    restDelta: 0.0001,
  });

  // 3. Desktop Horizontal Track
  const desktopX = useTransform(smoothProgress, [0, 1], ["0%", "-66.666%"]);

  // 4. Background Gradient
  const background = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["#000000", "#080706", "#0c0a07"]
  );

  // --- MOBILE STACK TRANSITIONS ---

  // Slide 1
  const slide1Opacity = useTransform(smoothProgress, [0, 0.15, 0.22], [1, 1, 0]);
  const slide1Y = useTransform(smoothProgress, [0.15, 0.22], [0, -15]);

  // Slide 2
  const slide2Opacity = useTransform(
    smoothProgress,
    [0.2, 0.3, 0.48, 0.55],
    [0, 1, 1, 0]
  );
  const slide2Y = useTransform(
    smoothProgress,
    [0.2, 0.3, 0.48, 0.55],
    [15, 0, 0, -15]
  );

  // Slide 3
  const slide3Opacity = useTransform(smoothProgress, [0.52, 0.62, 1], [0, 1, 1]);
  const slide3Y = useTransform(smoothProgress, [0.52, 0.62], [15, 0]);

  // Combined indicator opacity: visible on Slides 1 and 2, hidden on Slide 3
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.48, 0.55],
    [1, 1, 0]
  );

  return (
    <motion.section
      ref={ref}
      style={{ background }}
      className="relative h-[300vh] text-white selection:bg-[#C6A75E] selection:text-black"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Ambient Radial Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.06)_0%,transparent_70%)]" />

        {/* =========================================================
            1. MOBILE LAYOUT: Fast Single Card Stack
           ========================================================= */}
        <div className="relative flex h-full w-full flex-col justify-center px-6 py-6 md:hidden">
          
          {/* TOP IMAGE FRAME (50vh) */}
          <div className="relative h-[50vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <motion.img
              style={{ opacity: slide1Opacity }}
              src={visionaryImage}
              alt="Pradeep Jartarghar"
              className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-300 [will-change:opacity]"
            />
            <motion.img
              style={{ opacity: slide2Opacity }}
              src={storyImage1}
              alt="Wedding celebration detail"
              className="absolute inset-0 h-full w-full object-cover [will-change:opacity]"
            />
            <motion.img
              style={{ opacity: slide3Opacity }}
              src={storyImage2}
              alt="Wedding portrait"
              className="absolute inset-0 h-full w-full object-cover [will-change:opacity]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* BOTTOM CONTENT AREA */}
          <div className="relative mt-6 flex min-h-[220px] flex-col justify-center text-center">
            
            {/* Slide 1 Content */}
            <motion.div
              style={{ opacity: slide1Opacity, y: slide1Y }}
              className="absolute inset-0 flex flex-col items-center justify-center [will-change:transform,opacity]"
            >
              <span className="mb-1 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C6A75E]">
                The Visionary
              </span>
              <h1 className="mb-2 text-2xl font-light tracking-tight">
                <span className="mr-2 font-serif italic text-[#C6A75E]">Meet</span>
                Pradeep Jartarghar
              </h1>
              <p className="mb-4 text-xs font-light leading-relaxed text-neutral-400">
                Capturing raw emotions, timeless traditions, and high-fashion elegance
                with unscripted documentary storytelling.
              </p>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full bg-[#C6A75E] px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-black"
              >
                Work With Me
              </button>
            </motion.div>

            {/* Slide 2 Content */}
            <motion.div
              style={{ opacity: slide2Opacity, y: slide2Y }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none [will-change:transform,opacity]"
            >
              <h2 className="font-serif text-xl italic text-white/90">
                "Capturing moments that exist between seconds."
              </h2>
            </motion.div>

            {/* Slide 3 Content */}
            <motion.div
              style={{ opacity: slide3Opacity, y: slide3Y }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none [will-change:transform,opacity]"
            >
              <h2 className="font-serif text-lg font-light leading-snug">
                Capturing The Kind Of Love That Makes Ordinary Moments Feel Beautiful And Forever.
              </h2>
            </motion.div>

          </div>

          {/* MOBILE SCROLL INDICATOR (Only visible on Slides 1 & 2) */}
          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="pointer-events-none absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1.5 [will-change:opacity]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C6A75E]">
              Scroll
            </span>
            <motion.svg
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-4 w-4 text-[#C6A75E]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </motion.div>

        </div>

        {/* =========================================================
            2. DESKTOP LAYOUT: Horizontal Sliding Track
           ========================================================= */}
        <motion.div
          className="hidden h-full w-[300vw] md:flex [will-change:transform]"
          style={{ x: desktopX }}
        >
          {/* DESKTOP SLIDE 1 */}
          <div className="relative flex h-screen w-screen flex-none items-center bg-black px-16 lg:px-32">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-12">
              <div className="relative flex justify-center col-span-5">
                <div className="relative h-[24vw] w-[24vw] overflow-hidden rounded-full border border-white/10 shadow-2xl">
                  <img
                    className="h-full w-full object-cover grayscale transition-all duration-500 ease-out hover:grayscale-0"
                    src={visionaryImage}
                    alt="Pradeep Jartarghar"
                  />
                </div>
              </div>
              <div className="col-span-7 flex flex-col justify-center text-left">
                <span className="mb-2 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.5em] text-[#C6A75E]">
                  <span className="h-[1px] w-8 bg-[#C6A75E]" />
                  The Visionary
                </span>
                <h1 className="mb-6 text-5xl lg:text-7xl font-light tracking-tight">
                  <span className="mr-3 font-serif italic text-[#C6A75E]">Meet</span>
                  Pradeep Jartarghar
                </h1>
                <p className="mb-8 max-w-xl text-base font-light leading-relaxed text-neutral-400">
                  Dedicated to capturing raw emotions, timeless traditions, and the singular essence of every couple. Blending high-fashion elegance with unscripted documentary storytelling.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group relative overflow-hidden rounded-full bg-[#C6A75E] px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(198,167,94,0.4)]"
                  >
                    <span className="relative z-10">Work With Me</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP SLIDE 2 */}
          <div className="relative flex h-screen w-screen flex-none items-center bg-black px-16 lg:px-32">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-12">
              <div className="relative col-span-12 h-[70vh] overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={storyImage1}
                  alt="Wedding celebration detail"
                  className="h-full w-full object-cover opacity-85"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                <div className="absolute bottom-12 left-12 max-w-2xl">
                  <h2 className="font-serif text-5xl lg:text-6xl italic text-white/90">
                    "Capturing moments that exist between seconds."
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP SLIDE 3 */}
          <div className="relative flex h-screen w-screen flex-none items-center bg-black px-16 lg:px-32">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-12">
              <div className="relative col-span-12 h-[70vh] overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={storyImage2}
                  alt="Wedding portrait"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                  <h2 className="max-w-4xl font-serif text-4xl lg:text-5xl font-light leading-snug">
                    Capturing The Kind Of Love That Makes Ordinary Moments Feel Beautiful And Forever.
                  </h2>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.section>
  );
}