import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminGetUsers, adminUpdateUserRole } from '../../lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    adminGetUsers().then(({ data }) => { setUsers(data || []); setLoading(false) })
  }
  useEffect(() => { fetch() }, [])

  const handleRoleChange = async (userId, role) => {
    await adminUpdateUserRole(userId, role)
    fetch()
  }

  return (
    <AdminLayout title="Pengguna">
      <div className="bg-white rounded-xl shadow-sm p-5">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="pb-2 font-medium">Nama</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Bergabung</th>
                <th className="pb-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-navy">{u.name}</td>
                  <td className="py-3 text-gray-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      u.role === 'admin' ? 'bg-red/10 text-red' : 'bg-gray-100 text-gray-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
                    {format(new Date(u.created_at), 'd MMM yyyy', { locale: id })}
                  </td>
                  <td className="py-3">
                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
