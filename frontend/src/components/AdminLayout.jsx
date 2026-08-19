import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "../api/client.js";

const ADMIN_LINKS = [
  { name: "Dashboard", link: "/admin/dashboard" },
  { name: "Gallery", link: "/admin/gallery" },
  { name: "Weddings", link: "/admin/weddings" },
  { name: "Reviews", link: "/admin/reviews" },
  { name: "Bookings", link: "/admin/bookings" },
  { name: "Packages", link: "/admin/packages" },
  { name: "Inquiries", link: "/admin/inquiries" },
  { name: "Settings", link: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-56 shrink-0 border-r border-white/10 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <span className="text-lg font-serif italic text-[#C6A75E]">Wedding Bingo</span>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Admin</p>
        </div>

        <nav className="flex-1 py-4">
          {ADMIN_LINKS.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`block px-6 py-3 text-sm transition-colors ${
                pathname === item.link
                  ? "text-[#C6A75E] bg-white/5 border-l-2 border-[#C6A75E]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 px-6 py-4 text-sm text-gray-400 hover:text-white border-t border-white/10 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
