import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../config.js";

export const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Request failed";
    if (err?.response?.status === 401) {
      toast.error("Your admin session has expired. Please sign in again.");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") window.location.href = "/admin/login";
      return Promise.reject(err);
    }
    toast.error(msg);
    return Promise.reject(err);
  },
);

export const logoutAdmin = async () => {
  try { await api.post("/api/admin/logout"); } catch { /* session may already be expired */ }
  window.location.href = "/admin/login";
};
