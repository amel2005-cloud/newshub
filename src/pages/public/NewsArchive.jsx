import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PublicLayout from "../../components/layout/PublicLayout";
import NewsCard from "../../components/ui/NewsCard";
import { getPublishedNews, getCategories } from "../../lib/supabase";

const PAGE_SIZE = 9;

export default function NewsArchive() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * PAGE_SIZE;

    Promise.all([
      getPublishedNews({ limit: PAGE_SIZE, offset }),
      getCategories(),
    ]).then(([newsRes, catRes]) => {
      setNews(newsRes.data || []);
      setTotalCount(newsRes.count || 0);
      setCategories(catRes.data || []);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setSearchParams({ page: p.toString() });
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-navy font-bold text-2xl border-l-4 border-red pl-3">
          Semua Berita
        </h1>
        <span className="text-gray-400 text-sm">{totalCount} berita</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Memuat berita...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {news.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md bg-white shadow-sm text-navy text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red hover:text-white transition-colors"
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="text-gray-400 px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`px-3 py-1.5 rounded-md text-sm shadow-sm transition-colors ${
                      p === page
                        ? "bg-red text-white"
                        : "bg-white text-navy hover:bg-red hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-md bg-white shadow-sm text-navy text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red hover:text-white transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </>
      )}
    </PublicLayout>
  );
}