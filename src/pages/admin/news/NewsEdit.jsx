import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NewsForm from './NewsForm'
import AdminLayout from '../../../components/layout/AdminLayout'
import { adminGetNewsById } from '../../../lib/supabase'

export default function NewsEdit() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetNewsById(id).then(({ data }) => {
      setData(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <AdminLayout title="Edit Berita"><div className="text-gray-400 text-center py-10">Memuat...</div></AdminLayout>
  if (!data) return <AdminLayout title="Edit Berita"><div className="text-red text-center py-10">Berita tidak ditemukan.</div></AdminLayout>

  return <NewsForm initialData={data} newsId={id} />
}
