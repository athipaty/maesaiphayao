import { useState, useEffect } from 'react'
import { getTravel } from '../services/api'
import PageHeader from '../components/PageHeader'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="bg-gray-200 aspect-video w-full" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-20 mt-2" />
      </div>
    </div>
  )
}

export default function TravelPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTravel()
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader icon="🗺️" title="แนะนำสถานที่ท่องเที่ยว"
        desc="แหล่งท่องเที่ยวและสถานที่น่าสนใจในตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="text-6xl mb-4">🏞️</div>
          <p className="text-gray-600 font-semibold">ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</p>
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

                {/* Hero image with title overlay */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-teal-50 to-blue-100">
                  {mainImg
                    ? <img src={mainImg} alt={item.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🏞️</div>
                  }
                  {/* gradient overlay — confined to the bottom text strip, rest of the photo stays bright */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.65) 25%, transparent 55%)' }} />
                  {/* title on image */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                    <h3 className="text-white font-bold text-sm leading-snug drop-shadow">{item.title}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-white/70 text-[11px]">📍 ตำบลแม่ใส</span>
                    </div>
                  </div>
                  {/* location badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    🗺️ ท่องเที่ยว
                  </div>
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

                {/* Description + views */}
                <div className="p-4">
                  {item.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      👁 <span>{(item.views || 0).toLocaleString()} ครั้ง</span>
                    </span>
                    <span className="text-[11px] bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full font-semibold">
                      แม่ใส พะเยา
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
