import { useState, useEffect } from 'react'
import { getDocuments } from '../services/api'

const SECTIONS = [
  { id: 'all',     label: 'ทั้งหมด',                cats: ['finance', 'budget'] },
  { id: 'finance', label: 'รายงานการเงิน',           cats: ['finance'] },
  { id: 'budget',  label: 'งบประมาณ',               cats: ['budget'] },
]

const QUICK_LINKS = [
  { icon: '🏦', label: 'ระบบบัญชีคอมพิวเตอร์ขององค์กรปกครองส่วนท้องถิ่น (e-LAAS)', href: 'http://www.laas.go.th/' },
  { icon: '📊', label: 'ระบบสารสนเทศเพื่อการวางแผนฯ (e-Plan)', href: 'http://www.eplan.go.th/' },
  { icon: '💳', label: 'ระบบจัดเก็บรายได้ (e-Revenue)', href: 'http://www.revenue.go.th/' },
]

const FILE_ICON = { pdf: '📄', excel: '📊', word: '📝', zip: '📦', other: '📎' }

export default function FinancePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState('all')

  useEffect(() => {
    Promise.all([getDocuments({ category: 'finance' }), getDocuments({ category: 'budget' })])
      .then(([f, b]) => setItems([...(f?.data || []), ...(b?.data || [])]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cats = SECTIONS.find(s => s.id === section)?.cats || ['finance', 'budget']
  const displayed = items.filter(i => cats.includes(i.category))

  return (
    <div>
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">💰 การเงินและการคลัง</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          รายงานทางการเงิน งบทดลอง รายงานรายรับ-รายจ่าย และข้อบัญญัติงบประมาณรายจ่ายประจำปี
          ขององค์การบริหารส่วนตำบลแม่ใส เพื่อความโปร่งใสและตรวจสอบได้
        </div>
      </div>

      {/* Quick service info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { icon: '🏦', label: 'บัญชีเงินฝาก',    desc: 'ธนาคารออมสิน สาขาพะเยา' },
          { icon: '📅', label: 'จ่ายเบี้ยยังชีพ', desc: 'ทุกวันที่ 10 ของเดือน' },
          { icon: '🧾', label: 'ชำระภาษี',        desc: 'ม.ค. – เม.ย. ทุกปี' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-3 items-center">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              section === s.id ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Documents */}
      {loading ? (
        <div className="card p-10 text-center text-gray-400">กำลังโหลด...</div>
      ) : displayed.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">ยังไม่มีเอกสาร</div>
      ) : (
        <div className="space-y-2 mb-5">
          {displayed.map(item => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <span className="text-2xl flex-shrink-0">{FILE_ICON[item.fileType] || '📎'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  {item.fiscalYear && <span className="text-xs text-gray-400">ปี {item.fiscalYear}</span>}
                </div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
              </div>
              <a href={item.fileUrl} target="_blank" rel="noreferrer"
                className="flex-shrink-0 text-xs border-2 border-primary text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                ⬇ ดาวน์โหลด
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="section-head">
          <h2 className="text-sm font-semibold">🔗 ระบบการเงินที่เกี่ยวข้อง</h2>
        </div>
        <div className="p-3 space-y-2">
          {QUICK_LINKS.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-700 hover:text-primary transition-colors">
              <span className="text-lg">{l.icon}</span>
              <span className="text-xs">{l.label}</span>
              <span className="ml-auto text-gray-300 text-xs">›</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
