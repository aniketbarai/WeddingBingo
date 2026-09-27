import { useEffect, useState, useRef, useId } from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com/wedding_bingo",
    icon: Instagram,
    // Native color with dark/light background variants and matching glow
    colorClass:
      "text-[#E4405F] dark:text-[#f6b7c8] hover:shadow-[0_0_16px_rgba(228,64,95,0.35)] dark:hover:shadow-[0_0_16px_rgba(246,183,200,0.35)]",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919594624646",
    icon: MessageCircle,
    colorClass:
      "text-[#128C7E] dark:text-[#75d69b] hover:shadow-[0_0_16px_rgba(18,140,126,0.35)] dark:hover:shadow-[0_0_16px_rgba(117,214,155,0.35)]",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/weddingbingo",
    icon: Facebook,
    colorClass:
      "text-[#1877F2] dark:text-[#8db8ff] hover:shadow-[0_0_16px_rgba(24,119,242,0.35)] dark:hover:shadow-[0_0_16px_rgba(141,184,255,0.35)]",
  },
];

const DRIZZLE_DROPS = [
  { left: "12%", delay: "0ms" },
  { left: "30%", delay: "170ms" },
  { left: "50%", delay: "360ms" },
  { left: "70%", delay: "80ms" },
  { left: "88%", delay: "420ms" },
];

export default function HomeSocialTab() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const idPrefix = useId();

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;

      // Scroll Down -> Reveal
      // Scroll Up (or top of page) -> Hide
      if (deltaY > 6 && currentScrollY > 60) {
        setIsVisible(true);
      } else if (deltaY < -6 || currentScrollY <= 60) {
        setIsVisible(false);
      }

      setIsScrolling(true);
      lastScrollY.current = currentScrollY;

      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <aside
      aria-label="Social links menu"
      className="pointer-events-none fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
    >
      <div
        className={`pointer-events-auto relative flex items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-12 opacity-0 scale-95"
        }`}
      >
        {/* Drizzle Layer (Adapts drop gradient for light vs dark mode) */}
        <div
          className={`home-social-drizzle absolute inset-x-0 -top-8 h-8 pointer-events-none overflow-visible transition-opacity duration-300 ${
            isScrolling && isVisible ? "opacity-100 home-social-drizzle-active" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          {DRIZZLE_DROPS.map((drop, index) => (
            <span
              key={`${idPrefix}-drop-${index}`}
              className="home-social-drop bg-gradient-to-b from-transparent to-neutral-800/70 dark:to-white/80"
              style={{ left: drop.left, animationDelay: drop.delay }}
            />
          ))}
        </div>

        {/* Minimal Social Buttons */}
        {SOCIAL_LINKS.map(({ name, href, icon: Icon, colorClass }, index) => {
          const isHovered = hoveredIndex === index;
          const isOtherHovered = hoveredIndex !== null && !isHovered;

          return (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name}`}
              title={name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group flex h-9 w-9 items-center justify-center rounded-md border backdrop-blur-md transition-all duration-300 ease-out active:scale-90 
                border-black/10 bg-white/70 shadow-sm hover:border-black/20 hover:bg-white 
                dark:border-white/10 dark:bg-black/40 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-black/70 
                ${colorClass} ${
                isHovered
                  ? "scale-110 -translate-y-1 opacity-100 z-10"
                  : isOtherHovered
                  ? "scale-75 opacity-0 pointer-events-none translate-y-2"
                  : "scale-100 opacity-100"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
}