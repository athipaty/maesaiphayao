import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'

const DEPT_SUB_ID = '6560105'
const BASE_URL = 'http://process3.gprocurement.go.th/EPROCRssFeedWeb/egpannouncerss.xml'

const ANNOUNCE_TYPES = [
  { key: 'all', label: 'ทั้งหมด',                     type: '' },
  { key: 'P0',  label: 'แผนการจัดซื้อจัดจ้าง',        type: 'P0' },
  { key: 'D0',  label: 'ประกาศเชิญชวน',               type: 'D0' },
  { key: 'W0',  label: 'ประกาศผู้ชนะการเสนอราคา',     type: 'W0' },
  { key: '15',  label: 'ประกาศราคากลาง',              type: '15' },
]

function buildUrl(anounceType) {
  const params = new URLSearchParams({ deptsubId: DEPT_SUB_ID })
  if (anounceType) params.append('anounceType', anounceType)
  // ใช้ proxy ผ่าน allorigins เพื่อหลีกเลี่ยง CORS
  const target = `${BASE_URL}?${params.toString()}`
  return `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`
}

function parseRSS(xmlText) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'text/xml')
  const items = Array.from(doc.querySelectorAll('item'))
  return items.map(item => ({
    title: item.querySelector('title')?.textContent || '',
    link:  item.querySelector('link')?.textContent || '',
    date:  item.querySelector('pubDate')?.textContent || '',
    desc:  item.querySelector('description')?.textContent || '',
  }))
}

export default function ProcurementPage() {
  const [tab, setTab]         = useState('all')
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const selected = ANNOUNCE_TYPES.find(t => t.key === tab)
    fetch(buildUrl(selected?.type || ''))
      .then(r => r.json())
      .then(data => {
        const parsed = parseRSS(data.contents)
        setItems(parsed)
      })
      .catch(() => setError('ไม่สามารถดึงข้อมูลจากระบบ e-GP ได้ในขณะนี้'))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div>
      <PageHeader icon="📦" title="การจัดซื้อจัดจ้าง"
        desc="ประกาศการจัดซื้อจัดจ้างขององค์การบริหารส่วนตำบลแม่ใส ดึงข้อมูลแบบเรียลไทม์จากระบบ e-GP กรมบัญชีกลาง" />
      <div className="card">

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 bg-white">
          {ANNOUNCE_TYPES.map(t => (
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
          <div className="p-10 text-center">
            <div className="text-gray-400 text-sm animate-pulse">กำลังดึงข้อมูลจากระบบ e-GP...</div>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <div className="text-red-400 text-sm">{error}</div>
            <p className="text-xs text-gray-400 mt-2">ระบบ e-GP เปิดให้บริการ 12:01-12:59 น. และ 17:01-08:59 น.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">ไม่พบข้อมูลในขณะนี้</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2.5 text-left text-primary font-semibold w-10">ที่</th>
                <th className="px-3 py-2.5 text-left text-primary font-semibold">รายการ</th>
                <th className="px-3 py-2.5 text-left text-primary font-semibold w-36">วันที่ประกาศ</th>
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
        )}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            แสดงข้อมูลล่าสุด 20 รายการจากระบบ e-GP (รหัสหน่วยงาน: {DEPT_SUB_ID})
          </p>
          <a href={`https://www.gprocurement.go.th/`} target="_blank" rel="noreferrer"
            className="text-xs text-secondary hover:underline">
            ดูเพิ่มเติมที่ gprocurement.go.th →
          </a>
        </div>
      </div>
    </div>
  )
}