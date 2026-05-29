import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getProcurement, getEgpRss } from '../services/api'

// anounceType codes from CGD e-GP RSS manual
// Empty '' = default returns D0 (เชิญชวน) only — not truly "all"
const EGP_TYPES = [
  { key: 'D0', label: 'ประกาศเชิญชวน' },
  { key: 'P0', label: 'แผนการจัดซื้อ' },
  { key: 'W0', label: 'ประกาศผู้ชนะ' },
  { key: 'W2', label: 'แก้ไขประกาศผู้ชนะ' },
  { key: '15', label: 'ราคากลาง' },
  { key: 'B0', label: 'ร่างประกวดราคา' },
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

  const hasSummary = items.some(i => i.winner || i.amount != null)

  return (
    <div className="divide-y divide-gray-50">
      {items.map((item, idx) => {
        const href = item.externalUrl || item.fileUrl || null
        const hasResult = item.winner || item.amount != null || item.budget != null

        return (
          <div key={item._id} className={`px-4 py-4 hover:bg-blue-50/40 transition-colors ${hasResult ? 'bg-green-50/20' : ''}`}>
            {/* Row number + type + date */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${item.type === 'egp' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {item.type === 'egp' ? 'e-GP' : 'ข่าว'}
              </span>
              {item.method && <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.method}</span>}
              <span className="ml-auto text-[11px] text-gray-400">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : ''}
              </span>
            </div>

            {/* Title */}
            {href
              ? <a href={href} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-secondary leading-relaxed font-medium block mb-2">{item.title}</a>
              : <p className="text-sm text-gray-800 font-medium leading-relaxed mb-2">{item.title}</p>
            }

            {/* Summary chips — shown only when AI/manual data is available */}
            {hasResult && (
              <div className="flex flex-wrap gap-2 mt-1">
                {item.winner && (
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                    <span>🏆</span>
                    <span>{item.winner}</span>
                  </div>
                )}
                {item.amount != null && (
                  <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">
                    <span>💰</span>
                    <span>{Number(item.amount).toLocaleString('th-TH')} บาท</span>
                  </div>
                )}
                {item.budget != null && (
                  <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                    <span>📋</span>
                    <span>วงเงิน {Number(item.budget).toLocaleString('th-TH')} บาท</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EgpTab() {
  const [anounceType, setAnounceType] = useState('D0')
  const [items, setItems]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [maintenance, setMaintenance] = useState(null)
  const [staleAt, setStaleAt]         = useState(null)
  const [fetchedAt, setFetchedAt]     = useState(null)
  const [tick, setTick]               = useState(0)  // bump to force re-fetch

  useEffect(() => {
    setLoading(true)
    setError('')
    setMaintenance(null)
    setStaleAt(null)
    setFetchedAt(null)
    const params = anounceType ? { anounceType } : {}
    getEgpRss(params)
      .then(r => {
        const d = r?.data || {}
        setItems(d.items || [])
        if (d.stale)     setStaleAt(d.staleAt || null)
        if (d.fetchedAt) setFetchedAt(d.fetchedAt)
        if (d.notice)    setMaintenance({ notice: d.notice, hours: d.hours })
      })
      .catch(err => {
        const d = err?.response?.data || {}
        if (d.maintenance) setMaintenance({ notice: d.notice, hours: d.hours })
        else setError(d.error || 'ไม่สามารถเชื่อมต่อระบบ e-GP ได้')
      })
      .finally(() => setLoading(false))
  }, [anounceType, tick])

  return (
    <div>
      {/* Sub-filter + refresh */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
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
        <button
          onClick={() => setTick(n => n + 1)}
          disabled={loading}
          className="ml-auto flex items-center gap-1 text-xs text-gray-500 border border-gray-200 bg-white px-2.5 py-1 rounded-full hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50 flex-shrink-0"
          title="ดึงข้อมูลใหม่"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span> รีเฟรช
        </button>
      </div>

      {/* Last updated line */}
      {(fetchedAt || staleAt) && (
        <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
          {staleAt
            ? <><span className="text-amber-500">⚠️ ข้อมูลแคช</span> · อัปเดตล่าสุด {new Date(staleAt).toLocaleString('th-TH')}</>
            : <><span className="text-green-600">✓ ข้อมูลล่าสุด</span> · ดึงข้อมูลเมื่อ {new Date(fetchedAt).toLocaleString('th-TH')}</>
          }
        </div>
      )}

      {/* Maintenance notice banner */}
      {maintenance && (
        <div className="flex items-start gap-3 mx-4 mt-4 mb-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-xl flex-shrink-0">🔧</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">ระบบ e-GP ปิดปรับปรุงชั่วคราว</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {maintenance.notice && maintenance.notice !== 'ระบบ e-GP ไม่พร้อมให้บริการในขณะนี้'
                ? maintenance.notice
                : 'ระบบ e-GP ไม่พร้อมให้บริการในขณะนี้'}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              เปิดให้บริการ {maintenance.hours || '17:01–08:59 น.'} (เว้นวันหยุดราชการ)
            </p>
            {staleAt && (
              <p className="text-[11px] text-amber-500 mt-1">
                ℹ️ แสดงข้อมูลล่าสุดที่บันทึกไว้ เมื่อ {new Date(staleAt).toLocaleString('th-TH')}
              </p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-gray-400 text-sm animate-pulse">กำลังดึงข้อมูลจากระบบ e-GP...</div>
      ) : error ? (
        <div className="p-10 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500 text-sm font-medium">ไม่สามารถเชื่อมต่อระบบ e-GP ได้</p>
          <p className="text-xs text-gray-400 mt-2">ระบบ e-GP เปิดให้บริการ 17:01–08:59 น. (เว้นวันหยุดราชการ)</p>
        </div>
      ) : items.length === 0 && !maintenance ? (
        <div className="p-10 text-center text-gray-400 text-sm">ไม่พบข้อมูลในขณะนี้</div>
      ) : items.length === 0 ? null : (
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
