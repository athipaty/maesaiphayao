import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'

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
    <div className="card">
      <div className="section-head">
        <h2 className="text-sm font-semibold">🛍️ สินค้าผลิตภัณฑ์ตำบลแม่ใส (OTOP)</h2>
      </div>
      {loading ? (
        <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-gray-400">ยังไม่มีข้อมูลสินค้า</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {items.map(item => (
            <div key={item._id} className="border border-gray-100 rounded-md overflow-hidden hover:shadow-md transition-shadow">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-4xl">🎨</div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-primary mb-1">{item.title}</h3>
                {item.description && <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>}
                <p className="text-xs text-gray-400 mt-2">👁 {item.views} ครั้ง</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}