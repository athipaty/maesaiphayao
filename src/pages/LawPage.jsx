import { useState, useEffect } from 'react'
import { getDocuments } from '../services/api'

const CATS = [
  { id: 'all',       label: 'ทั้งหมด',           cats: ['law', 'integrity'] },
  { id: 'law',       label: 'กฎหมาย/ระเบียบ',     cats: ['law'] },
  { id: 'integrity', label: 'ด้านคุณธรรม/ความโปร่งใส', cats: ['integrity'] },
]

const FILE_ICON = { pdf: '📄', excel: '📊', word: '📝', zip: '📦', other: '📎' }

const STATIC_LAWS = [
  {
    group: '🏛️ กฎหมายหลักที่ อบต. ต้องปฏิบัติ',
    items: [
      { label: 'พ.ร.บ.สภาตำบลและองค์การบริหารส่วนตำบล พ.ศ. 2537 (และที่แก้ไขเพิ่มเติม)', href: 'https://www.dla.go.th/work/law.htm' },
      { label: 'พ.ร.บ.กำหนดแผนและขั้นตอนการกระจายอำนาจฯ พ.ศ. 2542', href: 'https://www.dla.go.th/work/law.htm' },
      { label: 'พ.ร.บ.ข้อมูลข่าวสารของราชการ พ.ศ. 2540', href: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER009/GENERAL/DATA0000/00000024.PDF' },
      { label: 'พ.ร.บ.การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560', href: 'https://www.gprocurement.go.th/wps/portal' },
      { label: 'พ.ร.บ.วิธีปฏิบัติราชการทางปกครอง พ.ศ. 2539', href: 'https://www.dla.go.th/work/law.htm' },
      { label: 'พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)', href: 'https://www.pdpc.or.th/' },
    ],
  },
  {
    group: '💰 กฎหมายด้านการเงินการคลัง',
    items: [
      { label: 'ระเบียบกระทรวงมหาดไทยว่าด้วยการรับเงิน การเบิกจ่ายเงิน การฝากเงิน การเก็บรักษาเงิน และการตรวจเงินขององค์กรปกครองส่วนท้องถิ่น พ.ศ. 2547', href: 'https://www.dla.go.th/work/law.htm' },
      { label: 'พ.ร.บ.ภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2562', href: 'https://www.revenue.go.th/' },
      { label: 'พ.ร.บ.ภาษีป้าย พ.ศ. 2510', href: 'https://www.revenue.go.th/' },
    ],
  },
  {
    group: '⚖️ กฎหมายด้านการบริหารงานบุคคล',
    items: [
      { label: 'พ.ร.บ.ระเบียบบริหารงานบุคคลส่วนท้องถิ่น พ.ศ. 2542', href: 'https://www.dla.go.th/work/law.htm' },
      { label: 'ประกาศ ก.ถ. มาตรฐานทั่วไปสำหรับพนักงานส่วนตำบล', href: 'https://www.local.moi.go.th/' },
    ],
  },
]

export default function LawPage() {
  const [docs, setDocs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat]       = useState('all')

  useEffect(() => {
    Promise.all([getDocuments({ category: 'law' }), getDocuments({ category: 'integrity' })])
      .then(([l, i]) => setDocs([...(l?.data || []), ...(i?.data || [])]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cats = CATS.find(c => c.id === cat)?.cats || ['law', 'integrity']
  const displayed = docs.filter(d => cats.includes(d.category))

  return (
    <div>
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📜 กฎหมาย/ข้อบัญญัติ</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          รวบรวมกฎหมาย ระเบียบ ข้อบัญญัติ และแนวปฏิบัติที่เกี่ยวข้องกับองค์การบริหารส่วนตำบลแม่ใส
          เพื่อให้บุคลากรและประชาชนสามารถศึกษาและอ้างอิงได้
        </div>
      </div>

      {/* Local ordinances highlight */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
        <span className="text-2xl flex-shrink-0">📋</span>
        <div>
          <p className="text-sm font-semibold text-amber-800 mb-1">ข้อบัญญัติท้องถิ่น อบต.แม่ใส</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            ข้อบัญญัติงบประมาณรายจ่ายประจำปี และข้อบัญญัติอื่น ๆ ที่สภา อบต.แม่ใส
            ตราขึ้นเพื่อใช้บังคับในเขตตำบลแม่ใส ดาวน์โหลดได้จากคลังเอกสารด้านล่าง
          </p>
        </div>
      </div>

      {/* Document library */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="section-head">
          <h2 className="text-sm font-semibold">📂 คลังเอกสารกฎหมายและข้อบัญญัติ</h2>
        </div>
        <div className="p-3 border-b border-gray-100 flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                cat === c.id ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : displayed.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">ยังไม่มีเอกสาร</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {displayed.map(item => (
              <div key={item._id} className="p-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{FILE_ICON[item.fileType] || '📎'}</span>
                <div className="flex-1 min-w-0">
                  {item.fiscalYear && <p className="text-xs text-gray-400 mb-0.5">ปี {item.fiscalYear}</p>}
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                </div>
                <a href={item.fileUrl} target="_blank" rel="noreferrer"
                  className="flex-shrink-0 text-xs border-2 border-primary text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                  ⬇ ดาวน์โหลด
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Static law references */}
      <div className="space-y-4">
        {STATIC_LAWS.map(group => (
          <div key={group.group} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">{group.group}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {group.items.map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50/50 transition-colors group">
                  <span className="text-primary text-xs flex-shrink-0">›</span>
                  <span className="text-xs text-gray-700 group-hover:text-primary flex-1">{item.label}</span>
                  <span className="text-gray-300 text-xs flex-shrink-0">🔗</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
