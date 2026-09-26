import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../api/client.js";

const AUTO_SLIDE_MS = 5000;

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    let active = true;
    api
      .get("/api/banner")
      .then(({ data }) => {
        if (active) setSlides(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        // No fallback content here — an empty banner just doesn't render.
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const goTo = useCallback(
    (next) => {
      setIndex((current) => {
        const len = slides.length;
        if (len === 0) return 0;
        return (next + len) % len;
      });
    },
    [slides.length],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-slide, restarting the timer whenever the index changes (manual or
  // automatic) so a click doesn't get instantly overridden by a pending tick.
  useEffect(() => {
    if (slides.length <= 1) return undefined;
    timerRef.current = setTimeout(() => goTo(index + 1), AUTO_SLIDE_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, slides.length, goTo]);

  if (loading || slides.length === 0) return null;

  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-black sm:h-[85vh]">
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt || "Wedding Bingo"}
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide._id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-[#C6A75E]" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
