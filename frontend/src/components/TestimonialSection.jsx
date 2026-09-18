import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { api } from "../api/client.js";

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let active = true;
    api
      .get("/api/public/testimonials")
      .then(({ data }) => {
        if (active) {
          setTestimonials(data.items || []);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-stone-50 py-28 text-slate-900 selection:bg-[#C6A75E] selection:text-white"
    >
      {/* SOFT LIGHT BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-[#C6A75E]/10 blur-[130px]" />

      {/* SECTION HEADER */}
      <div className="relative z-10 mx-auto mb-16 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.5em] text-[#C6A75E]">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl font-light italic leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Words from couples.
          </h2>
        </motion.div>
      </div>

      {/* CONTAINER */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* SKELETON LOADING GRID */}
        {status === "loading" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-slate-200/60"
              />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <p className="text-center text-xs uppercase tracking-widest text-slate-400">
            Unable to load testimonials at this time.
          </p>
        )}

        {/* EMPTY STATE */}
        {status === "ready" && testimonials.length === 0 && (
          <p className="text-center text-xs uppercase tracking-widest text-slate-400">
            No testimonials published yet.
          </p>
        )}

        {/* READY STATE - GRID LAYOUT */}
        {status === "ready" && testimonials.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item._id || `${item.coupleName}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C6A75E]/50 hover:shadow-md"
              >
                {/* QUOTE TEXT */}
                <blockquote className="mb-6 font-serif text-base italic leading-relaxed text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
                  “{item.testimonial}”
                </blockquote>

                {/* CARD FOOTER */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="font-serif text-sm font-medium tracking-wide text-slate-900">
                      {item.coupleName}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                      {item.location || "Client Story"}
                    </p>
                  </div>

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.coupleName}
                      className="h-9 w-9 rounded-full border border-slate-200 object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-serif text-xs text-[#C6A75E]">
                      {item.coupleName?.charAt(0) || "★"}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}