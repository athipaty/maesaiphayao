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

/* Thai short-date formatter */
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    })
  } catch {
    return ''
  }
}

/* Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div className="p-3 animate-pulse">
      <div className="w-full h-44 bg-gray-100 rounded-lg mb-2" />
      <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  )
}

export function NewsSection({ dept, items = [], loading }) {
  return (
    <div className="card">
      {/* Section header */}
      <div className="section-head">
        <div className="flex items-center gap-2">
          <span className="text-base">{DEPT_ICONS[dept] || '📰'}</span>
          <h3 className="text-sm font-bold tracking-wide">
            ข่าวสาร กิจกรรม {DEPT_LABELS[dept]}
          </h3>
        </div>
        <Link
          to={`/news/${dept}`}
          className="text-xs bg-white/20 hover:bg-white/35 transition-colors px-3 py-1 rounded-full ml-auto whitespace-nowrap">
          ดูทั้งหมด »
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          <div className="text-3xl mb-2">📭</div>
          ยังไม่มีข่าวสาร
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {items.slice(0, 3).map(item => {
            const img = Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : item.image
            return (
              <Link to={`/news/detail/${item._id}`} key={item._id}
                className="p-3 hover:bg-blue-50/60 transition-colors block group">

                {/* Thumbnail with zoom */}
                <div className="news-img-wrap w-full h-44 rounded-lg mb-2 overflow-hidden">
                  {img ? (
                    <img src={img} alt={item.title}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl">
                      {DEPT_ICONS[dept] || '📰'}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-xs font-semibold text-gray-800 group-hover:text-primary mb-1.5 leading-snug line-clamp-2 transition-colors"
                  title={item.title}>
                  {item.title}
                </h4>

                {/* Meta row */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[11px] text-gray-400">
                    {formatDate(item.createdAt) || `👁 ${item.views ?? 0} ครั้ง`}
                  </span>
                  <span className="text-[11px] text-secondary font-semibold group-hover:underline">
                    อ่านเพิ่ม »
                  </span>
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
