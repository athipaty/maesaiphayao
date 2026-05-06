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

          {/* O25 & O26 quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <a href="#o25"
              className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4 hover:bg-indigo-100 transition-colors">
              <span className="text-2xl flex-shrink-0">🔎</span>
              <div>
                <p className="text-sm font-semibold text-indigo-800">O25 — ผลการวิเคราะห์ตัวชี้วัด</p>
                <p className="text-xs text-indigo-600">วิเคราะห์ผลทุกตัวชี้วัด ITA ปีงบประมาณ {year}</p>
              </div>
            </a>
            <a href="#o26"
              className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4 hover:bg-teal-100 transition-colors">
              <span className="text-2xl flex-shrink-0">🛡️</span>
              <div>
                <p className="text-sm font-semibold text-teal-800">O26 — มาตรการป้องกันการทุจริต</p>
                <p className="text-xs text-teal-600">มาตรการเชิงป้องกัน ปีงบประมาณ {year}</p>
              </div>
            </a>
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

          {/* O25 — ผลการวิเคราะห์ตัวชี้วัด */}
          <div id="o25" className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-indigo-600 flex items-center gap-2">
              <span className="w-1 h-5 bg-white/50 rounded inline-block"/>
              <h2 className="text-white font-bold text-sm">🔎 O25 — ผลการวิเคราะห์ตัวชี้วัดตามเกณฑ์ ITA ปีงบประมาณ {year}</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-4">
                การวิเคราะห์ผลการดำเนินการตามตัวชี้วัดทุกข้อ (O01–O26) เพื่อประเมินระดับความครบถ้วนและคุณภาพของข้อมูลที่เปิดเผย
                ตามกรอบการประเมิน ITA ของสำนักงาน ป.ป.ช.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'ตัวชี้วัดทั้งหมด', value: total, color: 'bg-gray-50 border-gray-200 text-gray-700' },
                  { label: 'ครบถ้วน',           value: complete, color: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'ยังไม่ครบ',          value: total - complete, color: 'bg-red-50 border-red-200 text-red-700' },
                ].map(s => (
                  <div key={s.label} className={`text-center p-3 rounded-xl border ${s.color}`}>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-indigo-800">ข้อมูลที่ยังไม่ครบถ้วน:</p>
                {items.filter(i => i.status !== 'complete').length === 0 ? (
                  <p className="text-xs text-green-700">✅ ครบถ้วนทุกตัวชี้วัด</p>
                ) : (
                  items.filter(i => i.status !== 'complete').map(i => (
                    <div key={i._id} className="flex items-center gap-2 text-xs text-indigo-700">
                      <span className="font-bold">O{String(i.itemNo).padStart(2,'0')}</span>
                      <span className="text-gray-600">{i.title}</span>
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                        i.status === 'incomplete' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                      }`}>{i.status === 'incomplete' ? 'ไม่ครบ' : 'รอดำเนินการ'}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">ดาวน์โหลดรายงานผลการวิเคราะห์ฉบับสมบูรณ์ (PDF)</span>
                <span className="text-xs text-gray-400 italic">— อยู่ระหว่างจัดทำ —</span>
              </div>
            </div>
          </div>

          {/* O26 — มาตรการป้องกันการทุจริต */}
          <div id="o26" className="mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-teal-600 flex items-center gap-2">
              <span className="w-1 h-5 bg-white/50 rounded inline-block"/>
              <h2 className="text-white font-bold text-sm">🛡️ O26 — มาตรการส่งเสริมคุณธรรมและความโปร่งใส ปีงบประมาณ {year}</h2>
            </div>
            <div className="p-5">
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-teal-800 mb-2">แนวทางการดำเนินการ (แบบใหม่ ปีงบประมาณ 2569)</p>
                <p className="text-xs text-teal-700 leading-relaxed">
                  คัดเลือกตัวชี้วัด 1 ข้อที่มีคะแนนต่ำสุดหรือมีความเสี่ยงสูงสุด
                  แล้วตั้งมาตรการเชิงป้องกันที่ชัดเจน มีผู้รับผิดชอบ และระยะเวลาดำเนินการ
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { no: 1, label: 'ตัวชี้วัดที่เลือก', value: '— ยังไม่ได้กำหนด —', color: 'bg-gray-50' },
                  { no: 2, label: 'มาตรการที่กำหนด',    value: '— ยังไม่ได้กำหนด —', color: 'bg-gray-50' },
                  { no: 3, label: 'ผู้รับผิดชอบ',        value: '— ยังไม่ได้กำหนด —', color: 'bg-gray-50' },
                  { no: 4, label: 'ระยะเวลาดำเนินการ',  value: '— ยังไม่ได้กำหนด —', color: 'bg-gray-50' },
                  { no: 5, label: 'ผลการดำเนินการ',     value: '— ยังไม่ได้กำหนด —', color: 'bg-gray-50' },
                ].map(r => (
                  <div key={r.no} className={`flex gap-3 items-start p-3 rounded-lg ${r.color}`}>
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center flex-shrink-0">{r.no}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-700">{r.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">ดาวน์โหลดมาตรการฉบับสมบูรณ์ (PDF)</span>
                <span className="text-xs text-gray-400 italic">— อยู่ระหว่างจัดทำ —</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
