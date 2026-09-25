import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Footer from "../components/Footer";
import { heroStory, portfolioItems, stories } from "../data/galleryDemoData";

/* ---------------------------------------------------------------------- */
/*  Hero: full height/width image + overlaid couple name ("him weds her") */
/* ---------------------------------------------------------------------- */
function GalleryHero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 150]);
  const textY = useTransform(scrollY, [0, 600], [0, 60]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <motion.img
        style={{ y: imgY, scale: 1.08 }}
        initial={{ scale: 1.25, opacity: 0 }}
        animate={{ scale: 1.08, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
        src={heroStory.poster}
        alt={heroStory.coupleName}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-white/20" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0 pb-6 sm:pb-8">
        <motion.h1
          initial={{ y: 40, opacity: 0, letterSpacing: "0.2em" }}
          animate={{ y: 0, opacity: 1, letterSpacing: "0em" }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-serif text-4xl italic tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#8C6F2D] via-[#C2A35C] to-[#5A4415] sm:text-6xl md:text-7xl"
        >
          A Gallery of Love & Laughter
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-black/30"
        />
      </motion.div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Portfolio mosaic (same visual language as the Home page "Glimpse")    */
/* ---------------------------------------------------------------------- */
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

function PortfolioMosaic() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const selectedItem = selectedIndex === null ? null : portfolioItems[selectedIndex];

  const close = () => setSelectedIndex(null);
  const prev = () => {
    setDirection(-1);
    setSelectedIndex((i) => (i === null ? 0 : (i - 1 + portfolioItems.length) % portfolioItems.length));
  };
  const next = () => {
    setDirection(1);
    setSelectedIndex((i) => (i === null ? 0 : (i + 1) % portfolioItems.length));
  };

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-6 max-w-2xl text-center md:mb-8"
        >
          <h2 className="font-serif text-4xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#8C6F2D] via-[#C2A35C] to-[#5A4415] sm:text-5xl">
            <span className="italic font-normal">M</span>emories
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-3 h-px bg-[#C2A35C]/60"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {portfolioItems.map((item, index) => (
            <motion.button
              key={item.url}
              type="button"
              variants={cardVariants}
              whileHover={{
                scale: 1.04,
                rotate: index % 2 === 0 ? -1.5 : 1.5,
                zIndex: 10,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setDirection(1);
                setSelectedIndex(index);
              }}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-zinc-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              aria-label={`Open ${item.alt}`}
            >
              <motion.img
                src={item.url}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.18, rotate: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/35" />

              <motion.span
                initial={{ opacity: 0, x: -8 }}
                whileHover={{ opacity: 0.9, x: 0 }}
                className="absolute left-3 top-3 font-serif text-[11px] italic text-white"
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: -6, rotate: -90 }}
                whileHover={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 text-white backdrop-blur-sm"
              >
                <Search size={14} />
              </motion.span>

              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full p-4 text-[10px] font-medium uppercase tracking-[0.15em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence custom={direction}>
        {selectedItem && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4 backdrop-blur-md sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio image viewer"
            onClick={close}
          >
            <motion.button
              type="button"
              onClick={close}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/30 text-black"
              aria-label="Close image viewer"
            >
              <X size={20} />
            </motion.button>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/30 text-black sm:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </motion.button>

            <motion.figure
              key={selectedIndex}
              custom={direction}
              initial={{ opacity: 0, scale: 0.85, x: direction * 80, rotate: direction * 3 }}
              animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: direction * -80, rotate: direction * -3 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="flex max-h-full max-w-6xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedItem.url} alt={selectedItem.alt} className="max-h-[80vh] max-w-full object-contain shadow-2xl" />
              <motion.figcaption
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 max-w-xl text-center text-xs leading-5 text-zinc-600"
              >
                {selectedItem.caption}
              </motion.figcaption>
            </motion.figure>

            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/30 text-black sm:right-8"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Stories: one card per couple -> /gallery/story/:slug                  */
/* ---------------------------------------------------------------------- */
function StoriesSection() {
  return (
    <section className="bg-white px-6 py-10 sm:px-10 md:py-14 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8 text-center md:mb-10"
        >
          <h2 className="font-serif text-3xl font-extralight tracking-tight text-black sm:text-4xl">
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-tr from-[#8C6F2D] via-[#C2A35C] to-[#5A4415]">S</span>
            tories
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-4 h-px bg-[#C2A35C]/60"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        >
          {stories.map((story, i) => (
            <motion.div
              key={story.slug}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.85 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 200, damping: 20 },
                },
              }}
            >
              <Link to={`/gallery/story/${story.slug}`} className="group mx-auto block w-full max-w-[220px] text-center">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: i % 2 === 0 ? -2 : 2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto aspect-[3/4] w-full max-w-[190px] overflow-hidden rounded-full ring-1 ring-black/10"
                >
                  <motion.img
                    src={story.cover}
                    alt={story.coupleName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8C6F2D]">
                  {story.location} &middot; {story.date}
                </p>
                <h3 className="mt-1 font-serif text-xl italic text-black">{story.coupleName}</h3>
                <motion.span
                  initial={{ width: 0 }}
                  whileHover={{ width: "auto" }}
                  className="mt-2 inline-block overflow-hidden text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 transition-colors duration-300 group-hover:text-black"
                >
                  View story
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function Gallery() {
  return (
    <>
      <div className="bg-white">
        <GalleryHero />
        <PortfolioMosaic />
        <StoriesSection />
      </div>
      <Footer />
    </>
  );
}