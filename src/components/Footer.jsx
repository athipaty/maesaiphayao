import { useState, useEffect } from 'react'
import { getBanners } from '../services/api'

const FALLBACK_LINKS = [
  { label: 'กรมส่งเสริมการปกครอง', sub: 'DLA',  href: 'http://www.dla.go.th/',          bg: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
  { label: 'ระบบ E-GP',            sub: 'EGP',  href: 'http://www.gprocurement.go.th/', bg: 'linear-gradient(135deg,#065f46,#059669)' },
  { label: 'ทะเบียนราษฎร',         sub: 'DOPA', href: 'https://stat.bora.dopa.go.th/',  bg: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
  { label: 'ระบบสวัสดิการ',         sub: 'WEL',  href: 'https://welfare.dla.go.th/',     bg: 'linear-gradient(135deg,#b45309,#f59e0b)' },
  { label: 'เลือกตั้งท้องถิ่น',     sub: 'ELE',  href: 'https://ele.dla.go.th/',         bg: 'linear-gradient(135deg,#be123c,#f43f5e)' },
  { label: 'เมล์กรมส่งเสริมฯ',      sub: 'MAIL', href: 'https://mail.dla.go.th/login',   bg: 'linear-gradient(135deg,#0e7490,#06b6d4)' },
  { label: 'อุตุฯ เชียงใหม่',       sub: 'TMD',  href: 'https://cmmet.tmd.go.th/',       bg: 'linear-gradient(135deg,#0369a1,#38bdf8)' },
  { label: 'LPA Dashboard',         sub: 'LPA',  href: '#',                               bg: 'linear-gradient(135deg,#4f46e5,#818cf8)' },
  { label: 'แจ้งเบาะแสทุจริต',      sub: 'PACC', href: 'https://anonymous.pacc.go.th/', bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)' },
]

export default function Footer() {
  const [links, setLinks] = useState(FALLBACK_LINKS)

  useEffect(() => {
    getBanners()
      .then(r => { if (r.data?.length > 0) setLinks(r.data) })
      .catch(() => {})
  }, [])

  const cols = `grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(links.length, 9)}`

  return (
    <footer className="bg-primary text-white mt-6">
      <style>{`
        @keyframes banner-shimmer {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(350%)  skewX(-20deg); }
        }
        @keyframes banner-glow {
          0%,100% { filter: brightness(1); }
          50%     { filter: brightness(1.18); }
        }
        .footer-banner { position: relative; overflow: hidden; }
        .footer-shimmer {
          position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          pointer-events: none;
          display: none;
        }
        ${links.map((l, i) => {
          const anim = l.animation || 'both'
          const delay = `${(i * 0.3).toFixed(1)}s`
          const rules = []
          if (anim === 'glow' || anim === 'both') {
            rules.push(`.footer-banner:nth-child(${i + 1}) { animation: banner-glow 2.4s ease-in-out infinite; animation-delay: ${delay}; }`)
          }
          if (anim === 'shimmer' || anim === 'both') {
            rules.push(`.footer-banner:nth-child(${i + 1}) .footer-shimmer { display: block; background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%); animation: banner-shimmer 3s ease-in-out infinite; animation-delay: ${delay}; }`)
          }
          return rules.join('\n        ')
        }).join('\n        ')}
      `}</style>

      {/* Related links banner row */}
      <div style={{ background: 'linear-gradient(180deg,#0f2547 0%,#1a3a6b 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-[1200px] mx-auto px-4 py-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 rounded-sm inline-block" style={{ background: '#f59e0b' }} />
            <span className="text-sm font-semibold text-white/90 tracking-wide">ลิงค์ที่เกี่ยวข้อง</span>
          </div>
          <div className={`grid ${cols} gap-2`}>
            {links.map((l, idx) => (
              <a
                key={l._id || idx}
                href={l.href}
                target={l.href !== '#' ? '_blank' : undefined}
                rel="noreferrer"
                className="footer-banner group flex flex-col items-center justify-start gap-0.5 rounded-xl pt-3 pb-4 px-2 hover:scale-105 transition-transform relative overflow-hidden"
                style={{
                  ...(l.imageUrl
                    ? { backgroundImage: `url(${l.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: l.bg }),
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  minHeight: '80px',
                }}
              >
                <span className="footer-shimmer" />
                {!l.imageUrl && (
                  <>
                    <span className="text-[10px] font-bold text-white/60 tracking-widest relative z-10">{l.sub}</span>
                    <span className="text-xs font-bold text-white text-center leading-snug relative z-10">{l.label}</span>
                  </>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-[1200px] mx-auto px-4 py-5 text-center">
        <h3 className="text-base font-semibold mb-2">องค์การบริหารส่วนตำบลแม่ใส</h3>
        <p className="text-sm opacity-80 leading-relaxed">
          198 ม.12 ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000<br />
          โทรศัพท์: 0-5488-9909 | E-mail: saraban_06560115@dla.go.th
        </p>
        <div className="mt-4 pt-3 border-t border-white/20 text-xs opacity-60">
          Copyright © {new Date().getFullYear()} องค์การบริหารส่วนตำบลแม่ใส . All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
