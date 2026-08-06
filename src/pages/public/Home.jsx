import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../../components/layout/PublicLayout";
import NewsCard from "../../components/ui/NewsCard";
import {
  getPublishedNews,
  getFeaturedNews,
  getPopularNews,
  getCategories,
} from "../../lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { ContainerScroll } from "../../components/ui/ContainerScroll";

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ news: 0, categories: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPublishedNews({ limit: 6 }), // <-- diubah dari 9 jadi 6
      getFeaturedNews(),
      getPopularNews(),
      getCategories(),
    ]).then(([latestRes, featuredRes, popularRes, catRes]) => {
      const latestData = latestRes.data || [];
      const featuredData = featuredRes.data || [];
      const popularData = popularRes.data || [];
      const catData = catRes.data || [];

      setLatest(latestData);
      setFeatured(featuredData);
      setPopular(popularData);
      setCategories(catData);

      setStats({
        news: latestRes.count || latestData.length,
        categories: catData.length,
        views: popularData.reduce((acc, n) => acc + (n.views || 0), 0),
      });

      setLoading(false);
    });
  }, []);
  const hero = featured[0] || latest[0];

  if (loading)
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Memuat berita...</div>
        </div>
      </PublicLayout>
    );

  return (
    <PublicLayout>
      {/* Hero */}
      {hero && (
        <div
          className="relative bg-navy rounded-xl overflow-hidden mb-6 min-h-[300px] flex items-end"
          style={
            hero.thumbnail
              ? {
                  backgroundImage: `linear-gradient(to top, rgba(11,37,69,0.95) 40%, rgba(11,37,69,0.4) 100%), url(${hero.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="p-6 md:p-10 w-full">
            {hero.categories && (
              <Link
                to={`/category/${hero.categories.slug}`}
                className="badge-cat mb-3 inline-block"
              >
                {hero.categories.name}
              </Link>
            )}
            <Link to={`/news/${hero.slug}`}>
              <h1 className="text-white font-extrabold text-2xl md:text-4xl leading-tight mb-3 hover:text-red transition-colors">
                {hero.title}
              </h1>
            </Link>
            {hero.short_description && (
              <p className="text-blue-200 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
                {hero.short_description}
              </p>
            )}
            <Link to={`/news/${hero.slug}`} className="btn-red">
              Baca Berita Lengkap
            </Link>
          </div>
        </div>
      )}

      {/* Stats Bar - Glassmorphism floating */}
      <div className="relative -mt-8 mb-10 z-10">
        <div
          className="mx-auto max-w-2xl rounded-2xl px-6 py-5 grid grid-cols-3 gap-4 text-center"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl mb-1"></div>
            <div className="text-3xl font-extrabold text-white">
              {stats.news}
            </div>
            <div className="text-white/50 text-xs mt-1">Total Berita</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border-x border-white/10"
          >
            <div className="text-3xl mb-1"></div>
            <div className="text-3xl font-extrabold text-white">
              {stats.categories}
            </div>
            <div className="text-white/50 text-xs mt-1">Kategori</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl mb-1"></div>
            <div className="text-3xl font-extrabold text-red-400">
              {stats.views.toLocaleString()}
            </div>
            <div className="text-white/50 text-xs mt-1">Total Views</div>
          </motion.div>
        </div>
      </div>
      {/* Container Scroll Section */}
      <ContainerScroll
        titleComponent={
          <div className="mb-4">
            <span className="text-white/60 text-lg">Selamat datang di</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mt-2">
              KOJB<span className="text-red-500">News</span>
            </h2>
            <p className="text-white/50 mt-2 text-base">
              Portal berita resmi OJK Jember
            </p>
          </div>
        }
      >
        <img
          src="/ojk-jember.jpg"
          alt="Kantor OJK Jember"
          className="w-full h-full object-cover object-center rounded-xl"
        />
      </ContainerScroll>

      {/* Latest News */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-xl border-l-4 border-red pl-3">
          Berita Terbaru
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {latest.map((n) => (
          <NewsCard key={n.id} news={n} />
        ))}
      </div>
      <div className="text-center mb-10">
        <Link to="/berita" className="btn-red inline-block">
          Lihat Semua Berita
        </Link>
      </div>

      {/* Featured + Popular sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <h2 className="text-white font-bold text-xl border-l-4 border-red pl-3 mb-4">
            Berita Pilihan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.slice(0, 4).map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold text-xl border-l-4 border-red pl-3 mb-4">
            Paling Banyak Dibaca
          </h2>
          <div
            className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6 overflow-hidden relative"
            style={{ height: "280px" }}
          >
            <motion.div
              animate={{ y: ["0%", "-50%"] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
              className="space-y-4"
              whileHover={{ animationPlayState: "paused" }}
            >
              {[...popular, ...popular].map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-4 border-b border-white/5"
                >
                  <span
                    className={`text-2xl font-extrabold w-8 flex-shrink-0 ${i % popular.length === 0 ? "text-red-500" : "text-white/20"}`}
                  >
                    {i % popular.length === 0 ? "🔥" : (i % popular.length) + 1}
                  </span>
                  <div>
                    <Link
                      to={`/news/${n.slug}`}
                      className="text-sm font-semibold text-white hover:text-red-400 transition-colors line-clamp-2"
                    >
                      {n.title}
                    </Link>
                    <p className="text-xs text-white/40 mt-1">
                      {n.views?.toLocaleString()} views
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <h2 className="text-white font-bold text-xl border-l-4 border-red pl-3 mb-4">
            Kategori
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="bg-white text-navy text-sm px-3 py-1.5 rounded-full shadow-sm hover:bg-red hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
