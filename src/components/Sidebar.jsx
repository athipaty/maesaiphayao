import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSettings, getPages, getVisits, recordVisit } from '../services/api'

const ESERVICES = [
  { icon: '💬', label: 'แชท Messenger',                         href: 'https://m.me/MaesaiSAOPhayao' },
  { icon: '📘', label: 'Facebook Page',                          href: 'https://www.facebook.com/MaesaiSAOPhayao' },
  { icon: '📍', label: 'Traffy Fondue',                          href: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=traffyfondue' },
  { icon: '💭', label: 'ช่องทางรับฟังความคิดเห็น',             href: 'https://docs.google.com/forms/d/e/1FAIpQLSc9j_NSPrflDIV17OqlsPpy4P7efwYzEmVYZz1W4idy0Eg5ig/viewform' },
  { icon: '📊', label: 'แบบสำรวจความพึงพอใจ',                   href: 'https://docs.google.com/forms/d/e/1FAIpQLSeoxWq5gYJ4XWgmThe4PoKBdyNB5yVKNDPrvSdu87Jl_YmlTg/viewform' },
]

const DEFAULT_SETTINGS = {
  mayorName:     'นายสันติ สารเร็ว',
  mayorPosition: 'นายกองค์การบริหารส่วนตำบลแม่ใส',
  mayorPhone:    '089-757-7366',
  mayorImage:    '',
  logoImage:     '',
}

const PUBLIC_SERVICE_ITEMS = [
  { icon: '🌐', label: 'ยื่นคำร้อง',           to: '/eservice' },
  { icon: '📮', label: 'ร้องเรียน/ร้องทุกข์',  to: '/complaint' },
  { icon: '🚨', label: 'แจ้งเบาะแสทุจริต',    to: '/corruption' },
]
const PUBLIC_SERVICE_PATHS = PUBLIC_SERVICE_ITEMS.map(i => i.to)

export default function Sidebar({ onNavigate, mobile = false }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [menuPages, setMenuPages] = useState([])
  const [openSlug, setOpenSlug] = useState(null)
  const [visits, setVisits] = useState({ today: 0, week: 0, month: 0, year: 0, total: 0 })

  useEffect(() => {
    getSettings()
      .then(r => { if (r?.data) setSettings(prev => ({ ...prev, ...r.data })) })
      .catch(() => {})
    getPages()
      .then(r => setMenuPages((r?.data || []).filter(p => p.isActive)))
      .catch(() => {})

    if (!sessionStorage.getItem('abt_visited')) {
      sessionStorage.setItem('abt_visited', '1')
      recordVisit().then(r => setVisits(r.data)).catch(() => {})
    } else {
      getVisits().then(r => setVisits(r.data)).catch(() => {})
    }
  }, [])

  function getChildren(slug) {
    return menuPages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }
  function toggleSlug(slug) {
    setOpenSlug(prev => prev === slug ? null : slug)
  }

  /* ── Mobile full-screen drawer ─────────────────────────────────── */
  if (mobile) {
    const allItems = menuPages
      .filter(p => !p.parentSlug && !(p.isBuiltin && PUBLIC_SERVICE_PATHS.includes(p.path)))
      .sort((a, b) => a.order - b.order)

    return (
      <div className="flex flex-col h-full bg-gray-50">

        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary via-secondary to-accent text-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {settings.logoImage ? (
                <img src={settings.logoImage} alt="logo"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white/40 flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-xs font-bold text-center leading-tight flex-shrink-0">
                  อบต.<br/>แม่ใส
                </div>
              )}
              <div className="min-w-0">
                <div className="font-bold text-sm leading-snug truncate">องค์การบริหารส่วนตำบลแม่ใส</div>
                <div className="text-xs text-white/65 mt-0.5">อ.เมืองพะเยา · จ.พะเยา</div>
              </div>
            </div>
            <button
              onClick={onNavigate}
              aria-label="ปิดเมนู"
              className="ml-3 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors text-white text-base"
            >✕</button>
          </div>
        </div>

        {/* Mayor compact card */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 flex items-center gap-3 px-5 py-3">
          {settings.mayorImage ? (
            <img src={settings.mayorImage} alt={settings.mayorName}
              className="w-12 h-16 rounded object-cover object-top border-2 border-yellow-300 flex-shrink-0" />
          ) : (
            <div className="w-12 h-16 rounded bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl flex-shrink-0 border-2 border-yellow-300">👤</div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary leading-snug">{settings.mayorName}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{settings.mayorPosition}</p>
            {settings.mayorPhone && <p className="text-xs text-secondary mt-1 font-medium">{settings.mayorPhone}</p>}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Navigation */}
          <div className="mt-2">
            <p className="px-5 py-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">เมนูนำทาง</p>
            <div className="bg-white">
              {allItems.map(m => {
                const linkPath = m.isBuiltin ? m.path : `/page/${m.slug}`
                const children = getChildren(m.slug)
                const hasChildren = children.length > 0
                const isOpen = openSlug === m.slug
                return (
                  <div key={m.slug}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleSlug(m.slug)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 text-sm text-gray-700 hover:bg-blue-50/60 hover:text-primary active:bg-blue-50 transition-colors">
                        <span className="w-6 text-center text-base flex-shrink-0">{m.icon || '📄'}</span>
                        <span className="flex-1 text-left font-medium">{m.title}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                          <polyline points="2 4 6 8 10 4"/>
                        </svg>
                      </button>
                    ) : (
                      <NavLink to={linkPath} onClick={onNavigate}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 text-sm transition-colors ${
                            isActive ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700 hover:bg-blue-50/60 hover:text-primary'
                          }`
                        }>
                        <span className="w-6 text-center text-base flex-shrink-0">{m.icon || '📄'}</span>
                        <span className="flex-1 font-medium">{m.title}</span>
                        <span className="text-gray-300 text-sm flex-shrink-0">›</span>
                      </NavLink>
                    )}
                    {hasChildren && isOpen && (
                      <div className="bg-gray-50/80">
                        {children.map(c => (
                          <NavLink key={c.slug} to={c.isBuiltin ? c.path : `/page/${c.slug}`} onClick={onNavigate}
                            className={({ isActive }) =>
                              `flex items-center gap-3 pl-14 pr-5 py-3 border-b border-gray-100/80 text-sm transition-colors ${
                                isActive ? 'text-primary font-semibold bg-blue-50/50' : 'text-gray-500 hover:text-primary hover:bg-blue-50/30'
                              }`
                            }>
                            <span className="text-gray-300 text-xs mr-0.5">▸</span>
                            <span>{c.title}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              {/* Admin link — last item */}
              <a href="/admin" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 text-sm text-gray-700 hover:bg-blue-50/60 hover:text-primary transition-colors">
                <span className="w-6 text-center text-base flex-shrink-0">🔐</span>
                <span className="flex-1 font-medium">เข้าสู่ระบบ (Admin)</span>
                <span className="text-gray-300 text-sm flex-shrink-0">↗</span>
              </a>
            </div>
          </div>

          {/* E-Service */}
          <div className="mt-2">
            <p className="px-5 py-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">E-Service</p>
            <div className="bg-white">
              <div className="grid grid-cols-3 border-b border-gray-100">
                {PUBLIC_SERVICE_ITEMS.map((item, i) => (
                  <NavLink key={item.to} to={item.to} onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center gap-1.5 py-4 text-center transition-colors ${
                        i < 2 ? 'border-r border-gray-100' : ''
                      } ${isActive ? 'bg-pink-50 text-primary' : 'text-gray-600 hover:bg-pink-50 hover:text-primary'}`
                    }>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] font-medium leading-snug px-1">{item.label}</span>
                  </NavLink>
                ))}
              </div>
              {ESERVICES.map(e => (
                <a key={e.label} href={e.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 text-sm text-gray-700 hover:bg-pink-50 hover:text-primary transition-colors">
                  <span className="w-6 text-center text-base flex-shrink-0">{e.icon}</span>
                  <span className="flex-1">{e.label}</span>
                  <span className="text-gray-300 text-sm flex-shrink-0">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Visitor counter */}
          <div className="mt-2 mb-8">
            <p className="px-5 py-1.5 text-[10px] font-bold tracking-widest text-gray-400 uppercase">ผู้เข้าชมเว็บ</p>
            <div className="bg-white grid grid-cols-3 divide-x divide-gray-100">
              {[
                { label: 'วันนี้',   value: visits.today },
                { label: 'เดือนนี้', value: visits.month },
                { label: 'ทั้งหมด',  value: visits.total },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center py-4">
                  <span className="text-xl font-bold text-primary tabular-nums">{(value || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    )
  }

  /* ── Desktop sidebar ───────────────────────────────────────────── */
  const topLevel = menuPages
    .filter(p => !p.parentSlug && !p.showInNavbar && !(p.isBuiltin && PUBLIC_SERVICE_PATHS.includes(p.path)))
    .sort((a, b) => a.order - b.order)

  return (
    <aside className="w-[230px] flex-shrink-0 hidden lg:block">

      {/* Mayor card */}
      <div className="bg-white rounded-md shadow-sm mb-3 p-4 text-center">
        {settings.mayorImage ? (
          <img src={settings.mayorImage} alt={settings.mayorName}
            className="object-cover mx-auto mb-2 border-2 border-yellow-400 rounded"
            style={{ width: '100px', height: '150px', objectFit: 'cover', objectPosition: 'top center' }} />
        ) : (
          <div className="bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-3xl mx-auto mb-2 rounded border-2 border-yellow-400"
            style={{ width: '100px', height: '150px' }}>👤</div>
        )}
        <h4 className="text-sm font-semibold text-primary">{settings.mayorName}</h4>
        <p className="text-xs text-gray-500 mt-1">{settings.mayorPosition}</p>
        <p className="text-xs text-secondary mt-1">{settings.mayorPhone}</p>
      </div>

      {/* Main menu */}
      <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
        <div className="bg-secondary text-white px-3.5 py-2.5 text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-3.5 bg-accent rounded-sm inline-block"></span>
          เมนูหลัก
        </div>
        <ul>
          {topLevel.map(m => {
            const linkPath = m.isBuiltin ? m.path : `/page/${m.slug}`
            const children = getChildren(m.slug)
            const hasChildren = children.length > 0
            const isOpen = openSlug === m.slug
            return (
              <li key={m.slug}>
                {hasChildren ? (
                  <button onClick={() => toggleSlug(m.slug)}
                    className="w-full flex items-center gap-1.5 px-3.5 py-2.5 text-sm border-b border-gray-100 transition-colors text-gray-700 hover:bg-pink-50 hover:text-primary">
                    <span className="text-sm w-5 text-center">{m.icon}</span>
                    <span className="flex-1 text-left">{m.title}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                      <polyline points="2 4 6 8 10 4"/>
                    </svg>
                  </button>
                ) : (
                  <NavLink to={linkPath} onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3.5 py-2.5 text-sm border-b border-gray-100 transition-colors ${
                        isActive ? 'bg-pink-50 text-primary font-semibold' : 'text-gray-700 hover:bg-pink-50 hover:text-primary'
                      }`
                    }>
                    <span className="text-sm w-5 text-center">{m.icon}</span>
                    <span className="flex-1">{m.title}</span>
                  </NavLink>
                )}
                {hasChildren && isOpen && (
                  <ul>
                    {children.map(c => (
                      <NavLink key={c.slug} to={c.isBuiltin ? c.path : `/page/${c.slug}`} onClick={onNavigate}
                        className={({ isActive }) =>
                          `flex items-center gap-1.5 pl-8 pr-3.5 py-2 text-xs border-b border-gray-50 transition-colors ${
                            isActive ? 'bg-pink-50 text-primary font-semibold' : 'text-gray-500 hover:bg-pink-50 hover:text-primary'
                          }`
                        }>
                        <span className="text-gray-300">–</span>
                        <span>{c.title}</span>
                      </NavLink>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* บริการสาธารณะ + E-Service (combined) */}
      <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
        <div style={{
          background: 'linear-gradient(135deg, #be185d 0%, #ec4899 60%, #f9a8d4 100%)',
          padding: '14px 16px 10px',
        }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌐</span>
            <span className="text-white font-bold text-sm">E-Service</span>
          </div>
          <p className="text-white/70 text-xs">บริการออนไลน์สำหรับประชาชน</p>
        </div>
        <ul className="border-b border-gray-100">
          {PUBLIC_SERVICE_ITEMS.map(item => (
            <li key={item.to}>
              <NavLink to={item.to} onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2.5 text-sm border-b border-gray-100 transition-colors ${
                    isActive ? 'bg-pink-50 text-primary font-semibold' : 'text-gray-700 hover:bg-pink-50 hover:text-primary'
                  }`
                }>
                <span className="text-sm w-5 text-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul>
          {ESERVICES.map(e => (
            <li key={e.label}>
              <a href={e.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm border-b border-gray-100 transition-colors text-gray-700 hover:bg-pink-50 hover:text-primary">
                <span className="text-sm w-5 text-center">{e.icon}</span>
                <span className="flex-1">{e.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Visitor counter */}
      <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
        <div className="bg-secondary text-white px-3.5 py-2.5 text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-3.5 bg-accent rounded-sm inline-block"></span>
          จำนวนผู้เข้าชมเว็บ
        </div>
        <div className="p-3 space-y-1.5">
          {[
            { label: 'วันนี้',      value: visits.today, icon: '👁'  },
            { label: 'สัปดาห์นี้', value: visits.week,  icon: '📅' },
            { label: 'เดือนนี้',   value: visits.month, icon: '📆' },
            { label: 'ปีนี้',      value: visits.year,  icon: '🗓️' },
            { label: 'ทั้งหมด',    value: visits.total, icon: '📊' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center justify-between bg-pink-50 rounded px-3 py-1.5">
              <span className="text-xs text-gray-600 flex items-center gap-1.5">{icon} {label}</span>
              <span className="text-sm font-bold text-primary tabular-nums">{value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}
