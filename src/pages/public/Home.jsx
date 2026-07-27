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

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ news: 0, categories: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPublishedNews({ limit: 9 }),
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

      {/* Stats Bar */}
      <div className="bg-navy rounded-xl p-5 mb-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-extrabold text-white">{stats.news}</div>
          <div className="text-blue-300 text-sm mt-1">Total Berita</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white">
            {stats.categories}
          </div>
          <div className="text-blue-300 text-sm mt-1"> Kategori</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-red">
            {stats.views.toLocaleString()}
          </div>
          <div className="text-blue-300 text-sm mt-1"> Total Views</div>
        </div>
      </div>

      {/* Latest News */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-navy font-bold text-xl border-l-4 border-red pl-3">
          Berita Terbaru
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {latest.map((n) => (
          <NewsCard key={n.id} news={n} />
        ))}
      </div>

      {/* Featured + Popular sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <h2 className="text-navy font-bold text-xl border-l-4 border-red pl-3 mb-4">
            Berita Pilihan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.slice(0, 4).map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-navy font-bold text-xl border-l-4 border-red pl-3 mb-4">
            Paling Banyak Dibaca
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4 mb-6">
            {popular.map((n, i) => (
              <div key={n.id} className="flex items-start gap-3">
                <span className="text-2xl font-extrabold text-gray-200 w-8 flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <Link
                    to={`/news/${n.slug}`}
                    className="text-sm font-semibold text-navy hover:text-red transition-colors line-clamp-2"
                  >
                    {n.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.views?.toLocaleString()} views
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-navy font-bold text-xl border-l-4 border-red pl-3 mb-4">
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
