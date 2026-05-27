import React, { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const seededRange = (seed, min, max) => {
  const value = Math.sin(seed * 999) * 10000;
  const normalized = value - Math.floor(value);
  return normalized * (max - min) + min;
};

const IntroLoader = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let start = 0;

    const interval = setInterval(() => {
      start += Math.floor(Math.random() * 5) + 1;

      if (start >= 100) {
        start = 100;
        clearInterval(interval);

        setTimeout(() => {
          setIsVisible(false);
        }, 800);
      }

      setCount(start);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const word = "Wedding Bingo";
  const letters = useMemo(
    () =>
      word.split("").map((letter, i) => ({
        exit: {
          y: seededRange(i + 1, -200, 200),
          x: seededRange(i + 21, -200, 200),
          rotate: seededRange(i + 41, 0, 90),
          opacity: 0,
          filter: "blur(10px)",
        },
        id: `${letter}-${i}`,
        letter,
      })),
    []
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: "easeInOut",
            },
          }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#050505] overflow-hidden px-4"
        >
          {/* Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-[#C6A75E] rounded-full blur-[120px] md:blur-[150px]"
          />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            
            {/* Animated Text */}
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 max-w-full">
              {letters.map(({ exit, id, letter }, i) => (
                <motion.span
                  key={id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={exit}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    exit: {
                      type: "spring",
                      stiffness: 50,
                    },
                  }}
                  className="
                    text-4xl
                    sm:text-5xl
                    md:text-7xl
                    lg:text-8xl
                    xl:text-9xl
                    font-black
                    text-white
                    italic
                    tracking-tight
                    leading-none
                  "
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            {/* Counter */}
            <motion.div
              className="relative flex items-center justify-center"
              exit={{
                scale: 2,
                opacity: 0,
                filter: "blur(20px)",
              }}
            >
              <span
                className="
                  text-[5rem]
                  sm:text-[7rem]
                  md:text-[10rem]
                  lg:text-[14rem]
                  xl:text-[18rem]
                  font-black
                  text-white/5
                  leading-none
                  select-none
                "
              >
                {count}
              </span>

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ x: [-2, 2, -2] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.1,
                }}
              >
                <span
                  className="
                    text-sm
                    sm:text-base
                    md:text-lg
                    lg:text-xl
                    font-mono
                    text-[#C6A75E]
                    tracking-[0.5em]
                    sm:tracking-[0.8em]
                    md:tracking-[1em]
                    ml-2 sm:ml-4 md:ml-6
                  "
                >
                  {count}%
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.2, 0],
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "linear",
                }}
                className="h-[1px] w-full bg-[#C6A75E] absolute"
                style={{ top: `${i * 10}%` }}
              />
            ))}
          </div>

          {/* Noise Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05] z-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroLoader;
