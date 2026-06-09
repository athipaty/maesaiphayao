import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNewsById } from '../services/api'
import { DEPT_LABELS, DEPT_ICONS } from '../components/NewsSection'

export default function NewsDetailPage() {
  const { id } = useParams()
  const [item, setItem]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [lightboxImg, setLightbox] = useState(null)

  useEffect(() => {
    getNewsById(id)
      .then(r => setItem(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
  if (!item)   return <div className="p-10 text-center text-gray-400">ไม่พบข้อมูล</div>

  const allImages  = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : item.image ? [item.image] : []
  const firstImage = allImages[0] || null
  const restImages = allImages.slice(1)

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
        <Link to="/news" className="hover:text-secondary">ข่าวสารทั้งหมด</Link>
        <span>›</span>
        <Link to={`/news/${item.department}`} className="hover:text-secondary">
          {DEPT_LABELS[item.department]}
        </Link>
        <span>›</span>
        <span className="text-gray-600 truncate max-w-[200px]">{item.title}</span>
      </nav>

      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">
            {DEPT_ICONS[item.department]} {DEPT_LABELS[item.department]}
          </h2>
        </div>

        <div className="p-5">
          {/* หัวข้อ */}
          <h1 className="text-lg font-bold text-primary leading-snug mb-2">{item.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 pb-3 border-b border-gray-100">
            <span>👁 {item.views} ครั้ง</span>
            <span>📅 {new Date(item.publishedAt).toLocaleDateString('th-TH', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
          </div>

          {/* รูปแรก — เต็มความกว้าง */}
          {firstImage && (
            <img src={firstImage} alt={item.title}
              className="w-full object-cover rounded-md mb-5 shadow-sm"
              style={{ maxHeight: '480px' }}
            />
          )}

          {/* เนื้อหาข่าว */}
          {item.content ? (
            <div
              className="text-sm text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <p className="text-gray-400 text-sm mb-6">ไม่มีเนื้อหาเพิ่มเติม</p>
          )}

          {/* รูปที่เหลือ — grid 2-3 คอลัมน์ */}
          {restImages.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">รูปภาพเพิ่มเติม ({restImages.length} รูป)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {restImages.map((img, idx) => (
                  <img key={idx} src={img} alt={`${item.title} ${idx + 2}`}
                    onClick={() => setLightbox(img)}
                    className="w-full h-60 object-cover rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}>
          <img src={lightboxImg} alt="enlarged"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()} />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/35 text-white rounded-full text-xl transition-colors">
            ×
          </button>
        </div>
      )}

      <Link to="/news" onClick={() => window.scrollTo(0, 0)}
        className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary mt-3">
        ‹ กลับไปหน้าข่าวสาร
      </Link>
    </div>
  )
}