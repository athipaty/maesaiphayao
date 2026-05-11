import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement } from '../services/api'
import { NewsSection } from '../components/NewsSection'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

/* Thai short-date formatter */
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return ''
  }
}

/* Generic list skeleton */
function ListSkeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse divide-y divide-gray-50">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-3 py-2.5 flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-100 rounded flex-shrink-0" />
          <div className="flex-1 h-3 bg-gray-100 rounded" />
          <div className="w-20 h-3 bg-gray-100 rounded flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

/* Reusable tab + table component */
function TabbedList({ tabs, activeTab, onTabChange, rows, emptyMsg = 'ยังไม่มีข้อมูล' }) {
  return (
    <div className="card">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        {tabs.map(t => (
          <button key={t.key} onClick={() => onTabChange(t.key)}
            className={`tab-btn ${activeTab === t.key ? 'tab-btn-active' : 'tab-btn-idle'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {rows === null ? (
          <ListSkeleton />
        ) : rows.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            <div className="text-2xl mb-2">📭</div>
            {emptyMsg}
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {rows.map((item, i) => {
                const href = item.fileUrl || item.image || item.externalUrl || null
                const date = formatDate(item.createdAt || item.date)
                return (
                  <tr key={item._id}
                    className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors group">
                    <td className="px-3 py-2.5 w-9 text-center">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-bold bg-blue-50 text-primary border border-blue-100">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer"
                          className="text-primary group-hover:text-secondary group-hover:underline transition-colors">
                          {item.title}
                        </a>
                      ) : (
                        <span className="text-gray-700">{item.title}</span>
                      )}
                    </td>
                    {date && (
                      <td className="px-3 py-2.5 text-right text-[11px] text-gray-400 whitespace-nowrap w-28">
                        {date}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [newsByDept, setNewsByDept] = useState({})
  const [announce, setAnnounce]     = useState(null)
  const [newsletter, setNewsletter] = useState(null)
  const [egp, setEgp]               = useState(null)
  const [procNews, setProcNews]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [prTab, setPrTab]           = useState('announcement')
  const [procTab, setProcTab]       = useState('egp')

  useEffect(() => {
    async function load() {
      try {
        const deptResults = await Promise.all(
          DEPARTMENTS.map(dept => getNews({ dept, limit: 3 }))
        )
        const map = {}
        DEPARTMENTS.forEach((dept, i) => { map[dept] = deptResults[i]?.data || [] })
        setNewsByDept(map)

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
        setAnnounce([]); setNewsletter([]); setEgp([]); setProcNews([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* Active rows for each tabbed list */
  const prRows   = prTab === 'announcement'   ? announce   : newsletter
  const procRows = procTab === 'egp'           ? egp        : procNews

  return (
    <div className="space-y-1">

      {/* ── News per department ─────────────────────────────── */}
      {DEPARTMENTS.map(dept => (
        <NewsSection
          key={dept}
          dept={dept}
          items={newsByDept[dept] || []}
          loading={loading}
        />
      ))}

      {/* ── Announcements + Newsletter ──────────────────────── */}
      <TabbedList
        tabs={[
          { key: 'announcement', label: '📢 ข่าวประชาสัมพันธ์' },
          { key: 'newsletter',   label: '📰 จดหมายข่าว' },
        ]}
        activeTab={prTab}
        onTabChange={setPrTab}
        rows={prRows}
        emptyMsg="ยังไม่มีข้อมูล"
      />

      {/* ── Procurement ─────────────────────────────────────── */}
      <TabbedList
        tabs={[
          { key: 'egp',  label: '📋 รายงานจัดซื้อจัดจ้าง (EGP)' },
          { key: 'news', label: '🗞️ ข่าวการจัดซื้อจัดจ้าง' },
        ]}
        activeTab={procTab}
        onTabChange={setProcTab}
        rows={procRows}
        emptyMsg="ยังไม่มีข้อมูล"
      />

    </div>
  )
}
