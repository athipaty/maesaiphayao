import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getNews, getAnnouncements, getProcurement, getStaff, getTravel, getProducts } from '../../services/api'

const CARDS = [
  { label: 'ข่าวสารกิจกรรม',   icon: '📰', path: '/admin/news',          fetch: () => getNews({ all: 1 })           },
  { label: 'ประชาสัมพันธ์',     icon: '📢', path: '/admin/announcements', fetch: () => getAnnouncements({ all: 1 })  },
  { label: 'จัดซื้อจัดจ้าง',   icon: '📦', path: '/admin/procurement',   fetch: () => getProcurement({ all: 1 })    },
  { label: 'บุคลากร',           icon: '👥', path: '/admin/staff',         fetch: () => getStaff({ all: 1 })          },
  { label: 'สถานที่ท่องเที่ยว', icon: '🗺️', path: '/admin/travel',        fetch: () => getTravel({ all: 1 })         },
  { label: 'สินค้า OTOP',       icon: '🛍️', path: '/admin/products',      fetch: () => getProducts({ all: 1 })       },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    CARDS.forEach(card => {
      card.fetch()
        .then(r => setCounts(prev => ({ ...prev, [card.label]: r.data.length })))
        .catch(() => setCounts(prev => ({ ...prev, [card.label]: '-' })))
    })
  }, [])

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-800 mb-5">📊 Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {CARDS.map(c => (
          <Link key={c.label} to={c.path}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <p className="text-xs text-gray-400">{c.label}</p>
              <p className="text-2xl font-bold text-primary">
                {counts[c.label] ?? '...'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">🔗 ลิงค์ด่วน</h2>
        <div className="flex flex-wrap gap-2">
          {CARDS.map(c => (
            <Link key={c.label} to={c.path} className="btn-ghost text-xs">
              {c.icon} เพิ่ม{c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}