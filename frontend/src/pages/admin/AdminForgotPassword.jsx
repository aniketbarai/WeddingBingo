import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ loading: false, sent: false });

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, sent: false });
    try {
      await api.post("/api/admin/forgot-password", { email });
    } finally {
      // Always show the same "sent" state regardless of outcome — the API
      // intentionally doesn't reveal whether the email exists.
      setState({ loading: false, sent: true });
    }
  };

  return (
    <main className="min-h-screen bg-[#090909] text-white grid place-items-center p-8">
      <div className="w-full max-w-md">
        <p className="text-[#c6a75e] text-xs uppercase tracking-[.35em]">Private workspace</p>
        <h1 className="mt-3 text-4xl font-serif">Reset password</h1>

        {state.sent ? (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-white/60">
              If an account exists for <span className="text-white">{email}</span>, a reset token has been emailed to it.
            </p>
            <Link to="/admin/reset-password" className="inline-block text-sm text-[#c6a75e] hover:underline">
              I have a reset token
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-6">
            <p className="text-sm text-white/45">Enter your admin email and we'll send you a reset token.</p>
            <label className="block text-xs uppercase tracking-widest text-white/50">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none focus:border-[#c6a75e]"
              />
            </label>
            <button disabled={state.loading} className="w-full rounded-xl bg-[#c6a75e] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#ddc37f] disabled:opacity-50">
              {state.loading ? "Sending…" : "Send reset token"}
            </button>
          </form>
        )}

        <Link to="/admin/login" className="mt-8 block text-center text-xs text-white/45 hover:text-[#c6a75e]">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
