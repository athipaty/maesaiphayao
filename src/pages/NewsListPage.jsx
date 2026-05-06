import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getNews } from '../services/api'
import { DEPT_LABELS, DEPT_ICONS } from '../components/NewsSection'

const ALL_DEPTS = Object.keys(DEPT_LABELS)

export default function NewsListPage() {
  const { dept } = useParams()
  const activeDept = dept || ''
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getNews(activeDept ? { dept: activeDept } : {})
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeDept])

  const pageTitle = activeDept
    ? `${DEPT_ICONS[activeDept] || '✨'} ข่าวสาร — ${DEPT_LABELS[activeDept]}`
    : '✨ ข่าวสารกิจกรรมทั้งหมด'

  return (
    <div>
      {/* Header — same style as AboutPage */}
      <div className="card mb-4">
        <div className="section-head">
          <h1 className="text-sm font-semibold">{pageTitle}</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          {activeDept
            ? `ข่าวสารและกิจกรรมของ${DEPT_LABELS[activeDept]} องค์การบริหารส่วนตำบลแม่ใส`
            : 'ข่าวสารและกิจกรรมทั้งหมดขององค์การบริหารส่วนตำบลแม่ใส ครอบคลุมทุกกองและหน่วยงาน'}
        </div>
      </div>

      {/* Dept filter */}
      <div className="bg-white rounded-xl shadow-sm mb-4 p-3 flex flex-wrap gap-2">
        <Link to="/news"
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
            !activeDept
              ? 'bg-secondary text-white border-secondary'
              : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
          }`}>
          ทั้งหมด
        </Link>
        {ALL_DEPTS.map(d => (
          <Link key={d} to={`/news/${d}`}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              activeDept === d
                ? 'bg-secondary text-white border-secondary'
                : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
            }`}>
            {DEPT_ICONS[d]} {DEPT_LABELS[d]}
          </Link>
        ))}
      </div>

      {/* News cards */}
      {loading ? (
        <div className="card p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข่าวสาร</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const img = Array.isArray(item.images) && item.images.length > 0
              ? item.images[0] : item.image
            const deptIcon = DEPT_ICONS[item.department] || '📰'
            const deptLabel = DEPT_LABELS[item.department] || item.department

            return (
              <Link key={item._id} to={`/news/detail/${item._id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                {/* Image */}
                {img ? (
                  <img src={img} alt={item.title}
                    className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-4xl">
                    {deptIcon}
                  </div>
                )}

                {/* Content */}
                <div className="p-3">
                  {/* Dept badge */}
                  <span className="inline-flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full mb-2">
                    {deptIcon} {deptLabel}
                  </span>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>👁 {item.views} ครั้ง</span>
                    <span>📅 {new Date(item.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
