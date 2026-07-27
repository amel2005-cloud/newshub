import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../components/layout/AdminLayout'
import { adminGetAllNews, adminDeleteNews, getCategories } from '../../../lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function NewsList() {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const limit = 15

  const fetchNews = () => {
    setLoading(true)
    adminGetAllNews({ limit, offset: page * limit, status: status || undefined, categoryId: categoryId || undefined, search: search || undefined })
      .then(({ data, count }) => {
        setNews(data || [])
        setTotal(count || 0)
        setLoading(false)
      })
  }

  useEffect(() => { fetchNews() }, [page, status, categoryId])
  useEffect(() => { getCategories().then(({ data }) => setCategories(data || [])) }, [])

  const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchNews() }

  const handleDelete = async (id) => {
    if (!confirm('Hapus berita ini?')) return
    setDeleting(id)
    await adminDeleteNews(id)
    setDeleting(null)
    fetchNews()
  }

  return (
    <AdminLayout title="Manajemen Berita">
      <div className="bg-white rounded-xl shadow-sm p-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-end justify-between">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari judul..." className="input w-48" />
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(0) }} className="input w-36">
              <option value="">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(0) }} className="input w-40">
              <option value="">Semua Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="submit" className="btn-outline">Filter</button>
          </form>
          <Link to="/admin/news/create" className="btn-red">+ Tambah Berita</Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">Memuat...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="pb-2 font-medium">Judul</th>
                  <th className="pb-2 font-medium">Kategori</th>
                  <th className="pb-2 font-medium">Penulis</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Pilihan</th>
                  <th className="pb-2 font-medium">Tanggal</th>
                  <th className="pb-2 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {news.length === 0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">Tidak ada berita.</td></tr>
                ) : news.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="py-3 max-w-xs">
                      <span className="font-medium text-navy line-clamp-1">{n.title}</span>
                    </td>
                    <td className="py-3 text-gray-500">{n.categories?.name}</td>
                    <td className="py-3 text-gray-500">{n.author_name || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{n.status}</span>
                    </td>
                    <td className="py-3 text-gray-400">{n.featured ? '⭐ Featured' : '-'}</td>
                    <td className="py-3 text-gray-400 text-xs">
                      {format(new Date(n.created_at), 'd MMM yyyy', { locale: id })}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link to={`/admin/news/edit/${n.id}`}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">Edit</Link>
                        <button onClick={() => handleDelete(n.id)} disabled={deleting === n.id}
                          className="text-xs bg-red/10 text-red px-2 py-1 rounded hover:bg-red/20 disabled:opacity-50">
                          {deleting === n.id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Total: {total} berita</span>
          <div className="flex gap-2">
            {page > 0 && <button onClick={() => setPage(p => p - 1)} className="btn-outline py-1 px-3">←</button>}
            {(page + 1) * limit < total && <button onClick={() => setPage(p => p + 1)} className="btn-red py-1 px-3">→</button>}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
