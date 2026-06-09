import { useState, useEffect } from 'react'
import ImageUpload from '../../components/ImageUpload'
import { getContactMessages, createContactMessage, updateContactMessage, deleteContactMessage } from '../../services/api'

const STATUS_CONFIG = {
  new:  { label: 'ใหม่',           color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  read: { label: 'รับทราบแล้ว',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  done: { label: 'ดำเนินการแล้ว',  color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
}

const EMPTY_FORM = { title: '', message: '', pageUrl: '', images: [] }

export default function AdminContactMessages() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [editNote, setEditNote] = useState('')
  const [editStatus, setEditStatus] = useState('new')
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const r = await getContactMessages()
      setItems(r?.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.message.trim()) return
    setSubmitting(true)
    try {
      await createContactMessage({ ...form, status: 'new' })
      setForm(EMPTY_FORM)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      await load()
    } catch (err) {
      alert('ส่งไม่สำเร็จ: ' + (err?.response?.data?.error || err.message))
    } finally { setSubmitting(false) }
  }

  function openItem(item) {
    setExpanded(item._id)
    setEditNote(item.adminNote || '')
    setEditStatus(item.status)
    if (item.status === 'new') {
      updateContactMessage(item._id, { status: 'read' })
        .then(r => setItems(prev => prev.map(i => i._id === item._id ? r.data : i)))
        .catch(() => {})
    }
  }

  async function handleSaveNote() {
    setSaving(true)
    try {
      const r = await updateContactMessage(expanded, { status: editStatus, adminNote: editNote })
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
      await deleteContactMessage(id)
      setItems(prev => prev.filter(i => i._id !== id))
      if (expanded === id) setExpanded(null)
    } finally { setDeleting(null) }
  }

  const newCount = items.filter(i => i.status === 'new').length

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-base font-bold text-gray-800">💬 แจ้งผู้ดูแลระบบ</h1>
        {newCount > 0 && (
          <span className="text-xs font-semibold bg-blue-500 text-white px-2 py-0.5 rounded-full">
            {newCount} ใหม่
          </span>
        )}
      </div>

      {/* ── Compose form ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-4">✏️ ส่งเรื่องที่ต้องการแจ้ง</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">หัวข้อ <span className="text-red-400">*</span></label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              placeholder="เช่น ต้องการเพิ่มหน้า / แก้ไขข้อมูลบุคลากร"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">รายละเอียด <span className="text-red-400">*</span></label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none"
              placeholder="อธิบายสิ่งที่ต้องการให้ดำเนินการ..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              🔗 URL หน้าที่ต้องการแก้ไข <span className="text-gray-400 font-normal">(ถ้ามี)</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              placeholder="https://maesaiphayao.vercel.app/page/..."
              value={form.pageUrl}
              onChange={e => setForm(f => ({ ...f, pageUrl: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">📷 รูปภาพประกอบ (ถ้ามี)</label>
            <div className="border border-gray-200 rounded-lg p-3">
              <ImageUpload
                value={form.images}
                multiple
                onChange={urls => setForm(f => ({ ...f, images: urls }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !form.title.trim() || !form.message.trim()}
              className="btn-primary text-xs disabled:opacity-50 px-5 py-2">
              {submitting ? '⏳ กำลังส่ง...' : '📤 ส่งเรื่อง'}
            </button>
            {submitted && (
              <span className="text-xs text-green-600 font-medium animate-pulse">✅ ส่งเรียบร้อยแล้ว</span>
            )}
          </div>
        </form>
      </div>

      {/* ── Message list ─────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">รายการที่ส่งไว้ ({items.length})</p>

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

                  {/* Row header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => isOpen ? setExpanded(null) : openItem(item)}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${item.status === 'new' ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        {item.pageUrl && ' · 🔗 มี URL'}
                        {item.images?.length > 0 && ` · 📷 ${item.images.length} รูป`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${sc.color}`}>
                      {sc.label}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="flex-shrink-0 text-gray-300"
                      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <polyline points="2 5 7 10 12 5" />
                    </svg>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
                      {/* Message body */}
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.message}</p>

                      {item.pageUrl && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                          <span className="text-blue-400 flex-shrink-0">🔗</span>
                          <a href={item.pageUrl} target="_blank" rel="noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline break-all">
                            {item.pageUrl}
                          </a>
                        </div>
                      )}

                      {/* Images */}
                      {item.images?.length > 0 && (
                        <div className="space-y-2">
                          {item.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`img-${idx}`}
                              onClick={() => setLightbox(img)}
                              className="w-full rounded-lg border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" />
                          ))}
                        </div>
                      )}

                      {/* Admin note + status update */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                        <p className="text-xs font-semibold text-gray-500">บันทึก / การตอบกลับ</p>
                        <textarea
                          rows={3}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-pink-400 resize-none"
                          placeholder="จดบันทึกสถานะหรือคำตอบ..."
                          value={editNote}
                          onChange={e => setEditNote(e.target.value)}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <label key={val}
                              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                                editStatus === val
                                  ? `${cfg.color} border-current font-semibold`
                                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
                              }`}>
                              <input type="radio" name="status" value={val} checked={editStatus === val}
                                onChange={() => setEditStatus(val)} className="hidden" />
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </label>
                          ))}
                          <button onClick={handleSaveNote} disabled={saving}
                            className="ml-auto btn-primary text-xs disabled:opacity-50 px-4 py-1.5">
                            {saving ? '...' : '💾 บันทึก'}
                          </button>
                        </div>
                      </div>

                      {/* Delete */}
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

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="enlarged"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/35 text-white rounded-full text-xl">
            ×
          </button>
        </div>
      )}
    </div>
  )
}
