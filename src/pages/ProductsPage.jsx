import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import PageHeader from '../components/PageHeader'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="bg-gray-200 aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-px bg-gray-100 mt-3" />
        <div className="flex justify-between pt-1">
          <div className="h-3 bg-gray-100 rounded w-20" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [items, setItems] = useState([])
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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-gray-600 font-semibold">ยังไม่มีข้อมูลสินค้า</p>
          <p className="text-gray-400 text-sm mt-1">กรุณาติดต่อเจ้าหน้าที่เพื่อเพิ่มข้อมูล</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => {
            const imgs = Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : item.image ? [item.image] : []
            const mainImg = imgs[0]
            const extraImgs = imgs.slice(1, 5)

            return (
              <div key={item._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">

                {/* Main image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
                  {mainImg
                    ? <img src={mainImg} alt={item.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🎨</div>
                  }
                  {item.price != null && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      ฿{Number(item.price).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Extra thumbnails */}
                {extraImgs.length > 0 && (
                  <div className="flex gap-1 px-3 pt-2">
                    {extraImgs.map((img, idx) => (
                      <div key={idx} className="relative flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                        {idx === 3 && imgs.length > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                            +{imgs.length - 5}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-800 leading-snug mb-1.5">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      👁 <span>{(item.views || 0).toLocaleString()} ครั้ง</span>
                    </span>
                    <span className="text-[11px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
                      OTOP
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
