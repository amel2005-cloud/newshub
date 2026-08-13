import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PublicLayout from "../../components/layout/PublicLayout";
import NewsCard from "../../components/ui/NewsCard";
import { getAvailableYears, getNewsByYear } from "../../lib/supabase";
import { motion } from "framer-motion";

export default function Archive() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const activeYear = year ? parseInt(year) : null;

  useEffect(() => {
    getAvailableYears().then(setYears);
  }, []);

  useEffect(() => {
    if (!activeYear) { setLoading(false); return; }
    setLoading(true);
    setPage(0);
    getNewsByYear(activeYear, { limit, offset: 0 }).then(({ data, count }) => {
      setNews(data || []);
      setTotal(count || 0);
      setLoading(false);
    });
  }, [activeYear]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const { data } = await getNewsByYear(activeYear, { limit, offset: nextPage * limit });
    setNews(prev => [...prev, ...(data || [])]);
    setPage(nextPage);
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 24, height: 2, background: "#dc2626" }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11, fontWeight: 600,
              letterSpacing: "0.15em",
              color: "rgba(248,113,113,0.8)",
              textTransform: "uppercase",
            }}>
              Arsip Berita
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}>
            {activeYear ? `Berita Tahun ${activeYear}` : "Arsip Berita"}
          </h1>
          {activeYear && (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(148,163,184,0.6)",
              marginTop: 6,
            }}>
              Menampilkan {total} artikel dari tahun {activeYear}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar tahun */}
          <aside>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "rgba(203,213,225,0.8)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Pilih Tahun
              </div>
              {years.length === 0 && (
                <div style={{ padding: "1rem 1.25rem", color: "rgba(148,163,184,0.5)", fontSize: "0.85rem" }}>
                  Memuat...
                </div>
              )}
              {years.map(y => (
                <Link
                  key={y}
                  to={`/arsip/${y}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.875rem 1.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    textDecoration: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: activeYear === y ? 700 : 500,
                    color: activeYear === y ? "#ffffff" : "rgba(148,163,184,0.7)",
                    background: activeYear === y
                      ? "linear-gradient(90deg, rgba(220,38,38,0.15), transparent)"
                      : "transparent",
                    borderLeft: activeYear === y
                      ? "2px solid #dc2626"
                      : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{y}</span>
                  {activeYear === y && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(248,113,113,0.8)" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>

            {/* Kembali ke beranda */}
            <Link to="/" style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: "1rem",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.83rem",
              color: "rgba(148,163,184,0.5)",
              textDecoration: "none",
              padding: "0.5rem 0",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
          </aside>

          {/* Konten berita */}
          <div className="lg:col-span-3">
            {!activeYear ? (
              // Tampilan awal: pilih tahun
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                minHeight: 300, gap: 16,
                color: "rgba(148,163,184,0.5)",
                textAlign: "center",
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(148,163,184,0.3)" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", fontWeight: 600, color: "rgba(203,213,225,0.5)" }}>
                    Pilih tahun di sebelah kiri
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", marginTop: 4 }}>
                    untuk melihat arsip berita
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                <div style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'Inter', sans-serif" }}>
                  Memuat berita...
                </div>
              </div>
            ) : news.length === 0 ? (
              <div style={{
                textAlign: "center", minHeight: 300,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(148,163,184,0.4)",
                fontFamily: "'Inter', sans-serif",
              }}>
                Tidak ada berita di tahun {activeYear}.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {news.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <NewsCard news={n} />
                    </motion.div>
                  ))}
                </div>

                {/* Load more */}
                {(page + 1) * limit < total && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      style={{
                        padding: "0.75rem 2rem",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        color: "rgba(203,213,225,0.8)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        backdropFilter: "blur(12px)",
                        transition: "all 0.2s",
                      }}
                    >
                      Muat Lebih Banyak
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}