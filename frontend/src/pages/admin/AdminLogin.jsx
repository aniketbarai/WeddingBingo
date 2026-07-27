import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.success('Login successful');
      window.location.href = '/admin/dashboard';
    } catch {
      // api client's response interceptor already toasts the error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#111] text-white rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input
          className="w-full bg-black border border-gray-700 rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full bg-black border border-gray-700 rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full bg-[#C6A75E] text-black py-2 rounded font-bold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

