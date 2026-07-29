import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut, getCategories } from "../../lib/supabase";
import MascotCard from "./MascotCard";
import MascotHero from "./MascotHero";

export default function PublicLayout({ children }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data || []));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #0b2545 0%, #12335f 45%, #0d2a52 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="bg-navy sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-white font-extrabold text-xl">
              KOJB<span className="text-red">News</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="text-blue-200 hover:text-red text-sm px-2 py-1 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="hidden md:flex">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berita..."
                  className="text-sm px-3 py-1.5 rounded-l border-0 outline-none w-44"
                />
                <button
                  type="submit"
                  className="bg-red text-white text-sm px-3 py-1.5 rounded-r hover:bg-red-dark"
                >
                  Cari
                </button>
              </form>

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="text-sm bg-red text-white px-3 py-1.5 rounded hover:bg-red-dark"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm border border-blue-300 text-blue-200 px-3 py-1.5 rounded hover:bg-navy"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm border border-blue-300 text-blue-200 px-3 py-1.5 rounded hover:bg-white/10"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white ml-2"
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
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden py-3 border-t border-navy/50">
              <form onSubmit={handleSearch} className="flex mb-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berita..."
                  className="text-sm px-3 py-1.5 rounded-l flex-1 outline-none"
                />
                <button
                  type="submit"
                  className="bg-red text-white text-sm px-3 py-1.5 rounded-r"
                >
                  Cari
                </button>
              </form>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="block text-blue-200 hover:text-red py-1 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      <MascotHero />

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6"></main>
      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-blue-200 mt-4 relative" style={{
        backgroundImage: `linear-gradient(rgba(11,37,69,0.78), rgba(11,37,69,0.88)), url('/ojk-jember.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-white font-bold text-base mb-1">
                KOJB<span className="text-red">News</span>
              </h3>
              <p className="text-xs leading-relaxed">
                Media informasi yang menghimpun berita seputar OJK Jember dari berbagai publikasi resmi.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Hubungi Kami</h4>
              <ul className="text-xs space-y-1">
                <li>📍 Jl. Hayam Wuruk No. 41, Kaliwates Jember</li>
                <li>☎️ (0331) 484 444 / 483 859</li>
                <li>📠 Fax : (0331) 486 800</li>
                <li>📷 <a href="https://www.instagram.com/ojk_jember/" target="_blank" rel="noopener noreferrer" className="hover:text-red">@ojk_jember</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Tentang</h4>
              <p className="text-xs">&copy; {new Date().getFullYear()} KOJB News. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

