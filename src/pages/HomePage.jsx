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
                    className="w-64 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative overflow-hidden bg-blue-50" style={{ height: '190px' }}>
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

      {/* ── Announcement marquee ─────────────────────────────────────── */}
      {announce.length > 0 && (
        <div className="card">
          <style>{`
            @keyframes ann-marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ann-marquee {
              animation: ann-marquee ${Math.max(announce.length * 6, 30)}s linear infinite;
            }
            .ann-marquee:hover { animation-play-state: paused; }
          `}</style>

          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span>📢</span>
              <span className="text-sm font-semibold text-primary">ข่าวประชาสัมพันธ์</span>
            </div>
            <Link to="/announcements" className="text-xs text-secondary hover:underline">ดูทั้งหมด →</Link>
          </div>

          <div className="overflow-hidden pt-3 pb-4">
            <div className="ann-marquee flex gap-3 w-max">
              {[...announce, ...announce].map((item, i) => (
                <a
                  key={i}
                  href={item.fileUrl || '#'}
                  target={item.fileUrl ? '_blank' : undefined}
                  rel="noreferrer"
                  className="w-64 flex-shrink-0 rounded-xl overflow-hidden border border-blue-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative flex items-center justify-center" style={{ height: '130px', background: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#3b82f6 100%)' }}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">📄</span>
                    {item.fileUrl && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">PDF</span>
                    )}
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-semibold text-gray-700 leading-snug line-clamp-3 group-hover:text-primary transition-colors">{item.title}</p>
                    {item.createdAt && (
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        📅 {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Facebook Page ────────────────────────────────────────────── */}
      <div className="card overflow-hidden p-0">
        {/* Custom header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg,#1877f2 0%,#0d65d9 100%)' }}>
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center font-black text-xl" style={{ color: '#1877f2' }}>f</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">องค์การบริหารส่วนตำบลแม่ใส</p>
            <p className="text-blue-200 text-[11px] leading-tight">อบต.แม่ใส · จ.พะเยา</p>
          </div>
          <a href="https://www.facebook.com/MaesaiSAOPhayao" target="_blank" rel="noreferrer"
            className="flex-shrink-0 text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
            style={{ textDecoration: 'none' }}>
            👍 ติดตาม
          </a>
        </div>
        {/* Iframe — negative margin hides FB plugin's own header */}
        <div style={{ overflow: 'hidden', height: '460px' }}>
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMaesaiSAOPhayao&tabs=timeline&width=800&height=520&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false"
            width="100%"
            height="520"
            style={{ border: 'none', overflow: 'hidden', display: 'block', width: '100%', marginTop: '-60px' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook Page อบต.แม่ใส"
          />
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
