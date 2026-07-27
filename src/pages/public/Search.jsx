import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import NewsCard from '../../components/ui/NewsCard'
import { getPublishedNews } from '../../lib/supabase'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [news, setNews] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    getPublishedNews({ search: q, limit: 18 }).then(({ data, count }) => {
      setNews(data || [])
      setTotal(count || 0)
      setLoading(false)
    })
  }, [q])

  return (
    <PublicLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy border-l-4 border-red pl-3">
          Hasil pencarian: "{q}"
        </h1>
        {!loading && <p className="text-gray-500 text-sm mt-1 ml-4">{total} berita ditemukan</p>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400">Mencari...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Tidak ada berita yang ditemukan untuk "{q}".</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map(n => <NewsCard key={n.id} news={n} />)}
        </div>
      )}
    </PublicLayout>
  )
}
