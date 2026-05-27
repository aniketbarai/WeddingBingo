import { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useNavbarTheme } from "../hooks/useNavbarTheme";

const navLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Packages", link: "/packages" },
  { name: "Services", link: "/services" },
  { name: "Gallery", link: "/gallery" },
  { name: "Contact", link: "/contact" },
];

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
        panel: "bg-[#050505]/95",
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
        panel: solid ? "bg-white/72" : "bg-white/0",
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
      panel: solid ? "bg-black/[0.46]" : "bg-transparent",
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
        transition-[background-color,border-color,box-shadow,backdrop-filter,padding] duration-500 ease-out
      `}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-6 lg:h-20 lg:px-8">
        <Link
          to="/"
          aria-label="Wedding Bingo home"
          onClick={() => setIsOpen(false)}
          className={`group inline-flex shrink-0 items-baseline font-serif ${focusRing}`}
        >
          <span className={`text-[1.4rem] tracking-tight sm:text-2xl lg:text-[1.7rem] ${colors.logo} transition-colors duration-500`}>
            Wedding
          </span>
          <span className={`text-[1.4rem] tracking-tight sm:text-2xl lg:text-[1.7rem] ${colors.logoRest} transition-colors duration-500`}>
            Bingo
          </span>
        </Link>

        <ul className={`hidden items-center gap-7 text-[12px] font-semibold uppercase tracking-[0.22em] ${colors.navText} lg:flex`}>
          {navLinks.map((item) => (
            <motion.li key={item.link} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 360, damping: 24 }}>
              <NavLink
                to={item.link}
                end={item.link === "/"}
                className={({ isActive }) =>
                  `group relative inline-flex py-2.5 transition-colors duration-300 ${focusRing} ${
                    isActive ? colors.accent : "hover:opacity-70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.name}</span>
                    <motion.span
                      layoutId={isActive ? "active-nav-underline" : undefined}
                      className={`absolute bottom-1 left-0 h-px ${colors.underline}`}
                      initial={false}
                      animate={{ width: isActive ? "100%" : "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    />
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        <div className="hidden items-center lg:flex">
          <Link
            to="/contact"
            className={`
              rounded-full border px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.28em]
              transition-all duration-500 hover:-translate-y-0.5 active:translate-y-0 ${colors.cta} ${focusRing}
            `}
          >
            Inquiry Now
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 lg:hidden ${colors.icon} ${focusRing}`}
        >
          {isOpen ? <X size={24} strokeWidth={1.6} /> : <Menu size={24} strokeWidth={1.6} />}
        </button>
      </div>

      <motion.div
        aria-hidden="true"
        className="h-px origin-left bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent"
        style={{ scaleX: progressScale }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-[101] min-h-[calc(100dvh-4rem)] border-t border-white/10 bg-[#050505]/96 px-6 py-8 text-white shadow-2xl backdrop-blur-2xl sm:top-[4.5rem] sm:min-h-[calc(100dvh-4.5rem)] lg:hidden"
          >
            <div className="mx-auto flex max-w-md flex-col">
              <div className="space-y-1">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.link}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.045, duration: 0.32 }}
                  >
                    <NavLink
                      to={item.link}
                      end={item.link === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between border-b border-white/[0.08] py-5 font-serif text-4xl italic transition-colors duration-300 sm:text-5xl ${focusRing} ${
                          isActive ? "text-[#C6A75E]" : "text-white hover:text-[#C6A75E]"
                        }`
                      }
                    >
                      {item.name}
                      <span className="text-xs not-italic tracking-[0.35em] text-white/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.34 }}
                className="mt-10"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`inline-flex w-full items-center justify-center rounded-full border border-[#C6A75E]/70 px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-[#C6A75E] transition-all duration-500 hover:bg-[#C6A75E] hover:text-black ${focusRing}`}
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
