import React from "react";
import { motion } from "framer-motion";
import {
  Film,
  Play,
  Clapperboard,
  Music2,
  Check,
  ArrowRight,
} from "lucide-react";

const showcaseVideos = [
  {
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80",
  },
];

const features = [
  "Cinematic Wedding Films",
  "4K Ultra HD Recording",
  "Drone Cinematography",
  "Professional Color Grading",
  "Storytelling Editing",
  "Licensed Music Integration",
];

const packages = [
  {
    title: "Essential Film",
    price: "$1299",
    desc: "Perfect cinematic coverage for intimate weddings.",
    features: [
      "1 Videographer",
      "6 Hours Coverage",
      "3-5 Min Highlight Film",
      "Full HD Delivery",
    ],
  },
  {
    title: "Signature Film",
    price: "$2499",
    desc: "Luxury cinematic storytelling experience.",
    featured: true,
    features: [
      "2 Videographers",
      "Full Day Coverage",
      "Drone Coverage",
      "7-10 Min Film",
      "Social Media Reels",
    ],
  },
  {
    title: "Royal Production",
    price: "$3999",
    desc: "Complete cinematic wedding production.",
    features: [
      "Full Production Team",
      "Multi-Camera Setup",
      "Drone Cinematics",
      "15 Min Documentary Film",
      "Premium Editing",
      "Priority Delivery",
    ],
  },
];

const CinematicVideography = () => {
  return (
    <div className="bg-[#050505] text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">

        {/* BG */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=80"
            alt="Videography"
            className="w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-6">
              Luxury Cinematic Films
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight leading-none tracking-tight mb-8">
              Cinematic <br />
              <span className="italic font-serif text-[#C6A75E]">
                Videography.
              </span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-12">
              Transforming weddings into emotional cinematic experiences
              with storytelling, music, movement, and breathtaking visuals.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">

              <button className="bg-[#C6A75E] text-black px-8 py-4 rounded-full uppercase tracking-[0.3em] text-xs font-semibold hover:scale-105 transition duration-500">
                Book Videography
              </button>

              <button className="border border-white/20 px-8 py-4 rounded-full uppercase tracking-[0.3em] text-xs hover:border-[#C6A75E] hover:text-[#C6A75E] transition duration-500 flex items-center justify-center gap-3">
                <Play size={14} />
                Watch Films
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-24 sm:py-32">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-6">
                About Service
              </p>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight leading-tight mb-8">
                Your Wedding <br />
                As A Cinematic Story.
              </h2>

              <p className="text-gray-400 leading-relaxed text-lg mb-10">
                We create emotional wedding films designed like modern
                cinema — combining storytelling, movement, sound design,
                music, and luxury visuals into unforgettable memories.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">

                {features.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <Check className="w-5 h-5 text-[#C6A75E]" />

                    <span className="text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}

              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&q=80"
                alt="Film"
                className="rounded-[36px] w-full h-[700px] object-cover"
              />

              {/* PLAY BUTTON */}
              <div className="absolute inset-0 flex items-center justify-center">

                <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition duration-500">

                  <Play
                    className="text-[#C6A75E] ml-1"
                    size={34}
                    fill="#C6A75E"
                  />
                </button>
              </div>

              {/* FLOATING CARD */}
              <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md border border-white/10 rounded-3xl p-6">

                <p className="text-5xl font-extralight text-[#C6A75E] mb-2">
                  4K
                </p>

                <p className="uppercase tracking-[0.25em] text-xs text-gray-300">
                  Ultra HD Films
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-24 bg-[#0A0A0A]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20">

            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-5">
              Our Process
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight">
              Crafted Like Cinema.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                icon: Film,
                title: "Planning",
                desc: "Creative concept & wedding timeline planning.",
              },
              {
                icon: Clapperboard,
                title: "Filming",
                desc: "Luxury cinematic multi-angle coverage.",
              },
              {
                icon: Music2,
                title: "Editing",
                desc: "Storytelling edits with emotional music.",
              },
              {
                icon: Play,
                title: "Delivery",
                desc: "Premium cinematic final film delivery.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[32px] border border-white/10 bg-white/[0.02] p-8 hover:border-[#C6A75E]/40 transition duration-500"
              >
                <item.icon
                  className="text-[#C6A75E] mb-8"
                  size={42}
                />

                <h3 className="text-2xl font-light mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= SHOWCASE ================= */}
      <section className="py-24 sm:py-32">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-16">

            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-4">
              Featured Films
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight">
              Cinematic Showcase.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {showcaseVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[32px]"
              >

                <img
                  src={video.image}
                  alt="Showcase"
                  className="w-full h-[520px] object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/30" />

                {/* PLAY BTN */}
                <div className="absolute inset-0 flex items-center justify-center">

                  <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition duration-500">

                    <Play
                      className="text-[#C6A75E] ml-1"
                      size={28}
                      fill="#C6A75E"
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section className="py-24 bg-[#0A0A0A]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20">

            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-5">
              Pricing
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight">
              Videography Packages.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-[32px] border p-10 ${
                  pkg.featured
                    ? "border-[#C6A75E] bg-[#C6A75E]/5"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >

                <h3 className="text-3xl font-light mb-4">
                  {pkg.title}
                </h3>

                <p className="text-gray-400 mb-8">
                  {pkg.desc}
                </p>

                <div className="text-5xl font-extralight text-[#C6A75E] mb-10">
                  {pkg.price}
                </div>

                <div className="space-y-4 mb-10">

                  {pkg.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-[#C6A75E]" />

                      <span className="text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}

                </div>

                <button className="w-full bg-[#C6A75E] text-black py-4 rounded-full uppercase tracking-[0.3em] text-xs font-semibold flex items-center justify-center gap-3 hover:scale-[1.02] transition duration-500">

                  Choose Package

                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-6">
            Let’s Create Cinema
          </p>

          <h2 className="text-5xl sm:text-6xl font-extralight leading-tight mb-10">
            Your Love Story <br />
            Deserves A Film.
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Let’s create a cinematic masterpiece that preserves your
            wedding emotions forever.
          </p>

          <button className="bg-[#C6A75E] text-black px-10 py-5 rounded-full uppercase tracking-[0.35em] text-xs font-semibold hover:scale-105 transition duration-500">
            Book Cinematic Session
          </button>
        </div>
      </section>
    </div>
  );
};

export default CinematicVideography;