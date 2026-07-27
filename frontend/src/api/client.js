import axios from 'axios';
import toast from 'react-hot-toast';

import BASE_URL from '../config.js';

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || 'Request failed';

    // An expired/invalid admin token should log the user out and send them
    // back to login, instead of every subsequent request silently failing.
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Session expired - please log in again');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      return Promise.reject(err);
    }

    toast.error(msg);
    return Promise.reject(err);
  }
);

// Shared logout so every admin page clears the session the same way,
// instead of each one reimplementing localStorage.removeItem + redirect.
export const logoutAdmin = () => {
  localStorage.removeItem('token');
  window.location.href = '/admin/login';
};

