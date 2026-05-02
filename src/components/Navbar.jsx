import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSettings } from '../services/api'

const DEPT_LINKS = [
  { label: 'สำนักปลัด',                  value: 'office' },
  { label: 'กองคลัง',                    value: 'finance' },
  { label: 'กองช่าง',                    value: 'engineering' },
  { label: 'กองสาธารณสุขฯ',              value: 'health' },
  { label: 'กิจการสภา',                  value: 'council' },
  { label: 'ป้องกันและบรรเทาสาธารณภัย', value: 'disaster' },
  { label: 'ศูนย์พัฒนาเด็กเล็ก',         value: 'childdev' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [infoOpen, setInfoOpen]     = useState(false)
  const [logoImage, setLogoImage]   = useState('')

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage) setLogoImage(r.data.logoImage)
    }).catch(() => {})
  }, [])

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="max-w-[1200px] mx-auto px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoImage ? (
              <img src={logoImage} alt="logo"
                className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs text-center leading-tight p-1 flex-shrink-0">
                อบต.<br />แม่ใส
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold leading-tight">องค์การบริหารส่วนตำบลแม่ใส</h1>
              <p className="text-xs opacity-85">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
            </div>
          </div>
          <div className="text-right text-xs opacity-90 hidden sm:block">
            <div>📞 0-5488-9909</div>
            <div>📧 saraban_06560115@dla.go.th</div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-primary">
        <div className="max-w-[1200px] mx-auto flex items-center">

          {/* Desktop links */}
          <div className="hidden md:flex">
            <NavLink to="/" className={({ isActive }) =>
              `block px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors ${isActive ? 'bg-secondary' : ''}`
            }>หน้าหลัก</NavLink>

            {/* ข้อมูลทั่วไป dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors">
                ข้อมูลทั่วไป <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg min-w-[260px] z-50 border-t-2 border-secondary">
                <NavLink to="/general-info" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">› ข้อมูลทั่วไป</NavLink>
                <NavLink to="/mission" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">› ภารกิจ อำนาจหน้าที่</NavLink>
                <NavLink to="/local-wisdom" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">› ภูมิปัญญาท้องถิ่น</NavLink>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary">› ประวัติความเป็นมา</a>
              </div>
            </div>

            {/* News dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors">
                ข่าวสารกิจกรรม <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg min-w-[220px] z-50 border-t-2 border-secondary">
                {DEPT_LINKS.map(d => (
                  <Link key={d.value} to={`/news/${d.value}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>

            <NavLink to="/announcements" className={({ isActive }) =>
              `block px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors ${isActive ? 'bg-secondary' : ''}`
            }>ประชาสัมพันธ์</NavLink>

            <NavLink to="/procurement" className={({ isActive }) =>
              `block px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors ${isActive ? 'bg-secondary' : ''}`
            }>จัดซื้อจัดจ้าง</NavLink>

            {/* Staff dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors">
                บุคลากร <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg min-w-[240px] z-50 border-t-2 border-secondary">
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">สำนักปลัด</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">กองคลัง</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">กองช่าง</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">ทำเนียบผู้บริหาร</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">กองสาธารณสุขและสิ่งแวดล้อม</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">สมาชิกสภาองค์การบริหารส่วนตำบล</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">หน่วยตรวจสอบภายใน</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100">แผนผังโครงสร้างส่วนราชการ</NavLink>
                <NavLink to="/staff" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary">หัวหน้าส่วนราชการ</NavLink>
              </div>
            </div>

            <NavLink to="/travel" className={({ isActive }) =>
              `block px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors ${isActive ? 'bg-secondary' : ''}`
            }>ท่องเที่ยว</NavLink>

            <NavLink to="/products" className={({ isActive }) =>
              `block px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors ${isActive ? 'bg-secondary' : ''}`
            }>สินค้า OTOP</NavLink>

            <NavLink to="/contact" className={({ isActive }) =>
              `block px-4 py-2.5 text-white text-sm font-medium hover:bg-secondary transition-colors ${isActive ? 'bg-secondary' : ''}`
            }>ติดต่อเรา</NavLink>
          </div>

          <Link to="/admin" className="ml-auto px-4 py-2.5 text-white text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors">
            เข้าสู่ระบบ
          </Link>

          {/* Mobile burger */}
          <button className="md:hidden text-white px-3 py-2 text-xl" onClick={() => setMobileOpen(v => !v)}>
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-primary border-t border-white/20 pb-2">
            <Link to="/" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">หน้าหลัก</Link>

            {/* ข้อมูลทั่วไป toggle */}
            <div className="border-b border-white/10">
              <button onClick={() => setInfoOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>ข้อมูลทั่วไป</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: infoOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
              </button>
              {infoOpen && (
                <div className="bg-white/10">
                  <Link to="/general-info" onClick={() => { setMobileOpen(false); setInfoOpen(false) }}
                    className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ข้อมูลทั่วไป</Link>
                  <Link to="/mission" onClick={() => { setMobileOpen(false); setInfoOpen(false) }}
                    className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ภารกิจ อำนาจหน้าที่</Link>
                  <Link to="/local-wisdom" onClick={() => { setMobileOpen(false); setInfoOpen(false) }}
                    className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ภูมิปัญญาท้องถิ่น</Link>
                  <a href="#" onClick={() => { setMobileOpen(false); setInfoOpen(false) }}
                    className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ประวัติความเป็นมา</a>
                </div>
              )}
            </div>

            <Link to="/news" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">ข่าวสารกิจกรรม</Link>
            <Link to="/announcements" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">ประชาสัมพันธ์</Link>
            <Link to="/procurement" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">จัดซื้อจัดจ้าง</Link>
            <Link to="/staff" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">บุคลากร</Link>
            <Link to="/travel" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">ท่องเที่ยว</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm border-b border-white/10">สินค้า OTOP</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-white text-sm">ติดต่อเรา</Link>
          </div>
        )}
      </nav>
    </>
  )
}