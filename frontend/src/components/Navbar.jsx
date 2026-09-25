import { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useNavbarTheme } from "../hooks/useNavbarTheme";
import { NAV_LINKS } from "../config/navigation";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A75E] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { hidden, isLight, scrolled } = useNavbarTheme();
  const { scrollYProgress } = useScroll();

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  const solid = scrolled || isOpen;

  const colors = useMemo(() => {
    if (isOpen) {
      return {
        accent: "text-[#C6A75E]",
        border: "border-white/10",
        cta: "border-[#C6A75E]/70 text-[#C6A75E] hover:bg-[#C6A75E] hover:text-black",
        icon: "text-white hover:bg-white/10",
        logo: "text-[#C6A75E]",
        logoRest: "text-white",
        navText: "text-white",
        panel: "bg-[#09090b]",
        underline: "bg-[#C6A75E]",
      };
    }

    if (isLight) {
      return {
        accent: "text-[#9b7b36]",
        border: solid ? "border-black/10" : "border-transparent",
        cta: solid
          ? "bg-black text-white hover:bg-[#C6A75E] hover:text-black"
          : "border-black/20 text-black hover:border-black hover:bg-black hover:text-white",
        icon: "text-black hover:bg-black/5",
        logo: "text-[#9b7b36]",
        logoRest: "text-black",
        navText: "text-black",
        panel: solid ? "bg-white/80" : "bg-transparent",
        underline: "bg-black",
      };
    }

    return {
      accent: "text-[#C6A75E]",
      border: solid ? "border-white/10" : "border-transparent",
      cta: "border-[#C6A75E]/70 text-[#C6A75E] hover:bg-[#C6A75E] hover:text-black",
      icon: "text-white hover:bg-white/10",
      logo: "text-[#C6A75E]",
      logoRest: "text-white",
      navText: "text-white",
      panel: solid ? "bg-black/80" : "bg-transparent",
      underline: "bg-[#C6A75E]",
    };
  }, [isLight, isOpen, solid]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <motion.nav
      data-navbar-root
      aria-label="Primary navigation"
      initial={false}
      animate={{
        filter: hidden && !isOpen ? "blur(6px)" : "blur(0px)",
        opacity: hidden && !isOpen ? 0 : 1,
        y: hidden && !isOpen ? -88 : 0,
      }}
      transition={{
        duration: hidden && !isOpen ? 0.34 : 0.46,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        fixed left-0 top-0 z-[100] w-full
        border-b ${colors.border} ${colors.panel}
        ${solid ? "shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-2xl" : "shadow-none backdrop-blur-0"}
        transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out
      `}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:h-18 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          aria-label="Wedding Bingo home"
          onClick={() => setIsOpen(false)}
          className={`group inline-flex shrink-0 items-baseline font-serif ${focusRing}`}
        >
          <span className={`text-[1.35rem] tracking-tight sm:text-2xl lg:text-[1.6rem] ${colors.logo} transition-colors duration-500`}>
            Wedding
          </span>
          <span className={`text-[1.35rem] tracking-tight sm:text-2xl lg:text-[1.6rem] ${colors.logoRest} transition-colors duration-500`}>
            Bingo
          </span>
        </Link>

        {/* Desktop Navigation - Tighter X-axis gap-x-3 (12px) and lower letter-spacing */}
        <ul className={`hidden items-center gap-x-3 text-[11px] font-semibold uppercase tracking-wider xl:gap-x-4 xl:text-xs ${colors.navText} lg:flex`}>
          {NAV_LINKS.map((item) => (
            <motion.li key={item.link} whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <NavLink
                to={item.link}
                end={item.link === "/"}
                className={({ isActive }) =>
                  `group relative inline-flex items-center px-1.5 py-2 transition-colors duration-300 ${focusRing} ${
                    isActive ? colors.accent : "hover:opacity-80"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-0.5">
                      {item.name}
                      {!isActive && (
                        <ArrowUpRight
                          size={12}
                          className="-translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                        />
                      )}
                    </span>

                    {/* Underline Indicator */}
                    <span
                      className={`absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300 ease-out ${colors.underline} ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Desktop CTA Button */}
        <div className="hidden items-center lg:flex">
          <Link
            to="/contact"
            className={`
              rounded-full border px-5 py-2 text-[9px] font-bold uppercase tracking-[0.2em]
              transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${colors.cta} ${focusRing}
            `}
          >
            Inquiry Now
          </Link>
        </div>

        {/* Mobile/Tablet Toggle Button */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 lg:hidden ${colors.icon} ${focusRing}`}
        >
          {isOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="h-px origin-left bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent"
        style={{ scaleX: progressScale }}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 top-[4rem] z-[101] h-[calc(100dvh-4rem)] overflow-y-auto bg-[#09090b] px-6 py-6 text-white shadow-2xl sm:top-[4.25rem] sm:h-[calc(100dvh-4.25rem)] sm:px-8 lg:hidden"
          >
            <div className="mx-auto flex h-full max-w-md flex-col justify-between pb-8">
              <div className="space-y-1">
                {NAV_LINKS.map((item, index) => (
                  <motion.div
                    key={item.link}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 + 0.04, duration: 0.24 }}
                  >
                    <NavLink
                      to={item.link}
                      end={item.link === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between border-b border-white/10 py-3.5 font-serif text-2xl italic transition-colors duration-300 sm:py-4 sm:text-3xl ${focusRing} ${
                          isActive ? "text-[#C6A75E]" : "text-white/90 hover:text-[#C6A75E]"
                        }`
                      }
                    >
                      {item.name}
                      <span className="text-[10px] not-italic tracking-[0.3em] text-white/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.03 + 0.06, duration: 0.25 }}
                className="mt-6 pt-2"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`inline-flex w-full items-center justify-center rounded-full border border-[#C6A75E] bg-[#C6A75E]/10 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#C6A75E] transition-all duration-300 hover:bg-[#C6A75E] hover:text-black ${focusRing}`}
                >
                  Inquiry Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;