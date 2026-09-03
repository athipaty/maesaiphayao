import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef, forwardRef } from 'react'
import { getSettings, getPages } from '../services/api'

// Menu items that should open in a new tab instead of navigating the current one — currently
// just the standalone stock system, since it's a separate login-gated app outside this Layout.
const NEW_TAB_PATHS = ['/stock/electrical']

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

// Split out of Navbar so it can stay permanently fixed under the (possibly hidden) header
// instead of hiding along with it — see Layout.jsx for the `top` offset it's given. Forwards
// its ref to the root <nav> so Layout can measure its height for the content spacer.
const DesktopNav = forwardRef(function DesktopNav({ top }, ref) {
  const [pages, setPages] = useState([])
  const [depts, setDepts] = useState(DEFAULT_DEPTS)
  const [openSlug, setOpenSlug] = useState(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    getSettings().then(r => {
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
    <nav ref={ref} className="hidden lg:block fixed left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-[top] duration-300 ease-in-out"
      style={{ top }}>
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
              ) : NEW_TAB_PATHS.includes(linkPath) ? (
                <a href={linkPath} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-all whitespace-nowrap border-b-[3px] text-gray-600 border-transparent hover:text-primary hover:bg-gray-50 hover:border-gray-200">
                  {m.icon && <span className="text-sm">{m.icon}</span>}
                  {m.title}
                  <span className="text-gray-300 text-xs">↗</span>
                </a>
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
  )
})

export default DesktopNav
