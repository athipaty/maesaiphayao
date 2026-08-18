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

// Header/title now lives in the SectionBanner rendered above this component (see HomePage.jsx) —
// each department gets its own SectionBanner instead of all departments sharing one, so this is
// just the card body (loading/empty state or the grid of news items).
export function NewsSection({ dept, items = [], loading }) {
  return (
    <div className="card">
      {loading ? (
        <div className="px-3 py-2 text-gray-400 text-sm">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="px-3 py-2 text-gray-400 text-sm">ยังไม่มีข่าวสาร</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3">
          {items.slice(0, 3).map((item, idx) => {
            const img = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
            const icon = DEPT_ICONS[item.department] || DEPT_ICONS[dept] || '📰'
            const label = DEPT_LABELS[item.department] || DEPT_LABELS[dept] || ''
            return (
              <Link to={`/news/detail/${item._id}`} key={item._id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group${idx === 2 ? ' hidden md:block' : ''}`}>
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

// Combined "ข่าวสารกิจกรรม" section — a single flat, date-sorted list across all departments
// (see HomePage.jsx), shown as one full-width hero (the latest item) followed by a 3x3 grid
// of the next 9 items, instead of one grid per department.
export function LatestNewsGrid({ items = [], loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="px-3 py-2 text-gray-400 text-sm">กำลังโหลด...</div>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="card">
        <div className="px-3 py-2 text-gray-400 text-sm">ยังไม่มีข่าวสาร</div>
      </div>
    )
  }

  const [hero, ...rest] = items
  const gridItems = rest.slice(0, 9)

  const heroImg = Array.isArray(hero.images) && hero.images.length > 0 ? hero.images[0] : hero.image
  const heroDept = hero._dept || hero.department
  const heroIcon = DEPT_ICONS[heroDept] || '📰'
  const heroLabel = DEPT_LABELS[heroDept] || ''

  return (
    <div className="space-y-3">
      {/* Hero — latest news item, full width */}
      <Link to={`/news/detail/${hero._id}`}
        className="relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-white">
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
          {heroImg ? (
            <img src={heroImg} alt={hero.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">{heroIcon}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/90 text-primary px-2.5 py-1 rounded-full">
            {heroIcon} {heroLabel}
          </span>
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-4 pt-8">
            <h3 className="text-white text-base sm:text-xl font-bold leading-snug line-clamp-2 drop-shadow group-hover:underline">
              {hero.title}
            </h3>
            <div className="flex items-center gap-3 text-white/70 text-xs mt-2">
              <span>👁 {hero.views} ครั้ง</span>
              <span>📅 {new Date(hero.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Grid — next 9 news items, always 3 columns (3x3) so mobile doesn't leave a dangling last row */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {gridItems.map(item => {
            const img = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
            const dept = item._dept || item.department
            const icon = DEPT_ICONS[dept] || '📰'
            const label = DEPT_LABELS[dept] || ''
            return (
              <Link to={`/news/detail/${item._id}`} key={item._id}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                {img ? (
                  <img src={img} alt={item.title} className="w-full h-20 sm:h-36 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                ) : (
                  <div className="w-full h-20 sm:h-36 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl sm:text-3xl">
                    {icon}
                  </div>
                )}
                <div className="p-1.5 sm:p-2.5">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full mb-1.5">
                    {icon} {label}
                  </span>
                  <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-1.5 leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="hidden sm:flex items-center justify-between text-[10px] text-gray-400">
                    <span>👁 {item.views}</span>
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