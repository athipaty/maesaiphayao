import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement, getTravel, getFacebookPage, getEgpRss } from '../services/api'
import { DEPT_LABELS, DEPT_ICONS } from '../components/NewsSection'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

export default function HomePage() {
  const [allNews, setAllNews]       = useState([])
  const [announce, setAnnounce]     = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [egp, setEgp]               = useState([])
  const [egpLoading, setEgpLoading] = useState(true)
  const [egpError, setEgpError]     = useState('')
  const [procNews, setProcNews]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [travel, setTravel]         = useState([])
  const [prTab, setPrTab]           = useState('announcement')
  const [procTab, setProcTab]       = useState('egp')
  const [fbPage, setFbPage]         = useState(null)
  const [lightboxItem, setLightboxItem] = useState(null)
  const [annSlide, setAnnSlide]         = useState(0)
  const fbContainerRef = useRef(null)
  const [fbScale, setFbScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      if (!fbContainerRef.current) return
      const w = fbContainerRef.current.offsetWidth
      setFbScale(w / 500)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  useEffect(() => {
    if (!lightboxItem) return
    const onKey = e => { if (e.key === 'Escape') setLightboxItem(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxItem])

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

        const [ann, nl, pn, tv] = await Promise.all([
          getAnnouncements({ type: 'announcement' }),
          getAnnouncements({ type: 'newsletter' }),
          getProcurement({ type: 'news' }),
          getTravel({ limit: 6 }),
        ])
        getFacebookPage().then(r => setFbPage(r?.data)).catch(() => {})
        setAnnounce(ann?.data || [])
        setNewsletter(nl?.data || [])
        setProcNews(pn?.data || [])

        // Fetch EGP W0 (ประกาศผู้ชนะ) — has winner/amount summary data
        getEgpRss({ anounceType: 'W0' })
          .then(r => {
            const d = r?.data || {}
            setEgp(Array.isArray(d) ? d : (d.items || []))
            if (d.notice) setEgpError(d.notice)
          })
          .catch(err => {
            const d = err?.response?.data || {}
            setEgpError(d.notice || d.error || 'ระบบ e-GP ไม่พร้อมให้บริการในขณะนี้')
          })
          .finally(() => setEgpLoading(false))
        setTravel((tv?.data || []).slice(0, 6))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const annItems = [
    ...announce.map(i => ({ ...i, _kind: 'announcement' })),
    ...newsletter.map(i => ({ ...i, _kind: 'newsletter' })),
  ]

  useEffect(() => {
    if (annItems.length === 0) return
    const timer = setInterval(() => setAnnSlide(s => (s + 1) % annItems.length), 4000)
    return () => clearInterval(timer)
  }, [annItems.length])

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
            animation: news-marquee ${Math.max(allNews.length * 8, 50)}s linear infinite;
          }
          .news-marquee:hover { animation-play-state: paused; }
        `}</style>

        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
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
          <div className="overflow-hidden pt-2 pb-2">
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
                    className="w-72 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative overflow-hidden bg-blue-50" style={{ height: '210px' }}>
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

      {/* ── Announcement marquee — mobile only (desktop shows in Facebook right panel) ── */}
      {annItems.length > 0 && (() => {
        return (
          <div className="card lg:hidden">
            <style>{`
              @keyframes ann-marquee {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .ann-marquee {
                animation: ann-marquee ${Math.max(annItems.length * 8, 50)}s linear infinite;
              }
              .ann-marquee:hover { animation-play-state: paused; }
            `}</style>

            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span>📢</span>
                <span className="text-sm font-semibold text-primary">ข่าวประชาสัมพันธ์ &amp; จดหมายข่าว</span>
              </div>
              <Link to="/announcements" className="text-xs text-secondary hover:underline">ดูทั้งหมด →</Link>
            </div>

            <div className="overflow-hidden pt-2 pb-3">
              <div className="ann-marquee flex gap-3 w-max px-3">
                {[...annItems, ...annItems].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => item.image ? setLightboxItem(item) : item.fileUrl && window.open(item.fileUrl, '_blank')}
                    className="w-52 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    {/* Image — tall portrait, object-contain shows full image without cropping */}
                    <div className="relative overflow-hidden" style={{
                      height: '300px',
                      background: item.image
                        ? '#f1f5f9'
                        : item._kind === 'newsletter'
                          ? 'linear-gradient(135deg,#065f46 0%,#059669 60%,#34d399 100%)'
                          : 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#3b82f6 100%)'
                    }}>
                      {item.image ? (
                        <img src={item.image} alt={item.title}
                          className="absolute inset-0 w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-300">
                            {item._kind === 'newsletter' ? '📰' : '📄'}
                          </span>
                        </div>
                      )}
                      {/* Thin top gradient for badge readability only */}
                      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent" />
                      <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 text-primary px-2 py-0.5 rounded-full z-10">
                        {item._kind === 'newsletter' ? '📰 จดหมายข่าว' : '📢 ประชาสัมพันธ์'}
                      </span>
                      {item.image && (
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <span className="bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">🔍 ดูรูปภาพ</span>
                        </span>
                      )}
                    </div>
                    {/* Title + date + PDF link below image */}
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        {item.createdAt && (
                          <p className="text-[10px] text-gray-400">
                            📅 {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </p>
                        )}
                        {item.fileUrl && (
                          <a href={item.fileUrl} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-[10px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-full transition-colors flex-shrink-0">
                            📄 PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Facebook ─────────────────────────────────────────────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Facebook iframe — full width on mobile, half on desktop */}
          <div ref={fbContainerRef} className="overflow-hidden lg:w-1/2"
            style={{ height: `${Math.round(500 * fbScale)}px` }}>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMaesaiSAOPhayao&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=false&hide_cover=true&show_facepile=false"
              style={{
                border: 'none',
                width: '500px',
                height: '500px',
                display: 'block',
                transform: `scale(${fbScale})`,
                transformOrigin: 'top left',
              }}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
              title="Facebook Page อบต.แม่ใส"
            />
          </div>

          {/* Right: Announcement slideshow — desktop only */}
          <div className="hidden lg:block flex-1 relative overflow-hidden"
            style={{ height: `${Math.round(500 * fbScale)}px` }}>
            <style>{`
              @keyframes dot-bounce {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                40%           { transform: translateY(-10px); opacity: 1; }
              }
              .ann-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #94a3b8; animation: dot-bounce 1.4s ease-in-out infinite; }
              .ann-dot:nth-child(2) { animation-delay: 0.2s; }
              .ann-dot:nth-child(3) { animation-delay: 0.4s; }
            `}</style>

            {annItems.length > 0 ? (
              <>
                {annItems.map((item, i) => (
                  <div key={i}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === annSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    onClick={() => item.image ? setLightboxItem(item) : item.fileUrl && window.open(item.fileUrl, '_blank')}
                    style={{ cursor: item.image || item.fileUrl ? 'pointer' : 'default' }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" style={{ background: '#111' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: item._kind === 'newsletter' ? 'linear-gradient(135deg,#065f46,#059669)' : 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
                        <span className="text-7xl opacity-20">{item._kind === 'newsletter' ? '📰' : '📢'}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold bg-white/90 text-primary px-2 py-0.5 rounded-full z-20">
                      {item._kind === 'newsletter' ? '📰 จดหมายข่าว' : '📢 ประชาสัมพันธ์'}
                    </span>
                    {item.fileUrl && (
                      <a href={item.fileUrl} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="absolute top-3 right-3 text-[10px] font-bold bg-red-600/80 text-white px-2 py-0.5 rounded-full z-20 hover:bg-red-600 transition-colors">
                        📄 PDF
                      </a>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 z-20">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2 drop-shadow">{item.title}</p>
                      {item.createdAt && (
                        <p className="text-white/65 text-xs mt-1">
                          📅 {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Slide indicator dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30">
                  {annItems.map((_, i) => (
                    <button key={i}
                      onClick={() => setAnnSlide(i)}
                      className={`rounded-full transition-all duration-300 ${i === annSlide ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'}`}
                    />
                  ))}
                </div>

                {/* Header label */}
                <div className="absolute top-0 left-0 right-0 px-4 pt-3 pb-6 bg-gradient-to-b from-black/50 to-transparent z-20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90">📢 ข่าวประชาสัมพันธ์ &amp; จดหมายข่าว</span>
                  <Link to="/announcements" className="text-[10px] text-white/70 hover:text-white transition-colors">ดูทั้งหมด →</Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 bg-gradient-to-br from-gray-50 to-slate-100">
                <p className="text-2xl font-bold text-slate-300 tracking-widest select-none">coming soon</p>
                <div className="flex items-center gap-2">
                  <span className="ann-dot" /><span className="ann-dot" /><span className="ann-dot" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Procurement ──────────────────────────────────────────────── */}
      <div className="card p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-0 border-b border-gray-100 flex-shrink-0">
          <div className="flex">
            {[
              { key: 'egp',  label: 'ระบบ e-GP (เรียลไทม์)', shortLabel: 'e-GP' },
              { key: 'news', label: 'ข่าวจัดซื้อจัดจ้าง', shortLabel: 'ข่าว' },
            ].map(t => (
              <button key={t.key} onClick={() => setProcTab(t.key)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  procTab === t.key
                    ? 'border-secondary text-primary bg-pink-50'
                    : 'border-transparent text-gray-500 hover:text-primary'
                }`}>
                <span className="sm:hidden">{t.shortLabel}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <Link to="/procurement" className="text-xs text-secondary hover:underline pb-2">ดูทั้งหมด →</Link>
        </div>

        <div className="overflow-y-auto flex-1" style={{ maxHeight: '460px' }}>
          {procTab === 'egp' ? (
            egpLoading ? (
              <div className="px-3 py-4 text-center text-gray-400 text-sm animate-pulse">กำลังดึงข้อมูลจากระบบ e-GP...</div>
            ) : egpError ? (
              <div className="px-3 py-4 text-center">
                <span className="text-2xl">🔧</span>
                <p className="text-gray-400 text-sm mt-2">{egpError}</p>
                <p className="text-gray-300 text-xs mt-1">เปิดให้บริการ 17:01–08:59 น.</p>
              </div>
            ) : egp.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {egp.slice(0, 8).map((p, i) => (
                  <div key={i} className="px-3 py-2.5 hover:bg-pink-50/40 transition-colors">
                    {/* Line 1: number + title (1 line) + date */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      {p.link
                        ? <a href={p.link} target="_blank" rel="noreferrer"
                            className="flex-1 min-w-0 text-xs text-primary hover:text-secondary font-medium truncate">{p.title}</a>
                        : <span className="flex-1 min-w-0 text-xs text-gray-700 font-medium truncate">{p.title}</span>
                      }
                      {p.date && (
                        <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                          {new Date(p.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {/* Line 2: winner (left, truncated) + amount (right edge) */}
                    {(p.winner || p.amount != null) && (
                      <div className="flex items-center gap-2 mt-1 pl-5">
                        <span className="flex-1 min-w-0 text-[10px] text-green-700 truncate">
                          {p.winner ? `🏆 ${p.winner}` : ''}
                        </span>
                        {p.amount != null && (
                          <span className="text-[10px] font-semibold text-blue-700 whitespace-nowrap flex-shrink-0">
                            {Number(p.amount).toLocaleString('th-TH')} บาท
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <ul className="divide-y divide-gray-50">
              {procNews.length === 0 && (
                <li className="px-3 py-4 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล</li>
              )}
              {procNews.map((p, i) => (
                <li key={p._id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-pink-50/50 transition-colors">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    {p.externalUrl
                      ? <a href={p.externalUrl} target="_blank" rel="noreferrer" className="text-sm text-secondary hover:underline leading-snug block">{p.title}</a>
                      : <span className="text-sm text-gray-700 leading-snug">{p.title}</span>
                    }
                    {p.winner && (
                      <span className="text-[10px] bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded-full mt-1 inline-block">🏆 {p.winner}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
              animation: marquee ${Math.max(travel.length * 8, 50)}s linear infinite;
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
                  <div key={i} className="w-72 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white">
                    <div className="relative overflow-hidden bg-teal-50" style={{ height: '210px' }}>
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

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          {/* Image container */}
          <div
            className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              className="max-h-[80vh] max-w-full w-auto rounded-2xl shadow-2xl object-contain"
            />
            <p className="mt-3 text-white text-sm font-semibold text-center drop-shadow line-clamp-2 px-4">
              {lightboxItem.title}
            </p>
            <div className="flex items-center gap-3 mt-3">
              {lightboxItem.fileUrl && (
                <a href={lightboxItem.fileUrl} target="_blank" rel="noreferrer"
                  className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-colors">
                  📄 เปิด PDF
                </a>
              )}
              <button
                onClick={() => setLightboxItem(null)}
                className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-colors">
                ✕ ปิด
              </button>
            </div>
          </div>

          {/* Close X top-right */}
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center text-lg backdrop-blur-sm transition-colors z-10"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
