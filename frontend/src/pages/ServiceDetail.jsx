import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BASE_URL from "../config";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${BASE_URL}/api/public/services/${slug}`).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Service not found"); return data.item; }).then(setService).catch((error) => toast.error(error.message || "Service not found")).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div className="min-h-screen bg-[#050505] px-6 py-40 text-center text-white/50">Loading service…</div>;
  if (!service) return <div className="min-h-screen bg-[#050505] px-6 py-40 text-center text-white"><h1 className="font-serif text-5xl">Service not found.</h1><Link to="/services" className="mt-6 inline-block text-[#C6A75E]">Back to services</Link></div>;
  const layout = service.pageLayout || {};
  const alignClass = layout.heroAlign === "center" ? "text-center items-center" : layout.heroAlign === "right" ? "text-right items-end" : "text-left items-start";
  const defaults = [{ type: "hero", visible: true }, { type: "story", visible: true }, { type: "packages", visible: true }, { type: "gallery", visible: true }];
  const blocks = (layout.blocks?.length ? layout.blocks : defaults).filter((block) => block.visible).sort((a, b) => a.order - b.order);
  const packages = service.includedPackageRecords || [];
  const renderBlock = (block) => {
    if (block.type === "hero") return <section key="hero" className={`relative flex min-h-[70vh] flex-col justify-end px-6 py-24 sm:px-10 lg:px-24 ${alignClass}`}><img src={service.image} alt={service.title} className="absolute inset-0 h-full w-full object-cover opacity-45" /><div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/35 to-black/10" /><div className="relative z-10 max-w-4xl"><p className="mb-5 text-xs uppercase tracking-[0.4em]" style={{ color: layout.accent || "#C6A75E" }}>{service.number} / Wedding Bingo</p><h1 className="font-serif text-5xl leading-[.95] sm:text-7xl lg:text-9xl">{service.detailHeading || service.title}</h1><p className="mt-6 max-w-2xl text-lg font-light text-white/70">{service.detailSubheading || service.description}</p></div></section>;
    if (block.type === "story") return <section key="story" className="mx-auto max-w-4xl px-6 py-20 sm:px-10 lg:px-12"><div className="space-y-8">{(service.detailParagraphs || []).map((paragraph, index) => <motion.p key={index} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-lg leading-relaxed text-white/65">{paragraph}</motion.p>)}</div></section>;
    if (block.type === "packages") return <section key="packages" className="mx-auto max-w-6xl px-6 pb-20 sm:px-10 lg:px-12"><aside className="rounded-3xl border border-white/10 bg-white/[.03] p-7"><p className="text-xs uppercase tracking-[.3em] text-[#C6A75E]">Complete packages</p><div className="mt-6 grid gap-4 md:grid-cols-2">{packages.length ? packages.map((item) => <article key={item._id} className="rounded-2xl border border-white/10 bg-black/20 p-5"><h3 className="text-xl text-white">{item.title}</h3><p className="mt-2 text-[#C6A75E]">{item.price || "Custom quote"}</p>{item.description && <p className="mt-3 text-sm leading-relaxed text-white/55">{item.description}</p>}{item.features?.length > 0 && <ul className="mt-4 space-y-2 text-sm text-white/60">{item.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>}</article>) : (service.includedPackages || []).map((item) => <p key={item} className="border-b border-white/10 pb-4 text-white/75">{item}</p>)}</div><Link to="/contact" className="mt-8 inline-block rounded-full bg-[#C6A75E] px-5 py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white">Discuss this service</Link></aside></section>;
    if (block.type === "gallery") return (service.detailImages || []).length ? <section key="gallery" className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:px-12">{service.detailImages.map((image, index) => <img key={`${image.url}-${index}`} src={image.url} alt={`${service.title} detail ${index + 1}`} loading="lazy" className="h-80 w-full rounded-3xl object-cover" />)}</section> : null;
    return null;
  };
  return <main className="min-h-screen overflow-hidden bg-[#050505] text-white">{blocks.map(renderBlock)}</main>;
}
