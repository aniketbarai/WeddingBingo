import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../api/client.js";
import Container from "../components/ui/Container.jsx";

export default function Packages() {
  const [state, setState] = useState({ loading: true, items: [], error: false });
  useEffect(() => { api.get("/api/public/packages").then(({ data }) => setState({ loading: false, items: data.items || [], error: false })).catch(() => setState({ loading: false, items: [], error: true })); }, []);
  return <><Helmet><title>Packages | Wedding Studio</title></Helmet><main className="min-h-screen bg-[#050505] text-white"><Container className="py-24"><p className="text-xs uppercase tracking-[.3em] text-[#c6a75e]">Thoughtful collections</p><h1 className="mt-3 font-serif text-5xl">Packages</h1>{state.loading && <p className="mt-10 text-sm text-white/40">Loading collections…</p>}{state.error && <p className="mt-10 text-sm text-red-300">Packages are temporarily unavailable.</p>}{!state.loading && !state.error && state.items.length === 0 && <p className="mt-10 text-sm text-white/40">Our collections are being refreshed. Please contact us for current availability.</p>}<div className="mt-12 grid gap-6 md:grid-cols-2">{state.items.map((item) => <article key={item._id} className="rounded-2xl border border-white/10 bg-white/[.03] p-7"><h2 className="font-serif text-3xl">{item.title}</h2>{item.price && <p className="mt-3 text-[#c6a75e]">{item.price}</p>}{item.description && <p className="mt-5 text-sm leading-7 text-white/50">{item.description}</p>}{item.features?.length > 0 && <ul className="mt-6 space-y-2 text-sm text-white/65">{item.features.map((feature) => <li key={feature}>— {feature}</li>)}</ul>}</article>)}</div></Container></main></>;
}
