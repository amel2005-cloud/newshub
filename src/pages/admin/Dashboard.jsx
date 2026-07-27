import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { getDashboardStats, adminGetAllNews } from '../../lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color}`}>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-3xl font-extrabold text-navy mt-1">{value}</p>
  </div>
)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentNews, setRecentNews] = useState([])

  useEffect(() => {
    getDashboardStats().then(setStats)
    adminGetAllNews({ limit: 8 }).then(({ data }) => setRecentNews(data || []))
  }, [])

  const statCards = stats ? [
    { label: 'Total Berita', value: stats.total_news, color: 'border-navy' },
    { label: 'Published', value: stats.published_news, color: 'border-green-500' },
    { label: 'Draft', value: stats.draft_news, color: 'border-yellow-500' },
    { label: 'Kategori', value: stats.total_categories, color: 'border-blue-500' },
    { label: 'Penulis', value: stats.total_authors, color: 'border-purple-500' },
    { label: 'Pengguna', value: stats.total_users, color: 'border-red' },
  ] : []

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-navy">Berita Terbaru</h2>
          <Link to="/admin/news" className="text-sm text-red hover:underline">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="pb-2 font-medium">Judul</th>
                <th className="pb-2 font-medium">Kategori</th>
                <th className="pb-2 font-medium">Penulis</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Tanggal</th>
                <th className="pb-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentNews.map(n => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="py-3 max-w-xs">
                    <span className="line-clamp-1 font-medium text-navy">{n.title}</span>
                  </td>
                  <td className="py-3 text-gray-500">{n.categories?.name}</td>
                  <td className="py-3 text-gray-500">{n.authors?.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
                    {format(new Date(n.created_at), 'd MMM yyyy', { locale: id })}
                  </td>
                  <td className="py-3">
                    <Link to={`/admin/news/edit/${n.id}`} className="text-red text-xs hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
