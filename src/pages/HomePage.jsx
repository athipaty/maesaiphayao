import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement, getTravel } from '../services/api'
import { NewsSection } from '../components/NewsSection'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

export default function HomePage() {
  const [newsByDept, setNewsByDept]     = useState({})
  const [announce, setAnnounce]         = useState([])
  const [newsletter, setNewsletter]     = useState([])
  const [egp, setEgp]                   = useState([])
  const [procNews, setProcNews]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [travel, setTravel]             = useState([])
  const [prTab, setPrTab]               = useState('announcement')
  const [procTab, setProcTab]           = useState('egp')

  useEffect(() => {
    async function load() {
      try {
        // fetch news per dept (3 each)
        const deptResults = await Promise.all(
          DEPARTMENTS.map(dept => getNews({ dept, limit: 3 }))
        )
        const map = {}
        DEPARTMENTS.forEach((dept, i) => { map[dept] = deptResults[i]?.data || [] })
        setNewsByDept(map)

        // fetch announcements
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
      {/* News sections per department */}
      {DEPARTMENTS.map(dept => (
        <NewsSection
          key={dept}
          dept={dept}
          items={newsByDept[dept] || []}
          loading={loading}
        />
      ))}

      {/* Announcements + Newsletter tabs */}
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

      {/* Travel places — infinite marquee */}
      {travel.length > 0 && (
        <div className="card overflow-hidden">
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

          <div className="overflow-hidden py-3">
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
                    {item.description && (
                      <p className="px-3 py-2 text-[11px] text-gray-500 line-clamp-3 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Procurement tabs */}
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
    </div>
  )
}