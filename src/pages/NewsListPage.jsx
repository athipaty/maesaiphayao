import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getNews } from '../services/api'
import { DEPT_LABELS, DEPT_ICONS } from '../components/NewsSection'

const ALL_DEPTS = Object.keys(DEPT_LABELS)

export default function NewsListPage() {
  const { dept } = useParams()
  const activeDept = dept || ''
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getNews(activeDept ? { dept: activeDept } : {})
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeDept])

  return (
    <div>
      {/* Dept filter tabs */}
      <div className="bg-white rounded-md shadow-sm mb-4 p-3 flex flex-wrap gap-2">
        <Link to="/news"
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !activeDept ? 'bg-secondary text-white border-secondary' : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
          }`}>ทั้งหมด</Link>
        {ALL_DEPTS.map(d => (
          <Link key={d} to={`/news/${d}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeDept === d ? 'bg-secondary text-white border-secondary' : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
            }`}>
            {DEPT_ICONS[d]} {DEPT_LABELS[d]}
          </Link>
        ))}
      </div>

      {/* Header */}
      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">
            {activeDept ? `✨ ข่าวสาร กิจกรรม — ${DEPT_LABELS[activeDept]}` : '✨ ข่าวสารกิจกรรมทั้งหมด'}
          </h2>
          <span className="text-xs opacity-75">{items.length} รายการ</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">ยังไม่มีข่าวสาร</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <Link key={item._id} to={`/news/detail/${item._id}`}
                className="flex gap-3 p-3 hover:bg-blue-50 transition-colors">
                {item.image ? (
                  <img src={item.image} alt={item.title}
                    className="w-24 h-20 object-cover rounded flex-shrink-0" />
                ) : (
                  <div className="w-24 h-20 rounded flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">
                    {DEPT_ICONS[item.department] || '📰'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-primary line-clamp-2 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 mb-1">
                    {DEPT_ICONS[item.department]} {DEPT_LABELS[item.department]}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>👁 {item.views} ครั้ง</span>
                    <span>📅 {new Date(item.publishedAt).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
                <span className="text-xs text-secondary self-center flex-shrink-0">อ่านเพิ่ม »</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}