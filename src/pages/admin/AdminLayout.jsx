import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin1234'

const MENU = [
  { path: '/admin',              label: '📊 Dashboard',        end: true },
  { path: '/admin/news',         label: '📰 ข่าวสารกิจกรรม'              },
  { path: '/admin/announcements',label: '📢 ประชาสัมพันธ์'               },
  { path: '/admin/procurement',  label: '📦 จัดซื้อจัดจ้าง'              },
  { path: '/admin/staff',        label: '👥 บุคลากร'                     },
  { path: '/admin/travel',       label: '🗺️ สถานที่ท่องเที่ยว'           },
  { path: '/admin/products',     label: '🛍️ สินค้า OTOP'                },
]

export default function AdminLayout() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('abt_admin') === '1')
  const [pw, setPw]         = useState('')
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl mx-auto mb-3">
              🏛️
            </div>
            <h1 className="text-base font-bold text-primary">ระบบจัดการเนื้อหา</h1>
            <p className="text-xs text-gray-400 mt-1">องค์การบริหารส่วนตำบลแม่ใส</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                className="form-input"
                placeholder="กรอกรหัสผ่าน"
                value={pw}
                onChange={e => { setPw(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && login()}
              />
              {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
            </div>
            <button onClick={login} className="btn-primary w-full text-center">
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

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}