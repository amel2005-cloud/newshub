import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut, getCategories } from "../../lib/supabase";
import MascotHero from "./MascotHero";
import {
  Search,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Newspaper,
  MapPin,
  Phone,
  Printer,
} from "lucide-react";

export default function PublicLayout({ children }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup mobile menu tiap pindah halaman
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (slug) => location.pathname === `/category/${slug}`;

  return (
    <div className="min-h-screen bg-[#0b1a33] text-white flex flex-col">
      {/* ============ NAVBAR ============ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0b1a33]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-[#0b1a33] border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-red-600 group-hover:bg-red-500 transition-colors">
                <Newspaper size={18} className="text-white" />
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                KOJB<span className="text-red-500">News</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {categories.slice(0, 6).map((cat) => {
                const active = isActive(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? "text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat.name}
                    {active && (
                      <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-red-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
              <a
                href="https://ojk-jember-edukasi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-400 hover:text-white hover:bg-red-600/20 border border-red-500/30"
              >
                Pengajuan Edukasi
              </a>
            </nav>

            {/* Right side: search + actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search (desktop) */}
              <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center relative"
              >
                <Search
                  size={16}
                  className="absolute left-3 text-white/40 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berita..."
                  className="text-sm pl-9 pr-3 py-2 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none w-56 focus:w-64 focus:bg-white/15 focus:border-red-500/50 transition-all"
                />
              </form>

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden sm:inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-md shadow-red-600/20"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={15} />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-md shadow-red-600/20"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-white/10">
              <form onSubmit={handleSearch} className="relative mb-3 mt-3">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berita..."
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-red-500/50"
                />
              </form>

              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(cat.slug)
                        ? "bg-red-600/15 text-red-400"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Mobile auth actions */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 sm:hidden">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-medium px-4 py-2.5 rounded-full border border-white/15 hover:bg-white/5 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <MascotHero />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      {/* ============ FOOTER ============ */}
      <footer className="bg-[#081428] border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kolom 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-red-600">
                  <Newspaper size={18} className="text-white" />
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                  KOJB<span className="text-red-500">News</span>
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Media informasi yang menghimpun berita seputar OJK Jember dari
                berbagai publikasi resmi.
              </p>
            </div>

            {/* Kolom 2: Kontak */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
                Hubungi Kami
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-red-500 shrink-0" />
                  <span>Jl. Hayam Wuruk No. 41, Kaliwates Jember</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone size={16} className="mt-0.5 text-red-500 shrink-0" />
                  <span>(0331) 484 444 / 483 859</span>
                </li>
                <li className="flex items-start gap-2">
                  <Printer size={16} className="mt-0.5 text-red-500 shrink-0" />
                  <span>Fax : (0331) 486 800</span>
                </li>
                <li className="flex items-start gap-2">
                  <span> @ojk_jember</span>

                  <a
                    href="https://instagram.com/ojk_jember"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  ></a>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Tentang */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
                Tentang
              </h4>
              <p className="text-sm text-white/60 leading-relaxed">
                KOJBNews adalah portal informasi resmi yang menyajikan
                perkembangan terbaru seputar OJK Jember agar masyarakat tidak
                ketinggalan info penting.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50">
            © {new Date().getFullYear()} KOJB News. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
