import { useState, useEffect } from 'react'
import { getOIT, getOITYears } from '../services/api'

const STATUS_CONFIG = {
  complete:   { label: 'ครบถ้วน',      color: 'bg-green-100 text-green-700' },
  incomplete: { label: 'ไม่ครบ',        color: 'bg-red-100 text-red-600' },
  pending:    { label: 'รอดำเนินการ',   color: 'bg-yellow-100 text-yellow-700' },
}

export default function ItaPage() {
  const [years, setYears]     = useState([])
  const [year, setYear]       = useState('')
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOITYears()
      .then(r => {
        const list = r?.data || []
        setYears(list)
        if (list.length) setYear(list[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!year) return
    setLoading(true)
    getOIT({ year })
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [year])

  const complete   = items.filter(i => i.status === 'complete').length
  const total      = items.length

  return (
    <div>
      {/* Header */}
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">🏆 ITA — การประเมินคุณธรรมและความโปร่งใส</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ข้อมูลการเปิดเผยข้อมูลสาธารณะ (Open Data Integrity and Transparency Assessment)
          ตามกรอบการประเมิน ITA ของสำนักงาน ป.ป.ช. รายการ OIT ทั้ง {total > 0 ? total : 26} ข้อ
        </div>
      </div>

      {/* Year tabs */}
      {years.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {years.map(y => (
            <button key={y} onClick={() => setYear(y)}
              className={`text-xs px-4 py-1.5 rounded-full border font-medium transition-colors ${
                year === y
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              ปีงบประมาณ {y}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="card p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข้อมูล ITA</div>
      ) : (
        <>
          {/* Progress summary */}
          <div className="card mb-5 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>ความครบถ้วน OIT ปีงบประมาณ {year}</span>
                  <span className="font-semibold text-primary">{complete}/{total} ข้อ</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: total ? `${(complete / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OIT items */}
          <div className="space-y-3">
            {items.map(item => {
              const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending
              return (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                          O{String(item.itemNo).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 leading-snug">{item.title}</h3>
                          {item.category && (
                            <span className="text-xs text-gray-400">{item.category}</span>
                          )}
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${sc.color}`}>
                        {sc.label}
                      </span>
                    </div>

                    {/* Evidence links */}
                    {item.links?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.links.map((l, i) => (
                          l.url && (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors">
                              🔗 {l.label || 'ดูข้อมูล'}
                            </a>
                          )
                        ))}
                      </div>
                    )}

                    {/* File */}
                    {item.fileUrl && (
                      <div className="mt-2">
                        <a href={item.fileUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                          📄 {item.fileName || 'ดาวน์โหลดเอกสาร'}
                        </a>
                      </div>
                    )}

                    {item.note && (
                      <p className="mt-2 text-xs text-gray-400 italic">หมายเหตุ: {item.note}</p>
                    )}
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
