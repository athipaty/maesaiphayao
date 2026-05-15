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
        <div className="grid grid-cols-2 gap-3 p-3">
          {items.slice(0, 2).map(item => {
            const img = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
            const icon = DEPT_ICONS[item.department] || DEPT_ICONS[dept] || '📰'
            const label = DEPT_LABELS[item.department] || DEPT_LABELS[dept] || ''
            return (
              <Link to={`/news/detail/${item._id}`} key={item._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                {img ? (
                  <img src={img} alt={item.title} className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-4xl">
                    {icon}
                  </div>
                )}
                <div className="p-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full mb-2">
                    {icon} {label}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
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

export { DEPT_LABELS, DEPT_ICONS }