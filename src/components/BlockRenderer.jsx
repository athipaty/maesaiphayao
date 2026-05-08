import { Link } from 'react-router-dom'

function TextBlock({ data }) {
  const paragraphs = (data.content || '').split(/\n\n+/).filter(Boolean)
  return (
    <div className="card mb-4 px-5 py-4 space-y-3">
      {data.title && <h3 className="text-sm font-semibold text-primary mb-2">{data.title}</h3>}
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{p}</p>
      ))}
    </div>
  )
}

function LinksBlock({ data }) {
  const items = data.items || []
  return (
    <div className="card mb-4 overflow-hidden">
      {data.title && (
        <div className="section-head">
          <h3 className="text-sm font-semibold">{data.title}</h3>
        </div>
      )}
      <ul className="divide-y divide-gray-50">
        {items.map((item, i) => {
          const isExternal = item.external || item.url?.startsWith('http')
          return isExternal ? (
            <li key={i}>
              <a href={item.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors group">
                <span className="text-base w-6 text-center flex-shrink-0">{item.icon || '🔗'}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-gray-300 group-hover:text-secondary text-xs">↗</span>
              </a>
            </li>
          ) : (
            <li key={i}>
              <Link to={item.url || '#'}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors group">
                <span className="text-base w-6 text-center flex-shrink-0">{item.icon || '📄'}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-gray-300 group-hover:text-secondary text-xs">›</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function CardsBlock({ data }) {
  const items = data.items || []
  const cols = data.cols || 2
  const gridClass = cols === 1 ? 'grid-cols-1' : cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
  return (
    <div className="mb-4">
      {data.title && <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">{data.title}</h3>}
      <div className={`grid ${gridClass} gap-3`}>
        {items.map((item, i) => {
          const inner = (
            <div className="flex items-start gap-3">
              {item.icon && <span className="text-2xl flex-shrink-0">{item.icon}</span>}
              <div>
                <p className="text-sm font-semibold text-primary">{item.title}{item.link ? ' →' : ''}</p>
                {item.desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>}
              </div>
            </div>
          )
          return item.link ? (
            <Link key={i} to={item.link}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:border-primary/30 hover:bg-blue-50/50 transition-colors">
              {inner}
            </Link>
          ) : (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">{inner}</div>
          )
        })}
      </div>
    </div>
  )
}

function ImageBlock({ data }) {
  // backward compat: old format has data.url (single image)
  const images = data.images?.length > 0
    ? data.images.filter(i => i.url)
    : data.url ? [{ url: data.url, caption: data.caption || '' }] : []

  if (!images.length) return null

  const layout = data.layout || 'single'

  if (layout === 'single') {
    const img = images[0]
    const sizeMap = { sm: '300px', md: '500px', lg: '700px', full: '100%' }
    const maxW = sizeMap[data.size || 'lg'] || '700px'
    const align = data.align || 'center'
    const marginClass = align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto'
    const textAlign = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
    return (
      <div className="mb-4">
        <img src={img.url} alt={img.caption || ''} className={`block rounded-lg shadow-sm ${marginClass}`}
          style={{ maxWidth: maxW, width: '100%' }} />
        {img.caption && <p className={`text-xs text-gray-400 mt-2 ${textAlign}`}>{img.caption}</p>}
      </div>
    )
  }

  const colMap = { 'grid-2': 'grid-cols-2', 'grid-3': 'grid-cols-2 sm:grid-cols-3', 'grid-4': 'grid-cols-2 sm:grid-cols-4' }
  const gridClass = colMap[layout] || 'grid-cols-2'

  const heightCls = {
    auto:   'w-full',
    sm:     'w-full h-32 object-cover',
    md:     'w-full h-48 object-cover',
    lg:     'w-full h-64 object-cover',
    square: 'w-full aspect-square object-cover',
  }[data.height || 'auto'] || 'w-full'

  const isSingle  = images.length === 1
  const gridWrap  = isSingle ? 'flex justify-center' : `grid ${gridClass} gap-2`
  const singleW   = isSingle ? ({ 'grid-2': 'w-1/2', 'grid-3': 'w-1/3', 'grid-4': 'w-1/4' }[layout] || 'w-1/2') : ''

  return (
    <div className="mb-4">
      <div className={gridWrap}>
        {images.map((img, i) => (
          <div key={i} className={singleW}>
            <img src={img.url} alt={img.caption || ''} className={`rounded-lg shadow-sm ${heightCls}`} />
            {img.caption && <p className="text-xs text-gray-400 mt-1 text-center">{img.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function TableBlock({ data }) {
  const headers = data.headers || []
  const rows    = data.rows    || []
  return (
    <div className="card mb-4 overflow-x-auto">
      {data.title && (
        <div className="section-head">
          <h3 className="text-sm font-semibold">{data.title}</h3>
        </div>
      )}
      <table className="w-full text-sm">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-2.5 text-left text-gray-600 font-semibold text-xs">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PdfBlock({ data, preview }) {
  if (!data.url) return null
  const viewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(data.url)}&embedded=true`
  return (
    <div className="card mb-4 overflow-hidden">
      {data.title && (
        <div className="section-head">
          <h3 className="text-sm font-semibold">📄 {data.title}</h3>
        </div>
      )}
      <div className="p-4">
        {data.description && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{data.description}</p>}
        {preview ? (
          <div className="w-full rounded-lg border border-dashed border-red-200 bg-red-50 flex items-center justify-center gap-3 mb-3" style={{ height: 120 }}>
            <span className="text-3xl">📄</span>
            <div>
              <p className="text-sm font-medium text-red-700">{data.title || 'ไฟล์ PDF'}</p>
              <p className="text-xs text-red-400 mt-0.5">จะแสดง PDF viewer ในหน้าจริง</p>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-lg overflow-hidden border border-gray-200 mb-3" style={{ height: '500px' }}>
            <iframe src={viewUrl} className="w-full h-full" title={data.title || 'PDF'} />
          </div>
        )}
        <a href={data.url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors font-medium">
          📥 ดาวน์โหลด PDF
        </a>
      </div>
    </div>
  )
}

// ── Banner ────────────────────────────────────────────────────────────────────
const BANNER_GRAD = {
  primary:   'from-primary to-secondary',
  secondary: 'from-secondary to-accent',
  gold:      'from-yellow-700 to-amber-500',
  green:     'from-green-700 to-green-500',
  red:       'from-red-800 to-red-600',
  teal:      'from-teal-700 to-teal-500',
  gray:      'from-gray-700 to-gray-500',
}
function BannerBlock({ data }) {
  const grad  = BANNER_GRAD[data.color || 'primary'] || BANNER_GRAD.primary
  const align = data.align === 'left' ? 'text-left' : 'text-center'
  return (
    <div className={`mb-4 rounded-xl overflow-hidden bg-gradient-to-r ${grad}`}>
      <div className={`px-8 py-8 text-white ${align}`}>
        {data.icon    && <div className="text-4xl mb-2">{data.icon}</div>}
        {data.title   && <h2 className="text-xl font-bold mb-1">{data.title}</h2>}
        {data.subtitle && <p className="text-white/75 text-sm">{data.subtitle}</p>}
      </div>
    </div>
  )
}

// ── Info rows ─────────────────────────────────────────────────────────────────
function InfoRowsBlock({ data }) {
  const items = data.items || []
  if (!items.length) return null
  return (
    <div className="card mb-4 overflow-hidden">
      {data.title && <div className="section-head"><h3 className="text-sm font-semibold">{data.title}</h3></div>}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
            <span className="text-xl flex-shrink-0 w-7 text-center">{item.icon || '•'}</span>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 leading-snug">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const STAT_COLOR = {
  blue:   'from-blue-50 to-blue-100 border-blue-200',
  green:  'from-green-50 to-green-100 border-green-200',
  indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
  pink:   'from-pink-50 to-pink-100 border-pink-200',
  amber:  'from-amber-50 to-amber-100 border-amber-200',
  teal:   'from-teal-50 to-teal-100 border-teal-200',
  red:    'from-red-50 to-red-100 border-red-200',
  purple: 'from-purple-50 to-purple-100 border-purple-200',
}
function StatsBlock({ data }) {
  const items = data.items || []
  if (!items.length) return null
  const colMap = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }
  const gridClass = colMap[data.cols || 4] || 'grid-cols-2 sm:grid-cols-4'
  return (
    <div className="mb-4">
      {data.title && <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">{data.title}</h3>}
      <div className={`grid ${gridClass} gap-3`}>
        {items.map((item, i) => (
          <div key={i} className={`text-center p-4 rounded-xl border bg-gradient-to-br ${STAT_COLOR[item.color || 'blue'] || STAT_COLOR.blue}`}>
            {item.icon  && <div className="text-3xl mb-1">{item.icon}</div>}
            {item.value && <div className="text-xl font-bold text-primary">{item.value}</div>}
            {item.unit  && <div className="text-xs text-gray-500">{item.unit}</div>}
            {item.label && <div className="text-xs text-gray-600 mt-1 font-medium">{item.label}</div>}
          </div>
        ))}
      </div>
      {data.total?.value && (
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-center text-white mt-3">
          {data.total.label && <p className="text-sm opacity-80 mb-1">{data.total.label}</p>}
          <p className="text-4xl font-bold">
            {data.total.value}{data.total.unit && <span className="text-xl font-normal ml-2">{data.total.unit}</span>}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Alert / Callout ───────────────────────────────────────────────────────────
const ALERT_STYLE = {
  info:    { bg: 'bg-blue-50 border-blue-200',   defaultIcon: 'ℹ️',  titleCls: 'text-blue-800',  textCls: 'text-blue-700'  },
  warning: { bg: 'bg-amber-50 border-amber-200', defaultIcon: '⚠️',  titleCls: 'text-amber-800', textCls: 'text-amber-700' },
  success: { bg: 'bg-green-50 border-green-200', defaultIcon: '✅',  titleCls: 'text-green-800', textCls: 'text-green-700' },
  danger:  { bg: 'bg-red-50 border-red-200',     defaultIcon: '🚨',  titleCls: 'text-red-800',   textCls: 'text-red-700'   },
}
function AlertBlock({ data }) {
  const s    = ALERT_STYLE[data.variant || 'info'] || ALERT_STYLE.info
  const icon = data.icon || s.defaultIcon
  return (
    <div className={`mb-4 rounded-xl border p-4 ${s.bg}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1">
          {data.title   && <p className={`text-sm font-semibold mb-1 ${s.titleCls}`}>{data.title}</p>}
          {data.content && <p className={`text-xs leading-relaxed whitespace-pre-line ${s.textCls}`}>{data.content}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────────
const TIMELINE_COLOR = {
  primary: 'bg-primary', secondary: 'bg-secondary',
  blue: 'bg-blue-500', green: 'bg-green-500', amber: 'bg-amber-500',
  red: 'bg-red-500', purple: 'bg-purple-500', teal: 'bg-teal-500',
  cyan: 'bg-cyan-500', indigo: 'bg-indigo-500', pink: 'bg-pink-500',
}
function TimelineBlock({ data }) {
  const items = data.items || []
  if (!items.length) return null
  return (
    <div className="card mb-4 overflow-hidden">
      {data.title && <div className="section-head"><h3 className="text-sm font-semibold">{data.title}</h3></div>}
      <div className="p-5 relative">
        <div className="absolute left-[2.875rem] top-5 bottom-5 w-0.5 bg-gray-200" />
        <div className="space-y-5">
          {items.map((item, i) => (
            <div key={i} className="relative flex gap-4">
              <div className={`w-10 h-10 rounded-full flex-shrink-0 z-10 shadow-md flex items-center justify-center text-lg ${TIMELINE_COLOR[item.color || 'primary'] || 'bg-primary'}`}>
                {item.icon || '•'}
              </div>
              <div className="flex-1 pt-1 pb-2">
                {item.year  && <span className="text-xs font-bold text-secondary bg-blue-50 px-2 py-0.5 rounded-full">{item.year}</span>}
                {item.title && <h4 className="text-sm font-bold text-gray-800 mt-1.5 mb-1">{item.title}</h4>}
                {item.desc  && <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BlockRenderer({ block, preview = false }) {
  switch (block.type) {
    case 'text':  return <TextBlock  data={block.data} />
    case 'links': return <LinksBlock data={block.data} />
    case 'cards': return <CardsBlock data={block.data} />
    case 'image': return <ImageBlock data={block.data} />
    case 'table': return <TableBlock data={block.data} />
    case 'pdf':      return <PdfBlock      data={block.data} preview={preview} />
    case 'banner':   return <BannerBlock   data={block.data} />
    case 'inforows': return <InfoRowsBlock data={block.data} />
    case 'stats':    return <StatsBlock    data={block.data} />
    case 'alert':    return <AlertBlock    data={block.data} />
    case 'timeline': return <TimelineBlock data={block.data} />
    default:         return null
  }
}
