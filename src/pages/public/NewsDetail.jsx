import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import NewsCard from '../../components/ui/NewsCard'
import { getNewsDetail, getRelatedNews } from '../../lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function NewsDetail() {
  const { slug } = useParams()
  const [news, setNews] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    getNewsDetail(slug).then(({ data, error }) => {
      if (error || !data) { setNotFound(true); setLoading(false); return }
      setNews(data)
      getRelatedNews(data.category_id, data.id).then(({ data: rel }) => {
        setRelated(rel || [])
      })
      setLoading(false)
    })
  }, [slug])

  if (loading) return <PublicLayout><div className="flex items-center justify-center h-64 text-gray-400">Memuat...</div></PublicLayout>
  if (notFound) return (
    <PublicLayout>
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-navy mb-2">Berita tidak ditemukan</h2>
        <Link to="/" className="btn-red">Kembali ke Beranda</Link>
      </div>
    </PublicLayout>
  )

  const tags = news.tags ? news.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <PublicLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main article */}
        <article className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          {news.categories && (
            <Link to={`/category/${news.categories.slug}`} className="badge-cat mb-3 inline-block">
              {news.categories.name}
            </Link>
          )}
          <h1 className="text-navy font-extrabold text-2xl md:text-3xl leading-tight mb-4">{news.title}</h1>

          <div className="flex items-center gap-4 text-gray-500 text-sm mb-5 flex-wrap">
            {news.author_name && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {news.author_name.charAt(0)}
                </div>
                <span className="font-medium">{news.author_name}</span>
              </div>
            )}
            <span>•</span>
            <span>{news.published_at ? format(new Date(news.published_at), 'd MMMM yyyy', { locale: id }) : ''}</span>
            <span>•</span>
            <span>{news.views} views</span>
          </div>

          {news.thumbnail && (
            <img src={news.thumbnail} alt={news.title}
              className="w-full rounded-xl mb-6 max-h-96 object-cover shadow-sm" />
          )}

          {news.short_description && (
            <p className="text-gray-600 font-medium text-lg border-l-4 border-red pl-4 mb-6 italic">
              {news.short_description}
            </p>
          )}

          <div className="news-content text-gray-700" dangerouslySetInnerHTML={{ __html: news.content }} />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Source URL */}
          {news.source_url && (
            <div className="mt-4">
              <a href={news.source_url} target="_blank" rel="noopener noreferrer"
                className="text-sm text-red hover:underline">
                📎 Baca Sumber Asli
              </a>
            </div>
          )}

          {/* Author */}
          {news.author_name && (
            <div className="mt-8 p-4 bg-lightgray rounded-xl flex gap-4">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {news.author_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-navy">{news.author_name}</p>
                <p className="text-sm text-gray-500">Penulis berita</p>
              </div>
            </div>
          )}
        </article>

        {/* Sidebar - Related */}
        <aside className="bg-white rounded-xl p-4 shadow-sm h-fit">
          <h3 className="font-bold text-navy text-lg border-l-4 border-red pl-3 mb-4">Berita Terkait</h3>
          <div className="space-y-4">
            {related.length === 0 && <p className="text-gray-400 text-sm">Tidak ada berita terkait.</p>}
            {related.map(n => <NewsCard key={n.id} news={n} size="small" />)}
          </div>
        </aside>

      </div>
    </PublicLayout>
  )
}