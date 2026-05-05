import { useState, useEffect } from 'react'
import { getProcurementPlans } from '../services/api'

const FILE_ICON = { excel: '📊', zip: '📦', pdf: '📄' }
const FILE_COLOR = {
  excel: 'bg-green-50 text-green-700 border-green-200',
  zip:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  pdf:   'bg-red-50 text-red-700 border-red-200',
}
const FILE_LABEL = { excel: 'Excel', zip: 'ZIP', pdf: 'PDF' }

export default function ProcurementPlanPage() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProcurementPlans()
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // group by year descending
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = []
    acc[item.year].push(item)
    return acc
  }, {})
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

  return (
    <div>
      {/* Page header */}
      <div className="card mb-4">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📋 แผนการจัดหาพัสดุหรือการจัดซื้อจัดจ้าง</h1>
        </div>
        <div className="p-4 text-sm text-gray-500">
          รวมเอกสารแผนการจัดหาพัสดุและรายงานผลการจัดซื้อจัดจ้างขององค์การบริหารส่วนตำบลแม่ใส จำแนกตามปีงบประมาณ
        </div>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : years.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข้อมูล</div>
      ) : (
        years.map(year => (
          <div key={year} className="card mb-4">
            {/* Year header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {year.slice(-2)}
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                ปีงบประมาณ พ.ศ. {year}
              </h2>
              <span className="ml-auto text-xs text-gray-400">{grouped[year].length} เอกสาร</span>
            </div>

            {/* Documents */}
            <div className="divide-y divide-gray-50">
              {grouped[year].map(item => (
                <div key={item._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <span className="text-2xl flex-shrink-0">{FILE_ICON[item.fileType] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${FILE_COLOR[item.fileType] || FILE_COLOR.pdf}`}>
                        {FILE_LABEL[item.fileType] || 'PDF'}
                      </span>
                      <span className="text-xs text-gray-400">ปีงบประมาณ {year}</span>
                    </div>
                  </div>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:opacity-90 transition-opacity"
                  >
                    ⬇ ดาวน์โหลด
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
