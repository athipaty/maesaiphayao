import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import PageHeader from '../components/PageHeader'

export default function ProductsPage() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader icon="🛍️" title="สินค้าผลิตภัณฑ์ตำบลแม่ใส (OTOP)"
        desc="สินค้าและผลิตภัณฑ์ชุมชนของตำบลแม่ใส ส่งเสริมภูมิปัญญาท้องถิ่นและเพิ่มรายได้ให้ประชาชน" />
      <div className="card">
      {loading ? (
        <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-gray-400">ยังไม่มีข้อมูลสินค้า</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {items.map(item => (
            <div key={item._id} className="border border-gray-100 rounded-md overflow-hidden hover:shadow-md transition-shadow">
              {(() => {
                const imgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.image ? [item.image] : []
                const first = imgs[0]
                return first
                  ? <img src={first} alt={item.title} className="w-full h-64 object-cover" />
                  : <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-4xl">🎨</div>
              })()}
              {/* extra images grid */}
              {Array.isArray(item.images) && item.images.length > 1 && (
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {item.images.slice(1).map((img, idx) => (
                    <img key={idx} src={img} alt={`extra-${idx}`} className="w-full h-20 object-cover" />
                  ))}
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
                  {item.price != null && (
                    <span className="flex-shrink-0 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      S${Number(item.price).toFixed(2)}
                    </span>
                  )}
                </div>
                {item.description && <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>}
                <p className="text-xs text-gray-400 mt-2">👁 {item.views} ครั้ง</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}