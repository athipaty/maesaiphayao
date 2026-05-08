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
  if (!data.url) return null
  return (
    <div className="mb-4 text-center">
      <img src={data.url} alt={data.caption || ''} className="max-w-full rounded-lg shadow-sm mx-auto" />
      {data.caption && <p className="text-xs text-gray-400 mt-2">{data.caption}</p>}
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

function PdfBlock({ data }) {
  if (!data.url) return null
  return (
    <div className="card mb-4 overflow-hidden">
      {data.title && (
        <div className="section-head">
          <h3 className="text-sm font-semibold">📄 {data.title}</h3>
        </div>
      )}
      <div className="p-4">
        {data.description && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{data.description}</p>}
        <div className="w-full rounded-lg overflow-hidden border border-gray-200 mb-3" style={{ height: '500px' }}>
          <iframe src={data.url + '#toolbar=1&view=FitH'} className="w-full h-full" title={data.title || 'PDF'} />
        </div>
        <a href={data.url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors font-medium">
          📥 ดาวน์โหลด PDF
        </a>
      </div>
    </div>
  )
}

export default function BlockRenderer({ block }) {
  switch (block.type) {
    case 'text':  return <TextBlock  data={block.data} />
    case 'links': return <LinksBlock data={block.data} />
    case 'cards': return <CardsBlock data={block.data} />
    case 'image': return <ImageBlock data={block.data} />
    case 'table': return <TableBlock data={block.data} />
    case 'pdf':   return <PdfBlock   data={block.data} />
    default:      return null
  }
}
