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

export default function Navbar({ onMenuClick }) {
  const [logoImage, setLogoImage] = useState('')
  const [pages, setPages]         = useState([])
  const [depts, setDepts]         = useState(DEFAULT_DEPTS)
  const [openSlug, setOpenSlug]         = useState(null)
  const [mobileOpenSlug, setMobileOpenSlug] = useState(null)
  const closeTimer                      = useRef(null)

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

  // Mobile strip shows ALL top-level active pages (sidebar + navbar combined)
  const mobileItems = pages
    .filter(p => !p.parentSlug && p.isActive)
    .sort((a, b) => a.order - b.order)

  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  function openMenu(slug)  { clearTimeout(closeTimer.current); setOpenSlug(slug) }
  function closeMenu()     { closeTimer.current = setTimeout(() => setOpenSlug(null), 120) }

  return (
    <header className="sticky top-0 z-50 shadow-md">
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


      {/* Mobile nav strip — scrollable pills with dropdown support */}
      {navItems.length > 0 && (
        <nav className="lg:hidden bg-white border-b border-gray-200">
          <div className="overflow-x-auto">
            <div className="flex items-center gap-1 px-3 py-2 w-max">
              {navItems.map(m => {
                const isStaff      = m.slug === 'builtin-staff'
                const pageChildren = getChildren(m.slug)
                const dropItems    = isStaff
                  ? depts.map(d => ({ key: d.value, title: d.label, to: `/staff#dept-${d.value}` }))
                  : pageChildren.map(c => ({ key: c.slug, title: c.title, to: c.isBuiltin ? c.path : `/page/${c.slug}` }))
                const hasChildren  = dropItems.length > 0
                const isOpen       = mobileOpenSlug === m.slug

                if (hasChildren) {
                  return (
                    <button key={m.slug}
                      onClick={() => setMobileOpenSlug(isOpen ? null : m.slug)}
                      className={`flex items-center gap-1 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        isOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {m.icon ? `${m.icon} ` : ''}{m.title}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                        <polyline points="2 3 5 7 8 3"/>
                      </svg>
                    </button>
                  )
                }

                const linkPath = m.isBuiltin ? m.path : `/page/${m.slug}`
                return (
                  <NavLink key={m.slug} to={linkPath}
                    onClick={() => setMobileOpenSlug(null)}
                    className={({ isActive }) =>
                      `flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`
                    }>
                    {m.icon ? `${m.icon} ` : ''}{m.title}
                  </NavLink>
                )
              })}
            </div>
          </div>

          {/* Dropdown panel — full width below the strip */}
          {mobileOpenSlug && (() => {
            const openItem = navItems.find(m => m.slug === mobileOpenSlug)
            if (!openItem) return null
            const isStaff   = openItem.slug === 'builtin-staff'
            const dropItems = isStaff
              ? depts.map(d => ({ key: d.value, title: d.label, to: `/staff#dept-${d.value}` }))
              : getChildren(openItem.slug).map(c => ({ key: c.slug, title: c.title, to: c.isBuiltin ? c.path : `/page/${c.slug}` }))
            return (
              <div className="border-t border-gray-100 bg-gray-50 px-3 py-2 grid grid-cols-2 gap-1">
                {dropItems.map(item => (
                  <Link key={item.key} to={item.to}
                    onClick={() => setMobileOpenSlug(null)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-medium text-gray-700 bg-white hover:bg-blue-50 hover:text-primary rounded-lg transition-colors border border-gray-100">
                    <span>{item.title}</span>
                    <span className="text-gray-300 ml-2">›</span>
                  </Link>
                ))}
              </div>
            )
          })()}
        </nav>
      )}

      {/* Secondary nav row — desktop only */}
      <nav className="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-3 flex items-center">
          {navItems.map(m => {
            const linkPath     = m.isBuiltin ? m.path : `/page/${m.slug}`
            const isStaff      = m.slug === 'builtin-staff'
            const pageChildren = getChildren(m.slug)
            const dropItems    = isStaff
              ? depts.map(d => ({ key: d.value, title: d.label, to: `/staff#dept-${d.value}` }))
              : pageChildren.map(c => ({ key: c.slug, title: c.title, to: c.isBuiltin ? c.path : `/page/${c.slug}` }))
            const hasDropdown  = dropItems.length > 0
            const isOpen       = openSlug === m.slug
            return (
              <div key={m.slug} className="relative flex-shrink-0"
                onMouseEnter={() => openMenu(m.slug)}
                onMouseLeave={closeMenu}>

                {hasDropdown ? (
                  <button
                    onClick={() => (isOpen ? setOpenSlug(null) : openMenu(m.slug))}
                    className={`flex items-center gap-1 px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap border-b-2 ${
                      isOpen
                        ? 'text-primary border-primary'
                        : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/50'
                    }`}>
                    {m.title}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                      <polyline points="2 3 5 7 8 3"/>
                    </svg>
                  </button>
                ) : (
                  <NavLink to={linkPath}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap border-b-2 ${
                        isActive
                          ? 'text-primary border-primary'
                          : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/50'
                      }`
                    }>
                    {m.title}
                  </NavLink>
                )}

                {hasDropdown && isOpen && (
                  <div className="absolute top-full left-0 z-50 pt-1"
                    onMouseEnter={() => openMenu(m.slug ?? m.path)}
                    onMouseLeave={closeMenu}>
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[200px] overflow-hidden">
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      {dropItems.map(item => (
                        <Link key={item.key} to={item.to}
                          onClick={() => setOpenSlug(null)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors group">
                          {item.title}
                          <span className="text-gray-300 group-hover:text-primary ml-3">›</span>
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
