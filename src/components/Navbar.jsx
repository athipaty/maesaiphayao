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

const NAV_ROW1 = [
  { label: 'หน้าแรก', path: '/' },
]

function DropItem({ to, children, onClick }) {
  return (
    <NavLink to={to} onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary border-b border-gray-100 last:border-0">
      › {children}
    </NavLink>
  )
}

function NavBtn({ children, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 text-white text-xs font-medium hover:bg-white/20 transition-colors whitespace-nowrap">
      {children} <span className="opacity-70 text-[10px]">▾</span>
    </button>
  )
}

function NavDirect({ to, children }) {
  return (
    <NavLink to={to}
      className={({ isActive }) =>
        `block px-3 py-2 text-white text-xs font-medium hover:bg-white/20 transition-colors whitespace-nowrap ${isActive ? 'bg-white/20' : ''}`
      }>
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDrop, setOpenDrop]     = useState(null)
  const [logoImage, setLogoImage]   = useState('')
  const [mobileExpanded, setMobileExpanded] = useState(null)

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage) setLogoImage(r.data.logoImage)
    }).catch(() => {})
  }, [])

  function toggleDrop(name) {
    setOpenDrop(v => v === name ? null : name)
  }

  function closeMobile() {
    setMobileOpen(false)
    setMobileExpanded(null)
  }

  function toggleMobileSection(name) {
    setMobileExpanded(v => v === name ? null : name)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
        <div className="max-w-[1200px] mx-auto px-3 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {logoImage ? (
              <img src={logoImage} alt="logo" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs text-center leading-tight p-1 flex-shrink-0">
                อบต.<br />แม่ใส
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold leading-tight">องค์การบริหารส่วนตำบลแม่ใส</h1>
              <p className="text-xs opacity-85">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
            </div>
          </Link>
          <div className="text-right text-xs opacity-90 hidden sm:block">
            <div>📞 0-5488-9909</div>
            <div>📧 saraban_06560115@dla.go.th</div>
          </div>
        </div>
      </header>

      {/* Nav row 1 */}
      <nav className="bg-primary" onClick={() => setOpenDrop(null)}>
        <div className="max-w-[1200px] mx-auto flex items-center">

          {/* Desktop */}
          <div className="hidden md:flex flex-wrap w-full" onClick={e => e.stopPropagation()}>

            <NavDirect to="/">หน้าแรก</NavDirect>

            {/* เกี่ยวกับ อบต. */}
            <div className="relative">
              <NavBtn onClick={() => toggleDrop('about')}>เกี่ยวกับ อบต.</NavBtn>
              {openDrop === 'about' && (
                <div className="absolute top-full left-0 bg-white shadow-lg min-w-[240px] z-50 border-t-2 border-secondary">
                  <DropItem to="/about" onClick={() => setOpenDrop(null)}>ข้อมูลพื้นฐาน</DropItem>
                  <DropItem to="/about?tab=history" onClick={() => setOpenDrop(null)}>ประวัติความเป็นมา</DropItem>
                  <DropItem to="/about?tab=vision" onClick={() => setOpenDrop(null)}>วิสัยทัศน์/พันธกิจ</DropItem>
                  <DropItem to="/about?tab=authority" onClick={() => setOpenDrop(null)}>อำนาจหน้าที่</DropItem>
                </div>
              )}
            </div>

            {/* ข่าวสาร */}
            <div className="relative">
              <NavBtn onClick={() => toggleDrop('news')}>ข่าวสาร</NavBtn>
              {openDrop === 'news' && (
                <div className="absolute top-full left-0 bg-white shadow-lg min-w-[220px] z-50 border-t-2 border-secondary">
                  <DropItem to="/news" onClick={() => setOpenDrop(null)}>ข่าวสารทั้งหมด</DropItem>
                  <DropItem to="/announcements" onClick={() => setOpenDrop(null)}>ประชาสัมพันธ์</DropItem>
                  {DEPT_LINKS.map(d => (
                    <DropItem key={d.value} to={`/news/${d.value}`} onClick={() => setOpenDrop(null)}>{d.label}</DropItem>
                  ))}
                </div>
              )}
            </div>

            {/* แผนงาน/งบประมาณ */}
            <div className="relative">
              <NavBtn onClick={() => toggleDrop('plan')}>แผนงาน/งบประมาณ</NavBtn>
              {openDrop === 'plan' && (
                <div className="absolute top-full left-0 bg-white shadow-lg min-w-[260px] z-50 border-t-2 border-secondary">
                  <DropItem to="/development-plan" onClick={() => setOpenDrop(null)}>แผนพัฒนาท้องถิ่น</DropItem>
                  <DropItem to="/action-plan" onClick={() => setOpenDrop(null)}>แผนดำเนินงาน</DropItem>
                  <DropItem to="/budget" onClick={() => setOpenDrop(null)}>ข้อบัญญัติงบประมาณรายจ่าย</DropItem>
                  <DropItem to="/participation" onClick={() => setOpenDrop(null)}>การเปิดโอกาสให้มีส่วนร่วม</DropItem>
                </div>
              )}
            </div>

            <NavDirect to="/finance">การเงิน/การคลัง</NavDirect>

            {/* จัดซื้อจัดจ้าง */}
            <div className="relative">
              <NavBtn onClick={() => toggleDrop('proc')}>จัดซื้อจัดจ้าง</NavBtn>
              {openDrop === 'proc' && (
                <div className="absolute top-full left-0 bg-white shadow-lg min-w-[240px] z-50 border-t-2 border-secondary">
                  <DropItem to="/procurement" onClick={() => setOpenDrop(null)}>ประกาศจัดซื้อจัดจ้าง</DropItem>
                  <DropItem to="/procurement-plans" onClick={() => setOpenDrop(null)}>แผนการจัดหาพัสดุ</DropItem>
                </div>
              )}
            </div>

            {/* บุคลากร/กิจการสภา */}
            <div className="relative">
              <NavBtn onClick={() => toggleDrop('staff')}>บุคลากร/สภา</NavBtn>
              {openDrop === 'staff' && (
                <div className="absolute top-full left-0 bg-white shadow-lg min-w-[260px] z-50 border-t-2 border-secondary">
                  <DropItem to="/staff" onClick={() => setOpenDrop(null)}>ทำเนียบผู้บริหาร</DropItem>
                  <DropItem to="/staff#dept-office" onClick={() => setOpenDrop(null)}>สำนักปลัด</DropItem>
                  <DropItem to="/staff#dept-finance" onClick={() => setOpenDrop(null)}>กองคลัง</DropItem>
                  <DropItem to="/staff#dept-engineering" onClick={() => setOpenDrop(null)}>กองช่าง</DropItem>
                  <DropItem to="/staff#dept-health" onClick={() => setOpenDrop(null)}>กองสาธารณสุขและสิ่งแวดล้อม</DropItem>
                  <DropItem to="/staff#dept-council" onClick={() => setOpenDrop(null)}>สมาชิกสภา อบต.</DropItem>
                  <DropItem to="/staff#dept-audit" onClick={() => setOpenDrop(null)}>หน่วยตรวจสอบภายใน</DropItem>
                </div>
              )}
            </div>

            <NavDirect to="/public-service">บริการสาธารณะ</NavDirect>
            <NavDirect to="/eservice">e-Service</NavDirect>

            {/* ร้องเรียน */}
            <div className="relative">
              <NavBtn onClick={() => toggleDrop('complaint')}>ร้องเรียน</NavBtn>
              {openDrop === 'complaint' && (
                <div className="absolute top-full left-0 bg-white shadow-lg min-w-[220px] z-50 border-t-2 border-secondary">
                  <DropItem to="/complaint" onClick={() => setOpenDrop(null)}>ร้องเรียน/ร้องทุกข์</DropItem>
                  <DropItem to="/corruption" onClick={() => setOpenDrop(null)}>แจ้งเบาะแสทุจริต</DropItem>
                </div>
              )}
            </div>

            <NavDirect to="/ita">ITA/OIT</NavDirect>
            <NavDirect to="/info-center">ข้อมูลข่าวสาร</NavDirect>
            <NavDirect to="/laws">กฎหมาย</NavDirect>
            <NavDirect to="/contact">ติดต่อเรา</NavDirect>

            <Link to="/admin" className="ml-auto px-3 py-2 text-white text-xs font-medium bg-red-600 hover:bg-red-700 transition-colors whitespace-nowrap">
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center ml-auto gap-1">
            <Link to="/admin" className="px-3 py-2 text-white text-xs font-medium bg-red-600 hover:bg-red-700 transition-colors">
              เข้าสู่ระบบ
            </Link>
            <button className="text-white px-3 py-2 text-xl" onClick={() => setMobileOpen(v => !v)}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-primary border-t border-white/20 pb-2 max-h-[80vh] overflow-y-auto">

            <Link to="/" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">หน้าแรก</Link>

            {/* เกี่ยวกับ อบต. */}
            <div className="border-b border-white/10">
              <button onClick={() => toggleMobileSection('about')}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>เกี่ยวกับ อบต.</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: mobileExpanded === 'about' ? 'rotate(180deg)' : '' }}>▾</span>
              </button>
              {mobileExpanded === 'about' && (
                <div className="bg-white/10">
                  {[
                    { label: 'ข้อมูลพื้นฐาน', to: '/about' },
                    { label: 'ประวัติความเป็นมา', to: '/about?tab=history' },
                    { label: 'วิสัยทัศน์/พันธกิจ', to: '/about?tab=vision' },
                    { label: 'อำนาจหน้าที่', to: '/about?tab=authority' },
                  ].map(item => (
                    <Link key={item.label} to={item.to} onClick={closeMobile}
                      className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› {item.label}</Link>
                  ))}
                </div>
              )}
            </div>

            {/* ข่าวสาร */}
            <div className="border-b border-white/10">
              <button onClick={() => toggleMobileSection('news')}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>ข่าวสาร</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: mobileExpanded === 'news' ? 'rotate(180deg)' : '' }}>▾</span>
              </button>
              {mobileExpanded === 'news' && (
                <div className="bg-white/10">
                  <Link to="/news" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ข่าวสารทั้งหมด</Link>
                  <Link to="/announcements" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ประชาสัมพันธ์</Link>
                  {DEPT_LINKS.map(d => (
                    <Link key={d.value} to={`/news/${d.value}`} onClick={closeMobile}
                      className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› {d.label}</Link>
                  ))}
                </div>
              )}
            </div>

            {/* แผนงาน/งบประมาณ */}
            <div className="border-b border-white/10">
              <button onClick={() => toggleMobileSection('plan')}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>แผนงาน/งบประมาณ</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: mobileExpanded === 'plan' ? 'rotate(180deg)' : '' }}>▾</span>
              </button>
              {mobileExpanded === 'plan' && (
                <div className="bg-white/10">
                  <Link to="/development-plan" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› แผนพัฒนาท้องถิ่น</Link>
                  <Link to="/action-plan" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› แผนดำเนินงาน</Link>
                  <Link to="/budget" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ข้อบัญญัติงบประมาณรายจ่าย</Link>
                  <Link to="/participation" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› การเปิดโอกาสให้มีส่วนร่วม</Link>
                </div>
              )}
            </div>

            <Link to="/finance" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">การเงิน/การคลัง</Link>

            {/* จัดซื้อจัดจ้าง */}
            <div className="border-b border-white/10">
              <button onClick={() => toggleMobileSection('proc')}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>จัดซื้อจัดจ้าง</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: mobileExpanded === 'proc' ? 'rotate(180deg)' : '' }}>▾</span>
              </button>
              {mobileExpanded === 'proc' && (
                <div className="bg-white/10">
                  <Link to="/procurement" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ประกาศจัดซื้อจัดจ้าง</Link>
                  <Link to="/procurement-plans" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› แผนการจัดหาพัสดุ</Link>
                </div>
              )}
            </div>

            {/* บุคลากร/สภา */}
            <div className="border-b border-white/10">
              <button onClick={() => toggleMobileSection('staff')}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>บุคลากร/กิจการสภา</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: mobileExpanded === 'staff' ? 'rotate(180deg)' : '' }}>▾</span>
              </button>
              {mobileExpanded === 'staff' && (
                <div className="bg-white/10">
                  <Link to="/staff" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ทำเนียบผู้บริหาร</Link>
                  <Link to="/staff#dept-office" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› สำนักปลัด</Link>
                  <Link to="/staff#dept-finance" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› กองคลัง</Link>
                  <Link to="/staff#dept-engineering" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› กองช่าง</Link>
                  <Link to="/staff#dept-health" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› กองสาธารณสุขและสิ่งแวดล้อม</Link>
                  <Link to="/staff#dept-council" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› สมาชิกสภา อบต.</Link>
                </div>
              )}
            </div>

            <Link to="/public-service" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">บริการสาธารณะ</Link>
            <Link to="/eservice" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">e-Service</Link>

            {/* ร้องเรียน */}
            <div className="border-b border-white/10">
              <button onClick={() => toggleMobileSection('complaint')}
                className="w-full flex items-center justify-between px-4 py-3 text-white text-sm">
                <span>ร้องเรียน</span>
                <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: mobileExpanded === 'complaint' ? 'rotate(180deg)' : '' }}>▾</span>
              </button>
              {mobileExpanded === 'complaint' && (
                <div className="bg-white/10">
                  <Link to="/complaint" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› ร้องเรียน/ร้องทุกข์</Link>
                  <Link to="/corruption" onClick={closeMobile} className="block px-6 py-2.5 text-white/90 text-sm border-t border-white/10">› แจ้งเบาะแสทุจริต</Link>
                </div>
              )}
            </div>

            <Link to="/ita" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">ITA/OIT</Link>
            <Link to="/info-center" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">ศูนย์ข้อมูลข่าวสาร</Link>
            <Link to="/laws" onClick={closeMobile} className="block px-4 py-3 text-white text-sm border-b border-white/10">กฎหมาย/ข้อบัญญัติ</Link>
            <Link to="/contact" onClick={closeMobile} className="block px-4 py-3 text-white text-sm">ติดต่อเรา</Link>
          </div>
        )}
      </nav>
    </>
  )
}
