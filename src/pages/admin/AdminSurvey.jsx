import { useState, useEffect, useMemo } from 'react'
import { getSurveyResponses, deleteSurveyResponse } from '../../services/api'

const CRITERIA = [
  { key: 'process',  label: 'กระบวนการ/ขั้นตอน' },
  { key: 'staff',    label: 'เจ้าหน้าที่ผู้ให้บริการ' },
  { key: 'facility', label: 'สิ่งอำนวยความสะดวก' },
  { key: 'quality',  label: 'คุณภาพการให้บริการ' },
]

function avg(nums) { return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0 }

export default function AdminSurvey() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const r = await getSurveyResponses()
      setItems(r?.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const stats = useMemo(() => {
    const overall = avg(items.map(i => i.overallScore).filter(Number.isFinite))
    const perCriteria = CRITERIA.map(c => ({
      ...c,
      avg: avg(items.map(i => i.ratings?.[c.key]).filter(Number.isFinite)),
    }))
    return { overall, perCriteria }
  }, [items])

  async function handleDelete(id) {
    if (!window.confirm('ยืนยันการลบแบบสำรวจนี้?')) return
    setDeleting(id)
    try {
      await deleteSurveyResponse(id)
      setItems(prev => prev.filter(i => i._id !== id))
    } finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-base font-bold text-gray-800">📊 แบบสำรวจความพึงพอใจ</h1>
        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length} คำตอบ</span>
      </div>

      {!loading && items.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold text-primary tabular-nums">{stats.overall.toFixed(2)}</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">คะแนนเฉลี่ยรวม</p>
              <p className="text-xs text-gray-400">จากคะแนนเต็ม 5</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.perCriteria.map(c => (
              <div key={c.key} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                <p className="text-lg font-bold text-gray-800 tabular-nums">{c.avg.toFixed(2)} <span className="text-xs font-normal text-amber-400">★</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-10">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-10">ยังไม่มีคำตอบแบบสำรวจ</div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800">{item.serviceUsed || 'ไม่ระบุบริการ'}</span>
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                      {item.overallScore?.toFixed(2)} ★
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    {item.name ? ` · ${item.name}` : ''}
                  </p>
                  {item.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.comment}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {CRITERIA.map(c => (
                      <span key={c.key} className="text-[11px] text-gray-400">
                        {c.label}: <span className="font-semibold text-gray-600">{item.ratings?.[c.key]}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id}
                  className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 flex-shrink-0">
                  {deleting === item._id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
