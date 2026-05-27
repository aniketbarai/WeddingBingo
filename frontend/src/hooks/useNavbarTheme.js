import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const LIGHT_ROUTES = ["/about", "/gallery"];
const NAV_SAMPLE_Y = 76;
const SCROLL_THRESHOLD = 18;
const TOP_VISIBLE_OFFSET = 8;
const HIDE_AFTER_Y = 136;
const HIDE_INTENT_DELTA = 18;
const REVEAL_INTENT_DELTA = 10;

const getInitialTone = (pathname) =>
  LIGHT_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    ? "light"
    : "dark";

const parseRgb = (color) => {
  const match = color?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (!match) return null;

  const [, r, g, b, alpha = "1"] = match;
  if (Number(alpha) < 0.12) return null;

  return [Number(r), Number(g), Number(b)];
};

const luminanceFromRgb = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

const getElementLuminance = (element) => {
  let current = element;

  while (current && current !== document.documentElement) {
    const styles = window.getComputedStyle(current);
    const color = parseRgb(styles.backgroundColor);

    if (color) {
      return luminanceFromRgb(color);
    }

    current = current.parentElement;
  }

  return luminanceFromRgb(parseRgb(window.getComputedStyle(document.body).backgroundColor) || [5, 5, 5]);
};

const getThemeFromSections = (sampleY) => {
  const themedSections = document.querySelectorAll("[data-navbar-theme]");

  for (const section of themedSections) {
    const rect = section.getBoundingClientRect();

    if (rect.top <= sampleY && rect.bottom >= sampleY) {
      const theme = section.getAttribute("data-navbar-theme");
      if (theme === "light" || theme === "dark") return theme;
    }
  }

  return null;
};

const getThemeFromBackground = (sampleY) => {
  const sampleX = Math.min(window.innerWidth - 24, Math.max(24, window.innerWidth / 2));
  const elements = document.elementsFromPoint(sampleX, sampleY);
  const pageElement = elements.find((element) => !element.closest("[data-navbar-root]"));

  if (!pageElement) return null;

  return getElementLuminance(pageElement) > 0.62 ? "light" : "dark";
};

export const useNavbarTheme = () => {
  const { pathname } = useLocation();
  const routeTone = useMemo(() => getInitialTone(pathname), [pathname]);
  const [themeState, setThemeState] = useState({ pathname, tone: routeTone });
  const [scrolled, setScrolled] = useState(() =>
    typeof window === "undefined" ? false : window.scrollY > SCROLL_THRESHOLD
  );
  const [hiddenState, setHiddenState] = useState({ pathname, value: false });
  const lastScrollY = useRef(typeof window === "undefined" ? 0 : window.scrollY);
  const scrollIntent = useRef(0);
  const rafId = useRef(null);

  const measure = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    const nextScrolled = currentScrollY > SCROLL_THRESHOLD;
    const sampleY = nextScrolled ? NAV_SAMPLE_Y : Math.min(NAV_SAMPLE_Y, window.innerHeight * 0.12);
    const sectionTone = getThemeFromSections(sampleY);
    const detectedTone = sectionTone || getThemeFromBackground(sampleY) || routeTone;
    const delta = currentScrollY - lastScrollY.current;
    const directionChanged = Math.sign(delta) !== Math.sign(scrollIntent.current);

    if (Math.abs(delta) >= 2) {
      scrollIntent.current = directionChanged ? delta : scrollIntent.current + delta;
    }

    setThemeState((current) =>
      current.pathname === pathname && current.tone === detectedTone
        ? current
        : { pathname, tone: detectedTone }
    );
    setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    setHiddenState((current) => {
      let shouldHide = current.pathname === pathname ? current.value : false;

      if (currentScrollY <= TOP_VISIBLE_OFFSET) {
        shouldHide = false;
        scrollIntent.current = 0;
      } else if (currentScrollY < HIDE_AFTER_Y) {
        shouldHide = false;
      } else if (scrollIntent.current >= HIDE_INTENT_DELTA) {
        shouldHide = true;
        scrollIntent.current = 0;
      } else if (scrollIntent.current <= -REVEAL_INTENT_DELTA) {
        shouldHide = false;
        scrollIntent.current = 0;
      }

      return current.pathname === pathname && current.value === shouldHide
        ? current
        : { pathname, value: shouldHide };
    });

    lastScrollY.current = Math.max(currentScrollY, 0);
    rafId.current = null;
  }, [pathname, routeTone]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    scrollIntent.current = 0;

    const scheduleMeasure = () => {
      if (rafId.current) return;
      rafId.current = window.requestAnimationFrame(measure);
    };

    scheduleMeasure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
    };
  }, [measure]);

  const effectiveTone = themeState.pathname === pathname ? themeState.tone : routeTone;
  const effectiveHidden = hiddenState.pathname === pathname ? hiddenState.value : false;

  return {
    hidden: effectiveHidden,
    isLight: effectiveTone === "light",
    scrolled,
    tone: effectiveTone,
  };
};
