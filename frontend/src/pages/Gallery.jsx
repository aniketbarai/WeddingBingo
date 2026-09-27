import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { api } from "../api/client";

/* ---------------------------------------------------------------------- */
/*  Hero: full height/width image + overlaid title                        */
/* ---------------------------------------------------------------------- */
function GalleryHero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 150]);
  const textY = useTransform(scrollY, [0, 600], [0, 60]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <motion.div
        style={{ y: imgY }}
        initial={{ scale: 1.25, opacity: 0 }}
        animate={{ scale: 1.08, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#f4ecd8] via-[#ece0c2] to-[#d9c48f]"
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
/*  Stories: one card per couple -> /gallery/story/:slug                  */
/* ---------------------------------------------------------------------- */
function StoriesSection({ stories, loading }) {
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

        {loading ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mx-auto flex w-full max-w-[220px] flex-col items-center">
                <div className="aspect-[3/4] w-full max-w-[190px] animate-pulse rounded-full bg-zinc-100" />
                <div className="mt-4 h-3 w-24 animate-pulse rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <p className="text-center text-sm text-black/40">Couple stories are coming soon.</p>
        ) : (
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
                    className="mx-auto aspect-[3/4] w-full max-w-[190px] overflow-hidden rounded-full bg-zinc-100 ring-1 ring-black/10"
                  >
                    {story.coverImage && (
                      <motion.img
                        src={story.coverImage}
                        alt={story.coupleNames}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                  <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8C6F2D]">
                    {[story.location, story.weddingDate ? new Date(story.weddingDate).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : null]
                      .filter(Boolean)
                      .join(" \u00b7 ")}
                  </p>
                  <h3 className="mt-1 font-serif text-xl italic text-black">{story.coupleNames}</h3>
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
        )}
      </div>
    </section>
  );
}

export default function Gallery() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/public/weddings");
        if (!cancelled) setStories(data.items || []);
      } catch {
        if (!cancelled) setStories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="bg-white">
        <GalleryHero />
        <StoriesSection stories={stories} loading={loading} />
      </div>
      <Footer />
    </>
  );
}
