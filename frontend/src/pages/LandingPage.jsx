import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

// 6 Alternating Sentences with Toggling Colors
const WORDS = [
  { text: "One Moment at a Time", color: "text-[#C6A75E]" },
  { text: "Crafting Unforgettable Stories", color: "text-white" },
  { text: "Preserving Every Sacred Emotion", color: "text-[#C6A75E]" },
  { text: "Turning Memories into Pure Art", color: "text-white" },
  { text: "Framing Your Eternal Romance", color: "text-[#C6A75E]" },
  { text: "Celebrating Love in Every Detail", color: "text-white" },
];

const LandingPage = () => {
  const { scrollY } = useScroll();

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
    const currentWordObj = WORDS[wordIndex];
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
          setWordIndex((prev) => (prev + 1) % WORDS.length);
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
      className="relative h-screen w-full overflow-hidden bg-black selection:bg-[#C6A75E] selection:text-black"
    >
      {/* Parallax Background (ORIGINAL IMAGE PRESERVED) */}
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 h-full w-full">
        <img
          rel="preload"
          src="https://instagram.fbom19-3.fna.fbcdn.net/v/t51.82787-15/619595446_18001248938842405_1644051406423898218_n.jpg?stp=dst-jpg_e35_s640x640_sh2.08_tt6&_nc_cat=105&_nc_map=urlgen_bucketless&ig_cache_key=MzAyMzQyMDgzNTI2ODM1NTUwOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=15lwF3SwHkEQ7kNvwEEYtGB&_nc_oc=Adqco81wBb06Sb3ri1IK8ahcTj0HuITrbdmmdH2i0GR5PJ1hzMisiM1fhd-r2XDIaMdq8nDvCheS3h3wHcL_xQK6&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fbom19-3.fna&_nc_gid=qZEiRZI2A2q_kPHuMmseng&_nc_ss=7a22e&oh=00_AQKPROJzyCb7ESZEWLqW94if5PW3k-hZrRosi_uORY5UJw&oe=6AB2CA11"
          alt="Wedding"
          className="h-[120%] w-full object-cover object-center"
        />
        {/* Multi-Layer Overlay Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.85)_100%)]" />
      </motion.div>

      {/* Soft Gold Radiance Spotlight */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[35vw] w-[35vw] rounded-full bg-[#C6A75E]/15 blur-[130px]" />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: opacityText, y: yText }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        {/* Dynamic Heading (Scaled Down) */}
<h1 className="max-w-2xl font-serif text-2xl leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
  Capturing Love,
  {/* ROTATING TYPEWRITER TEXT */}
  <span className="mt-1 block min-h-[1.25em] font-serif italic tracking-tight">
    <span className={`transition-colors duration-500 ${WORDS[wordIndex].color}`}>
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

        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-neutral-300 md:text-xl">
          Luxury Wedding Photography that tells your timeless love story.
        </p>

        {/* ACTION BUTTON WITH SWEEP & ARROW ANIMATION */}
        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <button
            onClick={handleScrollToTestimonials}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#C6A75E] px-9 py-4 text-xs font-bold tracking-[0.25em] uppercase text-black shadow-[0_10px_30px_rgba(198,167,94,0.3)] transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_40px_rgba(198,167,94,0.5)] active:scale-95"
          >
            {/* Left to Right Light Shine Effect */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
            />

            <span className="relative z-10">View Testimonials</span>

            {/* Emergent Up-Right Arrow Icon */}
            <ArrowUpRight
              size={18}
              className="relative z-10 -translate-x-1 translate-y-1 opacity-70 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
            />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPage;