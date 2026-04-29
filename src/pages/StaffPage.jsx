import { useState, useEffect } from 'react'
import { getStaff } from '../services/api'

const DEPT_LABELS = {
  executive:   'ผู้บริหาร',
  council:     'สมาชิกสภา อบต.',
  office:      'สำนักปลัด',
  finance:     'กองคลัง',
  engineering: 'กองช่าง',
  health:      'กองสาธารณสุขและสิ่งแวดล้อม',
  audit:       'หน่วยตรวจสอบภายใน',
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

  // group by department
  const grouped = staff.reduce((acc, s) => {
    if (!acc[s.department]) acc[s.department] = []
    acc[s.department].push(s)
    return acc
  }, {})

  return (
    <div>
      {loading ? (
        <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : staff.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีข้อมูลบุคลากร</div>
      ) : (
        Object.entries(DEPT_LABELS).map(([dept, label]) => {
          const members = grouped[dept]
          if (!members || members.length === 0) return null
          return (
            <div key={dept} className="card mb-4">
              <div className="section-head">
                <h2 className="text-sm font-semibold">👥 {label}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {members.map(s => (
                  <div key={s._id} className="text-center">
                    {s.image ? (
                      <img src={s.image} alt={s.name}
                        className="object-cover mx-auto mb-2 border-2 border-blue-100 rounded"
                        style={{ width: '100px', height: '140px', objectFit: 'cover', objectPosition: 'top center' }} />
                    ) : (
                      <div className="bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl text-white mx-auto mb-2 rounded"
                        style={{ width: '100px', height: '140px' }}>
                        👤
                      </div>
                    )}
                    <h4 className="text-xs font-semibold text-primary leading-snug">{s.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.position}</p>
                    {s.phone && <p className="text-xs text-secondary mt-0.5">{s.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}