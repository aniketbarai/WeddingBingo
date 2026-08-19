import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../api/client.js";
import Container from "../components/ui/Container.jsx";

export default function Testimonials() {
  const [state, setState] = useState({ loading: true, items: [], error: false });
  useEffect(() => { api.get("/api/public/testimonials").then(({ data }) => setState({ loading: false, items: data.items || [], error: false })).catch(() => setState({ loading: false, items: [], error: true })); }, []);
  return <><Helmet><title>Testimonials | Wedding Studio</title></Helmet><main className="min-h-screen bg-[#050505] text-white"><Container className="py-24"><p className="text-xs uppercase tracking-[.3em] text-[#c6a75e]">Kind words</p><h1 className="mt-3 font-serif text-5xl">Testimonials</h1>{state.loading && <p className="mt-10 text-sm text-white/40">Loading stories…</p>}{state.error && <p className="mt-10 text-sm text-red-300">Testimonials are temporarily unavailable.</p>}{!state.loading && !state.error && state.items.length === 0 && <p className="mt-10 text-sm text-white/40">Testimonials will appear here as stories are published.</p>}<div className="mt-12 grid gap-6 md:grid-cols-2">{state.items.map((item) => <article key={item._id} className="rounded-2xl border border-white/10 bg-white/[.03] p-7"><div className="text-[#c6a75e]">{"★".repeat(item.rating || 5)}</div><blockquote className="mt-6 font-serif text-2xl leading-relaxed">“{item.testimonial}”</blockquote><p className="mt-6 text-xs uppercase tracking-widest text-white/40">{item.coupleName}{item.location ? ` · ${item.location}` : ""}</p></article>)}</div></Container></main></>;
}
