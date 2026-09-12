import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { api } from "../api/client.js";

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let active = true;
    api.get("/api/public/testimonials")
      .then(({ data }) => { if (active) { setTestimonials(data.items || []); setStatus("ready"); } })
      .catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, []);

  // Duplicate the list to create a seamless infinite loop
  const doubleTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="bg-[#050505] text-white py-32 overflow-hidden relative">

      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase font-bold mb-4 block">
            The Gallery of Praise
          </span>
          <h2 className="text-5xl md:text-8xl font-extralight tracking-tighter leading-none mb-6">
            Loved by <span className="italic font-serif text-[#C6A75E]">Souls.</span>
          </h2>
          <div className="h-[1px] w-24 bg-[#C6A75E] mx-auto opacity-50" />
        </motion.div>
      </div>

      {status === "loading" && (
        <div className="flex gap-8 px-6 max-w-7xl mx-auto overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[350px] md:w-[450px] flex-none h-64 rounded-[2.5rem] border border-white/5 bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-white/40">Testimonials could not be loaded right now. Please check back shortly.</p>
      )}

      {status === "ready" && testimonials.length === 0 && (
        <p className="text-center text-sm text-white/40">No testimonials published yet.</p>
      )}

      {status === "ready" && testimonials.length > 0 && (
        <>
          {/* INFINITE SCROLLING MARQUEE */}
          <div className="relative flex">
            <motion.div
              className="flex gap-8 pr-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 30,
                repeat: Infinity
              }}
            >
              {doubleTestimonials.map((item, index) => (
                <div
                  key={`${item._id || item.coupleName}-${index}`}
                  className="w-[350px] md:w-[450px] flex-none group cursor-pointer"
                >
                  <div className="h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-sm transition-all duration-700 group-hover:bg-[#C6A75E]/5 group-hover:border-[#C6A75E]/20 group-hover:-translate-y-2">

                    {/* Visual Accent */}
                    <div className="w-8 h-[1px] bg-[#C6A75E] mb-8 group-hover:w-16 transition-all duration-700" />

                    <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10 italic font-serif">
                      "{item.testimonial}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="overflow-hidden rounded-full w-12 h-12 border border-[#C6A75E]/30 group-hover:border-[#C6A75E] transition-colors flex items-center justify-center bg-white/5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.coupleName}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          />
                        ) : (
                          <span className="text-[10px] text-[#C6A75E] font-serif">{item.coupleName?.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium tracking-wide group-hover:text-[#C6A75E] transition-colors">
                          {item.coupleName}
                        </h4>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">
                          {item.location || "Signature Couple"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* AMBIENT BACKGROUND GLOW */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-64 bg-[#C6A75E]/5 blur-[120px] rounded-full pointer-events-none" />

          {/* SATISFACTION TAG */}
          <div className="mt-20 text-center relative z-10">
            <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em]">
                <span className="text-white">{testimonials.length}+</span> Stories Captured Globally
              </p>
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
}
