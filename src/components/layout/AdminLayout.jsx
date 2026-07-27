import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "../../lib/supabase";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { label: "Manajemen Berita", path: "/admin/news", icon: "📰" },
  { label: "Kategori", path: "/admin/categories", icon: "🏷️" },
  { label: "Penulis", path: "/admin/authors", icon: "✍️" },
  { label: "Pengguna", path: "/admin/users", icon: "👥" },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="text-white font-extrabold text-xl">
          KOJB<span className="text-red">News</span>
        </Link>
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
              location.pathname.startsWith(item.path)
                ? "bg-red text-white font-semibold"
                : "text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <span>🌐</span> Lihat Website
        </Link>
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-blue-300 text-xs mb-2">{profile?.name}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-blue-200 hover:text-red transition-colors flex items-center gap-2"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-lightgray overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-navy flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-navy flex flex-col">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="font-bold text-navy text-lg">{title}</h1>
          </div>
          <span className="text-sm text-gray-500">{profile?.name}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
