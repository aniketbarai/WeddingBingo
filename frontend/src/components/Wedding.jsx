import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

// Category metadata (routing, headings) stays fixed in code — only the
// photos + captions inside each category are admin-editable via
// /api/home-content. These are the fallback photos shown until that loads.
const CATEGORY_META = [
  { id: "wedding", key: "wedding", title: "Wedding", firstLetter: "W", restTitle: "edding", linkTo: "/wedding" },
  { id: "pre-wedding", key: "preWedding", title: "Pre-Wedding", firstLetter: "P", restTitle: "re-Wedding", linkTo: "/pre-wedding" },
  { id: "film", key: "film", title: "Film", firstLetter: "F", restTitle: "ilm", linkTo: "/films" },
];

const DEFAULT_CATEGORY_ITEMS = {
  wedding: [
    {
      image: "https://rachnaniranjan.com/wp-content/uploads/2026/01/Top-Destination-Wedding-Photographer-in-India-International-1.webp",
      alt: "Destination wedding couple portrait",
      caption: "Destination wedding photography, capturing the feeling of every celebration.",
    },
    {
      image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-07.webp",
      alt: "Joyful wedding ceremony moment",
      caption: "Candid wedding moments filled with joy, movement, and emotion.",
    },
  ],
  preWedding: [
    {
      image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-banner-08.webp",
      alt: "Pre-wedding romantic portrait",
      caption: "Timeless pre-wedding frames set against stunning natural landscapes.",
    },
    {
      image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-01.webp",
      alt: "Candid pre-wedding shoot",
      caption: "Intimate and effortless moments shared before the big day.",
    },
  ],
  film: [
    {
      image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-04.webp",
      alt: "Cinematic wedding film frame",
      caption: "Cinematic wedding films brought to life with emotion and atmosphere.",
    },
    {
      image: "https://rachnaniranjan.com/wp-content/uploads/2025/01/rachna-niranjan-slide-05.webp",
      alt: "Storytelling wedding video detail",
      caption: "Documentary-style wedding films preserving your rarest memories.",
    },
  ],
};

const buildCategoriesData = (categoryItems) =>
  CATEGORY_META.map((meta) => ({
    ...meta,
    items: (categoryItems[meta.key]?.length ? categoryItems[meta.key] : DEFAULT_CATEGORY_ITEMS[meta.key]).map((item) => ({
      url: item.image,
      alt: item.alt,
      caption: item.caption,
    })),
  }));

function AnimatedPortfolioCard({ item, index, onClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      style={{
        transitionDelay: `${index * 80}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className={`group relative overflow-hidden rounded-sm border border-black/10 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 rotate-0"
          : "opacity-0 translate-y-8 scale-95 rotate-1"
      }`}
      aria-label={`Open ${item.alt}`}
    >
      <div className="aspect-[16/10] w-full">
        <img
          src={item.url}
          alt={item.alt}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Overlay with Search Icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-black/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <Search size={18} />
        </span>
      </div>
    </button>
  );
}

export default function Wedding() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoriesData, setCategoriesData] = useState(() => buildCategoriesData({}));

  useEffect(() => {
    let active = true;
    api
      .get("/api/home-content")
      .then(({ data }) => {
        const categories = data?.content?.categories;
        if (active && categories) setCategoriesData(buildCategoriesData(categories));
      })
      .catch(() => {
        // Keep the default photos on error.
      });
    return () => {
      active = false;
    };
  }, []);

  const allItems = categoriesData.flatMap((category) => category.items);
  const selectedIndex = selectedImage ? allItems.findIndex((item) => item.url === selectedImage.url) : null;

  const closeLightbox = () => setSelectedImage(null);
  const showPrevious = () => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex - 1 + allItems.length) % allItems.length;
    setSelectedImage(allItems[nextIndex]);
  };
  const showNext = () => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % allItems.length;
    setSelectedImage(allItems[nextIndex]);
  };

  useEffect(() => {
    if (!selectedImage) return undefined;
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
  }, [selectedImage, selectedIndex]);

  return (
    <div className="bg-[#FCFCFC] px-4 py-8 text-black md:py-12 space-y-12 md:space-y-16">
      {categoriesData.map((category) => (
        <section key={category.id} id={category.id} className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-4 text-center md:mb-6">
            <h2 className="font-serif text-3xl font-extralight tracking-tight text-black sm:text-4xl md:text-5xl">
              <span className="inline-block pr-1 font-serif italic font-normal text-black">
                {category.firstLetter}
              </span>
              <span className="-ml-1">{category.restTitle}</span>
            </h2>
          </div>

          {/* 2-Grid Cards Layout */}
          <div className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {category.items.map((item, index) => (
              <AnimatedPortfolioCard
                key={item.url}
                item={item}
                index={index}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-6 text-center md:mt-8">
            <Link
              to={category.linkTo}
              className="inline-flex items-center gap-2 border border-black px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition duration-300 hover:bg-black hover:text-white"
            >
              View more...
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </section>
      ))}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20"
            aria-label="Close image viewer"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <figure className="flex max-h-full max-w-5xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <img src={selectedImage.url} alt={selectedImage.alt} className="max-h-[80vh] max-w-full object-contain shadow-2xl" />
            <figcaption className="mt-3 max-w-lg text-center text-xs leading-5 text-zinc-300">{selectedImage.caption}</figcaption>
          </figure>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}