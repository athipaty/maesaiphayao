import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getSettings, getPages } from '../services/api'

const DEFAULT_DEPTS = [
  { value: 'executive',   label: 'ผู้บริหาร' },
  { value: 'council',     label: 'สมาชิกสภา อบต.' },
  { value: 'office',      label: 'สำนักปลัด' },
  { value: 'finance',     label: 'กองคลัง' },
  { value: 'engineering', label: 'กองช่าง' },
  { value: 'health',      label: 'กองสาธารณสุขฯ' },
  { value: 'audit',       label: 'หน่วยตรวจสอบภายใน' },
]

const ChevronDown = ({ open }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
    <polyline points="2 3 5 7 8 3"/>
  </svg>
)

export default function Navbar({ onMenuClick }) {
  const [logoImage, setLogoImage]           = useState('')
  const [pages, setPages]                   = useState([])
  const [depts, setDepts]                   = useState(DEFAULT_DEPTS)
  const [openSlug, setOpenSlug]             = useState(null)
  const [mobileOpenSlug, setMobileOpenSlug] = useState(null)
  const closeTimer                          = useRef(null)

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage) setLogoImage(r.data.logoImage)
      if (r?.data?.departments?.length) setDepts(r.data.departments)
    }).catch(() => {})
    getPages().then(r => setPages((r?.data || []).filter(p => p.isActive))).catch(() => {})
  }, [])

  const navItems = pages
    .filter(p => p.showInNavbar && !p.parentSlug && p.isActive)
    .sort((a, b) => a.order - b.order)

  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  function getDropItems(m) {
    if (m.slug === 'builtin-staff')
      return depts.map(d => ({ key: d.value, title: d.label, icon: '👥', to: `/staff#dept-${d.value}` }))
    return getChildren(m.slug).map(c => ({ key: c.slug, title: c.title, icon: c.icon || '', to: c.isBuiltin ? c.path : `/page/${c.slug}` }))
  }

  function openMenu(slug)  { clearTimeout(closeTimer.current); setOpenSlug(slug) }
  function closeMenu()     { closeTimer.current = setTimeout(() => setOpenSlug(null), 120) }

  return (
    <header className="sticky top-0 z-50">

      {/* ── Main header row ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-md">
        <div className="max-w-[1200px] mx-auto px-3 py-2 flex items-center justify-between gap-3">

          {/* Hamburger */}
          <button
            className="lg:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors text-xl"
            onClick={onMenuClick}
            aria-label="เปิดเมนู"
          >
            ☰
          </button>

          {/* Logo + title */}
          <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
            {logoImage ? (
              <img src={logoImage} alt="logo"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-white/40 shadow" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-white font-bold text-[11px] text-center leading-tight p-1 flex-shrink-0 backdrop-blur-sm">
                อบต.<br />แม่ใส
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight tracking-wide drop-shadow-sm">
                องค์การบริหารส่วนตำบลแม่ใส
              </h1>
              <p className="text-[11px] text-white/70 hidden sm:block truncate">
                อ.เมืองพะเยา จ.พะเยา · โทร 0-5488-9909
              </p>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right text-[11px] text-white/80 hidden md:block leading-relaxed">
              <div>📞 0-5488-9909</div>
              <div>📧 saraban_06560115@dla.go.th</div>
            </div>
            <Link to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/30 rounded-lg transition-colors whitespace-nowrap backdrop-blur-sm">
              🔐 <span className="hidden sm:inline">เข้าสู่ระบบ</span><span className="sm:hidden">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile nav strip ────────────────────────────────────────── */}
      {navItems.length > 0 && (
        <div className="lg:hidden bg-slate-50 border-b border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <div className="flex items-center gap-1.5 px-3 py-2 w-max">
              {navItems.map(m => {
                const dropItems   = getDropItems(m)
                const hasChildren = dropItems.length > 0
                const isOpen      = mobileOpenSlug === m.slug

                if (hasChildren) {
                  return (
                    <button key={m.slug}
                      onClick={() => setMobileOpenSlug(isOpen ? null : m.slug)}
                      className={`flex items-center gap-1 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border shadow-sm ${
                        isOpen
                          ? 'bg-primary text-white border-primary shadow-primary/20'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary'
                      }`}>
                      {m.icon && <span className="text-sm">{m.icon}</span>}
                      {m.title}
                      <ChevronDown open={isOpen} />
                    </button>
                  )
                }

                const linkPath = m.isBuiltin ? m.path : `/page/${m.slug}`
                return (
                  <NavLink key={m.slug} to={linkPath}
                    onClick={() => setMobileOpenSlug(null)}
                    className={({ isActive }) =>
                      `flex items-center gap-1 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border shadow-sm ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-primary/20'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary'
                      }`
                    }>
                    {m.icon && <span className="text-sm">{m.icon}</span>}
                    {m.title}
                  </NavLink>
                )
              })}
            </div>
          </div>

          {/* Mobile dropdown panel */}
          {mobileOpenSlug && (() => {
            const openItem = navItems.find(m => m.slug === mobileOpenSlug)
            if (!openItem) return null
            const dropItems = getDropItems(openItem)
            return (
              <div className="border-t border-gray-200 bg-white shadow-inner px-3 py-3">
                <div className="grid grid-cols-2 gap-1.5">
                  {dropItems.map(item => (
                    <Link key={item.key} to={item.to}
                      onClick={() => setMobileOpenSlug(null)}
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-pink-50 hover:text-primary rounded-xl transition-colors border border-gray-100 hover:border-blue-200 group">
                      {item.icon && <span className="text-base flex-shrink-0">{item.icon}</span>}
                      <span className="flex-1 leading-snug">{item.title}</span>
                      <span className="text-gray-300 group-hover:text-primary text-sm">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── Desktop secondary nav ────────────────────────────────────── */}
      <nav className="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-3 flex items-center">
          {navItems.map(m => {
            const linkPath    = m.isBuiltin ? m.path : `/page/${m.slug}`
            const dropItems   = getDropItems(m)
            const hasDropdown = dropItems.length > 0
            const isOpen      = openSlug === m.slug

            return (
              <div key={m.slug} className="relative flex-shrink-0"
                onMouseEnter={() => openMenu(m.slug)}
                onMouseLeave={closeMenu}>

                {hasDropdown ? (
                  <button
                    onClick={() => (isOpen ? setOpenSlug(null) : openMenu(m.slug))}
                    className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap border-b-[3px] ${
                      isOpen
                        ? 'text-primary border-accent bg-blue-50/60'
                        : 'text-gray-600 border-transparent hover:text-primary hover:bg-gray-50 hover:border-gray-200'
                    }`}>
                    {m.icon && <span className="text-sm">{m.icon}</span>}
                    {m.title}
                    <ChevronDown open={isOpen} />
                  </button>
                ) : (
                  <NavLink to={linkPath}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap border-b-[3px] ${
                        isActive
                          ? 'text-primary border-accent bg-blue-50/60'
                          : 'text-gray-600 border-transparent hover:text-primary hover:bg-gray-50 hover:border-gray-200'
                      }`
                    }>
                    {m.icon && <span className="text-sm">{m.icon}</span>}
                    {m.title}
                  </NavLink>
                )}

                {hasDropdown && isOpen && (
                  <div className="absolute top-full left-0 z-50 pt-1"
                    onMouseEnter={() => openMenu(m.slug)}
                    onMouseLeave={closeMenu}>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[210px] overflow-hidden">
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      {dropItems.map(item => (
                        <Link key={item.key} to={item.to}
                          onClick={() => setOpenSlug(null)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-pink-50 hover:text-primary transition-colors group">
                          {item.icon && <span className="text-base flex-shrink-0">{item.icon}</span>}
                          <span className="flex-1">{item.title}</span>
                          <span className="text-gray-300 group-hover:text-primary">›</span>
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
