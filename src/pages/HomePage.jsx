import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement } from '../services/api'
import { NewsSection } from '../components/NewsSection'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

export default function HomePage() {
  const [newsByDept, setNewsByDept]     = useState({})
  const [announce, setAnnounce]         = useState([])
  const [newsletter, setNewsletter]     = useState([])
  const [egp, setEgp]                   = useState([])
  const [procNews, setProcNews]         = useState([])
  const [loading, setLoading]           = useState(true)
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
        const [ann, nl, e, pn] = await Promise.all([
          getAnnouncements({ type: 'announcement' }),
          getAnnouncements({ type: 'newsletter' }),
          getProcurement({ type: 'egp' }),
          getProcurement({ type: 'news' }),
        ])
        setAnnounce(ann?.data || [])
        setNewsletter(nl?.data || [])
        setEgp(e?.data || [])
        setProcNews(pn?.data || [])
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