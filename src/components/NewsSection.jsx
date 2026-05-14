import { Link } from 'react-router-dom'

const DEPT_ICONS = {
  council:     '🏛️',
  office:      '📋',
  childdev:    '🧒',
  disaster:    '🚒',
  health:      '🏥',
  engineering: '🔧',
  finance:     '💰',
}

const DEPT_LABELS = {
  council:     'กิจการสภา',
  office:      'สำนักปลัด',
  childdev:    'ศูนย์พัฒนาเด็กเล็ก',
  disaster:    'ป้องกันและบรรเทาสาธารณภัย',
  health:      'กองสาธารณสุขและสิ่งแวดล้อม',
  engineering: 'กองช่าง',
  finance:     'กองคลัง',
}

export function NewsSection({ dept, items = [], loading }) {
  return (
    <div className="card">
      <div className="section-head flex items-center justify-between">
        <h3 className="text-sm font-semibold">✨ ข่าวสาร กิจกรรม {DEPT_LABELS[dept]}</h3>
        <Link to={`/news/${dept}`}
          className="text-xs bg-white/20 hover:bg-white/35 transition-colors px-3 py-1 rounded-full ml-auto">
          ดูทั้งหมด »
        </Link>
      </div>
      {loading ? (
        <div className="px-3 py-2 text-gray-400 text-sm">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="px-3 py-2 text-gray-400 text-sm">ยังไม่มีข่าวสาร</div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {items.slice(0, 2).map(item => {
            const img = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
            return (
              <Link to={`/news/detail/${item._id}`} key={item._id}
                className="p-2 hover:bg-blue-50 transition-colors block bg-white">
                {img ? (
                  <img src={img} alt={item.title} className="w-full h-24 object-cover rounded mb-1.5" />
                ) : (
                  <div className="w-full h-24 rounded mb-1.5 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">
                    {DEPT_ICONS[dept] || '📰'}
                  </div>
                )}
                <p className="text-xs font-medium text-primary truncate">{item.title}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { DEPT_LABELS, DEPT_ICONS }