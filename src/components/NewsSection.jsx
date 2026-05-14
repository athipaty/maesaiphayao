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
        <ul className="divide-y divide-gray-50">
          {items.slice(0, 2).map((item, i) => (
            <li key={item._id}>
              <Link to={`/news/detail/${item._id}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-xs text-gray-700 truncate flex-1">{item.title}</span>
                <span className="text-xs text-secondary flex-shrink-0">»</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { DEPT_LABELS, DEPT_ICONS }