// Single source of truth for the primary nav. Navbar and Footer both
// read from this instead of keeping their own copies, which had drifted
// out of sync (Footer linked to a "/portfolio" route that doesn't exist).
export const NAV_LINKS = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Packages", link: "/packages" },
  { name: "Services", link: "/services" },
  { name: "Gallery", link: "/gallery" },
  { name: "Contact", link: "/contact" },
];
