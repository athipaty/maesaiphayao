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
      <div className="section-head">
        <h3 className="text-sm font-semibold">✨ ข่าวสาร กิจกรรม {DEPT_LABELS[dept]}</h3>
        <Link to={`/news/${dept}`}
          className="text-xs bg-white/20 hover:bg-white/35 transition-colors px-3 py-1 rounded-full">
          ดูทั้งหมด
        </Link>
      </div>
      {loading ? (
        <div className="p-6 text-center text-gray-400 text-sm">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center text-gray-400 text-sm">ยังไม่มีข่าวสาร</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {items.slice(0, 3).map(item => (
            <Link to={`/news/detail/${item._id}`} key={item._id}
              className="p-3 hover:bg-blue-50 transition-colors block">
              {item.image ? (
                <img src={item.image} alt={item.title}
                  className="w-full h-24 object-cover rounded mb-2" />
              ) : (
                <div className="w-full h-24 rounded mb-2 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl">
                  {DEPT_ICONS[dept] || '📰'}
                </div>
              )}
              <h4 className="text-xs font-semibold text-primary leading-snug mb-1 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-gray-400 mb-1">👁 {item.views} ครั้ง</p>
              <span className="text-xs text-secondary font-medium">อ่านเพิ่ม »</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export { DEPT_LABELS, DEPT_ICONS }