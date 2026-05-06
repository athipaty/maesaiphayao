import { useState, useEffect } from 'react'
import { getDocuments } from '../services/api'
import PageHeader from '../components/PageHeader'

const CATEGORIES = [
  { value: 'all',       label: 'ทั้งหมด',                 icon: '📂' },
  { value: 'finance',   label: 'การเงินและบัญชี',          icon: '💰' },
  { value: 'budget',    label: 'งบประมาณ',                 icon: '📊' },
  { value: 'hr',        label: 'บริหารทรัพยากรบุคคล',      icon: '👥' },
  { value: 'council',   label: 'กิจการสภา',                icon: '🏛️' },
  { value: 'audit',     label: 'ตรวจสอบภายใน',             icon: '🔍' },
  { value: 'risk',      label: 'บริหารความเสี่ยง',          icon: '⚠️' },
  { value: 'law',       label: 'กฎหมาย/ข้อบัญญัติ',        icon: '⚖️' },
  { value: 'integrity', label: 'ป้องกันทุจริต/No Gift',    icon: '🎗️' },
  { value: 'other',     label: 'อื่น ๆ',                  icon: '📄' },
]

const FILE_ICON = { pdf: '📄', excel: '📊', word: '📝', zip: '📦', other: '📎' }
const FILE_COLOR = {
  pdf:   'bg-red-50 text-red-700 border-red-200',
  excel: 'bg-green-50 text-green-700 border-green-200',
  word:  'bg-blue-50 text-blue-700 border-blue-200',
  zip:   'bg-amber-50 text-amber-700 border-amber-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
}

export default function DocumentPage() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [catFilter, setCatFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  useEffect(() => {
    getDocuments()
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const years = [...new Set(items.filter(i => i.fiscalYear).map(i => i.fiscalYear))]
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

  const displayed = items.filter(i => {
    if (catFilter !== 'all' && i.category !== catFilter) return false
    if (yearFilter !== 'all' && i.fiscalYear !== yearFilter) return false
    return true
  })

  const catLabel = (v) => CATEGORIES.find(c => c.value === v)?.label || v

  return (
    <div>
      <PageHeader icon="📂" title="คลังเอกสารราชการ"
        desc="รวมเอกสารราชการ รายงานทางการเงิน เอกสารสภา กฎหมาย และเอกสารด้านธรรมาภิบาลขององค์การบริหารส่วนตำบลแม่ใส" />

      {loading ? (
        <div className="card p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีเอกสาร</div>
      ) : (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCatFilter(c.value)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  catFilter === c.value
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                }`}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Year filter */}
          {years.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <button onClick={() => setYearFilter('all')}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  yearFilter === 'all' ? 'bg-secondary text-white border-secondary' : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
                }`}>
                ทุกปี
              </button>
              {years.map(y => (
                <button key={y} onClick={() => setYearFilter(y)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    yearFilter === y ? 'bg-secondary text-white border-secondary' : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
                  }`}>
                  {y}
                </button>
              ))}
            </div>
          )}

          {displayed.length === 0 ? (
            <div className="card p-8 text-center text-gray-400 text-sm">ไม่พบเอกสารในหมวดนี้</div>
          ) : (
            <div className="space-y-2">
              {displayed.map(item => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-4 hover:border-primary/30 transition-colors">
                  <div className="text-2xl flex-shrink-0">{FILE_ICON[item.fileType] || '📎'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">
                        {catLabel(item.category)}
                      </span>
                      {item.fiscalYear && (
                        <span className="text-xs text-gray-500">ปี {item.fiscalYear}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded border ${FILE_COLOR[item.fileType] || FILE_COLOR.other}`}>
                        {(item.fileType || 'pdf').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                  <a href={item.fileUrl} target="_blank" rel="noreferrer"
                    className="flex-shrink-0 text-xs border-2 border-primary text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                    ⬇ ดาวน์โหลด
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
