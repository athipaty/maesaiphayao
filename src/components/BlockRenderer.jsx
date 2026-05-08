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

  return (
    <div className="mb-4">
      <div className={`grid ${gridClass} gap-2`}>
        {images.map((img, i) => (
          <div key={i}>
            <img src={img.url} alt={img.caption || ''} className="w-full rounded-lg shadow-sm object-cover h-40" />
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

export default function BlockRenderer({ block, preview = false }) {
  switch (block.type) {
    case 'text':  return <TextBlock  data={block.data} />
    case 'links': return <LinksBlock data={block.data} />
    case 'cards': return <CardsBlock data={block.data} />
    case 'image': return <ImageBlock data={block.data} />
    case 'table': return <TableBlock data={block.data} />
    case 'pdf':   return <PdfBlock   data={block.data} preview={preview} />
    default:      return null
  }
}
