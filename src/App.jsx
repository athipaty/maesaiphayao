import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SplashPage from './pages/SplashPage'

// Public pages
import HomePage        from './pages/HomePage'
import NewsListPage    from './pages/NewsListPage'
import NewsDetailPage  from './pages/NewsDetailPage'
import AnnouncePage    from './pages/AnnouncePage'
import ProcurementPage from './pages/ProcurementPage'
import StaffPage       from './pages/StaffPage'
import TravelPage      from './pages/TravelPage'
import ProductsPage    from './pages/ProductsPage'
import ContactPage        from './pages/ContactPage'
import GeneralInfoPage   from './pages/GeneralInfoPage'

// Admin pages
import AdminLayout      from './pages/admin/AdminLayout'
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminNews        from './pages/admin/AdminNews'
import AdminAnnounce    from './pages/admin/AdminAnnounce'
import AdminProcurement from './pages/admin/AdminProcurement'
import AdminStaff       from './pages/admin/AdminStaff'
import AdminTravel      from './pages/admin/AdminTravel'
import AdminProducts    from './pages/admin/AdminProducts'
import AdminSettings    from './pages/admin/AdminSettings'

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('splash_seen')
  )

  function handleEnter() {
    sessionStorage.setItem('splash_seen', '1')
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashPage onEnter={handleEnter} />}

      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/"                element={<HomePage />} />
          <Route path="/news"            element={<NewsListPage />} />
          <Route path="/news/:dept"      element={<NewsListPage />} />
          <Route path="/news/detail/:id" element={<NewsDetailPage />} />
          <Route path="/announcements"   element={<AnnouncePage />} />
          <Route path="/procurement"     element={<ProcurementPage />} />
          <Route path="/staff"           element={<StaffPage />} />
          <Route path="/travel"          element={<TravelPage />} />
          <Route path="/products"        element={<ProductsPage />} />
          <Route path="/contact"         element={<ContactPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index                   element={<AdminDashboard />} />
          <Route path="news"             element={<AdminNews />} />
          <Route path="announcements"    element={<AdminAnnounce />} />
          <Route path="procurement"      element={<AdminProcurement />} />
          <Route path="staff"            element={<AdminStaff />} />
          <Route path="travel"           element={<AdminTravel />} />
          <Route path="products"         element={<AdminProducts />} />
          <Route path="settings"         element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}