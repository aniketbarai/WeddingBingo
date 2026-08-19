import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api/client.js";
import AdminLayout from "../components/AdminLayout.jsx";

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, authenticated: false });
  useEffect(() => {
    let active = true;
    api.get("/api/admin/me").then(() => active && setState({ loading: false, authenticated: true })).catch(() => active && setState({ loading: false, authenticated: false }));
    return () => { active = false; };
  }, []);
  if (state.loading) return <div className="min-h-screen bg-[#090909] text-white grid place-items-center"><span className="text-[#c6a75e] text-xs uppercase tracking-[0.3em]">Verifying session</span></div>;
  if (!state.authenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}
