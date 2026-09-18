import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const visionaryImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop";
const storyImage1 = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop";
const storyImage2 = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop";

export default function AboutHorizontal() {
  const ref = useRef(null);

  // 1. Raw Scroll Progress
  const { scrollYProgress } = useScroll({ target: ref });

  // 2. Add Spring Physics for fluid Awwwards-style inertial scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
    restDelta: 0.001,
  });

  // 3. Smooth Track Position Mapping
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-66.666%"]);

  // 4. Ambient Dynamic Background Gradient
  const background = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["#040404", "#080706", "#0c0a07"]
  );

  // 5. Parallax & Scale Transforms
  const portraitScale = useTransform(smoothProgress, [0, 0.33], [0.9, 1.05]);
  const floatingBadgeY = useTransform(smoothProgress, [0, 0.33], [100, -100]);

  // --- SLIDE 1: TEXT VANISH ANIMATIONS ---
  const slide1TextOpacity = useTransform(smoothProgress, [0.08, 0.28], [1, 0]);
  const slide1TextY = useTransform(smoothProgress, [0.08, 0.28], [0, -40]);
  const slide1TextBlur = useTransform(smoothProgress, [0.08, 0.28], ["blur(0px)", "blur(12px)"]);

  // --- SLIDE 2: TEXT FADE IN & VANISH ANIMATIONS ---
  const slide2ImageScale = useTransform(smoothProgress, [0.15, 0.5, 0.7], [1.25, 1, 1.1]);
  const slide2TextX = useTransform(smoothProgress, [0.25, 0.65], [120, -60]);
  const slide2TextOpacity = useTransform(smoothProgress, [0.25, 0.38, 0.55, 0.7], [0, 1, 1, 0]);
  const slide2TextBlur = useTransform(
    smoothProgress,
    [0.25, 0.38, 0.55, 0.7],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
  );

  // --- SLIDE 3: TEXT FADE IN & FINALE ANIMATIONS ---
  const slide3ImageScale = useTransform(smoothProgress, [0.5, 0.9], [1.3, 1]);
  const slide3TextY = useTransform(smoothProgress, [0.65, 0.92], [60, 0]);
  const slide3TextOpacity = useTransform(smoothProgress, [0.65, 0.88], [0, 1]);
  const slide3TextBlur = useTransform(smoothProgress, [0.65, 0.88], ["blur(12px)", "blur(0px)"]);

  // 7. Progress Indicator Keyframes
  const progressWidth0 = useTransform(smoothProgress, [0, 0.33, 0.34], [60, 60, 20]);
  const progressWidth1 = useTransform(smoothProgress, [0.33, 0.34, 0.66, 0.67], [20, 60, 60, 20]);
  const progressWidth2 = useTransform(smoothProgress, [0.66, 0.67, 1], [20, 60, 60]);

  const progressOpacity0 = useTransform(smoothProgress, [0, 0.33, 0.34], [1, 1, 0.3]);
  const progressOpacity1 = useTransform(smoothProgress, [0.33, 0.34, 0.66, 0.67], [0.3, 1, 1, 0.3]);
  const progressOpacity2 = useTransform(smoothProgress, [0.66, 0.67, 1], [0.3, 1, 1]);

  const progressWidths = [progressWidth0, progressWidth1, progressWidth2];
  const progressOpacities = [progressOpacity0, progressOpacity1, progressOpacity2];

  return (
    <motion.section
      ref={ref}
      style={{ background }}
      className="relative h-[450vh] text-white selection:bg-[#C6A75E] selection:text-black"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Ambient Radial Glow Effect */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.08)_0%,transparent_70%)]" />

        <motion.div
          className="flex h-full w-[300vw] will-change-transform"
          style={{ x }}
        >
          {/* SLIDE 1: THE VISIONARY */}
          <div className="relative flex h-screen w-screen flex-none items-center px-6 md:px-16 lg:px-32">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-12">
              <motion.div
                style={{ scale: portraitScale }}
                className="group relative md:col-span-5"
              >
                {/* Pulsing Gold Halo Ring */}
                <div className="absolute -inset-6 rounded-full border border-[#C6A75E]/30 transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#C6A75E]/20 to-transparent blur-xl opacity-50 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="relative overflow-hidden rounded-full border border-white/10 shadow-2xl">
                  <img
                    className="h-56 w-56 object-cover grayscale transition-all duration-1000 ease-out group-hover:scale-105 group-hover:grayscale-0 md:h-[24vw] md:w-[24vw]"
                    src={visionaryImage}
                    alt="Pradeep Jartarghar"
                  />
                </div>
              </motion.div>

              {/* SLIDE 1 VANISHING TEXT WRAPPER */}
              <motion.div
                style={{
                  opacity: slide1TextOpacity,
                  y: slide1TextY,
                  filter: slide1TextBlur,
                }}
                className="flex flex-col justify-center md:col-span-7 will-change-[opacity,transform,filter]"
              >
                <span className="mb-4 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.8em] text-[#C6A75E]">
                  <span className="h-[1px] w-8 bg-[#C6A75E]" />
                  The Visionary
                </span>

                <h1 className="mb-6 text-[clamp(2.5rem,5vw,5rem)] font-light leading-none tracking-tight">
                  <span className="mr-3 block font-serif text-4xl italic text-[#C6A75E] md:inline md:text-6xl">
                    Meet
                  </span>
                  Pradeep Jartarghar
                </h1>

                <p className="mb-8 max-w-xl text-base font-light leading-relaxed text-neutral-400 md:text-lg">
                  Dedicated to capturing raw emotions, timeless traditions, and
                  the singular essence of every couple. Blending high-fashion elegance
                  with unscripted documentary storytelling.
                </p>

                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group relative overflow-hidden rounded-full bg-[#C6A75E] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(198,167,94,0.4)]"
                  >
                    <span className="relative z-10">Work With Me</span>
                    <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* UNIQUE ELEMENT: GLASSMORPHIC ROTATING SEAL & STATS CARD */}
            <motion.div
              style={{ y: floatingBadgeY }}
              className="absolute bottom-16 right-16 hidden flex-col items-center gap-4 lg:flex"
            >
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-2xl transition-transform duration-500 hover:scale-105">
                {/* Rotating Circular Text Ring */}
                <svg
                  className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite]"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="textPath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="fill-[#C6A75E]/80 text-[7.5px] font-bold uppercase tracking-[0.22em]">
                    <textPath href="#textPath">
                      • CINEMATIC • PHOTOS • FILMS
                    </textPath>
                  </text>
                </svg>

                {/* Central Stat Badge */}
                <div className="text-center z-10">
                  <span className="block font-serif text-2xl font-light text-[#C6A75E]">
                    12+
                  </span>
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                    Years Exp.
                  </span>
                </div>
              </div>

              {/* Minimal Stats Row */}
              <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/30 px-5 py-2 text-[9px] font-semibold tracking-wider text-neutral-300 backdrop-blur-md">
                <span>20+ STORIES</span>
                <span className="h-1 w-1 rounded-full bg-[#C6A75E]" />
                <span>500+ Collections</span>
              </div>
            </motion.div>
          </div>

          {/* SLIDE 2: CINEMATIC FULL-SCREEN STORY */}
          <div className="relative h-screen w-screen flex-none overflow-hidden bg-black">
            <motion.img
              style={{ scale: slide2ImageScale }}
              src={storyImage1}
              alt="Wedding celebration detail"
              className="h-full w-full object-cover opacity-80 transition-opacity duration-700"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

            {/* SLIDE 2 DYNAMIC DISSOLVING/VANISHING TYPOGRAPHY OVERLAY */}
            <motion.div
              style={{
                x: slide2TextX,
                opacity: slide2TextOpacity,
                filter: slide2TextBlur,
              }}
              className="absolute bottom-24 left-12 max-w-2xl md:left-24 will-change-[opacity,transform,filter]"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.5em] text-[#C6A75E]">
                Editorial Perspective
              </p>
              <h2 className="font-serif text-3xl italic text-white/90 md:text-5xl">
                "Capturing moments that exist between seconds."
              </h2>
            </motion.div>
          </div>

          {/* SLIDE 3: EDITORIAL PORTRAIT FINALE */}
          <div className="relative h-screen w-screen flex-none overflow-hidden bg-black">
            <motion.img
              style={{ scale: slide3ImageScale }}
              src={storyImage2}
              alt="Wedding portrait"
              className="h-full w-full object-cover opacity-75"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

            {/* SLIDE 3 DYNAMIC FADE & BLUR FINALE OVERLAY */}
            <motion.div
              style={{
                y: slide3TextY,
                opacity: slide3TextOpacity,
                filter: slide3TextBlur,
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-[opacity,transform,filter]"
            >
              <span className="mb-4 text-xs uppercase tracking-[0.8em] text-[#C6A75E]">
                The Craft
              </span>
              <h2 className="max-w-4xl font-serif text-4xl font-light leading-tight md:text-6xl lg:text-7xl">
                Timeless Imagery For The Unapologetically Romantic.
              </h2>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}