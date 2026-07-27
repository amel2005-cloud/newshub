import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import NewsCard from '../../components/ui/NewsCard'
import { getPublishedNews, getCategories } from '../../lib/supabase'

export default function Category() {
  const { slug } = useParams()
  const [news, setNews] = useState([])
  const [category, setCategory] = useState(null)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const limit = 9

  useEffect(() => {
    setLoading(true)
    getCategories().then(({ data }) => {
      const cat = data?.find(c => c.slug === slug)
      setCategory(cat)
    })
    getPublishedNews({ limit, offset: page * limit, categorySlug: slug }).then(({ data, count }) => {
      setNews(data || [])
      setTotal(count || 0)
      setLoading(false)
    })
  }, [slug, page])

  return (
    <PublicLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy border-l-4 border-red pl-3">
          {category?.name || 'Kategori'}
        </h1>
        {category?.description && <p className="text-gray-500 text-sm mt-1 ml-4">{category.description}</p>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400">Memuat...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Belum ada berita di kategori ini.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {news.map(n => <NewsCard key={n.id} news={n} />)}
          </div>
          <div className="flex justify-center gap-2">
            {page > 0 && (
              <button onClick={() => setPage(p => p - 1)} className="btn-outline">← Sebelumnya</button>
            )}
            {(page + 1) * limit < total && (
              <button onClick={() => setPage(p => p + 1)} className="btn-red">Selanjutnya →</button>
            )}
          </div>
        </>
      )}
    </PublicLayout>
  )
}
