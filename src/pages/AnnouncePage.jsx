import { useState, useEffect } from 'react'
import { getAnnouncements } from '../services/api'
import PageHeader from '../components/PageHeader'
import PdfPreviewPanel from '../components/PdfPreviewPanel'

export default function AnnouncePage() {
  const [tab, setTab]         = useState('announcement')
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [pdfOpen, setPdfOpen] = useState({})

  useEffect(() => {
    setPdfOpen({})
    setLoading(true)
    getAnnouncements({ type: tab })
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tab])

  function toggle(id) {
    setPdfOpen(s => ({ ...s, [id]: !s[id] }))
  }

  return (
    <div>
      <PageHeader icon="📢" title="ข่าวประชาสัมพันธ์และจดหมายข่าว"
        desc="ข่าวประชาสัมพันธ์ ประกาศ และจดหมายข่าวขององค์การบริหารส่วนตำบลแม่ใส" />
      <div className="card overflow-hidden p-0">

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'announcement', label: 'ข่าวประชาสัมพันธ์' },
            { key: 'newsletter',   label: 'จดหมายข่าว' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? 'border-secondary text-primary bg-pink-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">ยังไม่มีข้อมูล</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((a, i) => (
              <div key={a._id}>
                <div
                  className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50/40 transition-colors cursor-pointer"
                  onClick={() => toggle(a._id)}
                >
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0 text-center">{i + 1}</span>
                  <span className="flex-1 min-w-0 text-sm text-gray-800 leading-snug">{a.title}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(a.publishedAt).toLocaleDateString('th-TH')}
                  </span>
                  {a.fileUrl && (
                    <>
                      <a href={a.fileUrl} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors flex-shrink-0">
                        📥 ดาวน์โหลด
                      </a>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${pdfOpen[a._id] ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {pdfOpen[a._id] ? '▲ ซ่อน' : '▼ แสดง'}
                      </span>
                    </>
                  )}
                </div>
                {pdfOpen[a._id] && <PdfPreviewPanel fileUrl={a.fileUrl} title={a.title} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
