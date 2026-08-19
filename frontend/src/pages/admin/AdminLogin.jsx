import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../api/client.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setLoading(true);
    try { await api.post("/api/admin/login", form); toast.success("Welcome back to the studio."); navigate("/admin/dashboard"); }
    catch { /* shared client displays the server message */ }
    finally { setLoading(false); }
  };
  return <main className="min-h-screen bg-[#090909] text-white grid lg:grid-cols-2">
    <section className="hidden lg:flex relative overflow-hidden bg-[#12100d] items-end p-16"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,167,94,.22),transparent_45%)]" /><div className="relative"><p className="text-[#c6a75e] text-xs uppercase tracking-[.35em]">Wedding Bingo Studio</p><h1 className="mt-5 max-w-xl font-serif text-6xl leading-[.95]">A quieter way to manage beautiful work.</h1></div></section>
    <section className="grid place-items-center p-8"><form onSubmit={submit} className="w-full max-w-md space-y-8"><div><p className="text-[#c6a75e] text-xs uppercase tracking-[.35em]">Private workspace</p><h2 className="mt-3 text-4xl font-serif">Admin sign in</h2><p className="mt-3 text-sm text-white/45">Manage the stories, galleries and people behind every celebration.</p></div><div className="space-y-4"><label className="block text-xs uppercase tracking-widest text-white/50">Email<input name="email" type="email" required value={form.email} onChange={update} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none focus:border-[#c6a75e]" /></label><label className="block text-xs uppercase tracking-widest text-white/50">Password<input name="password" type="password" required value={form.password} onChange={update} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none focus:border-[#c6a75e]" /></label><label className="flex items-center gap-3 text-sm text-white/55"><input name="remember" type="checkbox" checked={form.remember} onChange={update} className="accent-[#c6a75e]" /> Keep me signed in</label></div><button disabled={loading} className="w-full rounded-xl bg-[#c6a75e] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#ddc37f] disabled:opacity-50">{loading ? "Signing in…" : "Enter workspace"}</button><Link to="/admin/forgot-password" className="block text-center text-xs text-white/45 hover:text-[#c6a75e]">Forgot password?</Link></form></section>
  </main>;
}
