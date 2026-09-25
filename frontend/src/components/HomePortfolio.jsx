import { useEffect, useState, useRef } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

// Fallback shown only if the API hasn't been populated yet / is unreachable,
// so the section never renders completely empty during first setup.
const decodeUrl = (encodedUrl) => {
  try {
    return window.atob(encodedUrl);
  } catch {
    return "";
  }
};

const fallbackItems = [
  {
    url: "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDEvVG9wLURlc3RpbmF0aW9uLVdlZGRpbmctUGhvdG9ncmFwaGVyLWluLUluZGlhLUludGVybmF0aW9uYWwtMS53ZWJw",
    alt: "Destination wedding couple portrait",
    caption:
      "Destination wedding photography, capturing the feeling of every celebration.",
  },
  {
    url: "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTA3LndlYnA=",
    alt: "Joyful wedding ceremony moment",
    caption: "Candid wedding moments filled with joy, movement, and emotion.",
  },
  {
    url: "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLWJhbm5lci0wOC53ZWJw",
    alt: "Elegant wedding portrait",
    caption: "Elegant portraits made personal through natural connection.",
  },
  {
    url: "aHR0cHM6Ly9yYWNobmFuaXJhbmphbi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMjUvMDEvcmFjaG5hLW5pcmFuamFuLXNsaWRlLTAxLndlYnA=",
    alt: "Traditional Indian wedding ceremony",
    caption: "Tradition, colour, and the little in-between moments.",
  },
];

// Normalizes both the live API shape ({ src, type, thumbnail, alt, caption })
// and the base64-encoded fallback shape into one shape the grid renders.
const normalizeItems = (apiItems) => {
  if (Array.isArray(apiItems) && apiItems.length > 0) {
    return apiItems.map((item) => ({
      id: item._id,
      type: item.type === "video" ? "video" : "image",
      src: item.src,
      thumbnail: item.thumbnail || item.src,
      alt: item.alt || item.title || "Wedding Bingo glimpse",
      caption: item.caption || item.title || "",
    }));
  }
  return fallbackItems.map((item, index) => ({
    id: `fallback-${index}`,
    type: "image",
    src: decodeUrl(item.url),
    thumbnail: decodeUrl(item.url),
    alt: item.alt,
    caption: item.caption,
  }));
};

function AnimatedPortfolioCard({ item, index, onClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isColored, setIsColored] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    // Entrance Animation Observer
    const entranceObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          entranceObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Color Reveal Observer - Applies ONLY on screens smaller than lg (1024px)
    const colorObserver = new IntersectionObserver(
      ([entry]) => {
        const isMobileDevice = window.innerWidth < 1024;
        if (isMobileDevice) {
          setIsColored(entry.isIntersecting);
        } else {
          setIsColored(true); // Desktop remains colored
        }
      },
      { threshold: 0.2, rootMargin: "-30% 0px -30% 0px" }
    );

    if (cardRef.current) {
      entranceObserver.observe(cardRef.current);
      colorObserver.observe(cardRef.current);
    }

    return () => {
      entranceObserver.disconnect();
      colorObserver.disconnect();
    };
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      style={{
        transitionDelay: `${(index % 4) * 80}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className={`group relative mb-1 block w-full overflow-hidden break-inside-avoid bg-black text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 rotate-0"
          : "opacity-0 translate-y-16 scale-80 rotate-1"
      }`}
      aria-label={`Open ${item.alt}`}
    >
      <div className="relative">
        {item.type === "video" ? (
          <video
            src={item.src}
            muted
            playsInline
            preload="metadata"
            className={`block h-auto w-full transition-all duration-1000 ease-out group-hover:scale-105 group-hover:grayscale-0 ${
              isColored
                ? "grayscale-0 contrast-100"
                : "grayscale contrast-125 opacity-80 lg:grayscale-0 lg:contrast-100 lg:opacity-100"
            }`}
          />
        ) : (
          <img
            src={item.thumbnail}
            alt={item.alt}
            className={`block h-auto w-full transition-all duration-1000 ease-out group-hover:scale-105 group-hover:grayscale-0 ${
              isColored
                ? "grayscale-0 contrast-100"
                : "grayscale contrast-125 opacity-80 lg:grayscale-0 lg:contrast-100 lg:opacity-100"
            }`}
            loading="lazy"
          />
        )}
        {item.type === "video" && (
          <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
      </div>

      {/* Left-to-Right Overlay with Search Icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-black/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Search size={20} />
        </span>
      </div>
    </button>
  );
}

export default function HomePortfolio() {
  const [portfolioItems, setPortfolioItems] = useState(() => normalizeItems([]));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedItem =
    selectedIndex === null ? null : portfolioItems[selectedIndex];

  useEffect(() => {
    let active = true;
    api
      .get("/api/glimpse")
      .then(({ data }) => {
        if (active) setPortfolioItems(normalizeItems(data?.items));
      })
      .catch(() => {
        // Keep the fallback grid on any network/API error.
      });
    return () => {
      active = false;
    };
  }, []);

  const closeLightbox = () => setSelectedIndex(null);
  const showPrevious = () => {
    setSelectedIndex((current) =>
      current === null
        ? 0
        : (current - 1 + portfolioItems.length) % portfolioItems.length,
    );
  };
  const showNext = () => {
    setSelectedIndex((current) =>
      current === null ? 0 : (current + 1) % portfolioItems.length,
    );
  };

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <section
      id="portfolio"
      className="bg-black px-2 py-20 text-white sm:px-4 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <div className="group relative mx-auto mb-12 max-w-3xl text-center md:mb-16">
            {/* Main Title with Gradient & Shimmer */}
            <h2 className="relative font-serif text-5xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2D6] via-[#C2A35C] to-[#8C6F2D] sm:text-6xl md:text-7xl drop-shadow-2xl selection:bg-[#C2A35C] selection:text-black">
              <span className="inline-block pr-1 font-serif italic font-normal tracking-normal text-transparent bg-clip-text bg-gradient-to-tr from-[#8C6F2D] via-[#FFEBB3] to-[#C2A35C] drop-shadow-[0_2px_12px_rgba(194,163,92,0.4)]">
                G
              </span>
              <span className="-ml-2">limpse</span>
            </h2>

            {/* Multi-layered Accent Line */}
            <div className="relative mx-auto mt-3 flex h-0.5 w-24 items-center justify-center">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-[#C2A35C] to-transparent opacity-60 transition-all duration-700 group-hover:w-36 group-hover:opacity-100" />
              <div className="absolute h-1.5 w-1.5 rotate-45 border border-[#C2A35C] bg-black shadow-[0_0_8px_#C2A35C]" />
            </div>
          </div>
        </div>

        {/* Natural masonry: each photo/video keeps its own aspect ratio, nothing
            is cropped. Fixed at 2 columns on mobile, scaling up to 4 on desktop. */}
        <div className="columns-2 gap-1 lg:columns-4">
          {portfolioItems.map((item, index) => (
            <AnimatedPortfolioCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <div className="mt-14 text-center md:mt-20">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 border border-white px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-black"
          >
            Browse Our Gallery
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20"
            aria-label="Close image viewer"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <figure
            className="flex max-h-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedItem.type === "video" ? (
              <video
                src={selectedItem.src}
                poster={selectedItem.thumbnail}
                className="max-h-[80vh] max-w-full object-contain shadow-2xl"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedItem.src}
                alt={selectedItem.alt}
                className="max-h-[80vh] max-w-full object-contain shadow-2xl"
              />
            )}
            <figcaption className="mt-5 max-w-xl text-center text-xs leading-5 text-zinc-300">
              {selectedItem.caption}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:right-8"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
}