// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const storyData = [
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

// Rollercoaster Card Component with 3D Swoop & Tilt Dynamics
function RollercoasterCard({ item, index, progress }) {
  // Staggered trigger points for each card on the coaster track
  const start = index * 0.22;
  const apex = start + 0.25;
  const exit = apex + 0.25;

  // 1. Vertical Swoop Drop (Swoops in from above, drops through, swoops out)
  const rawY = useTransform(
    progress,
    [start, apex, exit],
    [180, 0, -120]
  );

  // 2. 3D Pitch/Tilt (Pitching backward on climb, flattening at peak, diving forward on exit)
  const rawRotateX = useTransform(
    progress,
    [start, apex, exit],
    [55, 0, -35]
  );

  // 3. Banking Turn Roll (Banking sideways into the turn)
  const rawRotateZ = useTransform(
    progress,
    [start, apex, exit],
    [index % 2 === 0 ? -12 : 12, 0, index % 2 === 0 ? 8 : -8]
  );

  // 4. Depth Zoom & Scale Velocity
  const rawScale = useTransform(
    progress,
    [start, apex, exit],
    [0.72, 1, 0.88]
  );

  // 5. Opacity Fade Track
  const rawOpacity = useTransform(
    progress,
    [start, start + 0.1, apex, exit - 0.1, exit],
    [0, 1, 1, 0.8, 0]
  );

  // High-stiffness momentum spring physics (Rollercoaster inertia feeling)
  const springConfig = { stiffness: 180, damping: 22, mass: 0.8 };

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
        transformPerspective: 1200,
      }}
      className="relative rounded-2xl border border-white/80 bg-white/70 p-7 md:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_35px_70px_-15px_rgba(198,167,94,0.25)]"
    >
      {/* Dynamic Gold Coaster Track Accent */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent opacity-80" />

      {/* Card Header Tag */}
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A75E]/30 bg-[#C6A75E]/10 px-3.5 py-1 text-[10px] font-bold tracking-[0.3em] text-[#A38238]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6A75E] animate-pulse" />
          {item.tag}
        </span>
        <span className="font-serif text-xs italic text-gray-400">
          0{index + 1}
        </span>
      </div>

      <h2 className="mb-3 font-serif text-2xl md:text-3xl font-light italic text-gray-900">
        {item.title}
      </h2>

      <p className="text-sm md:text-base font-light leading-relaxed text-gray-600">
        {item.text}
      </p>

      {/* Glass Corner Highlight */}
      <div className="pointer-events-none absolute bottom-3 right-4 font-serif text-[10px] italic text-[#C6A75E]/40">
        Velocity Pass
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);

  // Track overall scroll progress for track physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out track momentum with inertia spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  // Left Sticky Image Perspective Coaster Tilt
  const imgRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-8, 0, 8]);
  const imgRotateX = useTransform(smoothProgress, [0, 0.5, 1], [6, 0, -6]);
  const imgScale = useTransform(smoothProgress, [0, 0.5, 1], [0.96, 1.03, 0.98]);

  return (
    <section
      ref={containerRef}
      data-navbar-theme="light"
      className="relative h-[280vh] bg-[#fcfcfc] text-black px-6 selection:bg-[#C6A75E] selection:text-white"
    >
      {/* BACKGROUND ACCENT */}
      <div className="pointer-events-none absolute top-12 left-10 select-none opacity-[0.03]">
        <h1 className="font-serif text-[22vw] italic leading-none">Est. 2024</h1>
      </div>

      {/* STICKY VIEWPORT FRAME (100vh) */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-12 lg:gap-14">
          
          {/* LEFT - STICKY IMAGE WITH 3D COASTER MOMENTUM */}
          <div className="md:col-span-5 h-[360px] md:h-[440px] w-full">
            <motion.div
              style={{
                rotateY: imgRotateY,
                rotateX: imgRotateX,
                scale: imgScale,
                transformPerspective: 1000
              }}
              className="relative h-full w-full group"
            >
              {/* Coaster Window Frame */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                {/* macOS Bar Overlay */}
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

              {/* Floating Badge */}
              <div className="absolute -bottom-3 -right-3 hidden rounded-lg bg-[#C6A75E] px-3.5 py-2 text-black shadow-lg lg:block">
                <p className="text-[9px] font-black uppercase tracking-[0.25em]">
                  Authentic Storytelling
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT - ROLLERCOASTER SWOOPING CARDS */}
          <div className="relative md:col-span-7 flex flex-col justify-center space-y-6 py-6">
            {storyData.map((item, index) => (
              <RollercoasterCard
                key={index}
                item={item}
                index={index}
                progress={smoothProgress}
              />
            ))}

            {/* CTA CONNECT LINK */}
            <div className="pt-2 pl-2">
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