import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BASE_URL from "../config";

const initialForm = { name: "", email: "", phone: "", message: "" };
const phonePattern = /^\+?[0-9\s().-]{10,20}$/;

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phonePattern.test(formData.phone.trim()) || phoneDigits.length < 10 || phoneDigits.length > 15 || /^([0-9])\1+$/.test(phoneDigits)) {
      toast.error("Please enter a real phone number with 10–15 digits.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/send-mail`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "We could not send your request.");
      setFormData(initialForm);
      toast.success("Your message has been received. We’ll be in touch shortly.");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-navbar-theme="dark" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050505] px-6 py-32 text-[#f4f4f4]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A75E]/5 blur-[120px]" />
      <div className="relative z-10 grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6"><motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#C6A75E]">Connect</motion.div><motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-light leading-none tracking-tighter lg:text-7xl">Reserve Your <br /><span className="font-serif italic text-[#C6A75E]">Legacy.</span></motion.h2><p className="max-w-xs text-sm font-light leading-relaxed text-gray-500">Tell us what you are planning and we’ll shape the right visual experience for it.</p></div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[2.5rem] p-[1px]">
          <div className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,#C6A75E_0%,#000_20%,#000_80%,#C6A75E_100%)] opacity-80" />
          <div className="relative space-y-8 rounded-[2.5rem] bg-[#0a0a0a] p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <input type="text" name="name" value={formData.name} required minLength={2} onChange={handleChange} placeholder="NAME" autoComplete="name" className="w-full border-b border-white/10 bg-transparent py-3 text-[15px] tracking-widest text-white outline-none transition-all placeholder:text-[#c6a75e] focus:border-[#C6A75E]" />
              <input type="email" name="email" value={formData.email} required onChange={handleChange} placeholder="EMAIL" autoComplete="email" className="w-full border-b border-white/10 bg-transparent py-3 text-[15px] tracking-widest text-white outline-none transition-all placeholder:text-[#c6a75e] focus:border-[#C6A75E]" />
              <div><input type="tel" name="phone" value={formData.phone} required onChange={handleChange} placeholder="PHONE NUMBER *" autoComplete="tel" inputMode="tel" aria-describedby="phone-help" className="w-full border-b border-white/10 bg-transparent py-3 text-[15px] tracking-widest text-white outline-none transition-all placeholder:text-[#c6a75e] focus:border-[#C6A75E]" /><p id="phone-help" className="mt-2 text-[10px] tracking-wide text-white/35">Use a reachable number with country code when needed.</p></div>
              <textarea name="message" rows="2" value={formData.message} required minLength={10} onChange={handleChange} placeholder="YOUR MESSAGE" className="w-full resize-none border-b border-white/10 bg-transparent py-3 text-[15px] tracking-widest text-white outline-none transition-all placeholder:text-[#c6a75e] focus:border-[#C6A75E]" />
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#C6A75E] py-4 text-[12px] font-black uppercase tracking-normal text-black transition-all duration-500 hover:bg-white disabled:cursor-wait disabled:opacity-50">{loading ? "Sending…" : "Send Request"}</button>
            </form>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
