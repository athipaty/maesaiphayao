import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getProcurement } from '../services/api'

const TABS = [
  { key: 'all',  label: 'ทั้งหมด' },
  { key: 'egp',  label: 'ระบบ e-GP' },
  { key: 'news', label: 'ข่าวจัดซื้อจัดจ้าง' },
]

export default function ProcurementPage() {
  const [tab, setTab]         = useState('all')
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = {}
    if (tab !== 'all') params.type = tab
    getProcurement(params)
      .then(r => setItems((r?.data || []).filter(i => i.isActive)))
      .catch(() => setError('ไม่สามารถโหลดข้อมูลได้'))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div>
      <PageHeader icon="📦" title="การจัดซื้อจัดจ้าง"
        desc="ประกาศการจัดซื้อจัดจ้างขององค์การบริหารส่วนตำบลแม่ใส" />
      <div className="card">

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 bg-white">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'border-secondary text-primary bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm animate-pulse">กำลังโหลด...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-400 text-sm">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">ไม่พบข้อมูลในขณะนี้</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2.5 text-left text-primary font-semibold w-10">ที่</th>
                  <th className="px-3 py-2.5 text-left text-primary font-semibold">รายการ</th>
                  <th className="px-3 py-2.5 text-left text-primary font-semibold w-28 whitespace-nowrap">ประเภท</th>
                  <th className="px-3 py-2.5 text-left text-primary font-semibold w-36 whitespace-nowrap">วันที่ประกาศ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-blue-50/50">
                    <td className="px-3 py-2.5 text-gray-400 text-center">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      {item.externalUrl ? (
                        <a href={item.externalUrl} target="_blank" rel="noreferrer"
                          className="text-primary hover:text-secondary leading-relaxed">
                          {item.title}
                        </a>
                      ) : item.fileUrl ? (
                        <a href={item.fileUrl} target="_blank" rel="noreferrer"
                          className="text-primary hover:text-secondary leading-relaxed">
                          {item.title}
                        </a>
                      ) : (
                        <span className="text-gray-700">{item.title}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        item.type === 'egp'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'egp' ? 'e-GP' : 'ข่าว'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">แสดง {items.length} รายการ</p>
          <a href="https://www.gprocurement.go.th/" target="_blank" rel="noreferrer"
            className="text-xs text-secondary hover:underline">
            ดูเพิ่มเติมที่ gprocurement.go.th →
          </a>
        </div>
      </div>
    </div>
  )
}
