import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import Footer from "../components/Footer";
import { api } from "../api/client";

export default function StoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setStory(null);
    (async () => {
      try {
        const { data } = await api.get(`/api/public/weddings/${slug}`);
        if (!cancelled) setStory(data.item);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const gallery = story?.media?.map((m) => m.url) || [];

  useEffect(() => {
    if (!story || selectedIndex === null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") setSelectedIndex((i) => (i - 1 + gallery.length) % gallery.length);
      if (e.key === "ArrowRight") setSelectedIndex((i) => (i + 1) % gallery.length);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story, selectedIndex]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
      </div>
    );
  }

  if (notFound || !story) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-black">
        <h1 className="font-serif text-4xl">Story not found.</h1>
        <p className="mt-3 text-sm text-black/50">This couple&apos;s story isn&apos;t available yet.</p>
        <Link to="/gallery" className="mt-8 inline-flex items-center gap-2 border border-black px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-black hover:text-white">
          <ArrowLeft size={14} /> Back to gallery
        </Link>
      </div>
    );
  }

  const dateLabel = story.weddingDate ? new Date(story.weddingDate).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : null;

  return (
    <>
      <div className="bg-white">
        {/* Hero: video with title */}
        <section className="relative h-[70vh] w-full overflow-hidden sm:h-screen">
          {story.videoUrl ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={story.videoUrl}
              poster={story.coverImage || undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : story.coverImage ? (
            <img className="absolute inset-0 h-full w-full object-cover" src={story.coverImage} alt={story.coupleNames} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2b2317] to-[#0e0b07]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

          <Link
            to="/gallery"
            className="absolute left-5 top-24 z-10 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:left-8"
          >
            <ArrowLeft size={13} /> Gallery
          </Link>

          <div className="absolute inset-x-0 bottom-0 pb-10 text-center sm:pb-14">
            {(story.location || dateLabel) && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C2A35C]">
                {[story.location, dateLabel].filter(Boolean).join(" \u00b7 ")}
              </p>
            )}
            <h1 className="mt-2 font-serif text-4xl italic tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2D6] via-[#E3C77E] to-[#8C6F2D] sm:text-6xl md:text-7xl">
              {story.coupleNames}
            </h1>
          </div>
        </section>

        {/* Minimal description */}
        {story.description && (
          <section className="px-6 py-16 text-center sm:py-20">
            <p className="mx-auto max-w-2xl font-serif text-xl italic leading-relaxed text-black/80 sm:text-2xl">
              &ldquo;{story.description}&rdquo;
            </p>
          </section>
        )}

        {/* This couple's own gallery */}
        {gallery.length > 0 && (
          <section className="px-2 pb-20 sm:px-4 md:pb-28">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 sm:grid-cols-3">
              {gallery.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="group relative aspect-[4/5] overflow-hidden bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  aria-label={`Open photo ${index + 1}`}
                >
                  <img
                    src={src}
                    alt={`${story.coupleNames} photo ${index + 1}`}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Story photo viewer"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20"
              aria-label="Close image viewer"
            >
              <X size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((i) => (i - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:left-8"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>
            <img
              src={gallery[selectedIndex]}
              alt={`${story.coupleNames} photo ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((i) => (i + 1) % gallery.length);
              }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:right-8"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
