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

  const topLevel = menuPages
    .filter(p => !p.parentSlug && !p.showInNavbar && !(p.isBuiltin && PUBLIC_SERVICE_PATHS.includes(p.path)))
    .sort((a, b) => a.order - b.order)
  function getChildren(slug) {
    return menuPages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }
  function toggleSlug(slug) {
    setOpenSlug(prev => prev === slug ? null : slug)
  }

  return (
    <aside className={`w-[230px] flex-shrink-0 ${mobile ? 'block' : 'hidden lg:block'}`}>

      {/* Mobile header with close button */}
      {mobile && (
        <div className="flex items-center justify-between bg-primary text-white px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">เมนูนำทาง</span>
          </div>
          <button
            onClick={onNavigate}
            aria-label="ปิดเมนู"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/30 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

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
          background: 'linear-gradient(135deg, #831843 0%, #be185d 60%, #ec4899 100%)',
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
