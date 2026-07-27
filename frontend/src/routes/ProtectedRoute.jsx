import { Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

// Client-side gate for admin pages. This is a UX guard only -
// the real security boundary is requireAdminAuth on the backend.
// It stops the admin UI shell from rendering for logged-out visitors,
// bounces them to /admin/login, and wraps everything else in the
// shared sidebar layout so no admin page has to do that itself.
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
