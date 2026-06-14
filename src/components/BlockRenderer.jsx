import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/api\/abt.*$/, '') || 'https://center-kitchen-backend.onrender.com'
const B2_ORIGIN = 'https://s3.us-west-004.backblazeb2.com'

function resolveFileUrl(url) {
  if (!url) return url
  if (url.startsWith('/')) {
    // Relative paths starting with /maesai- are B2 bucket paths stored without the full host
    // e.g. /maesai-pdfs/pdfs/... → https://s3.us-west-004.backblazeb2.com/maesai-pdfs/pdfs/...
    if (url.startsWith('/maesai-')) return B2_ORIGIN + url
    return BACKEND_ORIGIN + url
  }
  return url
}

function TextBlock({ data }) {
  const paragraphs = (data.content || '').split(/\n\n+/).filter(Boolean)
  return (
    <div className="card mb-2 px-5 py-4 space-y-3">
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
    <div className="card mb-2 overflow-hidden">
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
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-primary transition-colors group">
                <span className="text-base w-6 text-center flex-shrink-0">{item.icon || '🔗'}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-gray-300 group-hover:text-secondary text-xs">↗</span>
              </a>
            </li>
          ) : (
            <li key={i}>
              <Link to={item.url || '#'}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-primary transition-colors group">
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

const CARD_ICON_POS = {
  left:   { wrap: 'flex-row items-start',         text: '' },
  right:  { wrap: 'flex-row-reverse items-start', text: '' },
  top:    { wrap: 'flex-col items-center',         text: 'text-center' },
  bottom: { wrap: 'flex-col-reverse items-center', text: 'text-center' },
}

const CARD_BG = {
  white:  'bg-white border-gray-100',
  blue:   'bg-blue-50 border-blue-200',
  green:  'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  amber:  'bg-amber-50 border-amber-200',
  red:    'bg-red-50 border-red-200',
  teal:   'bg-teal-50 border-teal-200',
  pink:   'bg-pink-50 border-pink-200',
  indigo: 'bg-indigo-50 border-indigo-200',
  gray:   'bg-gray-100 border-gray-200',
}
const CARD_SIZE = {
  sm: { p: 'p-3',   icon: 'text-xl',    title: 'text-xs',    desc: 'text-[11px]', gap: 'gap-2' },
  md: { p: 'p-4',   icon: 'text-2xl',   title: 'text-sm',    desc: 'text-xs',     gap: 'gap-3' },
  lg: { p: 'p-5',   icon: 'text-3xl',   title: 'text-base',  desc: 'text-sm',     gap: 'gap-4' },
}

function CardsBlock({ data }) {
  const items = data.items || []
  const cols = data.cols || 2
  const sz  = CARD_SIZE[data.size || 'md'] || CARD_SIZE.md
  const pos = CARD_ICON_POS[data.iconPos || 'left'] || CARD_ICON_POS.left
  const gridClass = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[cols] || 'grid-cols-1 sm:grid-cols-2'
  return (
    <div className="mb-2">
      {data.title && <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">{data.title}</h3>}
      <div className={`grid ${gridClass} gap-3`}>
        {items.map((item, i) => {
          const bg = CARD_BG[item.color || 'white'] || CARD_BG.white
          const inner = (
            <div className={`flex ${pos.wrap} ${sz.gap}`}>
              {item.icon && <span className={`${sz.icon} flex-shrink-0`}>{item.icon}</span>}
              <div className={pos.text}>
                <p className={`${sz.title} font-semibold text-primary`}>{item.title}{item.link ? ' →' : ''}</p>
                {item.desc && <p className={`${sz.desc} text-gray-500 mt-0.5 leading-relaxed`}>{item.desc}</p>}
              </div>
            </div>
          )
          return item.link ? (
            <Link key={i} to={item.link}
              className={`rounded-lg shadow-sm border ${sz.p} ${bg} hover:opacity-80 transition-opacity`}>
              {inner}
            </Link>
          ) : (
            <div key={i} className={`rounded-lg shadow-sm border ${sz.p} ${bg}`}>{inner}</div>
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
      <div className="mb-2">
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
    <div className="mb-2">
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
    <div className="card mb-2 overflow-x-auto">
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

function PdfFileIcon({ size = 44 }) {
  const w = size, h = size * 1.3
  return (
    <svg width={w} height={h} viewBox="0 0 44 57" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Document body */}
      <path d="M0 5C0 2.239 2.239 0 5 0H30L44 15V52C44 54.761 41.761 57 39 57H5C2.239 57 0 54.761 0 52V5Z" fill="#DC2626"/>
      {/* Folded corner */}
      <path d="M30 0L44 15H32C30.895 15 30 14.105 30 13V0Z" fill="#B91C1C"/>
      {/* White lines (document lines) */}
      <rect x="7" y="20" width="20" height="2.5" rx="1.25" fill="white" fillOpacity="0.35"/>
      <rect x="7" y="26" width="30" height="2.5" rx="1.25" fill="white" fillOpacity="0.25"/>
      {/* Red label band */}
      <rect x="0" y="34" width="44" height="16" rx="0" fill="#991B1B"/>
      <rect x="0" y="34" width="44" height="16" rx="0" fill="white" fillOpacity="0.08"/>
      {/* PDF text */}
      <text x="22" y="46" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="Arial Black, Arial, sans-serif" letterSpacing="1">PDF</text>
    </svg>
  )
}

// Returns the best embeddable URL for a given file URL.
// Priority: Google Drive → native preview; everything else → Google Docs viewer.
function getEmbedUrl(url) {
  if (!url) return ''
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

async function downloadPdf(url, title) {
  // Derive a safe .pdf filename from the title or the URL's last path segment
  const base = title
    ? title.replace(/[^a-zA-Z0-9ก-๙\s_-]/g, '').trim() || 'document'
    : url.split('?')[0].split('/').pop() || 'document'
  const filename = base.toLowerCase().endsWith('.pdf') ? base : base + '.pdf'

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('fetch failed')
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl) }, 200)
  } catch {
    // CORS fallback: open directly
    window.open(url, '_blank')
  }
}

function PdfBlock({ data, preview }) {
  const [open, setOpen] = useState(false)
  const [loadErr, setLoadErr] = useState(false)
  if (!data.url) return null
  const absUrl  = resolveFileUrl(data.url)
  const viewUrl = getEmbedUrl(absUrl)

  function handleOpen() { setOpen(v => !v); setLoadErr(false) }

  return (
    <div className="bg-white border-b border-gray-100">
      {data.description && <p className="text-xs text-gray-500 px-3 pt-2 leading-relaxed">{data.description}</p>}

      {preview ? (
        <div className="mx-3 my-2 rounded-lg border border-dashed border-red-200 bg-red-50 flex items-center justify-center gap-3" style={{ height: 80 }}>
          <PdfFileIcon size={24} />
          <div>
            <p className="text-sm font-medium text-red-700">{data.title || 'ไฟล์ PDF'}</p>
            <p className="text-xs text-red-400 mt-0.5">จะแสดง PDF viewer ในหน้าจริง</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 transition-colors">
            <span className="text-base flex-shrink-0">📄</span>
            <button onClick={handleOpen}
              className="flex-1 text-left text-sm text-primary hover:text-secondary transition-colors">
              {data.title || 'ไฟล์ PDF'}
            </button>
            <button onClick={handleOpen}
              className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0 px-2">
              {open ? '▲ ซ่อน' : '▼ แสดง'}
            </button>
            <button onClick={() => downloadPdf(absUrl, data.title)}
              className="flex-shrink-0 text-xs text-secondary hover:text-primary font-medium px-2">
              📥 ดาวน์โหลด
            </button>
          </div>
          {open && (
            <div className="mx-3 mb-2">
              <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '520px' }}>
                <iframe
                  key={viewUrl}
                  src={viewUrl}
                  className="w-full h-full"
                  title={data.title || 'PDF'}
                  onError={() => setLoadErr(true)}
                />
              </div>
              {loadErr && (
                <p className="text-xs text-amber-600 mt-1.5 text-center">
                  ไม่สามารถแสดงตัวอย่างได้ —{' '}
                  <a href={absUrl} target="_blank" rel="noreferrer" className="underline font-medium">เปิดในแท็บใหม่</a>
                  {' '}หรือกดดาวน์โหลด
                </p>
              )}
              <p className="text-[10px] text-gray-300 mt-1 text-center">
                ถ้าหน้าว่างหรือโหลดไม่ได้ →{' '}
                <a href={absUrl} target="_blank" rel="noreferrer" className="underline text-gray-400">เปิดโดยตรง</a>
              </p>
            </div>
          )}
        </>
      )}
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
const BANNER_HEIGHT = { xs: 'py-2', sm: 'py-4', md: 'py-8', lg: 'py-14', xl: 'py-20', xxl: 'py-32' }
const BANNER_FONT   = {
  xs:  { icon: 'text-lg',   title: 'text-xs',   sub: 'text-[11px]' },
  sm:  { icon: 'text-2xl',  title: 'text-sm',   sub: 'text-xs'     },
  md:  { icon: 'text-3xl',  title: 'text-xl',   sub: 'text-sm'     },
  lg:  { icon: 'text-4xl',  title: 'text-2xl',  sub: 'text-base'   },
  xl:  { icon: 'text-5xl',  title: 'text-3xl',  sub: 'text-lg'     },
  xxl: { icon: 'text-6xl',  title: 'text-4xl',  sub: 'text-xl'     },
}

function BannerBlock({ data }) {
  const grad  = BANNER_GRAD[data.color || 'primary'] || BANNER_GRAD.primary
  const align = data.align === 'left' ? 'text-left' : 'text-center'
  const h     = data.height || 'md'
  const py    = BANNER_HEIGHT[h] || BANNER_HEIGHT.md
  const font  = BANNER_FONT[h]   || BANNER_FONT.md
  return (
    <div className={`mb-2 rounded-xl overflow-hidden bg-gradient-to-r ${grad}`}>
      <div className={`px-8 ${py} text-white ${align}`}>
        {data.icon     && <div className={`${font.icon} mb-2`}>{data.icon}</div>}
        {data.title    && <h2 className={`${font.title} font-bold mb-1`}>{data.title}</h2>}
        {data.subtitle && <p className={`${font.sub} text-white/75`}>{data.subtitle}</p>}
      </div>
    </div>
  )
}

// ── Info rows ─────────────────────────────────────────────────────────────────
function InfoRowsBlock({ data }) {
  const items = data.items || []
  if (!items.length) return null
  return (
    <div className="card mb-2 overflow-hidden">
      {data.title && <div className="section-head"><h3 className="text-sm font-semibold">{data.title}</h3></div>}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-pink-50/50 rounded-lg">
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
    <div className="mb-2">
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
    <div className={`mb-2 rounded-xl border p-4 ${s.bg}`}>
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
    <div className="card mb-2 overflow-hidden">
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

function ExcelFileIcon({ size = 44 }) {
  const w = size, h = size * 1.3
  return (
    <svg width={w} height={h} viewBox="0 0 44 57" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M0 5C0 2.239 2.239 0 5 0H30L44 15V52C44 54.761 41.761 57 39 57H5C2.239 57 0 54.761 0 52V5Z" fill="#16a34a"/>
      <path d="M30 0L44 15H32C30.895 15 30 14.105 30 13V0Z" fill="#86efac"/>
      <rect x="0" y="34" width="44" height="16" fill="#15803d"/>
      <rect x="0" y="34" width="44" height="16" fill="white" fillOpacity="0.08"/>
      <text x="22" y="46" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Arial Black, Arial, sans-serif" letterSpacing="0.5">XLS</text>
      <rect x="7" y="20" width="20" height="2" rx="1" fill="white" fillOpacity="0.4"/>
      <rect x="7" y="26" width="30" height="2" rx="1" fill="white" fillOpacity="0.25"/>
    </svg>
  )
}

function ExcelBlock({ data, preview }) {
  const [open, setOpen] = useState(false)
  const [loadErr, setLoadErr] = useState(false)
  if (!data.url) return null
  const absUrl  = resolveFileUrl(data.url)
  const viewUrl = getEmbedUrl(absUrl)

  function handleOpen() { setOpen(v => !v); setLoadErr(false) }

  return (
    <div className="card mb-2 overflow-hidden">
      <div className="p-4">
        {data.description && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{data.description}</p>}

        {preview ? (
          <div className="w-full rounded-lg border border-dashed border-green-200 bg-green-50 flex items-center justify-center gap-3 mb-3" style={{ height: 100 }}>
            <ExcelFileIcon size={36} />
            <div>
              <p className="text-sm font-medium text-green-700">{data.title || 'ไฟล์ Excel'}</p>
              <p className="text-xs text-green-400 mt-0.5">จะแสดง Excel viewer ในหน้าจริง</p>
            </div>
          </div>
        ) : (
          <>
            <button onClick={handleOpen}
              className="mb-3 w-full flex items-center gap-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl px-4 py-3 transition-colors group">
              <div className="group-hover:scale-105 transition-transform">
                <ExcelFileIcon size={36} />
              </div>
              <p className="text-sm font-semibold text-green-700 flex-1 text-left">{data.title || 'ไฟล์ Excel'}</p>
              <p className="text-xs text-green-400 flex-shrink-0">
                {open ? '▲ ซ่อน' : 'กดเพื่อแสดง ▼'}
              </p>
            </button>

            {open && (
              <div className="mb-3">
                <div className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ height: '520px' }}>
                  <iframe
                    key={viewUrl}
                    src={viewUrl}
                    className="w-full h-full"
                    title={data.title || 'Excel'}
                    onError={() => setLoadErr(true)}
                  />
                </div>
                {loadErr && (
                  <p className="text-xs text-amber-600 mt-1.5 text-center">
                    ไม่สามารถแสดงตัวอย่างได้ —{' '}
                    <a href={absUrl} target="_blank" rel="noreferrer" className="underline font-medium">เปิดในแท็บใหม่</a>
                  </p>
                )}
                <p className="text-[10px] text-gray-300 mt-1 text-center">
                  ถ้าหน้าว่างหรือโหลดไม่ได้ →{' '}
                  <a href={absUrl} target="_blank" rel="noreferrer" className="underline text-gray-400">เปิดโดยตรง</a>
                </p>
              </div>
            )}
          </>
        )}

        <a href={absUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors font-medium">
          📥 ดาวน์โหลด Excel
        </a>
      </div>
    </div>
  )
}

function HtmlBlock({ data, preview }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script')
      Array.from(old.attributes).forEach(a => s.setAttribute(a.name, a.value))
      s.textContent = old.textContent
      old.parentNode.replaceChild(s, old)
    })
  }, [data.html])

  if (!data.html) return null
  if (preview) {
    return (
      <div className="mb-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold text-slate-400 mb-1">HTML Block (ตัวอย่าง)</p>
        <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap break-all line-clamp-4">{data.html}</pre>
      </div>
    )
  }
  return (
    <div ref={ref} className="mb-2" dangerouslySetInnerHTML={{ __html: data.html }} />
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
    case 'excel':    return <ExcelBlock    data={block.data} preview={preview} />
    case 'html':     return <HtmlBlock     data={block.data} preview={preview} />
    default:         return null
  }
}
