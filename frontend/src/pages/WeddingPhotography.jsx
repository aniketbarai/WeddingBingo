import React from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Heart,
  Sparkles,
  ImageIcon,
  ArrowRight,
  Check,
} from "lucide-react";

const galleryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
];

const features = [
  "Full Day Wedding Coverage",
  "Luxury Edited Album",
  "Candid Photography",
  "Bride & Groom Portraits",
  "Family Coverage",
  "High Resolution Delivery",
];

const packages = [
  {
    title: "Classic",
    price: "$899",
    desc: "Perfect for intimate weddings.",
    features: [
      "1 Photographer",
      "6 Hours Coverage",
      "200+ Edited Photos",
      "Online Gallery",
    ],
  },
  {
    title: "Premium",
    price: "$1499",
    desc: "Most loved cinematic experience.",
    featured: true,
    features: [
      "2 Photographers",
      "Full Day Coverage",
      "500+ Edited Photos",
      "Luxury Album",
      "Drone Shots",
    ],
  },
  {
    title: "Royal",
    price: "$2499",
    desc: "Luxury storytelling production.",
    features: [
      "Full Team Coverage",
      "Cinematic Film",
      "Unlimited Photos",
      "Drone Coverage",
      "Premium Album",
    ],
  },
];

const WeddingPhotographyPage = () => {
  return (
    <div className="bg-[#050505] text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
            alt="Wedding"
            className="w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-6">
              Luxury Wedding Experience
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight leading-none mb-8">
              Wedding <br />
              <span className="italic font-serif text-[#C6A75E]">
                Photography.
              </span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-10">
              Capturing timeless emotions and cinematic moments that
              transform your wedding into a beautiful visual story.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">

              <button className="bg-[#C6A75E] text-black px-8 py-4 rounded-full uppercase tracking-[0.3em] text-xs font-semibold hover:scale-105 transition duration-500">
                Book Now
              </button>

              <button className="border border-white/20 px-8 py-4 rounded-full uppercase tracking-[0.3em] text-xs hover:border-[#C6A75E] hover:text-[#C6A75E] transition duration-500">
                View Portfolio
              </button>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-5">
                About Service
              </p>

              <h2 className="text-4xl sm:text-5xl font-extralight leading-tight mb-8">
                Elegant Stories Through Every Frame.
              </h2>

              <p className="text-gray-400 leading-relaxed mb-10">
                We believe wedding photography is about preserving
                emotions, capturing authentic moments, and creating
                timeless cinematic memories.
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80"
                alt="Wedding"
                className="rounded-[32px] w-full h-[650px] object-cover"
              />

              <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                <p className="text-5xl font-extralight text-[#C6A75E] mb-2">
                  500+
                </p>

                <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
                  Weddings Captured
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-[#0A0A0A]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20">

            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-5">
              Why Choose Us
            </p>

            <h2 className="text-4xl sm:text-5xl font-extralight">
              Crafted For Luxury Weddings.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                icon: Camera,
                title: "Artistic Vision",
                desc: "Editorial cinematic storytelling approach.",
              },
              {
                icon: Heart,
                title: "Emotional Moments",
                desc: "Capturing genuine emotions naturally.",
              },
              {
                icon: Sparkles,
                title: "Luxury Editing",
                desc: "Premium timeless color grading.",
              },
              {
                icon: ImageIcon,
                title: "Fast Delivery",
                desc: "Quick previews and galleries.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-white/10 rounded-[28px] p-8 bg-white/[0.02]"
              >
                <item.icon className="w-10 h-10 text-[#C6A75E] mb-6" />

                <h3 className="text-2xl font-light mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-16">

            <p className="uppercase tracking-[0.4em] text-[#C6A75E] text-xs mb-4">
              Portfolio
            </p>

            <h2 className="text-4xl sm:text-5xl font-extralight">
              Featured Gallery.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group overflow-hidden rounded-[28px]"
              >
                <img
                  src={img}
                  alt="Gallery"
                  className="w-full h-[420px] object-cover group-hover:scale-110 transition duration-700"
                />
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

            <h2 className="text-4xl sm:text-5xl font-extralight">
              Wedding Packages.
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
                className={`rounded-[32px] p-10 border ${
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
                  <ArrowRight className="w-4 h-4" />
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
            Let’s Create Memories
          </p>

          <h2 className="text-5xl sm:text-6xl font-extralight leading-tight mb-10">
            Ready To Capture Your Special Day?
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Let’s craft timeless memories with cinematic elegance and
            emotional storytelling.
          </p>

          <button className="bg-[#C6A75E] text-black px-10 py-5 rounded-full uppercase tracking-[0.35em] text-xs font-semibold hover:scale-105 transition duration-500">
            Book Consultation
          </button>

        </div>
      </section>
    </div>
  );
};

export default WeddingPhotographyPage;