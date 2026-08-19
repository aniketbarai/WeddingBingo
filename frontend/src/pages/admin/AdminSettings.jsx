import { useState } from "react";
import { api } from "../../api/client.js";
import AdminLayout from "../../components/AdminLayout.jsx";

export default function AdminSettings() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [state, setState] = useState({ saving: false, message: "", error: false });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) return setState({ saving: false, message: "New passwords do not match.", error: true });
    setState({ saving: true, message: "", error: false });
    try { await api.post("/api/admin/change-password", { oldPassword: form.oldPassword, newPassword: form.newPassword }); setForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); setState({ saving: false, message: "Password changed. Please sign in again.", error: false }); }
    catch (error) { setState({ saving: false, message: error.response?.data?.message || "Password could not be changed.", error: true }); }
  };
  return <AdminLayout><section className="mx-auto max-w-3xl p-6 text-white md:p-10"><p className="text-xs uppercase tracking-[.3em] text-[#c6a75e]">Account security</p><h1 className="mt-3 font-serif text-5xl">Settings</h1><div className="mt-10 rounded-2xl border border-white/10 bg-white/[.03] p-6"><h2 className="font-serif text-2xl">Change password</h2><form onSubmit={submit} className="mt-6 space-y-4"><input required minLength={6} type="password" name="oldPassword" value={form.oldPassword} onChange={update} placeholder="Current password" className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-[#c6a75e]" /><input required minLength={6} type="password" name="newPassword" value={form.newPassword} onChange={update} placeholder="New password" className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-[#c6a75e]" /><input required minLength={6} type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} placeholder="Confirm new password" className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none focus:border-[#c6a75e]" /><button disabled={state.saving} className="rounded-xl bg-[#c6a75e] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{state.saving ? "Saving…" : "Update password"}</button>{state.message && <p className={`text-sm ${state.error ? "text-red-300" : "text-emerald-300"}`}>{state.message}</p>}</form></div></section></AdminLayout>;
}
