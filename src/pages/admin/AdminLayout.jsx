import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin1234'

const MENU = [
  { path: '/admin',               label: '📊 Dashboard',         end: true },
  { path: '/admin/news',          label: '📰 ข่าวสารกิจกรรม'               },
  { path: '/admin/announcements', label: '📢 ประชาสัมพันธ์'                },
  { path: '/admin/procurement',   label: '📦 จัดซื้อจัดจ้าง'               },
  { path: '/admin/staff',         label: '👥 บุคลากร'                      },
  { path: '/admin/travel',        label: '🗺️ สถานที่ท่องเที่ยว'            },
  { path: '/admin/products',      label: '🛍️ สินค้า OTOP'                 },
]

export default function AdminLayout() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('abt_admin') === '1')
  const [pw, setPw]         = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr]       = useState('')
  const navigate            = useNavigate()

  function login() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('abt_admin', '1')
      setAuthed(true)
    } else {
      setErr('รหัสผ่านไม่ถูกต้อง')
    }
  }

  function logout() {
    sessionStorage.removeItem('abt_admin')
    setAuthed(false)
    navigate('/admin')
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">

          {/* Top banner */}
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">
              🏛️
            </div>
            <h1 className="text-white text-lg font-bold text-center">ระบบจัดการเนื้อหา</h1>
            <p className="text-white/70 text-xs mt-1 text-center">องค์การบริหารส่วนตำบลแม่ใส</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="กรอกรหัสผ่าน"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setErr('') }}
                  onKeyDown={e => e.key === 'Enter' && login()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  tabIndex={-1}
                >
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
              {err && (
                <p className="text-red-500 text-xs mt-2">⚠️ {err}</p>
              )}
            </div>

            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-lg py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-56 bg-primary flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/20">
          <p className="text-white font-bold text-sm">🏛️ อบต.แม่ใส</p>
          <p className="text-white/60 text-xs mt-0.5">ระบบจัดการเนื้อหา</p>
        </div>
        <nav className="flex-1 py-2">
          {MENU.map(m => (
            <NavLink key={m.path} to={m.path} end={m.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-secondary text-white font-medium'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/20">
          <button onClick={logout}
            className="w-full text-xs text-white/60 hover:text-white text-left px-1 py-1 transition-colors">
            🚪 ออกจากระบบ
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}