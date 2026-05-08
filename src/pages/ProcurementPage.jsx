import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getProcurement, getEgpRss } from '../services/api'

const EGP_TYPES = [
  { key: '',   label: 'ทั้งหมด' },
  { key: 'P0', label: 'แผนการจัดซื้อ' },
  { key: 'D0', label: 'ประกาศเชิญชวน' },
  { key: 'W0', label: 'ประกาศผู้ชนะ' },
  { key: '15', label: 'ราคากลาง' },
]

function LocalTab() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getProcurement({})
      .then(r => setItems((r?.data || []).filter(i => i.isActive)))
      .catch(() => setError('ไม่สามารถโหลดข้อมูลได้'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-10 text-center text-gray-400 text-sm animate-pulse">กำลังโหลด...</div>
  if (error)   return <div className="p-10 text-center text-red-400 text-sm">{error}</div>
  if (items.length === 0) return <div className="p-10 text-center text-gray-400 text-sm">ไม่พบข้อมูลในขณะนี้</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-50">
            <th className="px-3 py-2.5 text-left text-primary font-semibold w-10">ที่</th>
            <th className="px-3 py-2.5 text-left text-primary font-semibold">รายการ</th>
            <th className="px-3 py-2.5 text-left text-primary font-semibold w-28">ประเภท</th>
            <th className="px-3 py-2.5 text-left text-primary font-semibold w-36 whitespace-nowrap">วันที่ประกาศ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item._id} className="border-b border-gray-50 hover:bg-blue-50/50">
              <td className="px-3 py-2.5 text-gray-400 text-center">{i + 1}</td>
              <td className="px-3 py-2.5">
                {item.externalUrl || item.fileUrl ? (
                  <a href={item.externalUrl || item.fileUrl} target="_blank" rel="noreferrer"
                    className="text-primary hover:text-secondary leading-relaxed">
                    {item.title}
                  </a>
                ) : (
                  <span className="text-gray-700">{item.title}</span>
                )}
              </td>
              <td className="px-3 py-2.5">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  item.type === 'egp' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
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
  )
}

function EgpTab() {
  const [anounceType, setAnounceType] = useState('')
  const [items, setItems]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = anounceType ? { anounceType } : {}
    getEgpRss(params)
      .then(r => setItems(r?.data || []))
      .catch(err => setError(err?.response?.data?.error || 'ไม่สามารถเชื่อมต่อระบบ e-GP ได้'))
      .finally(() => setLoading(false))
  }, [anounceType])

  return (
    <div>
      {/* Sub-filter */}
      <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
        {EGP_TYPES.map(t => (
          <button key={t.key} onClick={() => setAnounceType(t.key)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              anounceType === t.key
                ? 'bg-secondary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-400 text-sm animate-pulse">กำลังดึงข้อมูลจากระบบ e-GP...</div>
      ) : error ? (
        <div className="p-10 text-center">
          <div className="text-red-400 text-sm">{error}</div>
          <p className="text-xs text-gray-400 mt-2">ระบบ e-GP เปิดให้บริการ 12:01–12:59 น. และ 17:01–08:59 น.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-gray-400 text-sm">ไม่พบข้อมูลในขณะนี้</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2.5 text-left text-primary font-semibold w-10">ที่</th>
                <th className="px-3 py-2.5 text-left text-primary font-semibold">รายการ</th>
                <th className="px-3 py-2.5 text-left text-primary font-semibold w-36 whitespace-nowrap">วันที่ประกาศ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/50">
                  <td className="px-3 py-2.5 text-gray-400 text-center">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer"
                        className="text-primary hover:text-secondary leading-relaxed">
                        {item.title}
                      </a>
                    ) : (
                      <span className="text-gray-700">{item.title}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                    {item.date ? new Date(item.date).toLocaleDateString('th-TH', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    }) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const MAIN_TABS = [
  { key: 'local', label: 'ประกาศจัดซื้อ' },
  { key: 'egp',   label: 'ระบบ e-GP (เรียลไทม์)' },
]

export default function ProcurementPage() {
  const [tab, setTab] = useState('local')

  return (
    <div>
      <PageHeader icon="📦" title="การจัดซื้อจัดจ้าง"
        desc="ประกาศการจัดซื้อจัดจ้างขององค์การบริหารส่วนตำบลแม่ใส" />
      <div className="card">
        <div className="flex flex-wrap border-b border-gray-200 bg-white">
          {MAIN_TABS.map(t => (
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

        {tab === 'local' ? <LocalTab /> : <EgpTab />}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <a href="https://www.gprocurement.go.th/" target="_blank" rel="noreferrer"
            className="text-xs text-secondary hover:underline">
            ดูเพิ่มเติมที่ gprocurement.go.th →
          </a>
        </div>
      </div>
    </div>
  )
}
