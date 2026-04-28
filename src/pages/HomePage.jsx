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
        DEPARTMENTS.forEach((dept, i) => { map[dept] = deptResults[i].data })
        setNewsByDept(map)

        // fetch announcements
        const [ann, nl, e, pn] = await Promise.all([
          getAnnouncements({ type: 'announcement' }),
          getAnnouncements({ type: 'newsletter' }),
          getProcurement({ type: 'egp' }),
          getProcurement({ type: 'news' }),
        ])
        setAnnounce(ann.data)
        setNewsletter(nl.data)
        setEgp(e.data)
        setProcNews(pn.data)
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
      {/* Hero */}
      <div className="w-full h-56 bg-gradient-to-r from-primary via-secondary to-accent rounded-md mb-4 flex flex-col items-center justify-center text-white gap-2 shadow-sm">
        <div className="text-4xl">🏛️</div>
        <h2 className="text-xl font-bold">องค์การบริหารส่วนตำบลแม่ใส</h2>
        <p className="text-sm opacity-85">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา</p>
      </div>

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
        <div className="flex border-b border-gray-200">
          {[
            { key: 'announcement', label: 'ข่าวประชาสัมพันธ์' },
            { key: 'newsletter',   label: 'จดหมายข่าว' },
          ].map(t => (
            <button key={t.key} onClick={() => setPrTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                prTab === t.key
                  ? 'border-secondary text-primary bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          {prTab === 'announcement' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 text-left text-primary font-semibold w-10">ที่</th>
                  <th className="px-3 py-2 text-left text-primary font-semibold">รายการ</th>
                </tr>
              </thead>
              <tbody>
                {announce.length === 0 && (
                  <tr><td colSpan={2} className="px-3 py-4 text-center text-gray-400">ยังไม่มีข้อมูล</td></tr>
                )}
                {announce.map((a, i) => (
                  <tr key={a._id} className="border-b border-gray-50 hover:bg-blue-50/50">
                    <td className="px-3 py-2 text-gray-400 text-center">{i + 1}</td>
                    <td className="px-3 py-2">
                      {a.fileUrl
                        ? <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-secondary">{a.title}</a>
                        : <span className="text-gray-700">{a.title}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {prTab === 'newsletter' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 text-left text-primary font-semibold w-10">ที่</th>
                  <th className="px-3 py-2 text-left text-primary font-semibold">หัวเรื่อง</th>
                </tr>
              </thead>
              <tbody>
                {newsletter.length === 0 && (
                  <tr><td colSpan={2} className="px-3 py-4 text-center text-gray-400">ยังไม่มีข้อมูล</td></tr>
                )}
                {newsletter.map((n, i) => (
                  <tr key={n._id} className="border-b border-gray-50 hover:bg-blue-50/50">
                    <td className="px-3 py-2 text-gray-400 text-center">{i + 1}</td>
                    <td className="px-3 py-2">
                      {n.image
                        ? <a href={n.image} target="_blank" rel="noreferrer" className="text-primary hover:text-secondary">{n.title}</a>
                        : <span className="text-gray-700">{n.title}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Procurement tabs */}
      <div className="card">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'egp',  label: 'รายงานจัดซื้อจัดจ้าง (EGP)' },
            { key: 'news', label: 'ข่าวการจัดซื้อจัดจ้าง' },
          ].map(t => (
            <button key={t.key} onClick={() => setProcTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                procTab === t.key
                  ? 'border-secondary text-primary bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {(procTab === 'egp' ? egp : procNews).length === 0 && (
                <tr><td className="px-3 py-4 text-center text-gray-400">ยังไม่มีข้อมูล</td></tr>
              )}
              {(procTab === 'egp' ? egp : procNews).map((p, i) => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-blue-50/50">
                  <td className="px-3 py-2">
                    <span className="inline-block bg-blue-50 text-primary border border-blue-100 rounded text-xs px-1.5 py-0.5 font-semibold mr-2">
                      {i + 1}
                    </span>
                    {p.externalUrl
                      ? <a href={p.externalUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline">{p.title}</a>
                      : <span className="text-gray-700">{p.title}</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}