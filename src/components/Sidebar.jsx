import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSettings } from '../services/api'

const MENU = [
  { label: 'งานแผนและงบประมาณ',       path: '/announcements' },
  { label: 'งานพัสดุการคลัง',          path: '/procurement' },
  { label: 'งานการเงินและบัญชี',        path: '/announcements' },
  { label: 'งานจัดเก็บรายได้',          path: '/announcements' },
  { label: 'งานพัฒนาสังคม',            path: '/announcements' },
  { label: 'ศูนย์ข้อมูลข่าวสาร',        path: '/announcements' },
  { label: 'งานการเจ้าหน้าที่',          path: '/staff' },
  { label: 'งานสาธารณสุขฯ',            path: '/news/health' },
  { label: 'งานป้องกันการทุจริต',        path: '/announcements' },
  { label: 'งานกิจการสภา',             path: '/news/council' },
  { label: 'งานป้องกันสาธารณภัย',       path: '/news/disaster' },
  { label: 'กองช่าง',                  path: '/news/engineering' },
  { label: 'งานตรวจสอบภายใน',          path: '/announcements' },
  { label: 'งานการศึกษา',              path: '/announcements' },
  { label: 'งานเลือกตั้ง',              path: '/announcements' },
]

const ESERVICES = [
  { icon: '🏛️', label: 'ศูนย์บริการออนไลน์', href: 'https://www.dla.go.th/oss.htm' },
  { icon: '💬', label: 'แชท Messenger',       href: 'https://m.me/MaesaiSAOPhayao' },
  { icon: '📘', label: 'Facebook Page',        href: 'https://www.facebook.com/MaesaiSAOPhayao' },
  { icon: '📍', label: 'Traffy Fondue',        href: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=traffyfondue' },
  { icon: '📋', label: 'แบบฟอร์มร้องเรียน',    href: '#' },
  { icon: '📝', label: 'แบบฟอร์มขอข้อมูล',    href: '#' },
  { icon: '🏠', label: 'ขออนุญาตก่อสร้าง',   href: '#' },
  { icon: '💧', label: 'แจ้งขอน้ำอุปโภค',     href: '#' },
]

const LINKS = [
  { label: 'กรมส่งเสริมการปกครอง', href: 'http://www.dla.go.th/' },
  { label: 'ระบบ E-GP',             href: 'http://www.gprocurement.go.th/' },
  { label: 'ทะเบียนราษฎร',          href: 'https://stat.bora.dopa.go.th/' },
  { label: 'ระบบสวัสดิการ',          href: 'https://welfare.dla.go.th/' },
  { label: 'เลือกตั้งท้องถิ่น',      href: 'https://ele.dla.go.th/' },
  { label: 'เมล์ กรมส่งเสริมฯ',     href: 'https://mail.dla.go.th/login' },
  { label: 'อุตุฯ เชียงใหม่',        href: 'https://cmmet.tmd.go.th/' },
  { label: 'LPA Dashboard',          href: '#' },
]

const DEFAULT_SETTINGS = {
  mayorName:     'นายสันติ สารเร็ว',
  mayorPosition: 'นายกองค์การบริหารส่วนตำบลแม่ใส',
  mayorPhone:    '089-7577366',
  mayorImage:    '',
}

export default function Sidebar() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    getSettings()
      .then(r => {
        if (r?.data) setSettings(prev => ({ ...prev, ...r.data }))
      })
      .catch(() => {})
  }, [])

  return (
    <aside className="w-[230px] flex-shrink-0 hidden lg:block">

      {/* President card */}
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
          {MENU.map(m => (
            <li key={m.label}>
              <Link to={m.path} className="sidebar-link">
                <span className="text-secondary">›</span> {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* E-Service */}
      <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
        <div className="bg-secondary text-white px-3.5 py-2.5 text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-3.5 bg-accent rounded-sm inline-block"></span>
          บริการ e-service
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-2.5">
          {ESERVICES.map(e => (
            <a key={e.label} href={e.href} target="_blank" rel="noreferrer"
              className="bg-blue-50 border border-blue-100 rounded p-2 text-center text-xs text-primary hover:bg-secondary hover:text-white hover:border-secondary transition-colors cursor-pointer">
              <div className="text-base mb-0.5">{e.icon}</div>
              {e.label}
            </a>
          ))}
        </div>
      </div>

      {/* ITA */}
      <div className="bg-white rounded-md shadow-sm mb-3 p-3 text-center">
        <a href="#" className="block bg-gradient-to-br from-primary to-secondary text-white rounded-md p-3 text-sm font-bold leading-snug hover:opacity-90 transition-opacity">
          ITA : อบต.แม่ใส<br />
          <span className="text-xs font-normal opacity-90">การประเมินคุณธรรมและความโปร่งใส</span>
        </a>
        <p className="text-xs text-gray-400 mt-1.5">คลิกเพื่อดูผลการประเมิน ITA</p>
      </div>

      {/* Related links */}
      <div className="bg-white rounded-md shadow-sm mb-3 overflow-hidden">
        <div className="bg-secondary text-white px-3.5 py-2.5 text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-3.5 bg-accent rounded-sm inline-block"></span>
          ลิงค์ที่เกี่ยวข้อง
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-2.5">
          {LINKS.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              className="bg-blue-50 border border-blue-100 rounded p-2 text-center text-xs text-primary font-medium hover:bg-secondary hover:text-white hover:border-secondary transition-colors flex items-center justify-center min-h-[44px]">
              {l.label}
            </a>
          ))}
        </div>
      </div>

    </aside>
  )
}