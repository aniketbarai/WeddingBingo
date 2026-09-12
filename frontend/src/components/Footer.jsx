import { Instagram, Mail, ArrowUpRight, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { NAV_LINKS } from "../config/navigation";

// Social Links Configuration
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    icon: <Instagram size={18} />,
    link: "https://instagram.com/wedding_bingo",
    hoverStyle: "hover:border-pink-500 hover:text-pink-500 hover:shadow-pink-500/20",
  },
  {
    name: "WhatsApp",
    icon: <MessageCircle size={18} />,
    link: "https://wa.me/1234567890", // Replace with your WhatsApp number
    hoverStyle: "hover:border-emerald-500 hover:text-emerald-500 hover:shadow-emerald-500/20",
  },
  {
    name: "Email",
    icon: <Mail size={18} />,
    link: "mailto:hello@weddingbingo.com", // Replace with your email address
    hoverStyle: "hover:border-[#C6A75E] hover:text-[#C6A75E] hover:shadow-[#C6A75E]/20",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050505] text-white pt-20 md:pt-28 pb-10 px-6 border-t border-white/10 relative overflow-hidden">
      
      {/* BACKGROUND DECOR - Soft Top Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-40 bg-gradient-to-b from-[#C6A75E]/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      {/* WATERMARK */}
      <div className="absolute top-8 right-[-3%] opacity-[0.02] pointer-events-none select-none hidden md:block">
        <h2 className="text-[16vw] font-serif italic leading-none text-white">Wedding Bingo</h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20">

          {/* BRAND COLUMN */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl md:text-4xl font-extralight tracking-tighter mb-5">
                Wedding <span className="italic font-serif text-[#C6A75E]">Bingo.</span>
              </h3>
              
              <p className="text-gray-400 max-w-sm leading-relaxed font-light text-sm mb-8">
                Capturing quiet glances, grand celebrations, and timeless 
                narratives of love across the globe. Documenting your legacy with 
                unrivaled elegance.
              </p>
              
              {/* SOCIAL ICONS */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-10 h-10 flex items-center justify-center border border-white/10 rounded-full transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.06] shadow-md ${social.hoverStyle}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* NAVIGATION COLUMN */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#C6A75E] mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.filter((item) => item.name !== "Home").map((item) => (
                <li key={item.link}>
                  <Link 
                    to={item.link}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group text-sm font-light w-max"
                  >
                    {item.name}
                    <ArrowUpRight size={13} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#C6A75E]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* STUDIO INFO COLUMN */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#C6A75E] mb-6">
                Studio
              </h4>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C6A75E]/20 bg-[#C6A75E]/5 text-[#C6A75E] text-xs font-light">
                  <Sparkles size={12} />
                  <span>Worldwide Destination Coverage</span>
                </div>
                <p className="text-gray-400 text-sm font-light leading-relaxed pt-1">
                  Documenting love stories locally and globally.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          
          <p className="text-[12px] text-gray-600 tracking-widest text-center md:text-left font-medium">
            <span> © {currentYear} Wedding Bingo.</span> All rights reserved • Crafted by{" "}
            <a 
              href="https://www.linkedin.com/in/aniketbarai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 text-[9px] hover:text-[#C6A75E] transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-[#C6A75E]"
            >
              Aniket Barai
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link
              to="/admin/login"
              className="group flex items-center gap-2 text-[10px] text-gray-400 hover:text-[#C6A75E] transition-all uppercase tracking-[0.2em] font-bold border border-white/10 hover:border-[#C6A75E]/40 rounded-full px-4 py-2 bg-white/[0.01] hover:bg-white/[0.04]"
            >
              <ShieldCheck size={14} className="text-gray-500 group-hover:text-[#C6A75E] transition-colors" />
              Admin Portal
            </Link>

            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-2.5 text-[10px] text-gray-400 hover:text-[#C6A75E] transition-colors uppercase tracking-[0.2em] font-bold"
            >
              Back to Top
              <div className="w-7 h-7 rounded-full border border-white/10 group-hover:border-[#C6A75E] flex items-center justify-center transition-all bg-white/[0.01] group-hover:bg-white/[0.05]">
                <ArrowUpRight size={13} className="-rotate-45 text-gray-400 group-hover:text-[#C6A75E] transition-colors" />
              </div>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}