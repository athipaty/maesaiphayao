import { useState, useEffect } from 'react'
import { getStaff } from '../services/api'
import PageHeader from '../components/PageHeader'

const DEPT_LABELS = {
  executive:   'ผู้บริหาร',
  council:     'สมาชิกสภา อบต.',
  office:      'สำนักปลัด',
  finance:     'กองคลัง',
  engineering: 'กองช่าง',
  health:      'กองสาธารณสุขและสิ่งแวดล้อม',
  audit:       'หน่วยตรวจสอบภายใน',
}

function StaffCard({ s, size = 'md' }) {
  const sizes = {
    lg: { img: [120, 165], name: 'text-sm', pos: 'text-xs' },
    md: { img: [100, 140], name: 'text-xs', pos: 'text-xs' },
    sm: { img: [80,  110], name: 'text-xs', pos: 'text-xs' },
  }
  const cfg = sizes[size]
  return (
    <div className="text-center">
      {s.image ? (
        <img src={s.image} alt={s.name}
          className="object-cover mx-auto mb-2 border-2 border-blue-100 rounded"
          style={{ width: cfg.img[0], height: cfg.img[1], objectFit: 'cover', objectPosition: 'top center' }} />
      ) : (
        <div className="bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl text-white mx-auto mb-2 rounded"
          style={{ width: cfg.img[0], height: cfg.img[1] }}>
          👤
        </div>
      )}
      <h4 className={`font-semibold text-primary leading-snug ${cfg.name}`}>{s.name}</h4>
      <p className={`text-gray-500 mt-0.5 leading-snug ${cfg.pos}`}>{s.position}</p>
      {s.phone && <p className="text-xs text-secondary mt-0.5">{s.phone}</p>}
    </div>
  )
}

function DeptSection({ dept, label, members }) {
  // group by level, sort within each level by order
  const byLevel = members.reduce((acc, s) => {
    const lv = s.level || 1
    if (!acc[lv]) acc[lv] = []
    acc[lv].push(s)
    return acc
  }, {})

  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b)

  // connector line colour per dept
  const lineColor = dept === 'executive' ? 'bg-primary' : 'bg-secondary'

  return (
    <div id={`dept-${dept}`} className="card mb-4">
      <div className="section-head">
        <h2 className="text-sm font-semibold">👥 {label}</h2>
      </div>

      <div className="px-4 py-5 space-y-0">
        {levels.map((lv, lvIdx) => {
          const row = [...byLevel[lv]].sort((a, b) => (a.order || 0) - (b.order || 0))
          const cardSize = lv === 1 ? 'lg' : lv === 2 ? 'md' : 'sm'
          const isFirst  = lvIdx === 0

          // indent per level
          const indent = `${(lv - 1) * 16}px`

          return (
            <div key={lv}>
              {/* connector line down from previous level */}
              {!isFirst && (
                <div className="flex justify-center">
                  <div className={`w-0.5 h-6 ${lineColor} opacity-30`} />
                </div>
              )}

              {/* row of cards */}
              <div
                className="flex flex-wrap justify-center gap-4 py-2"
                style={{ paddingLeft: indent, paddingRight: indent }}
              >
                {row.map(s => (
                  <StaffCard key={s._id} s={s} size={cardSize} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StaffPage() {
  const [staff, setStaff]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStaff()
      .then(r => setStaff(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const grouped = staff.reduce((acc, s) => {
    if (!acc[s.department]) acc[s.department] = []
    acc[s.department].push(s)
    return acc
  }, {})

  return (
    <div>
      <PageHeader icon="👥" title="บุคลากร/กิจการสภา"
        desc="ข้อมูลผู้บริหาร สมาชิกสภา และบุคลากรองค์การบริหารส่วนตำบลแม่ใส แยกตามสังกัดกอง/สำนัก" />
      {loading ? (
        <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : staff.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข้อมูลบุคลากร</div>
      ) : (
        Object.entries(DEPT_LABELS).map(([dept, label]) => {
          const members = grouped[dept]
          if (!members || members.length === 0) return null
          return <DeptSection key={dept} dept={dept} label={label} members={members} />
        })
      )}
    </div>
  )
}
