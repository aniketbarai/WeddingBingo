import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { api } from "../api/client";

/* ---------------------------------------------------------------------- */
/* Hero: full height/width image + overlaid title                        */
/* ---------------------------------------------------------------------- */
function GalleryHero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 150]);
  const textY = useTransform(scrollY, [0, 600], [0, 50]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Replace with your image URL
  const HERO_IMAGE_URL =
    "https://images.unsplash.com/photo-1645497265284-f2cf176bcb6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29sbGFnZSUyMGFsYnVtc3xlbnwwfHwwfHx8MA%3D%3D?auto=format&fit=crop&q=80&w=2000";

  // Ribbon text repeat array for continuous seamless scrolling
  const ribbonItems = [
    "LOVE & LAUGHTER",
    "CURATED MEMORIES",
    "A CELEBRATION OF MOMENTS",
    "FOREVER & ALWAYS",
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#FAF8F5]">
      {/* Background Image Container with Parallax Effect */}
      <motion.div
        style={{ y: imgY }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-[115%] w-full bg-[#EFECE6]"
      >
        <img
          src={HERO_IMAGE_URL}
          alt="Gallery Hero Background"
          className="h-[80vh] mt-[12vh] w-full object-cover object-center"
        />
      </motion.div>

      {/* Dark Overlay Gradient for High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Main Bottom Title Content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-x-0 bottom-24 z-10 flex flex-col items-center px-4 text-center sm:bottom-28"
      >
        <motion.h1
  initial={{ y: 35, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
  className="font-serif text-3xl font-light leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
>
  A Gallery of{" "}
  <span className="font-serif italic font-normal text-[#E0C992]">
    Love
  </span>{" "}
  &{" "}
  <span className="font-serif italic font-normal text-[#E0C992]">
    Laughter
  </span>
</motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 h-px w-10 bg-[#B89647]/60"
        />
      </motion.div>

      {/* Bottom Moving Text Ribbon */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-[#B89647]/30 bg-black/40 py-2.5 backdrop-blur-xs">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 22,
          }}
        >
          {/* Duplicate loop sequence for unbroken infinite animation */}
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex shrink-0 items-center gap-8 px-4">
              {ribbonItems.map((text, idx) => (
                <div key={idx} className="flex items-center gap-8">
                  <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#E0C992]/90 sm:text-[11px]">
                    {text}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#B89647]/70" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* General Gallery Section                                                */
/* ---------------------------------------------------------------------- */
export function GeneralGallerySection({ images, loading }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of organic tilt angles for free-style hover feel
  const hoverRotations = [2, -2.5, 3, -1.5, 2.5, -3];

  return (
    <section className="border-t border-[#B89647]/15 bg-[#FAF8F5] px-4 py-14 sm:px-8 sm:py-18">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A38238]">
            The Archive
          </p>
          <h2 className="mt-1 font-serif text-2xl italic tracking-tight text-[#2B261F] sm:text-4xl">
            Complete Collection
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-2 h-px w-8 bg-[#B89647]/40"
          />
        </motion.div>

        {/* Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`w-full animate-pulse rounded-xs bg-[#EFECE6] ${
                  index % 3 === 0
                    ? "aspect-[3/4]"
                    : index % 2 === 0
                    ? "aspect-square"
                    : "aspect-[4/5]"
                }`}
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="py-8 text-center font-serif text-xs italic text-[#7C756B]">
            Photos are coming soon.
          </p>
        ) : (
          /* Dynamic Stagger Gallery */
          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
          >
            {images.map((image, index) => {
              const aspectClass =
                index % 5 === 0
                  ? "aspect-[3/4]"
                  : index % 3 === 0
                  ? "aspect-square"
                  : "aspect-[4/5]";

              const targetRotate = hoverRotations[index % hoverRotations.length];

              return (
                <motion.div
                  key={image._id || `${image.src}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  whileHover={{
                    y: -6,
                    rotate: targetRotate,
                    scale: 1.02,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  onClick={() => setSelectedImage(image)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xs bg-[#EFECE6] shadow-xs ${aspectClass}`}
                >
                  {/* Photo */}
                  <img
                    src={image.src}
                    alt={image.title || "Wedding gallery photo"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                  />

                  {/* Bottom-to-Top Grey Overlay Slide */}
                  <div className="absolute inset-0 translate-y-full bg-neutral-900/60 transition-transform duration-500 ease-out group-hover:translate-y-0" />

                  {/* Centered Minimalist Vector Search Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100 pointer-events-none">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2B261F] shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title || "Expanded Gallery Photo"}
                className="max-h-[85vh] max-w-full rounded-md object-contain"
              />
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white transition-colors hover:bg-black/80"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Stories Section                                                        */
/* ---------------------------------------------------------------------- */
function StoriesSection({ stories, loading }) {
  return (
    <section className="bg-[#FAF8F5] px-4 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A38238]">
            Featured Journal
          </span>
          <h2 className="mt-1 font-serif text-2xl font-normal italic tracking-tight text-[#2B261F] sm:text-4xl">
            Love Stories
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-2 h-px w-8 bg-[#B89647]/40"
          />
        </motion.div>

        {/* Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mx-auto flex w-full max-w-[190px] flex-col items-center">
                <div className="aspect-[3/4] w-full animate-pulse rounded-t-full rounded-b-lg bg-[#EFECE6]" />
                <div className="mt-3 h-2.5 w-20 animate-pulse rounded bg-[#EFECE6]" />
                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-[#EFECE6]" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <p className="py-6 text-center font-serif text-xs italic text-[#7C756B]">
            Couple stories are coming soon.
          </p>
        ) : (
          /* Cards Grid */
          <motion.div
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {stories.map((story, i) => (
              <motion.div
                key={story.slug}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <Link
                  to={`/gallery/story/${story.slug}`}
                  className="group mx-auto flex w-full max-w-[190px] flex-col items-center text-center"
                >
                  {/* Arch Card Image with Free Tilt Angle */}
                  <motion.div
                    whileHover={{ y: -6, rotate: i % 2 === 0 ? 2 : -2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-t-full rounded-b-lg bg-[#EFECE6] p-1.5 ring-1 ring-[#B89647]/20 shadow-xs transition-shadow duration-500 group-hover:ring-[#B89647]/60 group-hover:shadow-lg"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-md">
                      {story.coverImage && (
                        <img
                          src={story.coverImage}
                          alt={story.coupleNames}
                          className="h-full w-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Metadata */}
                  <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A38238]">
                    {[
                      story.location,
                      story.weddingDate
                        ? new Date(story.weddingDate).toLocaleDateString(undefined, {
                            month: "short",
                            year: "numeric",
                          })
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" \u00b7 ")}
                  </p>

                  <h3 className="mt-0.5 font-serif text-lg italic tracking-tight text-[#2B261F] transition-colors duration-300 group-hover:text-[#A38238]">
                    {story.coupleNames}
                  </h3>

                  {/* Action Link Arrow */}
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#7C756B] transition-colors duration-300 group-hover:text-[#2B261F]">
                    Explore
                    <motion.span
                      className="inline-block text-[10px]"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      &rarr;
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Main Component                                                         */
/* ---------------------------------------------------------------------- */
export default function Gallery() {
  const [stories, setStories] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storiesResult, imagesResult] = await Promise.allSettled([
        api.get("/api/public/weddings"),
        api.get("/api/images", { params: { limit: 60 } }),
      ]);
      if (cancelled) return;
      if (storiesResult.status === "fulfilled") setStories(storiesResult.value.data.items || []);
      else setStories([]);
      if (imagesResult.status === "fulfilled") setImages(imagesResult.value.data.images || []);
      else setImages([]);
      setLoadingStories(false);
      setLoadingImages(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-[#FAF8F5] text-[#2B261F] selection:bg-[#B89647]/20 selection:text-[#2B261F]">
      <GalleryHero />
      <GeneralGallerySection images={images} loading={loadingImages} />
      <StoriesSection stories={stories} loading={loadingStories} />
      <Footer />
    </div>
  );
}