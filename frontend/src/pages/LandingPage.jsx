import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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

  // Parallax background & opacity scroll effects
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // Infinite Typewriter State
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWordObj = WORDS[wordIndex];
    const fullText = currentWordObj.text;

    // Typing / Deleting speed timing
    const typingSpeed = isDeleting ? 35 : 75;

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
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <img
          rel="preload"
          src="https://images.unsplash.com/photo-1519741497674-611481863552"
          alt="Wedding"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: opacityText }}
        className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight">
          Capturing Love,
          {/* ROTATING TYPEWRITER TEXT */}
          <span className={`block min-h-[1.3em] transition-colors duration-300 ${WORDS[wordIndex].color}`}>
            {displayedText}
            {/* Blinking Cursor */}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block ml-1 font-sans opacity-80"
            >
              |
            </motion.span>
          </span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg md:text-xl font-light max-w-2xl">
          Luxury Wedding Photography that tells your timeless love story.
        </p>

        {/* ACTION BUTTON WITH SWEEP & ARROW ANIMATION */}
        <div className="mt-8 flex gap-6 flex-wrap justify-center">
          <button
            onClick={handleScrollToTestimonials}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6A75E] text-black rounded-full font-medium overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 active:scale-100"
          >
            {/* Left to Right Light Shine Effect */}
            <span aria-hidden="true" className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            <span className="relative z-10">View Testimonials</span>

            {/* Emergent Up-Right Arrow Icon */}
            <ArrowUpRight
              size={18}
              className="relative z-10 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
            />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingPage;