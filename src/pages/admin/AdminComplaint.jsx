import { useState, useEffect } from 'react'
import { getComplaints, updateComplaint } from '../../services/api'

const STATUSES = [
  { value: 'received',      label: 'รับเรื่องแล้ว',  color: 'bg-blue-50 text-blue-700' },
  { value: 'investigating', label: 'กำลังสอบสวน',   color: 'bg-yellow-50 text-yellow-700' },
  { value: 'done',          label: 'เสร็จสิ้น',       color: 'bg-green-50 text-green-700' },
  { value: 'rejected',      label: 'ไม่รับเรื่อง',    color: 'bg-red-50 text-red-600' },
]

export default function AdminComplaint() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote]       = useState('')
  const [status, setStatus]   = useState('')
  const [saving, setSaving]   = useState(false)

  async function load() {
    setLoading(true)
    try {
      const r = await getComplaints({})
      setItems(r?.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openItem(item) {
    setSelected(item)
    setNote(item.officerNote || '')
    setStatus(item.status)
  }

  async function handleUpdate() {
    setSaving(true)
    try {
      const r = await updateComplaint(selected._id, { status, officerNote: note })
      setItems(prev => prev.map(i => i._id === selected._id ? r.data : i))
      setSelected(null)
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err?.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const displayItems = typeFilter ? items.filter(i => i.type === typeFilter) : items
  const statusConfig = (s) => STATUSES.find(x => x.value === s)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">📮 จัดการเรื่องร้องเรียน</h1>
        <button onClick={load} className="text-xs text-secondary hover:underline">↻ รีเฟรช</button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setTypeFilter('')}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${!typeFilter ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600'}`}>
          ทั้งหมด ({items.length})
        </button>

        <button onClick={() => setTypeFilter('general')}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${typeFilter === 'general' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600'}`}>
          📝 ร้องเรียนทั่วไป
        </button>
        <button onClick={() => setTypeFilter('corruption')}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${typeFilter === 'corruption' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600'}`}>
          🚨 แจ้งเบาะแสทุจริต
        </button>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-sm font-semibold">
                {selected.type === 'corruption' ? '🚨' : '📝'} {selected.complaintNo}
              </h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div><span className="text-gray-400 text-xs">ประเภท</span>
                  <p className="font-medium">{selected.type === 'corruption' ? 'ร้องเรียนทุจริตและประพฤติมิชอบ' : 'ร้องเรียนทั่วไป'}</p>
                </div>
                {selected.isAnonymous ? (
                  <div><span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">ไม่ระบุตัวตน</span></div>
                ) : (
                  <>
                    {selected.citizenName && <div><span className="text-gray-400 text-xs">ผู้ร้องเรียน</span><p className="font-medium">{selected.citizenName}</p></div>}
                    {selected.phone && <div><span className="text-gray-400 text-xs">เบอร์โทร</span><p className="font-medium">{selected.phone}</p></div>}
                  </>
                )}
              </div>
              <div><span className="text-gray-400 text-xs">รายละเอียด</span><p className="mt-1 leading-relaxed">{selected.detail}</p></div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">อัปเดตสถานะ</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-pink-400"
                  value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ผลการดำเนินการ</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 resize-none"
                  value={note} onChange={e => setNote(e.target.value)} placeholder="บันทึกผลการสอบสวน/ดำเนินการ..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setSelected(null)} className="btn-ghost text-xs">ยกเลิก</button>
              <button onClick={handleUpdate} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
                {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : displayItems.length === 0 ? (
          <div className="p-10 text-center text-gray-400">ยังไม่มีเรื่องร้องเรียน</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">เลขที่</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">ประเภท</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">ผู้ร้อง</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">รายละเอียด</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">วันที่</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">สถานะ</th>
                  <th className="px-3 py-2.5 text-right text-gray-500 font-medium w-20">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map(item => {
                  const sc = statusConfig(item.status)
                  return (
                    <tr key={item._id} className={`border-b border-gray-50 hover:bg-gray-50/60 ${item.type === 'corruption' ? 'bg-red-50/20' : ''}`}>
                      <td className="px-3 py-2.5 text-xs font-mono text-primary">{item.complaintNo}</td>
                      <td className="px-3 py-2.5 text-xs">{item.type === 'corruption' ? '🚨 ทุจริต' : '📝 ทั่วไป'}</td>
                      <td className="px-3 py-2.5 text-xs">{item.isAnonymous ? <span className="text-gray-400">ไม่ระบุ</span> : item.citizenName}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600 max-w-xs truncate">{item.detail}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc?.color || ''}`}>{sc?.label}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button onClick={() => openItem(item)} className="text-xs text-secondary hover:underline">จัดการ</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
