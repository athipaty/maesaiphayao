import { useState, useEffect } from 'react'
import { getFeedback, updateFeedback, deleteFeedback } from '../../services/api'

const STATUS_CONFIG = {
  new:  { label: 'ใหม่',           color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  read: { label: 'รับทราบแล้ว',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  done: { label: 'ดำเนินการแล้ว',  color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
}

export default function AdminFeedback() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('')
  const [expanded, setExpanded] = useState(null)
  const [editNote, setEditNote] = useState('')
  const [editStatus, setEditStatus] = useState('new')
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const r = await getFeedback(filter ? { status: filter } : {})
      setItems(r?.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  function openItem(item) {
    setExpanded(item._id)
    setEditNote(item.adminNote || '')
    setEditStatus(item.status)
    if (item.status === 'new') {
      updateFeedback(item._id, { status: 'read' })
        .then(r => setItems(prev => prev.map(i => i._id === item._id ? r.data : i)))
        .catch(() => {})
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const r = await updateFeedback(expanded, { status: editStatus, adminNote: editNote })
      setItems(prev => prev.map(i => i._id === expanded ? r.data : i))
      setExpanded(null)
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + (err?.response?.data?.error || err.message))
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('ยืนยันการลบ?')) return
    setDeleting(id)
    try {
      await deleteFeedback(id)
      setItems(prev => prev.filter(i => i._id !== id))
      if (expanded === id) setExpanded(null)
    } finally { setDeleting(null) }
  }

  const newCount = items.filter(i => i.status === 'new').length

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-base font-bold text-gray-800">💭 ช่องทางรับฟังความคิดเห็น</h1>
        {newCount > 0 && (
          <span className="text-xs font-semibold bg-blue-500 text-white px-2 py-0.5 rounded-full">{newCount} ใหม่</span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        {[{ v: '', l: 'ทั้งหมด' }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ v, l: c.label }))].map(o => (
          <button key={o.v} onClick={() => setFilter(o.v)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              filter === o.v ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white'
            }`}>
            {o.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 text-sm py-10">กำลังโหลด...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-10">ยังไม่มีรายการ</div>
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.new
            const isOpen = expanded === item._id
            return (
              <div key={item._id}
                className={`bg-white rounded-xl border transition-all ${isOpen ? 'border-pink-200 shadow-md' : 'border-gray-100 shadow-sm hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => isOpen ? setExpanded(null) : openItem(item)}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${item.status === 'new' ? 'text-gray-900' : 'text-gray-600'}`}>
                      {item.topic || 'ไม่มีหัวข้อ'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      {item.isAnonymous ? ' · ไม่ระบุชื่อ' : item.name ? ` · ${item.name}` : ''}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${sc.color}`}>{sc.label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0 text-gray-300"
                    style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <polyline points="2 5 7 10 12 5" />
                  </svg>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
                    {!item.isAnonymous && (item.name || item.phone) && (
                      <div className="text-xs text-gray-500 flex gap-4">
                        {item.name && <span>👤 {item.name}</span>}
                        {item.phone && <span>📞 {item.phone}</span>}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>

                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                      <p className="text-xs font-semibold text-gray-500">บันทึก / การตอบกลับ</p>
                      <textarea rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-pink-400 resize-none"
                        placeholder="จดบันทึกสถานะหรือคำตอบ..."
                        value={editNote} onChange={e => setEditNote(e.target.value)} />
                      <div className="flex items-center gap-2 flex-wrap">
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                          <label key={val}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                              editStatus === val ? `${cfg.color} border-current font-semibold` : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}>
                            <input type="radio" name="status" value={val} checked={editStatus === val}
                              onChange={() => setEditStatus(val)} className="hidden" />
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </label>
                        ))}
                        <button onClick={handleSave} disabled={saving}
                          className="ml-auto btn-primary text-xs disabled:opacity-50 px-4 py-1.5">
                          {saving ? '...' : '💾 บันทึก'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id}
                        className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40">
                        {deleting === item._id ? 'กำลังลบ...' : '🗑️ ลบรายการนี้'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
