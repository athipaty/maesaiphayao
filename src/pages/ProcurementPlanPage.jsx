import { useState, useEffect } from 'react'
import { getProcurementPlans } from '../services/api'

const FILE_ICON  = { excel: '📊', zip: '📦', pdf: '📄' }
const FILE_BADGE = {
  excel: 'bg-green-50 text-green-700 border-green-200',
  zip:   'bg-amber-50 text-amber-700 border-amber-200',
  pdf:   'bg-red-50 text-red-700 border-red-200',
}
const FILE_LABEL = { excel: 'Excel', zip: 'ZIP', pdf: 'PDF' }

const DOC_TYPE_INFO = {
  excel: {
    badge: 'Open Data',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    desc: 'รายงานผลการจัดซื้อจัดจ้างหรือการจัดหาพัสดุในรูปแบบ Open Data เพื่อความโปร่งใสตาม พ.ร.บ.ข้อมูลข่าวสารของราชการ',
  },
  zip: {
    badge: 'แบบ ผด.2',
    badgeColor: 'bg-blue-100 text-blue-700',
    desc: 'แบบรายงานแผนการจัดหาพัสดุประจำปีงบประมาณ (แบบ ผด.2) ตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ',
  },
  pdf: {
    badge: 'PDF',
    badgeColor: 'bg-rose-100 text-rose-700',
    desc: 'เอกสารแผนการจัดหาพัสดุในรูปแบบ PDF',
  },
}

function formatBudget(n) {
  if (!n) return null
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`
  return `${n.toLocaleString('th-TH')} บาท`
}

export default function ProcurementPlanPage() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    getProcurementPlans()
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const years     = [...new Set(items.map(i => i.year))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
  const displayed = filter === 'all' ? items : items.filter(i => i.year === filter)

  return (
    <div>
      {/* Page header */}
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📋 แผนการจัดหาพัสดุหรือการจัดซื้อจัดจ้าง</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          รวมเอกสารแผนการจัดหาพัสดุและรายงานผลการจัดซื้อจัดจ้างขององค์การบริหารส่วนตำบลแม่ใส
          จำแนกตามปีงบประมาณ เพื่อความโปร่งใสและตรวจสอบได้
        </div>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข้อมูล</div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-primary">{items.length}</div>
              <div className="text-xs text-gray-400 mt-1">เอกสารทั้งหมด</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-secondary">{years.length}</div>
              <div className="text-xs text-gray-400 mt-1">ปีงบประมาณ</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-base font-bold text-accent leading-tight">
                {years[years.length - 1]}<br/>–{years[0]}
              </div>
              <div className="text-xs text-gray-400 mt-1">ช่วงปีที่ครอบคลุม</div>
            </div>
          </div>

          {/* Year filter tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              ทั้งหมด ({items.length})
            </button>
            {years.map(y => (
              <button key={y} onClick={() => setFilter(y)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  filter === y
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Document cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayed.map(item => {
              const info = DOC_TYPE_INFO[item.fileType] || DOC_TYPE_INFO.pdf
              const budget = formatBudget(item.totalBudget)
              return (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />

                  <div className="p-5 flex flex-col flex-1">

                    {/* Year + file type row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md">
                        ปีงบประมาณ พ.ศ. {item.year}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${FILE_BADGE[item.fileType]}`}>
                        {FILE_ICON[item.fileType]} {FILE_LABEL[item.fileType]}
                      </span>
                    </div>

                    {/* Document type badge */}
                    <span className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${info.badgeColor}`}>
                      {info.badge}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-4">
                      {item.title}
                    </h3>

                    {/* Stats — only if admin filled them in */}
                    {(item.totalItems || item.totalBudget) && (
                      <div className="grid grid-cols-2 gap-3 mb-4 bg-blue-50 rounded-xl p-3">
                        {item.totalItems && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {item.totalItems.toLocaleString('th-TH')}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">รายการจัดซื้อจัดจ้าง</div>
                          </div>
                        )}
                        {budget && (
                          <div className="text-center">
                            <div className="text-base font-bold text-primary leading-tight">
                              {budget}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">งบประมาณรวม</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Period */}
                    {item.period && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                        <span>📅</span>
                        <span>ช่วงเวลา: {item.period}</span>
                      </div>
                    )}

                    {/* What's in this document */}
                    <div className="flex gap-2 bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-500 leading-relaxed">
                      <span className="flex-shrink-0">ℹ️</span>
                      <p>{info.desc}</p>
                    </div>

                    {/* Note */}
                    {item.note && (
                      <p className="text-xs text-gray-400 italic mb-3">
                        หมายเหตุ: {item.note}
                      </p>
                    )}

                    {/* Download — bottom, secondary style */}
                    <div className="mt-auto pt-1">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all"
                      >
                        ⬇ ดาวน์โหลดเอกสาร
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
