import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public pages
import Home from './pages/public/Home'
import NewsDetail from './pages/public/NewsDetail'
import Category from './pages/public/Category'
import Search from './pages/public/Search'
import NewsArchive from './pages/public/NewsArchive'

// Auth
import Login from './pages/auth/Login'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import NewsList from './pages/admin/news/NewsList'
import NewsCreate from './pages/admin/news/NewsCreate'
import NewsEdit from './pages/admin/news/NewsEdit'
import Categories from './pages/admin/Categories'
import Users from './pages/admin/Users'

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user || !isAdmin) return <Navigate to="/login" />
  return children
}

const GuestRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (user && isAdmin) return <Navigate to="/admin/dashboard" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/berita" element={<NewsArchive />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/search" element={<Search />} />

          {/* Auth */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/news" element={<AdminRoute><NewsList /></AdminRoute>} />
          <Route path="/admin/news/create" element={<AdminRoute><NewsCreate /></AdminRoute>} />
          <Route path="/admin/news/edit/:id" element={<AdminRoute><NewsEdit /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
