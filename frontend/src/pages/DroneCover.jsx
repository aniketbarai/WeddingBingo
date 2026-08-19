import React from "react";
import {
  Video,
  Layers,
  Compass,
  Zap,
  ArrowRight,
  Check,
  Maximize2,
} from "lucide-react";

const dynamicShowcase = [
  {
    title: "Bird's-Eye Ceremony",
    category: "Scale & Symmetry",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", 
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "The Destination Reveal",
    category: "Cinematic Establishing Shot",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    span: "md:col-span-2",
  },
  {
    title: "Sunset Grand Entrance",
    category: "Tracking Narrative",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    span: "md:col-span-2",
  },
];

const technicalSpecs = [
  "Ultra-Smooth 4K HDR ProRes Footage",
  "Dual-Operator Teams (Pilot & Camera Director)",
  "Bespoke FPV (First Person View) Acrobatics",
  "Regulatory Flight Compliance & Insurance Included",
  "Whisper-Quiet Low Noise Propeller Profiles",
  "Flawless Low-Light Twilight Performance",
];

const capabilities = [
  {
    icon: Compass,
    title: "Establishing Context",
    desc: "Transforming the venue architecture, mountain vistas, or coastal edges into a living prologue for your film.",
  },
  {
    icon: Video,
    title: "Dynamic Tracking",
    desc: "Sweeping, high-speed fluid motions capturing the grand exit, vintage getaway cars, or open-air cocktail hours.",
  },
  {
    icon: Layers,
    title: "Scale Orthomosaics",
    desc: "Symmetrical, geometrically perfect geometric overhead shots capturing the macro-arrangements of your layout.",
  },
  {
    icon: Zap,
    title: "FPV Fly-Throughs",
    desc: "Hyper-immersive single-take maneuvers threading through grand entryways for an unmatched adrenaline-fueled reveal.",
  },
];

const packages = [
  {
    title: "Cinematic Accent",
    price: "$650",
    desc: "Perfect addition to classic single-venue settings.",
    features: [
      "1 FAA Certified Drone Pilot",
      "2 Hours Dedicated Flight Time",
      "4K Raw B-Roll Asset Delivery",
      "Establishing Venue Master Shots",
      "Full Post-Production Color Grading",
    ],
  },
  {
    title: "Horizon Production",
    price: "$1,150",
    desc: "Complete aerial layout storytelling narrative.",
    featured: true,
    features: [
      "2-Man Crew (Pilot + Camera Op)",
      "Full Day Flexible Coverage",
      "4K HDR Ultra-Smooth ProRes Pro",
      "FPV Drone Venue Fly-Through Video",
      "Seamless Integration into Main Film",
      "Bespoke Drone Signature Reel (60s)",
    ],
  },
  {
    title: "Elite Masterclass",
    price: "$1,950",
    desc: "Ultimate destination grandeur and live streaming.",
    features: [
      "Dual Drone Heavy-Lift Flight Crew",
      "Multi-Day Travel Flexibility",
      "5.1K Cinematic Raw Master Files",
      "Live 1080p Stream to Venue Screens",
      "Unlimited Cinematic Tracking Sequences",
      "Pre-Wedding Travel Location Scouting Shots",
    ],
  },
];

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const DroneCover = () => {
  return (
    <div className="bg-[#050505] text-white antialiased selection:bg-[#C6A75E]/30 selection:text-[#C6A75E]">
      
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
            alt="Cinematic Aerial Horizon Landscape"
            className="w-full h-full object-cover opacity-25 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#050505]/60 to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 text-center w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="max-w-4xl mx-auto"
          >
            <motion.p variants={fadeInUpVariant} className="uppercase tracking-[0.6em] text-[#C6A75E] text-xs font-semibold mb-6 block">
              Advanced Aerial Cinematography
            </motion.p>

            <motion.h1 variants={fadeInUpVariant} className="text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-none mb-8">
              Elevated <br />
              <span className="italic font-serif text-[#C6A75E] font-normal">Perspectives.</span>
            </motion.h1>

            <motion.p variants={fadeInUpVariant} className="text-gray-300 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-12 mix-blend-plus-lighter">
              Break away from earthbound limitations. Witness your celebration from spectacular vantage points, weaving architectural majesty and emotion together.
            </motion.p>

            <motion.div variants={fadeInUpVariant} className="flex flex-col sm:flex-row items-center gap-5 justify-center">
              <button className="w-full sm:w-auto bg-[#C6A75E] text-black px-12 py-4.5 rounded-full uppercase tracking-[0.25em] text-xs font-bold hover:bg-[#b0924e] shadow-lg shadow-[#C6A75E]/10 active:scale-98 transition-all duration-300">
                Request Flight Plan
              </button>
              <button className="w-full sm:w-auto border border-white/10 bg-white/[0.02] backdrop-blur-sm px-10 py-4.5 rounded-full uppercase tracking-[0.25em] text-xs font-medium hover:border-[#C6A75E] hover:text-[#C6A75E] active:scale-98 transition-all duration-300">
                View Showreel
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= TECHNICAL OVERVIEW BLOCK ================= */}
      <section className="py-24 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* LEFT NARRATIVE */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariant}
              className="lg:col-span-7"
            >
              <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-5">
                The Scale of Flight
              </p>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight leading-tight mb-8">
                Uncompromising Precision. <br />Breathtaking Cinematic Depth.
              </h2>
              <p className="text-gray-400 font-light leading-relaxed mb-10 text-base sm:text-lg">
                Aerial coverage is not just about flying high; it's about scaling a narrative. We direct specialized heavy-lift drone aircraft dynamically to trace geometry, follow pacing, and frame landscapes seamlessly alongside your primary film crew.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {technicalSpecs.map((spec, index) => (
                  <div key={index} className="flex items-start gap-3.5 group">
                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-[#C6A75E]/10 flex items-center justify-center border border-[#C6A75E]/30">
                      <Check className="w-2.5 h-2.5 text-[#C6A75E]" />
                    </div>
                    <span className="text-gray-300 font-light text-sm group-hover:text-white transition-colors duration-200">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT TECHNICAL ASSET CARD */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80"
                alt="High Altitude Overlap Composition"
                className="rounded-[32px] w-full h-[500px] lg:h-[600px] object-cover filter brightness-75 shadow-2xl transition-transform duration-700"
              />
              <div className="absolute top-6 right-6 bg-black/80 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  FAA Certified Operator
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                <p className="text-3xl font-extralight text-[#C6A75E] tracking-tight mb-1">
                  10-Bit HDR
                </p>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-medium">
                  Color depth matched perfectly to cinema formats
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES GRID ================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-5">
              Flight Dynamics
            </p>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">
              A Moving Fine-Art Blueprint.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariant}
                transition={{ delay: index * 0.05 }}
                className="border border-white/[0.05] rounded-[24px] p-8 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C6A75E]/5 border border-[#C6A75E]/10 flex items-center justify-center mb-6 group-hover:bg-[#C6A75E] transition-colors duration-500">
                  <item.icon className="w-5 h-5 text-[#C6A75E] group-hover:text-black transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide text-white group-hover:text-[#C6A75E] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HIGH ANGLE DYNAMIC SHOWCASE ================= */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center sm:text-left">
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-4">
              Motion Sequences
            </p>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">
              Breathtaking Master Frames.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {dynamicShowcase.map((shot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                className={`group overflow-hidden rounded-[24px] relative bg-neutral-900 ${shot.span}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-100 z-10 p-6 flex flex-col justify-end">
                  <span className="text-[#C6A75E] text-[10px] uppercase tracking-[0.3em] font-semibold mb-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {shot.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-light text-white tracking-wide">{shot.title}</h3>
                    <Maximize2 className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <img
                  src={shot.img}
                  alt={shot.title}
                  className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-102 filter brightness-90 group-hover:brightness-95"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INVESTMENT OPTIONS ================= */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs font-semibold mb-5">
              Aerial Pricing
            </p>
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight">
              Coverage Integration Add-ons.
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
                    Best Match
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
                  Incorporate Flight
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
              Clear For Takeoff
            </p>
            <h2 className="text-4xl sm:text-6xl font-extralight tracking-tight leading-tight mb-8">
              Elevate Your Wedding <br />Cinematography.
            </h2>
            <p className="text-gray-400 font-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Every venue has hidden artistic topography. Share your location details with our aviation coordinators to verify airspace permissions and map a pristine custom shooting itinerary.
            </p>
            <button className="bg-[#C6A75E] text-black px-12 py-5 rounded-full uppercase tracking-[0.3em] text-xs font-bold hover:bg-[#b0924e] shadow-xl shadow-[#C6A75E]/10 active:scale-98 transition-all duration-300">
              Verify Venue Airspace
            </button>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};

export default DroneCover;