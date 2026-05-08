import { useState, useEffect } from 'react'
import { getStaff, getSettings } from '../services/api'
import PageHeader from '../components/PageHeader'

const DEFAULT_DEPTS = [
  { value: 'executive',   label: 'ผู้บริหาร' },
  { value: 'council',     label: 'สมาชิกสภา อบต.' },
  { value: 'office',      label: 'สำนักปลัด' },
  { value: 'finance',     label: 'กองคลัง' },
  { value: 'engineering', label: 'กองช่าง' },
  { value: 'health',      label: 'กองสาธารณสุขฯ' },
  { value: 'audit',       label: 'หน่วยตรวจสอบภายใน' },
]

function StaffCard({ s }) {
  if (s.isVacant) {
    return (
      <div className="text-center">
        <div className="border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mx-auto mb-2 rounded bg-gray-50"
          style={{ width: 100, height: 140 }}>
          <span className="text-2xl mb-1">👤</span>
          <span className="text-xs text-gray-400">ตำแหน่งว่าง</span>
        </div>
        <p className="text-xs text-gray-400 italic leading-snug">{s.position}</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      {s.image ? (
        <img src={s.image} alt={s.name}
          className="object-cover mx-auto mb-2 border-2 border-blue-100 rounded"
          style={{ width: 100, height: 140, objectFit: 'cover', objectPosition: 'top center' }} />
      ) : (
        <div className="bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl text-white mx-auto mb-2 rounded"
          style={{ width: 100, height: 140 }}>
          👤
        </div>
      )}
      <h4 className="text-xs font-semibold text-primary leading-snug">{s.name}</h4>
      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.position}</p>
      {s.phone && <p className="text-xs text-secondary mt-0.5">{s.phone}</p>}
    </div>
  )
}

function DeptSection({ dept, members }) {
  const byLevel = members.reduce((acc, s) => {
    const lv = s.level || 1
    if (!acc[lv]) acc[lv] = []
    acc[lv].push(s)
    return acc
  }, {})

  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b)
  const lineColor = dept === 'executive' ? 'bg-primary' : 'bg-secondary'

  return (
    <div className="px-4 py-5 space-y-0">
      {levels.map((lv, lvIdx) => {
        const row = [...byLevel[lv]].sort((a, b) => (a.order || 0) - (b.order || 0))
        const isFirst = lvIdx === 0
        const indent = `${(lv - 1) * 16}px`

        return (
          <div key={lv}>
            {!isFirst && (
              <div className="flex justify-center">
                <div className={`w-0.5 h-6 ${lineColor} opacity-30`} />
              </div>
            )}
            <div
              className="flex flex-wrap justify-center gap-4 py-2"
              style={{ paddingLeft: indent, paddingRight: indent }}
            >
              {row.map(s => <StaffCard key={s._id} s={s} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function StaffPage() {
  const [staff, setStaff]     = useState([])
  const [depts, setDepts]     = useState(DEFAULT_DEPTS)
  const [loading, setLoading] = useState(true)
  const [activeDept, setActiveDept] = useState('all')

  useEffect(() => {
    Promise.all([getStaff(), getSettings()])
      .then(([staffRes, settingsRes]) => {
        setStaff(staffRes?.data || [])
        if (settingsRes?.data?.departments?.length) {
          setDepts(settingsRes.data.departments)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const deptMap = Object.fromEntries(depts.map(d => [d.value, d.label]))

  const grouped = staff.reduce((acc, s) => {
    if (!acc[s.department]) acc[s.department] = []
    acc[s.department].push(s)
    return acc
  }, {})

  const deptKeys = depts.map(d => d.value).filter(v => grouped[v]?.length > 0)

  const visibleDepts = activeDept === 'all'
    ? deptKeys
    : deptKeys.filter(d => d === activeDept)

  return (
    <div>
      <PageHeader icon="👥" title="บุคลากร/กิจการสภา"
        desc="ข้อมูลผู้บริหาร สมาชิกสภา และบุคลากรองค์การบริหารส่วนตำบลแม่ใส แยกตามสังกัดกอง/สำนัก" />

      {/* Dept filter buttons */}
      {!loading && deptKeys.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm mb-4 p-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveDept('all')}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              activeDept === 'all'
                ? 'bg-secondary text-white border-secondary'
                : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
            }`}>
            ทั้งหมด
          </button>
          {deptKeys.map(d => (
            <button key={d} onClick={() => setActiveDept(d)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                activeDept === d
                  ? 'bg-secondary text-white border-secondary'
                  : 'border-gray-300 text-gray-600 hover:border-secondary hover:text-secondary'
              }`}>
              {deptMap[d]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : staff.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข้อมูลบุคลากร</div>
      ) : (
        visibleDepts.map(dept => (
          <div key={dept} id={`dept-${dept}`} className="card mb-4">
            <div className="section-head">
              <h2 className="text-sm font-semibold">👥 {deptMap[dept]}</h2>
            </div>
            <DeptSection dept={dept} members={grouped[dept]} />
          </div>
        ))
      )}
    </div>
  )
}
