import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Sparkles,
  Compass,
  Film,
  ArrowRight,
  Check,
  Maximize2,
} from "lucide-react";

const locations = [
  {
    name: "Amalfi Coast, Italy",
    type: "Coastal Romance",
    img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80",
    span: "md:col-span-2",
  },
  {
    name: "Parisian Streets",
    type: "Urban Elegance",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    span: "col-span-1",
  },
  {
    name: "Kyoto Gardens",
    type: "Serene Tradition",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    span: "col-span-1",
  },
  {
    name: "Icelandic Black Sands",
    type: "Cinematic Drama",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    span: "md:col-span-2",
  },
];

const processSteps = [
  {
    icon: Compass,
    title: "Concept & Mood",
    desc: "We curate a tailored visual storyboard reflecting your unique style, styling lookbooks, and location map.",
  },
  {
    icon: MapPin,
    title: "Location Scouting",
    desc: "Access to private properties, hidden architectural gems, and breathtaking natural backdrops worldwide.",
  },
  {
    icon: Sparkles,
    title: "The Shoot Day",
    desc: "A relaxed, editorial-style experience directed gently to capture organic, high-fashion chemistry.",
  },
  {
    icon: Film,
    title: "Cinematic Edit",
    desc: "Signature high-end color grading and a bespoke musical score for your official pre-wedding reveal film.",
  },
];

const packages = [
  {
    title: "Vogue Essence",
    price: "$1,200",
    desc: "Perfect for local editorial portraits.",
    features: [
      "1 Location (Local)",
      "4 Hours Creative Session",
      "2 Distinct Stylized Looks",
      "30 High-End Edited Frames",
      "Online Private Gallery",
    ],
  },
  {
    title: "Global Destination",
    price: "$2,800",
    desc: "Our signature editorial travel experience.",
    featured: true,
    features: [
      "Any Travel Destination Location",
      "Full Day Directing & Shooting",
      "4 Bespoke Outfit Changes",
      "80 Master-Edited Frames",
      "4K Cinematic Teaser Film (2 Min)",
      "All Travel Included (Select Dates)",
    ],
  },
  {
    title: "Couture Multi-Day",
    price: "$4,500",
    desc: "Ultimate lifestyle luxury narrative.",
    features: [
      "2-Day Shoot Production",
      "Multiple Locations/Cities",
      "Unlimited Outfit Concepts",
      "150+ Master-Edited Frames",
      "Full Cinematic Featurette (5 Min)",
      "Premium Silk Heirloom Box",
    ],
  },
];

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const PreWeddingShoots = () => {
  return (
    <div className="bg-[#050505] text-white antialiased selection:bg-[#C6A75E]/30 selection:text-[#C6A75E]">
      
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80"
            alt="Editorial Pre-Wedding Concept"
            className="w-full h-full object-cover opacity-30 scale-105 animate-[subtle-zoom_25s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#050505]/50 to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 text-center w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="max-w-4xl mx-auto"
          >
            <motion.p variants={fadeInUpVariant} className="uppercase tracking-[0.6em] text-[#C6A75E] text-xs font-semibold mb-6 block">
              Cinematic Pre-Wedding Narratives
            </motion.p>

            <motion.h1 variants={fadeInUpVariant} className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-none mb-8">
              Love, <br />
              <span className="italic font-serif text-[#C6A75E] font-normal">Unscripted.</span>
            </motion.h1>

            <motion.p variants={fadeInUpVariant} className="text-gray-300 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-12 mix-blend-plus-lighter">
              Before the vows, celebrate your authentic connection with a high-fashion, editorial visual experience set against the world's most breathtaking landscapes.
            </motion.p>

            <motion.div variants={fadeInUpVariant} className="flex flex-col sm:flex-row items-center gap-5 justify-center">
              <button className="w-full sm:w-auto bg-[#C6A75E] text-black px-12 py-4.5 rounded-full uppercase tracking-[0.25em] text-xs font-bold hover:bg-[#b0924e] shadow-lg shadow-[#C6A75E]/10 active:scale-98 transition-all duration-300">
                Plan Your Session
              </button>
              <button className="w-full sm:w-auto border border-white/10 bg-white/[0.02] backdrop-blur-sm px-10 py-4.5 rounded-full uppercase tracking-[0.25em] text-xs font-medium hover:border-[#C6A75E] hover:text-[#C6A75E] active:scale-98 transition-all duration-300">
                Explore Lookbook
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= DESIGN INTENT / PHILOSOPHY ================= */}
      <section className="py-24 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* LEFT ARTWORK BLOCK */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative group order-last lg:order-first"
            >
              <img
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80"
                alt="Editorial Couple Sunset Frame"
                className="rounded-[32px] w-full h-[500px] lg:h-[650px] object-cover filter brightness-90 shadow-2xl transition-transform duration-700"
              />
              <div className="absolute inset-0 border border-[#C6A75E]/30 m-4 rounded-[24px] pointer-events-none" />
            </motion.div>

            {/* RIGHT DESCRIPTION */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariant}
              className="lg:col-span-7"
            >
              <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-5">
                The Experience
              </p>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight leading-tight mb-8">
                Away From Traditional Poses. <br />Focused On Real Connection.
              </h2>
              <p className="text-gray-400 font-light leading-relaxed mb-8 text-base sm:text-lg">
                Pre-wedding sessions are an intentional pause from wedding planning. It is your opportunity to express your style, discover your confidence in front of the lens, and craft timeless fine-art legacy media.
              </p>
              <p className="text-gray-400 font-light leading-relaxed mb-10 text-base sm:text-lg">
                Whether running through historical architectures, strolling at dusk along the sea cliffs, or creating quiet intimate scenes inside raw minimalist studios—your film is curated around you.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= SIGNATURE LOCATIONS EDITORIAL GRID ================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-4">
                Curated Destinations
              </p>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">
                Iconic Backdrops.
              </h2>
            </div>
            <p className="text-gray-400 font-light max-w-md sm:text-right">
              We travel to spectacular global geographic landscapes to match your intended luxury aesthetic backdrop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((loc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                className={`group overflow-hidden rounded-[24px] relative h-[350px] bg-neutral-900 ${loc.span}`}
              >
                {/* Information Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 p-8 flex flex-col justify-end">
                  <span className="text-[#C6A75E] text-xs uppercase tracking-[0.25em] font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {loc.type}
                  </span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-light text-white tracking-wide">{loc.name}</h3>
                    <Maximize2 className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                  </div>
                </div>
                
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-95"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THE CREATIVE PROCESS ================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-5">
              The Framework
            </p>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">
              Bespoke Production Timeline.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariant}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="text-xs font-serif italic text-[#C6A75E]/30 mb-4 block text-left">
                  0{index + 1} //
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:border-[#C6A75E]/40 transition-colors duration-300">
                  <step.icon className="w-5 h-5 text-[#C6A75E]" />
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING PACKAGES ================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-5">
              Investment
            </p>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">
              Pre-Wedding Production Packages.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariant}
                className={`rounded-[32px] p-8 sm:p-10 border transition-all duration-300 relative overflow-hidden ${
                  pkg.featured
                    ? "border-[#C6A75E] bg-[#C6A75E]/[0.03] shadow-xl shadow-[#C6A75E]/5 lg:-translate-y-4"
                    : "border-white/[0.06] bg-white/[0.01] hover:border-white/10"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute top-5 right-5 bg-[#C6A75E] text-black text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full">
                    Recommended
                  </span>
                )}

                <h3 className="text-2xl sm:text-3xl font-light mb-3 tracking-wide">{pkg.title}</h3>
                <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">{pkg.desc}</p>
                <div className="text-4xl sm:text-5xl font-extralight text-[#C6A75E] tracking-tight mb-8">
                  {pkg.price}
                </div>

                <div className="space-y-4.5 mb-10 border-t border-white/[0.05] pt-8">
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3.5">
                      <Check className="w-4 h-4 text-[#C6A75E] flex-shrink-0" />
                      <span className="text-gray-300 font-light text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 rounded-full uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${
                    pkg.featured
                      ? "bg-[#C6A75E] text-black hover:bg-[#b0924e]"
                      : "bg-white/[0.04] text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  Book Production
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-28 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.04)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariant}
          >
            <p className="uppercase tracking-[0.5em] text-[#C6A75E] text-xs font-semibold mb-6">
              Escape With Us
            </p>
            <h2 className="text-4xl sm:text-6xl font-extralight tracking-tight leading-tight mb-8">
              Let's Tell Your Visual <br />Story Anywhere.
            </h2>
            <p className="text-gray-400 font-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Our travel schedule is flexible and open for booking globally. Contact our art director to begin designing custom style guides and selecting backdrops.
            </p>
            <button className="bg-[#C6A75E] text-black px-12 py-5 rounded-full uppercase tracking-[0.3em] text-xs font-bold hover:bg-[#b0924e] shadow-xl shadow-[#C6A75E]/10 active:scale-98 transition-all duration-300">
              Inquire Availability
            </button>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};

export default PreWeddingShoots;