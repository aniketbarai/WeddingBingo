// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    number: "01",
    title: "Wedding Photography",
    slug:"weddingp",
    description:
      "Timeless and artistic coverage capturing raw emotions and beautiful details.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  },
  {
    number: "02",
    title: "Cinematic Videography",
    slug:"cinematic",
    description:
      "High-end cinematic films crafted with storytelling, music, and precision.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
  },
  {
    number: "03",
    title: "Pre-Wedding Shoots",
    slug:"prewedshoots",
    description:
      "Creative and personalized pre-wedding concepts in stunning locations.",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80",
  },
  {
    number: "04",
    title: "Drone Coverage",
    slug:"droneCover",
    description:
      "Breathtaking aerial visuals that elevate your wedding film experience.",
    image:
      "https://images.unsplash.com/photo-1473415781819-175f02f9036b?w=1200&q=80",
  },
];

export default function ServicesSection() {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(services[0].image);

  return (
    <section data-navbar-theme="dark" className="bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-16 relative">

          {/* ================= LEFT STICKY ================= */}
          <div className="hidden lg:block lg:w-1/2">

            <div className="sticky top-24">
              
              <div className="relative h-[80vh] rounded-[32px] overflow-hidden border border-white/10">

                {/* IMAGE */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt="service"
                    initial={{
                      opacity: 0,
                      scale: 1.1,
                    }}
                    animate={{
                      opacity: 0.7,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.6,
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* TEXT */}
                <div className="absolute bottom-0 left-0 p-12 z-10">
                  
                  <p className="uppercase tracking-[0.4em] text-xs text-[#C6A75E] mb-5">
                    Premium Studio
                  </p>

                  <h2 className="text-6xl font-extralight leading-none tracking-tight">
                    Our <br />
                    <span className="italic font-serif text-[#C6A75E]">
                      Services.
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SCROLLABLE ================= */}
          <div className="lg:w-1/2">

            {/* MOBILE TITLE */}
            <div className="lg:hidden mb-16">
              <p className="uppercase tracking-[0.4em] text-xs text-[#C6A75E] mb-4">
                Premium Studio
              </p>

              <h2 className="text-5xl font-extralight leading-none">
                Our{" "}
                <span className="italic font-serif text-[#C6A75E]">
                  Services.
                </span>
              </h2>
            </div>

            <div className="space-y-6">

              {services.map((service, index) => (
                <motion.div
                  key={index}
                  onMouseEnter={() => setActiveImage(service.image)}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  onClick={() =>
                    navigate(`/services/${service.slug}`)
                  }
                  className="group relative border border-white/10 rounded-3xl overflow-hidden hover:border-[#C6A75E]/40 transition-all duration-500"
                >

                  {/* HOVER BG */}
                  <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="relative p-8 sm:p-10">

                    {/* NUMBER */}
                    <div className="mb-6">
                      <span className="text-xs tracking-[0.4em] text-[#C6A75E] font-bold">
                        {service.number}
                      </span>
                    </div>

                    {/* TITLE */}
                    <div className="flex items-start justify-between gap-4 mb-5">

                      <h3 className="text-3xl sm:text-4xl font-light tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                        {service.title}
                      </h3>

                      <div className="opacity-0 group-hover:opacity-100 transition duration-500">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#C6A75E"
                          strokeWidth="1.5"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base max-w-lg">
                      {service.description}
                    </p>

                    {/* MOBILE IMAGE */}
                    <div className="mt-8 lg:hidden rounded-2xl overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="pt-16">
              <button className="border border-[#C6A75E]/30 px-8 py-4 rounded-full uppercase tracking-[0.35em] text-xs text-[#C6A75E] hover:bg-[#C6A75E] hover:text-black transition-all duration-500">
                Discuss Your Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
