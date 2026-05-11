import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'ข่าวสาร / กิจกรรม',          to: '/news' },
  { label: 'ประกาศ / ประชาสัมพันธ์',      to: '/announcements' },
  { label: 'จัดซื้อจัดจ้าง',               to: '/procurement' },
  { label: 'แผนงานและงบประมาณ',            to: '/action-plan' },
  { label: 'ร้องเรียน / ร้องทุกข์',        to: '/complaint' },
  { label: 'ติดต่อเรา',                    to: '/contact' },
]

const EXT_LINKS = [
  { label: 'กรมส่งเสริมการปกครอง',        href: 'http://www.dla.go.th/' },
  { label: 'ระบบ E-GP',                   href: 'http://www.gprocurement.go.th/' },
  { label: 'ทะเบียนราษฎร',                href: 'https://stat.bora.dopa.go.th/' },
  { label: 'ระบบสวัสดิการ',               href: 'https://welfare.dla.go.th/' },
  { label: 'เลือกตั้งท้องถิ่น',           href: 'https://ele.dla.go.th/' },
  { label: 'อุตุฯ เชียงใหม่',             href: 'https://cmmet.tmd.go.th/' },
]

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/MaesaiSAOPhayao',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Messenger',
    href: 'https://m.me/MaesaiSAOPhayao',
    icon: (
      <svg width="18" height="18" viewBox="0 0 28 28" fill="currentColor">
        <path d="M14 2C7.373 2 2 7.06 2 13.32c0 3.348 1.39 6.356 3.635 8.524V26l4.37-2.406C11.222 23.847 12.584 24 14 24c6.627 0 12-5.06 12-11.32C26 7.06 20.627 2 14 2z"/>
      </svg>
    ),
  },
  {
    label: 'LINE',
    href: 'https://liff.line.me/1645278921-kWRPP32q/?accountId=traffyfondue',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.89c.50 0 .866.356.866.79 0 .434-.366.79-.866.79h-2.274v1.304h2.274c.5 0 .866.355.866.789 0 .434-.366.79-.866.79h-3.14a.878.878 0 01-.866-.79V8.313c0-.435.367-.79.866-.79h3.14c.5 0 .866.355.866.789 0 .434-.366.79-.866.79h-2.274V9.89h2.274zm-5.85 3.673a.878.878 0 01-.866.79.862.862 0 01-.688-.35l-2.95-3.925v3.485a.878.878 0 01-.866.79.878.878 0 01-.866-.79V8.313c0-.435.367-.79.866-.79.261 0 .496.113.66.294l2.977 3.955V8.313c0-.435.367-.79.866-.79.5 0 .866.355.866.79v5.25zm-7.1 0a.878.878 0 01-.866.79.878.878 0 01-.866-.79V8.313c0-.435.367-.79.866-.79.5 0 .866.355.866.79v5.25zm-3.05-5.25c0-.435.367-.79.866-.79.5 0 .866.355.866.79v5.25a.878.878 0 01-.866.79.878.878 0 01-.866-.79V8.313zM12 2C6.477 2 2 5.998 2 10.912c0 2.688 1.296 5.097 3.33 6.746V22l4.15-2.207A11.37 11.37 0 0012 19.825c5.523 0 10-3.998 10-8.913C22 5.998 17.523 2 12 2z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-6">

      {/* ── Main footer content ──────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Column 1 — About */}
          <div>
            <h3 className="text-base font-bold mb-3 pb-2 border-b border-white/20">
              🏛️ องค์การบริหารส่วนตำบลแม่ใส
            </h3>
            <p className="text-sm opacity-80 leading-relaxed mb-3">
              198 ม.12 ตำบลแม่ใส อำเภอเมืองพะเยา<br />
              จังหวัดพะเยา 56000
            </p>
            <ul className="space-y-1.5 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:0548892909" className="hover:text-yellow-300 transition-colors">0-5488-9909</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📠</span>
                <span>0-5488-9910</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:saraban_06560115@dla.go.th" className="hover:text-yellow-300 transition-colors break-all">
                  saraban_06560115@dla.go.th
                </a>
              </li>
            </ul>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  title={s.label}
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h3 className="text-base font-bold mb-3 pb-2 border-b border-white/20">
              🔗 เมนูลัด
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => (
                <li key={l.to}>
                  <Link to={l.to}
                    className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-yellow-200 transition-all group">
                    <span className="text-yellow-400/60 group-hover:text-yellow-300 transition-colors">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — External links */}
          <div>
            <h3 className="text-base font-bold mb-3 pb-2 border-b border-white/20">
              🌐 ลิงค์หน่วยงานที่เกี่ยวข้อง
            </h3>
            <ul className="space-y-2">
              {EXT_LINKS.map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-yellow-200 transition-all group">
                    <span className="text-yellow-400/60 group-hover:text-yellow-300 transition-colors">›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Copyright bar ────────────────────────────────────── */}
      <div className="border-t border-white/15 bg-black/20">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs opacity-60">
          <span>Copyright © {new Date().getFullYear()} องค์การบริหารส่วนตำบลแม่ใส. All Rights Reserved</span>
          <span>Powered by อบต.แม่ใส Web Team</span>
        </div>
      </div>

    </footer>
  )
}
