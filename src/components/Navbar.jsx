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
  const [openSlug, setOpenSlug]   = useState(null)
  const [scrolled, setScrolled]   = useState(false)
  const closeTimer                = useRef(null)

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage)        setLogoImage(r.data.logoImage)
      if (r?.data?.departments?.length) setDepts(r.data.departments)
    }).catch(() => {})
    getPages().then(r => setPages((r?.data || []).filter(p => p.isActive))).catch(() => {})
  }, [])

  /* Shadow nav on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = pages
    .filter(p => p.showInNavbar && !p.parentSlug && p.isActive)
    .sort((a, b) => a.order - b.order)

  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  function openMenu(slug)  { clearTimeout(closeTimer.current); setOpenSlug(slug) }
  function closeMenu()     { closeTimer.current = setTimeout(() => setOpenSlug(null), 120) }

  return (
    <header className={`navbar-sticky${scrolled ? ' scrolled' : ''}`}>

      {/* ── Top header bar ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="max-w-[1200px] mx-auto px-3 py-2.5 flex items-center justify-between gap-4">

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex-shrink-0 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
            onClick={onMenuClick}
            aria-label="เปิดเมนู"
          >
            ☰
          </button>

          {/* Logo + title */}
          <Link to="/" className="flex items-center gap-3 min-w-0 flex-1 group">
            {logoImage ? (
              <img src={logoImage} alt="logo"
                className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-white/40 group-hover:ring-white/70 transition-all" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs text-center leading-tight p-1 flex-shrink-0 ring-2 ring-white/40 group-hover:ring-white/70 transition-all">
                อบต.<br />แม่ใส
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight group-hover:text-yellow-200 transition-colors">
                องค์การบริหารส่วนตำบลแม่ใส
              </h1>
              <p className="text-xs opacity-80 hidden sm:block tracking-wide">
                ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000
              </p>
            </div>
          </Link>

          {/* Contact + login */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right text-xs opacity-90 hidden sm:block leading-relaxed">
              <div className="flex items-center justify-end gap-1">
                <span>📞</span>
                <span>0-5488-9909</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span>📧</span>
                <span>saraban_06560115@dla.go.th</span>
              </div>
            </div>
            <Link to="/admin"
              className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg shadow-sm transition-colors whitespace-nowrap">
              🔐 เข้าสู่ระบบ
            </Link>
          </div>

        </div>
      </div>

      {/* ── Desktop nav row ──────────────────────────────────── */}
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
                    className={`flex items-center gap-1 px-4 py-3 text-[13px] font-semibold transition-all whitespace-nowrap border-b-2 ${
                      isOpen
                        ? 'text-primary border-primary bg-blue-50/60'
                        : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/40 hover:bg-blue-50/40'
                    }`}>
                    {m.title}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
                      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                      <polyline points="2 3 5 7 8 3"/>
                    </svg>
                  </button>
                ) : (
                  <NavLink to={linkPath}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-[13px] font-semibold transition-all whitespace-nowrap border-b-2 ${
                        isActive
                          ? 'text-primary border-primary bg-blue-50/60'
                          : 'text-gray-600 border-transparent hover:text-primary hover:border-primary/40 hover:bg-blue-50/40'
                      }`
                    }>
                    {m.title}
                  </NavLink>
                )}

                {/* Dropdown panel */}
                {hasDropdown && isOpen && (
                  <div className="absolute top-full left-0 z-50 pt-1.5"
                    onMouseEnter={() => openMenu(m.slug)}
                    onMouseLeave={closeMenu}>
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 min-w-[210px] overflow-hidden">
                      {/* Arrow tip */}
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 pointer-events-none" />
                      {dropItems.map((item, idx) => (
                        <Link key={item.key} to={item.to}
                          onClick={() => setOpenSlug(null)}
                          className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors group">
                          <span>{item.title}</span>
                          <span className="text-gray-300 group-hover:text-secondary ml-4 text-base leading-none">›</span>
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
