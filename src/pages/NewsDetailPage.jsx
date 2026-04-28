import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNewsById } from '../services/api'
import { DEPT_LABELS, DEPT_ICONS } from '../components/NewsSection'

export default function NewsDetailPage() {
  const { id } = useParams()
  const [item, setItem]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewsById(id)
      .then(r => setItem(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
  if (!item)   return <div className="p-10 text-center text-gray-400">ไม่พบข้อมูล</div>

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
        <Link to="/" className="hover:text-secondary">หน้าหลัก</Link>
        <span>›</span>
        <Link to={`/news/${item.department}`} className="hover:text-secondary">
          {DEPT_LABELS[item.department]}
        </Link>
        <span>›</span>
        <span className="text-gray-600 line-clamp-1">{item.title}</span>
      </nav>

      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">
            {DEPT_ICONS[item.department]} {DEPT_LABELS[item.department]}
          </h2>
        </div>
        <div className="p-5">
          <h1 className="text-lg font-bold text-primary leading-snug mb-3">{item.title}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pb-3 border-b border-gray-100">
            <span>👁 {item.views} ครั้ง</span>
            <span>📅 {new Date(item.publishedAt).toLocaleDateString('th-TH', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
          </div>
          {/* รูปภาพ — รองรับทั้ง single image และ multiple images */}
          {Array.isArray(item.images) && item.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {item.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${item.title} ${idx + 1}`}
                  className="w-full max-h-72 object-cover rounded-md" />
              ))}
            </div>
          ) : item.image ? (
            <img src={item.image} alt={item.title}
              className="w-full max-h-80 object-cover rounded-md mb-5" />
          ) : null}
          {item.content ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <p className="text-gray-400 text-sm">ไม่มีเนื้อหาเพิ่มเติม</p>
          )}
        </div>
      </div>

      <Link to={`/news/${item.department}`}
        className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary mt-2">
        ‹ กลับไปหน้ารายการ
      </Link>
    </div>
  )
}