import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getSettings, getPages } from '../services/api'

const TOP_NAV = [
  { label: 'เกี่ยวกับ อบต.แม่ใส', path: '/about',      slug: 'builtin-about',     icon: '🏛️' },
  { label: 'บุคลากร/กิจการสภา',   path: '/staff',      slug: 'builtin-staff',     icon: '👥' },
  { label: 'e-Service',            path: '/eservice',   slug: null,                icon: '🌐' },
  { label: 'ร้องเรียน/ร้องทุกข์',              path: '/complaint',  slug: 'builtin-complaint',  icon: '📮' },
  { label: 'ร้องเรียนการทุจริตและประพฤติมิชอบ', path: '/corruption', slug: 'builtin-corruption', icon: '🚨' },
  { label: 'ติดต่อเรา',                         path: '/contact',    slug: 'builtin-contact',    icon: '📞' },
]

const DEFAULT_DEPTS = [
  { value: 'executive',   label: 'ผู้บริหาร' },
  { value: 'council',     label: 'สมาชิกสภา อบต.' },
  { value: 'office',      label: 'สำนักปลัด' },
  { value: 'finance',     label: 'กองคลัง' },
  { value: 'engineering', label: 'กองช่าง' },
  { value: 'health',      label: 'กองสาธารณสุขฯ' },
  { value: 'audit',       label: 'หน่วยตรวจสอบภายใน' },
]

export default function Navbar({ onMenuClick }) {
  const [logoImage, setLogoImage] = useState('')
  const [pages, setPages]         = useState([])
  const [depts, setDepts]         = useState(DEFAULT_DEPTS)
  const [openSlug, setOpenSlug]   = useState(null)
  const closeTimer                = useRef(null)

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage) setLogoImage(r.data.logoImage)
      if (r?.data?.departments?.length) setDepts(r.data.departments)
    }).catch(() => {})
    getPages().then(r => setPages((r?.data || []).filter(p => p.isActive))).catch(() => {})
  }, [])

  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  function openMenu(slug)  { clearTimeout(closeTimer.current); setOpenSlug(slug) }
  function closeMenu()     { closeTimer.current = setTimeout(() => setOpenSlug(null), 120) }

  return (
    <header>
      {/* Main header row */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="max-w-[1200px] mx-auto px-3 py-2.5 flex items-center justify-between gap-4">

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex-shrink-0 text-white text-2xl w-10 h-10 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
            onClick={onMenuClick}
            aria-label="เปิดเมนู"
          >
            ☰
          </button>

          <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
            {logoImage ? (
              <img src={logoImage} alt="logo" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs text-center leading-tight p-1 flex-shrink-0">
                อบต.<br />แม่ใส
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">องค์การบริหารส่วนตำบลแม่ใส</h1>
              <p className="text-xs opacity-85 hidden sm:block">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right text-xs opacity-90 hidden sm:block">
              <div>📞 0-5488-9909</div>
              <div>📧 saraban_06560115@dla.go.th</div>
            </div>
            <Link to="/admin"
              className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 rounded transition-colors whitespace-nowrap">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary nav row — desktop only */}
      <nav className="hidden lg:block bg-primary/90 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-3 flex items-center gap-1">
          {TOP_NAV.map(m => {
            const isStaff      = m.slug === 'builtin-staff'
            const pageChildren = m.slug ? getChildren(m.slug) : []
            // Staff: departments as dropdown; others: sub-pages from the API
            const dropItems    = isStaff
              ? depts.map(d => ({ key: d.value, icon: '👥', title: d.label, to: `/staff#dept-${d.value}` }))
              : pageChildren.map(c => ({ key: c.slug, icon: c.icon, title: c.title, to: c.isBuiltin ? c.path : `/page/${c.slug}` }))
            const hasDropdown  = dropItems.length > 0
            const isOpen       = openSlug === m.slug
            return (
              <div key={m.slug} className="relative flex-shrink-0"
                onMouseEnter={() => openMenu(m.slug)}
                onMouseLeave={closeMenu}>

                {hasDropdown ? (
                  <button
                    onClick={() => (isOpen ? setOpenSlug(null) : openMenu(m.slug))}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap text-white/80 hover:bg-white/10 hover:text-white">
                    {m.icon && <span>{m.icon}</span>}
                    {m.label}
                    <span className="text-[10px] transition-transform duration-150 inline-block"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                  </button>
                ) : (
                  <NavLink to={m.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-white/20 text-white border-b-2 border-accent'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }>
                    {m.icon && <span>{m.icon}</span>}
                    {m.label}
                  </NavLink>
                )}

                {hasDropdown && isOpen && (
                  <div className="absolute top-full left-0 z-50 mt-0 pt-1"
                    onMouseEnter={() => openMenu(m.slug)}
                    onMouseLeave={closeMenu}>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[220px] overflow-hidden">
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      {dropItems.map(item => (
                        <Link key={item.key} to={item.to}
                          onClick={() => setOpenSlug(null)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors group">
                          <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                          <span className="flex-1 text-xs font-medium">{item.title}</span>
                          <span className="text-gray-300 group-hover:text-secondary text-xs">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
