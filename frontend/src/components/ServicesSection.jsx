import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BASE_URL from "../config";

export default function ServicesSection() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`${BASE_URL}/api/public/services`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load services");
        return data;
      })
      .then((data) => {
        if (!mounted) return;
        const items = Array.isArray(data.items) ? data.items : [];
        setServices(items);
        setActiveImage(items[0]?.image || "");
      })
      .catch((error) => {
        if (mounted) toast.error(error.message || "Unable to load services");
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section data-navbar-theme="dark" className="bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative flex flex-col gap-16 lg:flex-row">
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky top-24">
              <div className="relative h-[80vh] overflow-hidden rounded-[32px] border border-white/10 bg-white/[.03]">
                <AnimatePresence mode="wait">
                  {activeImage && <motion.img key={activeImage} src={activeImage} alt="Selected wedding service" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 0.7, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }} className="absolute inset-0 h-full w-full object-cover" />}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 z-10 p-12">
                  <p className="mb-5 text-xs uppercase tracking-[0.4em] text-[#C6A75E]">Premium Studio</p>
                  <h2 className="text-6xl font-extralight leading-none tracking-tight">Our <br /><span className="font-serif italic text-[#C6A75E]">Services.</span></h2>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="mb-16 lg:hidden">
              <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#C6A75E]">Premium Studio</p>
              <h2 className="text-5xl font-extralight leading-none">Our <span className="font-serif italic text-[#C6A75E]">Services.</span></h2>
            </div>
            {loading ? (
              <div className="space-y-6">{[1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/[.03]" />)}</div>
            ) : services.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/50">Services will be available shortly.</div>
            ) : (
              <div className="space-y-6">
                {services.map((service, index) => (
                  <motion.div key={service._id || service.slug} onMouseEnter={() => setActiveImage(service.image)} onClick={() => navigate(`/services/${service.slug}`)} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 hover:border-[#C6A75E]/40">
                    <div className="absolute inset-0 bg-white/[.03] opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="relative p-8 sm:p-10">
                      <div className="mb-6"><span className="text-xs font-bold tracking-[0.4em] text-[#C6A75E]">{service.number}</span></div>
                      <div className="mb-5 flex items-start justify-between gap-4"><h3 className="text-3xl font-light tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">{service.title}</h3><span className="text-2xl text-[#C6A75E] opacity-0 transition duration-500 group-hover:opacity-100">↗</span></div>
                      <p className="max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">{service.description}</p>
                      <div className="mt-8 overflow-hidden rounded-2xl lg:hidden"><img src={service.image} alt={service.title} loading="lazy" className="h-64 w-full object-cover" /></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="pt-16"><button onClick={() => navigate("/contact")} className="rounded-full border border-[#C6A75E]/30 px-8 py-4 text-xs uppercase tracking-[0.35em] text-[#C6A75E] transition-all duration-500 hover:bg-[#C6A75E] hover:text-black">Discuss Your Project</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
