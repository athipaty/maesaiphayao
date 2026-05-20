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
          @keyframes siren-blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.15)} }
          @keyframes float-sticker { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
          @keyframes float-sticker2 { 0%,100%{transform:translateY(0) rotate(10deg)} 50%{transform:translateY(-5px) rotate(-5deg)} }
          @keyframes glow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.5),0 4px 20px rgba(220,38,38,0.3)} 50%{box-shadow:0 0 0 10px rgba(220,38,38,0),0 4px 30px rgba(220,38,38,0.5)} }
          @keyframes shimmer-bg { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
          .siren-blink  { animation: siren-blink 1s ease-in-out infinite; }
          .float-s1     { animation: float-sticker 3s ease-in-out infinite; }
          .float-s2     { animation: float-sticker2 2.5s ease-in-out infinite; }
          .float-s3     { animation: float-sticker 3.5s ease-in-out 0.5s infinite; }
          .glow-pulse   { animation: glow-pulse 2s ease-in-out infinite; }
          .shimmer-btn  { background-size: 200% 200%; animation: shimmer-bg 3s ease infinite; }
        `}</style>

        {/* ── Header ── */}
        <div className="relative overflow-hidden px-4 py-4"
          style={{ background: 'linear-gradient(135deg,#450a0a 0%,#991b1b 40%,#dc2626 80%,#f87171 100%)' }}>
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:'-30px', right:'-20px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'absolute', bottom:'-40px', left:'-15px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'absolute', top:'10px', right:'60px', width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>

          <div className="relative z-10 flex items-center gap-3">
            <span className="text-4xl siren-blink" style={{ filter:'drop-shadow(0 0 8px rgba(255,200,0,0.8))' }}>🚨</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-black text-lg tracking-wider">เบอร์ฉุกเฉิน</h3>
                <span className="text-[10px] font-bold text-red-900 px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(255,220,0,0.9)' }}>📢 EMERGENCY</span>
              </div>
              <p className="text-red-200 text-xs mt-0.5">อบต.แม่ใส · กดโทรได้ทันที · 24 ชม.</p>
            </div>
            <div className="text-center">
              <div className="text-white text-2xl">☎️</div>
              <div className="text-red-200 text-[9px] font-bold">24 / 7</div>
            </div>
          </div>

          {/* Floating stickers in header */}
          <span className="float-s1" style={{ position:'absolute', top:'6px', right:'50px', fontSize:'20px', opacity:0.5 }}>⭐</span>
          <span className="float-s2" style={{ position:'absolute', bottom:'5px', right:'18px', fontSize:'15px', opacity:0.45 }}>✨</span>
          <span className="float-s3" style={{ position:'absolute', top:'12px', left:'55%', fontSize:'13px', opacity:0.35 }}>💫</span>
        </div>

        <div className="p-3 space-y-3" style={{ background:'linear-gradient(180deg,#fff5f5 0%,#fff 60%)' }}>

          {/* ── 1669 Hero Card ── */}
          <div className="relative mt-2">
            {/* Floating stickers around hero */}
            <span className="float-s1" style={{ position:'absolute', top:'-14px', left:'18px', fontSize:'26px', zIndex:10, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>❤️</span>
            <span className="float-s2" style={{ position:'absolute', top:'-16px', right:'22px', fontSize:'28px', zIndex:10, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>💊</span>
            <span className="float-s3" style={{ position:'absolute', bottom:'-10px', right:'50px', fontSize:'20px', zIndex:10, filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}>🩺</span>

            <a href="tel:1669" className="glow-pulse flex items-center gap-4 rounded-2xl p-4 pt-6 pb-4 hover:scale-[1.01] transition-transform"
              style={{ background:'linear-gradient(135deg,#dc2626 0%,#9b1c1c 100%)', textDecoration:'none', display:'flex' }}>
              <div style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(4px)', borderRadius:'50%', width:'68px', height:'68px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'38px', flexShrink:0, border:'2px solid rgba(255,255,255,0.3)' }}>
                🚑
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-red-200 text-xs font-semibold mb-0.5">🏥 เจ็บป่วยฉุกเฉิน</p>
                <p className="text-white font-black leading-none tracking-widest" style={{ fontSize:'42px' }}>1669</p>
                <p className="text-red-300 text-[10px]">Emergency Medical Service</p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0, border:'2px solid rgba(255,255,255,0.3)' }}>
                📞
              </div>
            </a>
          </div>

          {/* ── Section divider ── */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background:'linear-gradient(to right,transparent,#fca5a5)' }}/>
            <span className="text-[10px] font-bold text-red-400 px-2 flex items-center gap-1">👥 ติดต่อเจ้าหน้าที่</span>
            <div className="h-px flex-1" style={{ background:'linear-gradient(to left,transparent,#fca5a5)' }}/>
          </div>

          {/* ── Official contacts grid ── */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:'นายก อบต.แม่ใส',  phone:'0897577366', display:'089-757-7366', icon:'👨‍💼', sticker:'⭐', bg:'linear-gradient(135deg,#dbeafe,#eff6ff)', border:'#93c5fd', text:'#1d4ed8' },
              { label:'ปลัด อบต.แม่ใส',  phone:'0987496770', display:'098-749-6770', icon:'📋', sticker:'✅', bg:'linear-gradient(135deg,#dcfce7,#f0fdf4)', border:'#86efac', text:'#15803d' },
              { label:'นักป้องกันฯ',      phone:'0812635432', display:'081-263-5432', icon:'🚒', sticker:'🔥', bg:'linear-gradient(135deg,#ffedd5,#fff7ed)', border:'#fdba74', text:'#c2410c' },
              { label:'ป้องกัน อบต.',     phone:'054889809',  display:'054-889-809',  icon:'🛡️', sticker:'💪', bg:'linear-gradient(135deg,#ffedd5,#fff7ed)', border:'#fdba74', text:'#c2410c' },
              { label:'รพ.สต.แม่ใส',     phone:'054889885',  display:'054-889-885',  icon:'🏥', sticker:'💚', bg:'linear-gradient(135deg,#dcfce7,#f0fdf4)', border:'#86efac', text:'#15803d' },
            ].map(({ label, phone, display, icon, sticker, bg, border, text }) => (
              <a key={phone} href={`tel:${phone}`}
                className="relative rounded-xl px-3 py-2.5 hover:scale-[1.03] transition-transform"
                style={{ background:bg, border:`1.5px solid ${border}`, textDecoration:'none', display:'block' }}>
                <span style={{ position:'absolute', top:'-9px', right:'8px', fontSize:'15px', filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>{sticker}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold leading-tight text-gray-400 truncate">{label}</p>
                    <p className="text-sm font-bold leading-tight" style={{ color:text }}>{display}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* ── Utility hotlines ── */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background:'linear-gradient(to right,transparent,#d1d5db)' }}/>
            <span className="text-[10px] font-bold text-gray-400 px-2 flex items-center gap-1">⚙️ สายด่วนสาธารณูปโภค</span>
            <div className="h-px flex-1" style={{ background:'linear-gradient(to left,transparent,#d1d5db)' }}/>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label:'ไฟฟ้า',  number:'1129', icon:'⚡', deco:'💡', bg:'linear-gradient(135deg,#fef3c7,#fefce8)', border:'#fde047', text:'#713f12' },
              { label:'ประปา',  number:'1662', icon:'💧', deco:'🚰', bg:'linear-gradient(135deg,#dbeafe,#eff6ff)', border:'#93c5fd', text:'#1e3a8a' },
              { label:'ตำรวจ', number:'191',  icon:'👮', deco:'🚔', bg:'linear-gradient(135deg,#ede9fe,#f5f3ff)', border:'#c4b5fd', text:'#4c1d95' },
            ].map(({ label, number, icon, deco, bg, border, text }) => (
              <a key={number} href={`tel:${number}`}
                className="relative flex flex-col items-center gap-0.5 rounded-xl py-3 hover:scale-[1.04] transition-transform text-center overflow-hidden"
                style={{ background:bg, border:`1.5px solid ${border}`, textDecoration:'none' }}>
                <span style={{ position:'absolute', top:'4px', right:'6px', fontSize:'11px', opacity:0.35 }}>{deco}</span>
                <span className="text-2xl">{icon}</span>
                <p className="text-[10px] font-bold mt-0.5" style={{ color:text }}>{label}</p>
                <p className="text-2xl font-black tracking-wider" style={{ color:text }}>{number}</p>
              </a>
            ))}
          </div>

          {/* ── Footer note ── */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-0.5">
            <span className="text-base">🌙</span>
            <p className="text-[10px] text-gray-400 text-center">บริการ 24 ชั่วโมง ทุกวัน ไม่เว้นวันหยุดราชการ</p>
            <span className="text-base">☀️</span>
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
