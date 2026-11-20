import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "../../lib/supabase";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Users,
  Globe,
  LogOut,
  Menu,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manajemen Berita", path: "/admin/news", icon: Newspaper },
  { label: "Kategori", path: "/admin/categories", icon: Tags },
  { label: "Pengguna", path: "/admin/users", icon: Users },
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
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo-ojk.png"
            alt="OJK Jember"
            className="h-9 w-auto object-contain"
          />
          <span className="h-6 w-px bg-white/20" />
          <span className="text-white font-extrabold text-lg">
            KOJB<span className="text-red">News</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                active
                  ? "bg-red text-white font-semibold"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <Globe size={18} strokeWidth={1.75} className="shrink-0" />
          Lihat Website
        </Link>
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-blue-300 text-xs mb-2">{profile?.name}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-blue-200 hover:text-red transition-colors flex items-center gap-2"
        >
          <LogOut size={16} strokeWidth={1.75} className="shrink-0" />
          Logout
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
              aria-label="Buka menu"
            >
              <Menu size={24} />
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
