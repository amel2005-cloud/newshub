import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../lib/supabase'

const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = () => getCategories().then(({ data }) => setCategories(data || []))
  useEffect(() => { fetch() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    await adminCreateCategory({ ...form, slug: slugify(form.name) + '-' + Date.now().toString().slice(-4) })
    setForm({ name: '', description: '' })
    setLoading(false)
    fetch()
  }

  const handleUpdate = async (cat) => {
    await adminUpdateCategory(cat.id, { name: editing.name, description: editing.description })
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus kategori ini?')) return
    await adminDeleteCategory(id)
    fetch()
  }

  return (
    <AdminLayout title="Kategori">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-navy mb-4">Tambah Kategori</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="label">Nama Kategori</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input" required />
            </div>
            <div>
              <label className="label">Deskripsi</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input" rows={2} />
            </div>
            <button type="submit" disabled={loading} className="btn-red w-full">
              {loading ? 'Menyimpan...' : 'Tambah Kategori'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-navy mb-4">Daftar Kategori</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="pb-2 font-medium">Nama</th>
                <th className="pb-2 font-medium">Slug</th>
                <th className="pb-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    {editing?.id === cat.id ? (
                      <input value={editing.name} onChange={e => setEditing(ed => ({ ...ed, name: e.target.value }))}
                        className="input text-sm py-1" />
                    ) : (
                      <span className="font-medium text-navy">{cat.name}</span>
                    )}
                  </td>
                  <td className="py-3 text-gray-400">{cat.slug}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {editing?.id === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat)}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Simpan</button>
                          <button onClick={() => setEditing(null)}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Batal</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditing({ id: cat.id, name: cat.name, description: cat.description })}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">Edit</button>
                          <button onClick={() => handleDelete(cat.id)}
                            className="text-xs bg-red/10 text-red px-2 py-1 rounded hover:bg-red/20">Hapus</button>
                        </>
                      )}
                    </div>
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
