import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { getAuthors, adminCreateAuthor, adminUpdateAuthor, adminDeleteAuthor, uploadImage } from '../../lib/supabase'

export default function Authors() {
  const [authors, setAuthors] = useState([])
  const [form, setForm] = useState({ name: '', bio: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = () => getAuthors().then(({ data }) => setAuthors(data || []))
  useEffect(() => { fetch() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    let photoUrl = ''
    if (photoFile) {
      const { url } = await uploadImage(photoFile, 'authors')
      photoUrl = url || ''
    }
    await adminCreateAuthor({ ...form, photo: photoUrl })
    setForm({ name: '', bio: '' })
    setPhotoFile(null)
    setLoading(false)
    fetch()
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus penulis ini?')) return
    await adminDeleteAuthor(id)
    fetch()
  }

  return (
    <AdminLayout title="Penulis">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-navy mb-4">Tambah Penulis</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="label">Nama Penulis</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="input" rows={3} />
            </div>
            <div>
              <label className="label">Foto</label>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-red w-full">
              {loading ? 'Menyimpan...' : 'Tambah Penulis'}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-navy mb-4">Daftar Penulis</h2>
          <div className="divide-y">
            {authors.map(a => (
              <div key={a.id} className="py-3 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                  {a.photo ? <img src={a.photo} alt={a.name} className="w-full h-full object-cover" /> : a.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-navy">{a.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{a.bio}</p>
                </div>
                <button onClick={() => handleDelete(a.id)}
                  className="text-xs bg-red/10 text-red px-2 py-1 rounded hover:bg-red/20">Hapus</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
