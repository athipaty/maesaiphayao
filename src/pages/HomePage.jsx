import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement, getTravel, getProducts, getVideos, getFacebookPage, getEgpRss, getNotices } from '../services/api'
import { LatestNewsGrid } from '../components/NewsSection'
import { iframeSrc as pdfIframeSrc } from '../components/PdfPreviewPanel'
import { toArabicDigits } from '../utils/thaiNumerals'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

function getYoutubeId(url) {
  if (!url) return ''
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : ''
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Sections already in the initial viewport (e.g. the news sections at the top of the
        // page, compact enough to all fit above the fold with no content yet) can have this
        // callback fire before the browser has ever painted the starting opacity:0/translateY
        // state — flipping straight to "visible" with nothing to transition from, so the fade-in
        // never actually plays, even though the exact same Reveal wrapper is used everywhere.
        // Two rAFs guarantee at least one real paint of the hidden state happens first, so the
        // transition is always visible, not just for sections the user has to scroll to reach.
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
        io.unobserve(el)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal-section ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function SectionBanner({ icon, label, to, toLabel = 'ดูทั้งหมด »' }) {
  return (
    <div className="flex items-center gap-3 mt-5 mb-2 px-1">
      <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1.5 rounded-full shadow-sm">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-bold tracking-wide">{label}</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-secondary/30 to-transparent" />
      {to && (
        <Link to={to} className="text-xs font-semibold text-secondary hover:text-primary transition-colors whitespace-nowrap">
          {toLabel}
        </Link>
      )}
    </div>
  )
}

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
  const [products, setProducts]     = useState([])
  const [videos, setVideos]         = useState([])
  const [prTab, setPrTab]           = useState('announcement')
  const [procTab, setProcTab]       = useState('egp')
  const [egpOpen, setEgpOpen]       = useState({})
  const [notices, setNotices]       = useState([])
  const [noticeOpen, setNoticeOpen] = useState({})
  const [fbPage, setFbPage]         = useState(null)
  const [lightboxItem, setLightboxItem] = useState(null)
  const fbContainerRef = useRef(null)
  const [fbScale, setFbScale] = useState(1)
  const annTrackRef = useRef(null)
  const [annItemWidth, setAnnItemWidth] = useState(320)
  const annDesktopTrackRef = useRef(null)
  const [annDesktopItemWidth, setAnnDesktopItemWidth] = useState(300)

  useEffect(() => {
    function updateScale() {
      if (!fbContainerRef.current) return
      setFbScale(fbContainerRef.current.offsetWidth / 500)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  useEffect(() => {
    function updateAnnWidth() {
      if (!annTrackRef.current) return
      setAnnItemWidth(annTrackRef.current.offsetWidth - 24) // minus px-3 track padding (12px each side)
    }
    updateAnnWidth()
    window.addEventListener('resize', updateAnnWidth)
    return () => window.removeEventListener('resize', updateAnnWidth)
  }, [])

  useEffect(() => {
    function updateDesktopAnnWidth() {
      if (!annDesktopTrackRef.current) return
      // 2 cards per row: subtract px-5 track padding (40px) and 1 gap (gap-4 = 16px)
      setAnnDesktopItemWidth((annDesktopTrackRef.current.offsetWidth - 40 - 16) / 2)
    }
    updateDesktopAnnWidth()
    window.addEventListener('resize', updateDesktopAnnWidth)
    return () => window.removeEventListener('resize', updateDesktopAnnWidth)
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
          DEPARTMENTS.map(dept => getNews({ dept, limit: 10 }))
        )
        const flat = []
        DEPARTMENTS.forEach((dept, i) => {
          const items = deptResults[i]?.data || []
          items.forEach(item => flat.push({ ...item, _dept: dept }))
        })
        flat.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        setAllNews(flat)

        const [ann, nl, pn, tv, pd] = await Promise.all([
          getAnnouncements({ type: 'announcement' }),
          getAnnouncements({ type: 'newsletter' }),
          getProcurement({ type: 'news' }),
          getTravel({ limit: 6 }),
          getProducts({ limit: 6 }),
        ])
        getFacebookPage().then(r => setFbPage(r?.data)).catch(() => {})
        getNotices().then(r => setNotices(Array.isArray(r?.data) ? r.data : [])).catch(() => {})
        getVideos().then(r => setVideos((r?.data || []).slice(0, 6))).catch(() => {})
        setAnnounce(ann?.data || [])
        setNewsletter(nl?.data || [])
        setProcNews(pn?.data || [])

        // Fetch EGP W0: serve from DB immediately, then re-fetch after backend background sync completes
        const fetchEgp = () => getEgpRss({ anounceType: 'W0' })
          .then(r => {
            const d = r?.data || {}
            setEgp(Array.isArray(d) ? d : (d.items || []))
            if (d.notice) setEgpError(d.notice)
          })
          .catch(err => {
            const d = err?.response?.data || {}
            setEgpError(d.notice || d.error || 'ระบบ e-GP ไม่พร้อมให้บริการในขณะนี้')
          })
        fetchEgp().finally(() => {
          setEgpLoading(false)
          // Re-fetch after 6s to pick up items the backend just enriched in the background
          setTimeout(() => fetchEgp(), 6000)
        })
        setTravel((tv?.data || []).slice(0, 6))
        setProducts((pd?.data || []).slice(0, 6))
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

  return (
    <div>

      {/* ── ข่าวสารกิจกรรม — one combined section: latest news as a full-width hero, then a 3x3 grid ── */}
      <Reveal>
        <SectionBanner icon="📰" label="ข่าวสารกิจกรรม" to="/news" />
        <LatestNewsGrid items={allNews} loading={loading} />
      </Reveal>

      {/* ── ประชาสัมพันธ์ ─────────────────────────────────────────────── */}
      <Reveal>
      <SectionBanner icon="📢" label="ข่าวประชาสัมพันธ์ & จดหมายข่าว" to="/announcements" />

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
                animation: ann-marquee ${Math.max((annItemWidth + 12) * annItems.length / 26, 50)}s linear infinite;
              }
              .ann-marquee:hover { animation-play-state: paused; }
            `}</style>

            <div className="overflow-hidden pt-2 pb-3" ref={annTrackRef}>
              <div className="ann-marquee flex gap-3 w-max px-3">
                {[...annItems, ...annItems].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => (item.image || item.fileUrl) && setLightboxItem(item)}
                    style={{ width: `${annItemWidth}px` }}
                    className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
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
      </Reveal>

      {/* ── Announcement marquee — desktop only, full width, 3 cards visible, slides left ───────────── */}
      {annItems.length > 0 && (
      <Reveal>
          <div className="hidden lg:block card p-0 overflow-hidden">
            <style>{`
              @keyframes ann-marquee-desktop {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .ann-marquee-desktop {
                animation: ann-marquee-desktop ${Math.max((annDesktopItemWidth + 16) * annItems.length / 12, 60)}s linear infinite;
              }
              .ann-marquee-desktop:hover { animation-play-state: paused; }
            `}</style>
            <div className="overflow-hidden py-5" ref={annDesktopTrackRef}>
              <div className="ann-marquee-desktop flex gap-4 w-max px-5">
                {[...annItems, ...annItems].map((item, i) => (
              <div key={i}
                onClick={() => item.image ? setLightboxItem(item) : item.fileUrl && window.open(item.fileUrl, '_blank')}
                style={{ width: `${annDesktopItemWidth}px` }}
                className="flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="relative overflow-hidden" style={{
                  height: '460px',
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
                      <span className="text-9xl opacity-40 group-hover:scale-110 transition-transform duration-300">
                        {item._kind === 'newsletter' ? '📰' : '📄'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-sm font-bold bg-white/90 text-primary px-3 py-1.5 rounded-full z-10">
                    {item._kind === 'newsletter' ? '📰 จดหมายข่าว' : '📢 ประชาสัมพันธ์'}
                  </span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-base font-semibold text-gray-800 line-clamp-2 leading-snug mb-2.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {item.createdAt && (
                      <p className="text-sm text-gray-400">
                        📅 {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    )}
                    {item.fileUrl && (
                      <a href={item.fileUrl} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors flex-shrink-0">
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
      </Reveal>
      )}

      {/* ── Facebook ─────────────────────────────────────────────────── */}
      <Reveal>
      <SectionBanner icon="📘" label="Facebook" />
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Facebook widget — crisp at native size, full width on mobile */}
        <div className="card p-0 overflow-hidden flex justify-center w-full lg:w-[500px] lg:flex-shrink-0">
          <div ref={fbContainerRef} className="overflow-hidden w-full max-w-[500px]"
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
        </div>

        {/* Contact info + map — fills the space beside Facebook on desktop, same total height */}
        <div className="hidden lg:flex flex-col gap-4 flex-1" style={{ height: `${Math.round(500 * fbScale)}px` }}>
          <div className="card p-4 flex-shrink-0">
            <h3 className="text-xs font-bold text-primary mb-2">📞 ติดต่อเรา</h3>
            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-sm">📍</span>
                <div>
                  <p className="font-medium">ที่อยู่</p>
                  <p className="text-gray-500">198 ม.12 ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">📞</span>
                <div>
                  <p className="font-medium">โทรศัพท์</p>
                  <a href="tel:054889909" className="text-blue-600 hover:underline font-medium">0-5488-9909</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">📧</span>
                <div>
                  <p className="font-medium">อีเมล</p>
                  <a href="mailto:saraban_06560115@dla.go.th" className="text-blue-600 hover:underline break-all">saraban_06560115@dla.go.th</a>
                  <br />
                  <a href="mailto:maesaiphayao.909@gmail.com" className="text-blue-600 hover:underline break-all">maesaiphayao.909@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm">🕐</span>
                <div>
                  <p className="font-medium">เวลาทำการ</p>
                  <p className="text-gray-500">วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map — fills whatever height remains */}
          <div className="card p-0 overflow-hidden flex-1 min-h-0">
            <iframe
              title="แผนที่ อบต.แม่ใส"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d968.8!2d99.8763!3d19.1322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9d2bf364e9093%3A0x59f89dc1c3f4d41b!2z!5e0!3m2!1sth!2sth!4v1700000000002"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      </Reveal>

      {/* ── Notices (หัวข้อประกาศ) ───────────────────────────────────── */}
      {notices.length > 0 && (
      <Reveal>
      <SectionBanner icon="📋" label="หัวข้อประกาศ" />
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {notices.slice(0, 5).map((n, i) => {
              const open = !!noticeOpen[n._id]
              return (
                <div key={n._id}>
                  {/* Row */}
                  <div
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-blue-50/40 transition-colors cursor-pointer"
                    onClick={() => setNoticeOpen(s => ({ ...s, [n._id]: !s[n._id] }))}
                  >
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="flex-1 min-w-0 text-xs text-gray-800 font-medium truncate">{n.title}</span>
                    {n.topic && (
                      <span className="hidden sm:inline text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">{n.topic}</span>
                    )}
                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      {new Date(n.publishedAt || n.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                    {n.fileUrl && (
                      <span className={`text-[10px] text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
                    )}
                  </div>
                  {/* PDF preview */}
                  {open && (
                    n.fileUrl ? (
                      <div className="px-4 pb-3 bg-blue-50/30">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-gray-400">📄 ตัวอย่างเอกสาร</span>
                          <a href={n.fileUrl} target="_blank" rel="noreferrer"
                            className="text-[10px] font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-full transition-colors">
                            เปิดใน Tab ใหม่ ↗
                          </a>
                        </div>
                        <iframe
                          src={(() => { const m = n.fileUrl.match(/drive\.google\.com\/file\/d\/([^/?#]+)/); if (m) return `https://drive.google.com/file/d/${m[1]}/preview`; if (n.fileUrl.includes('backblazeb2.com')) return n.fileUrl; return `https://docs.google.com/viewer?url=${encodeURIComponent(n.fileUrl)}&embedded=true` })()}
                          className="w-full rounded border border-gray-200"
                          style={{ height: '480px' }}
                          title={n.title}
                        />
                      </div>
                    ) : (
                      <div className="px-4 pb-3 text-[11px] text-gray-400">ไม่มีไฟล์แนบ</div>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>
      )}

      {/* ── Procurement e-GP ─────────────────────────────────────────── */}
      <Reveal>
      <SectionBanner icon="📦" label="ระบบ e-GP (เรียลไทม์)" to="/procurement?tab=egp" />
      <div className="card p-0 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1" style={{ maxHeight: '460px' }}>
          {egpLoading ? (
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
              {egp.slice(0, 8).map((p, i) => {
                const open = !!egpOpen[i]
                return (
                  <div key={i} className="transition-colors">
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50/40 cursor-pointer"
                      onClick={() => setEgpOpen(s => ({ ...s, [i]: !s[i] }))}>
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      {p.link
                        ? <a href={p.link} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex-1 min-w-0 text-sm text-primary hover:text-secondary font-medium truncate">{toArabicDigits(p.title)}</a>
                        : <span className="flex-1 min-w-0 text-sm text-gray-700 font-medium truncate">{toArabicDigits(p.title)}</span>
                      }
                      {p.amount != null && (
                        <span className="text-xs font-semibold text-blue-700 whitespace-nowrap flex-shrink-0">
                          {Number(p.amount).toLocaleString('th-TH', { numberingSystem: 'latn' })} บาท
                        </span>
                      )}
                      <span className={`text-gray-400 text-xs flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
                    </div>
                    {open && (
                      <div className="flex items-center gap-3 px-3 pb-2 pl-9 bg-pink-50/30">
                        {p.winner && (
                          <span className="flex-1 min-w-0 text-xs text-green-700 truncate">🏆 {toArabicDigits(p.winner)}</span>
                        )}
                        {p.date && (
                          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                            📅 {new Date(p.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', numberingSystem: 'latn' })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      </Reveal>

      {/* ── สถานที่ท่องเที่ยว ─────────────────────────────────────────── */}
      {travel.length > 0 && (
      <Reveal>
        <SectionBanner icon="🗺️" label="สถานที่ท่องเที่ยว" to="/travel" />

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

          <div className="overflow-hidden pt-3 pb-4">
            <div className="travel-marquee flex gap-3 w-max">
              {[...travel, ...travel].map((item, i) => {
                const mainImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
                return (
                  <div key={i} className="w-96 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white">
                    <div className="relative overflow-hidden bg-teal-50" style={{ height: '280px' }}>
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
      </Reveal>
      )}

      {/* ── สินค้า OTOP ───────────────────────────────────────────────── */}
      {products.length > 0 && (
      <Reveal>
        <SectionBanner icon="🛍️" label="สินค้า OTOP" to="/products" />

        <div className="card">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
            {products.map((item, i) => {
              const mainImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm group bg-white">
                  <div className="relative overflow-hidden bg-green-50 aspect-[4/3]">
                    {mainImg
                      ? <img src={mainImg} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">🛍️</div>
                    }
                    {item.price != null && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        ฿{Number(item.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-700 px-2 py-1.5 leading-snug line-clamp-2">{item.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>
      )}

      {/* ── วิดีโอ YouTube ────────────────────────────────────────────── */}
      {videos.length > 0 && (
      <Reveal>
        <SectionBanner icon="▶️" label="วีดีทัศน์การดำเนินงานของหน่วยงาน" />

        <div className="card">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
            {videos.map((item, i) => {
              const id = getYoutubeId(item.youtubeUrl)
              if (!id) return null
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${id}`}
                      className="w-full h-full"
                      title={item.title}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 px-2 py-1.5 leading-snug line-clamp-2">{item.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          {/* Content container */}
          <div
            className={`relative w-full max-h-[90vh] flex flex-col items-center ${lightboxItem.fileUrl ? 'max-w-5xl' : 'max-w-3xl'}`}
            onClick={e => e.stopPropagation()}
          >
            {lightboxItem.fileUrl ? (
              <iframe
                src={pdfIframeSrc(lightboxItem.fileUrl)}
                title={lightboxItem.title}
                className="w-full rounded-2xl shadow-2xl bg-white"
                style={{ height: '78vh' }}
              />
            ) : (
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="max-h-[80vh] max-w-full w-auto rounded-2xl shadow-2xl object-contain"
              />
            )}
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
