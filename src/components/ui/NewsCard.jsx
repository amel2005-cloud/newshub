import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function NewsCard({ news, size = 'normal' }) {
  const imgSrc = news.thumbnail || `https://placehold.co/600x350/0b2545/ffffff?text=NewsHub`
  const date = news.published_at ? format(new Date(news.published_at), 'd MMM yyyy', { locale: id }) : ''

  if (size === 'small') {
    return (
      <div className="flex gap-3 items-start">
        <img src={imgSrc} alt={news.title} className="w-20 h-16 object-cover rounded flex-shrink-0" />
        <div>
          <Link to={`/news/${news.slug}`} className="text-sm font-semibold text-navy hover:text-red transition-colors line-clamp-2">
            {news.title}
          </Link>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-news">
      <Link to={`/news/${news.slug}`}>
        <img src={imgSrc} alt={news.title} className="w-full h-44 object-cover" />
      </Link>
      <div className="p-4">
        {news.categories && (
          <Link to={`/category/${news.categories.slug}`} className="badge-cat mb-2 inline-block">
            {news.categories.name}
          </Link>
        )}
        <Link to={`/news/${news.slug}`}>
          <h3 className="font-bold text-navy hover:text-red transition-colors line-clamp-2 text-sm leading-snug mb-2">
            {news.title}
          </h3>
        </Link>
        {news.short_description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{news.short_description}</p>
        )}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{news.authors?.name}</span>
          <span>{date}</span>
        </div>
        <Link to={`/news/${news.slug}`}
          className="mt-3 inline-block text-xs bg-red text-white px-3 py-1.5 rounded hover:bg-red-dark transition-colors">
          Baca Selengkapnya
        </Link>
      </div>
    </div>
  )
}
