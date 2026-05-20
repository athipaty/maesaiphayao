import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement, getTravel } from '../services/api'
import { DEPT_LABELS, DEPT_ICONS } from '../components/NewsSection'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

export default function HomePage() {
  const [allNews, setAllNews]       = useState([])
  const [announce, setAnnounce]     = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [egp, setEgp]               = useState([])
  const [procNews, setProcNews]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [travel, setTravel]         = useState([])
  const [prTab, setPrTab]           = useState('announcement')
  const [procTab, setProcTab]       = useState('egp')

  useEffect(() => {
    async function load() {
      try {
        const deptResults = await Promise.all(
          DEPARTMENTS.map(dept => getNews({ dept, limit: 3 }))
        )
        const flat = []
        DEPARTMENTS.forEach((dept, i) => {
          ;(deptResults[i]?.data || []).forEach(item => flat.push({ ...item, _dept: dept }))
        })
        flat.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        setAllNews(flat)

        const [ann, nl, e, pn, tv] = await Promise.all([
          getAnnouncements({ type: 'announcement' }),
          getAnnouncements({ type: 'newsletter' }),
          getProcurement({ type: 'egp' }),
          getProcurement({ type: 'news' }),
          getTravel({ limit: 6 }),
        ])
        setAnnounce(ann?.data || [])
        setNewsletter(nl?.data || [])
        setEgp(e?.data || [])
        setProcNews(pn?.data || [])
        setTravel((tv?.data || []).slice(0, 6))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>

      {/* ── Combined news marquee ─────────────────────────────────────── */}
      <div className="card">
        <style>{`
          @keyframes news-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .news-marquee {
            animation: news-marquee ${Math.max(allNews.length * 5, 30)}s linear infinite;
          }
          .news-marquee:hover { animation-play-state: paused; }
        `}</style>

        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span>📰</span>
            <span className="text-sm font-semibold text-primary">ข่าวสาร กิจกรรม ทั้งหมด</span>
          </div>
          <Link to="/news" className="text-xs text-secondary hover:underline">ดูทั้งหมด →</Link>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : allNews.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400 text-sm">ยังไม่มีข่าวสาร</div>
        ) : (
          <div className="overflow-hidden pt-3 pb-4">
            <div className="news-marquee flex gap-3 w-max">
              {[...allNews, ...allNews].map((item, i) => {
                const img  = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
                const dept = item.department || item._dept
                const icon = DEPT_ICONS[dept] || '📰'
                const label = DEPT_LABELS[dept] || ''
                return (
                  <Link
                    key={i}
                    to={`/news/detail/${item._id}`}
                    className="w-52 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative overflow-hidden bg-blue-50" style={{ height: '148px' }}>
                      {img
                        ? <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">{icon}</div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] bg-white/90 text-primary font-semibold px-2 py-0.5 rounded-full shadow">
                        {icon} {label}
                      </span>
                      <p className="absolute bottom-0 left-0 right-0 px-3 py-2 text-white text-xs font-semibold leading-snug drop-shadow line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        📅 {new Date(item.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-gray-400">👁 {item.views}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Facebook Page ────────────────────────────────────────────── */}
      <div className="card overflow-hidden p-0">
        {/* Full-page embed — small_header=false shows cover photo + profile */}
        <div className="w-full">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMaesaiSAOPhayao&tabs=&width=800&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false"
            width="100%"
            height="130"
            style={{ border: 'none', overflow: 'hidden', display: 'block', width: '100%' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook Page อบต.แม่ใส"
          />
        </div>
      </div>

      {/* ── Emergency Contacts ───────────────────────────────────────── */}
      <div className="card overflow-hidden p-0">
        <style>{`
          @keyframes pulse-ring {
            0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
            50%      { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
          }
          .emergency-pulse { animation: pulse-ring 2s ease-in-out infinite; }
        `}</style>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #ef4444 100%)' }}
          className="px-4 py-3.5 flex items-center gap-3">
          <span className="text-3xl emergency-pulse rounded-full">🚨</span>
          <div>
            <h3 className="text-white font-bold text-base tracking-wide">เบอร์ฉุกเฉิน</h3>
            <p className="text-red-200 text-xs">แจ้งเหตุด่วน — กดโทรได้ทันที</p>
          </div>
        </div>

        <div className="p-3 space-y-2.5 bg-red-50/30">

          {/* 1669 — top priority */}
          <a href="tel:1669"
            className="flex items-center gap-3 rounded-xl p-3 border-2 border-red-300 hover:border-red-500 transition-all group"
            style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0 emergency-pulse"
              style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
              🚑
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-red-500 font-semibold">เจ็บป่วยฉุกเฉิน / Emergency Medical</p>
              <p className="text-3xl font-black text-red-600 leading-tight tracking-wider">1669</p>
            </div>
            <div className="flex-shrink-0 w-9 h-9 bg-red-500 group-hover:bg-red-600 rounded-full flex items-center justify-center text-white text-lg transition-colors">
              📞
            </div>
          </a>

          {/* Local official contacts */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'นายก อบต.แม่ใส',           phone: '0897577366', display: '089-757-7366', icon: '👨‍💼', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
              { label: 'ปลัด อบต.แม่ใส',           phone: '0987496770', display: '098-749-6770', icon: '📋', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
              { label: 'นักป้องกันฯ',              phone: '0812635432', display: '081-263-5432', icon: '🚒', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
              { label: 'ป้องกัน อบต.แม่ใส',        phone: '054889809',  display: '054-889-809',  icon: '🛡️', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
              { label: 'รพ.สต.แม่ใส',              phone: '054889885',  display: '054-889-885',  icon: '🏥', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
            ].map(({ label, phone, display, icon, bg, border, text }) => (
              <a key={phone} href={`tel:${phone}`}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:opacity-85 transition-opacity group"
                style={{ background: bg, border: `1.5px solid ${border}` }}>
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold leading-tight text-gray-500 truncate">{label}</p>
                  <p className="text-sm font-bold leading-tight" style={{ color: text }}>{display}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Utility hotlines */}
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1.5 px-1">สายด่วนสาธารณูปโภค</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ไฟฟ้า',  number: '1129', icon: '⚡', bg: '#fefce8', border: '#fde047', text: '#854d0e' },
                { label: 'ประปา',  number: '1662', icon: '💧', bg: '#eff6ff', border: '#93c5fd', text: '#1e40af' },
                { label: 'ตำรวจ', number: '191',  icon: '👮', bg: '#f5f3ff', border: '#c4b5fd', text: '#5b21b6' },
              ].map(({ label, number, icon, bg, border, text }) => (
                <a key={number} href={`tel:${number}`}
                  className="flex flex-col items-center gap-0.5 rounded-xl py-3 hover:opacity-80 transition-opacity text-center"
                  style={{ background: bg, border: `1.5px solid ${border}` }}>
                  <span className="text-2xl">{icon}</span>
                  <p className="text-[10px] font-semibold" style={{ color: text }}>{label}</p>
                  <p className="text-xl font-black tracking-wider" style={{ color: text }}>{number}</p>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Announcements + Newsletter tabs ──────────────────────────── */}
      <div className="card">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { key: 'announcement', label: 'ข่าวประชาสัมพันธ์' },
            { key: 'newsletter',   label: 'จดหมายข่าว' },
          ].map(t => (
            <button key={t.key} onClick={() => setPrTab(t.key)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                prTab === t.key
                  ? 'border-secondary text-primary bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        {prTab === 'announcement' && (
          <ul className="divide-y divide-gray-50">
            {announce.length === 0 && (
              <li className="px-3 py-4 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล</li>
            )}
            {announce.map((a, i) => (
              <li key={a._id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50/50 transition-colors">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  {a.fileUrl
                    ? <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-secondary leading-snug block">{a.title}</a>
                    : <span className="text-sm text-gray-700 leading-snug">{a.title}</span>
                  }
                </div>
              </li>
            ))}
          </ul>
        )}
        {prTab === 'newsletter' && (
          <ul className="divide-y divide-gray-50">
            {newsletter.length === 0 && (
              <li className="px-3 py-4 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล</li>
            )}
            {newsletter.map((n, i) => (
              <li key={n._id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50/50 transition-colors">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  {n.image
                    ? <a href={n.image} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-secondary leading-snug block">{n.title}</a>
                    : <span className="text-sm text-gray-700 leading-snug">{n.title}</span>
                  }
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Procurement tabs ─────────────────────────────────────────── */}
      <div className="card">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { key: 'egp',  label: 'รายงานจัดซื้อจัดจ้าง (EGP)', shortLabel: 'รายงาน EGP' },
            { key: 'news', label: 'ข่าวการจัดซื้อจัดจ้าง',        shortLabel: 'ข่าวจัดซื้อฯ' },
          ].map(t => (
            <button key={t.key} onClick={() => setProcTab(t.key)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                procTab === t.key
                  ? 'border-secondary text-primary bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              <span className="sm:hidden">{t.shortLabel}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
        <ul className="divide-y divide-gray-50">
          {(procTab === 'egp' ? egp : procNews).length === 0 && (
            <li className="px-3 py-4 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล</li>
          )}
          {(procTab === 'egp' ? egp : procNews).map((p, i) => (
            <li key={p._id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50/50 transition-colors">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <div className="min-w-0 flex-1">
                {p.externalUrl
                  ? <a href={p.externalUrl} target="_blank" rel="noreferrer" className="text-sm text-secondary hover:underline leading-snug block">{p.title}</a>
                  : <span className="text-sm text-gray-700 leading-snug">{p.title}</span>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Travel marquee ────────────────────────────────────────────── */}
      {travel.length > 0 && (
        <div className="card">
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .travel-marquee {
              animation: marquee ${travel.length * 4}s linear infinite;
            }
            .travel-marquee:hover { animation-play-state: paused; }
          `}</style>

          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span>🗺️</span>
              <span className="text-sm font-semibold text-primary">แนะนำสถานที่ท่องเที่ยว</span>
            </div>
            <Link to="/travel" className="text-xs text-secondary hover:underline">ดูทั้งหมด →</Link>
          </div>

          <div className="overflow-hidden pt-3 pb-4">
            <div className="travel-marquee flex gap-3 w-max">
              {[...travel, ...travel].map((item, i) => {
                const mainImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
                return (
                  <div key={i} className="w-52 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white">
                    <div className="relative overflow-hidden bg-teal-50" style={{ height: '150px' }}>
                      {mainImg
                        ? <img src={mainImg} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">🏞️</div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                        <p className="text-white text-xs font-semibold leading-snug drop-shadow line-clamp-2">{item.title}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
