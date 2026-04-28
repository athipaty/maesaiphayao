import { useState, useEffect } from 'react'
import { getAnnouncements } from '../services/api'

export default function AnnouncePage() {
  const [tab, setTab]             = useState('announcement')
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    getAnnouncements({ type: tab })
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div>
      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">📢 ข่าวประชาสัมพันธ์และจดหมายข่าว</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'announcement', label: 'ข่าวประชาสัมพันธ์' },
            { key: 'newsletter',   label: 'จดหมายข่าว' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? 'border-secondary text-primary bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left text-primary font-semibold w-10">ที่</th>
                <th className="px-3 py-2 text-left text-primary font-semibold">รายการ</th>
                <th className="px-3 py-2 text-left text-primary font-semibold w-32">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-8 text-center text-gray-400">ยังไม่มีข้อมูล</td></tr>
              )}
              {items.map((a, i) => (
                <tr key={a._id} className="border-b border-gray-50 hover:bg-blue-50/50">
                  <td className="px-3 py-2.5 text-gray-400 text-center">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    {a.fileUrl
                      ? <a href={a.fileUrl} target="_blank" rel="noreferrer"
                          className="text-primary hover:text-secondary">
                          {a.title}
                        </a>
                      : <span>{a.title}</span>
                    }
                  </td>
                  <td className="px-3 py-2.5 text-gray-400 text-xs">
                    {new Date(a.publishedAt).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}