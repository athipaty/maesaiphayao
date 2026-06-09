import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { loginAdmin, verifyAdmin } from '../../services/api'

const MENU = [
  { path: '/admin/pages',         label: 'จัดการเมนู/หน้า',    icon: '🗂️' },
  { path: '/admin/news',          label: 'ข่าวสารกิจกรรม',     icon: '📰' },
  { path: '/admin/announcements', label: 'ประชาสัมพันธ์',       icon: '📢' },
  { path: '/admin/procurement',       label: 'จัดซื้อจัดจ้าง',   icon: '📦' },
  { path: '/admin/procurement-plans', label: 'แผนการจัดหาพัสดุ', icon: '📋' },
  { path: '/admin/staff',         label: 'บุคลากร',             icon: '👥' },
  { path: '/admin/travel',        label: 'สถานที่ท่องเที่ยว',   icon: '🗺️' },
  { path: '/admin/products',      label: 'สินค้า OTOP',         icon: '🛍️' },
  { section: 'บริการสาธารณะ' },
  { path: '/admin/eservice',      label: 'คำร้อง e-Service',    icon: '🌐' },
  { path: '/admin/complaints',    label: 'เรื่องร้องเรียน',      icon: '📮' },
  { path: '/admin/banners',       label: 'แบนเนอร์ Footer',     icon: '🎨' },
  { path: '/admin/settings',      label: 'ตั้งค่าเว็บไซต์',    icon: '⚙️' },
]

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export default function AdminLayout() {
  const [authed, setAuthed]       = useState(false)
  const [checking, setChecking]   = useState(true)
  const [pw, setPw]               = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [err, setErr]             = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const navigate                  = useNavigate()
  const location                  = useLocation()

  useEffect(() => {
    const token = sessionStorage.getItem('abt_token')
    if (!token) { setChecking(false); return }
    verifyAdmin(token)
      .then(r => { if (r.data.valid) setAuthed(true) })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  async function login() {
    setErr('')
    try {
      const r = await loginAdmin(pw)
      sessionStorage.setItem('abt_token', r.data.token)
      setAuthed(true)
      navigate(location.pathname, { replace: true })
    } catch (err) {
      if (err?.response?.status === 401) {
        setErr('รหัสผ่านไม่ถูกต้อง')
      } else {
        setErr('ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่')
      }
    }
  }

  function logout() {
    sessionStorage.removeItem('abt_token')
    setAuthed(false)
    navigate('/admin')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-400 text-sm">กำลังตรวจสอบ...</div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">🏛️</div>
            <h1 className="text-white text-lg font-bold text-center">ระบบจัดการเนื้อหา</h1>
            <p className="text-white/70 text-xs mt-1 text-center">องค์การบริหารส่วนตำบลแม่ใส</p>
          </div>
          <div className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-pink-100 transition-all"
                  placeholder="รหัสผ่าน"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setErr('') }}
                  onKeyDown={e => e.key === 'Enter' && login()}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  tabIndex={-1}>
                  {showPw ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {err && <p className="text-red-500 text-xs mt-2">⚠️ {err}</p>}
            </div>
            <button onClick={login}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-lg py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside
        style={{ width: collapsed ? '64px' : '220px', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}
        className="bg-primary flex-shrink-0 flex flex-col overflow-hidden relative"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/20 min-h-[60px] overflow-hidden">
          <span className="text-xl flex-shrink-0">🏛️</span>
          <div style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
            <p className="text-white font-bold text-sm">อบต.แม่ใส</p>
            <p className="text-white/60 text-xs">ระบบจัดการเนื้อหา</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-2 overflow-hidden">
          {MENU.map((m, i) =>
            m.section ? (
              <div key={i} style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s' }}
                className="px-4 pt-2 pb-0.5 text-[10px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
                {m.section}
              </div>
            ) : (
              <NavLink key={m.path} to={m.path} end={m.end}
                title={collapsed ? m.label : ''}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-1.5 text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold border-r-4 border-accent'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }>
                <span className="text-base flex-shrink-0 w-5 text-center">{m.icon}</span>
                <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
                  {m.label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        {/* Bottom buttons */}
        <div className="border-t border-white/20 overflow-hidden">
          <a href="/"
            title={collapsed ? 'กลับหน้าหลัก' : ''}
            className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm">
            <span className="flex-shrink-0 w-5 text-center">🏠</span>
            <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
              กลับหน้าหลัก
            </span>
          </a>
          <button onClick={logout}
            title={collapsed ? 'ออกจากระบบ' : ''}
            className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm">
            <span className="flex-shrink-0 w-5 text-center">🚪</span>
            <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
              ออกจากระบบ
            </span>
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-7 z-50 w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200"
          title={collapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
