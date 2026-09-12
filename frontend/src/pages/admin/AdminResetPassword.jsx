import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../api/client.js";

export default function AdminResetPassword() {
  const { token: tokenFromUrl } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ resetToken: tokenFromUrl || "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error("New passwords do not match.");
    setLoading(true);
    try {
      await api.post(`/api/admin/reset-password/${form.resetToken}`, { newPassword: form.newPassword });
      toast.success("Password reset. Please sign in.");
      navigate("/admin/login");
    } catch {
      /* shared client displays the server message */
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090909] text-white grid place-items-center p-8">
      <div className="w-full max-w-md">
        <p className="text-[#c6a75e] text-xs uppercase tracking-[.35em]">Private workspace</p>
        <h1 className="mt-3 text-4xl font-serif">Set a new password</h1>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {!tokenFromUrl && (
            <label className="block text-xs uppercase tracking-widest text-white/50">
              Reset token
              <input name="resetToken" required value={form.resetToken} onChange={update} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none focus:border-[#c6a75e]" />
            </label>
          )}
          <label className="block text-xs uppercase tracking-widest text-white/50">
            New password
            <input name="newPassword" type="password" required minLength={8} value={form.newPassword} onChange={update} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none focus:border-[#c6a75e]" />
          </label>
          <label className="block text-xs uppercase tracking-widest text-white/50">
            Confirm new password
            <input name="confirmPassword" type="password" required minLength={8} value={form.confirmPassword} onChange={update} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none focus:border-[#c6a75e]" />
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-[#c6a75e] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#ddc37f] disabled:opacity-50">
            {loading ? "Saving…" : "Reset password"}
          </button>
        </form>

        <Link to="/admin/login" className="mt-8 block text-center text-xs text-white/45 hover:text-[#c6a75e]">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
