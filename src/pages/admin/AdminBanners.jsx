import { useState, useEffect } from 'react'
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../services/api'

const GRADIENT_PRESETS = [
  { label: 'น้ำเงิน',    value: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
  { label: 'เขียว',      value: 'linear-gradient(135deg,#065f46,#059669)' },
  { label: 'ม่วง',       value: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
  { label: 'ส้ม/ทอง',   value: 'linear-gradient(135deg,#b45309,#f59e0b)' },
  { label: 'แดงชมพู',   value: 'linear-gradient(135deg,#be123c,#f43f5e)' },
  { label: 'ฟ้าเข้ม',   value: 'linear-gradient(135deg,#0e7490,#06b6d4)' },
  { label: 'ฟ้าอ่อน',   value: 'linear-gradient(135deg,#0369a1,#38bdf8)' },
  { label: 'คราม',       value: 'linear-gradient(135deg,#4f46e5,#818cf8)' },
  { label: 'แดงเข้ม',   value: 'linear-gradient(135deg,#7f1d1d,#dc2626)' },
  { label: 'เทา',        value: 'linear-gradient(135deg,#374151,#6b7280)' },
  { label: 'เขียวมะกอก', value: 'linear-gradient(135deg,#365314,#84cc16)' },
  { label: 'ชมพู',       value: 'linear-gradient(135deg,#831843,#ec4899)' },
]

const EMPTY = { label: '', sub: '', href: 'https://', bg: GRADIENT_PRESETS[0].value, order: 0, active: true }

export default function AdminBanners() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const r = await getAllBanners()
      setItems(r.data || [])
    } catch { }
    setLoading(false)
  }

  function openNew() {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 10 : 10
    setForm({ ...EMPTY, order: maxOrder })
    setEditing('new')
  }

  function openEdit(item) {
    setForm({ label: item.label, sub: item.sub || '', href: item.href || '#', bg: item.bg || GRADIENT_PRESETS[0].value, order: item.order || 0, active: item.active !== false })
    setEditing(item._id)
  }

  function closeModal() { setEditing(null) }

  async function save() {
    if (!form.label.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') {
        const r = await createBanner(form)
        setItems(prev => [...prev, r.data].sort((a, b) => a.order - b.order))
      } else {
        const r = await updateBanner(editing, form)
        setItems(prev => prev.map(i => i._id === editing ? r.data : i).sort((a, b) => a.order - b.order))
      }
      closeModal()
    } catch { }
    setSaving(false)
  }

  async function toggleActive(item) {
    try {
      const r = await updateBanner(item._id, { active: !item.active })
      setItems(prev => prev.map(i => i._id === item._id ? r.data : i))
    } catch { }
  }

  async function handleDelete(id) {
    if (!window.confirm('ลบแบนเนอร์นี้?')) return
    setDeleting(id)
    try {
      await deleteBanner(id)
      setItems(prev => prev.filter(i => i._id !== id))
    } catch { }
    setDeleting(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">จัดการแบนเนอร์ Footer</h1>
          <p className="text-sm text-gray-500 mt-0.5">แบนเนอร์ลิงค์ที่แสดงในส่วน Footer ของเว็บไซต์</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow">
          + เพิ่มแบนเนอร์
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">กำลังโหลด...</div>
      ) : (
        <>
          {/* Preview row */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ตัวอย่างแสดงผล (เฉพาะที่เปิดใช้งาน)</p>
            <div className="flex flex-wrap gap-2">
              {items.filter(i => i.active).map(i => (
                <div key={i._id}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-3 px-3 min-w-[80px]"
                  style={{ background: i.bg }}>
                  <span className="text-[9px] font-bold text-white/50 tracking-widest">{i.sub}</span>
                  <span className="text-[11px] font-bold text-white text-center leading-snug">{i.label}</span>
                </div>
              ))}
              {items.filter(i => i.active).length === 0 && (
                <span className="text-sm text-gray-400">ไม่มีแบนเนอร์ที่เปิดใช้งาน</span>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">ลำดับ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">แบนเนอร์</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ลิงค์</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">สถานะ</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{item.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center rounded-lg py-2 px-3 min-w-[70px] flex-shrink-0"
                          style={{ background: item.bg }}>
                          <span className="text-[9px] font-bold text-white/50 tracking-widest">{item.sub}</span>
                          <span className="text-[11px] font-bold text-white text-center leading-snug">{item.label}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.label}</p>
                          {item.sub && <p className="text-xs text-gray-400">{item.sub}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a href={item.href} target="_blank" rel="noreferrer"
                        className="text-xs text-blue-500 hover:underline truncate max-w-[200px] block">
                        {item.href}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(item)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${item.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          แก้ไข
                        </button>
                        <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">ยังไม่มีแบนเนอร์</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">
                {editing === 'new' ? 'เพิ่มแบนเนอร์ใหม่' : 'แก้ไขแบนเนอร์'}
              </h2>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Preview */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center justify-center rounded-xl py-4 px-6 min-w-[120px]"
                  style={{ background: form.bg }}>
                  <span className="text-[10px] font-bold text-white/50 tracking-widest">{form.sub || 'SUB'}</span>
                  <span className="text-sm font-bold text-white text-center leading-snug">{form.label || 'ชื่อแบนเนอร์'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ชื่อแบนเนอร์ *</label>
                  <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="เช่น กรมส่งเสริมการปกครอง" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">รหัสย่อ (SUB)</label>
                  <input value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="เช่น DLA" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL ลิงค์</label>
                <input value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ลำดับ</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                      className="w-4 h-4 rounded accent-green-500" />
                    <span className="text-sm text-gray-700">เปิดใช้งาน</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">สีพื้นหลัง</label>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map(p => (
                    <button key={p.value} onClick={() => setForm(f => ({ ...f, bg: p.value }))}
                      title={p.label}
                      className={`h-9 rounded-lg transition-all ${form.bg === p.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                      style={{ background: p.value }} />
                  ))}
                </div>
                <div className="mt-2">
                  <label className="block text-[11px] text-gray-400 mb-1">หรือกรอก CSS gradient เอง</label>
                  <input value={form.bg} onChange={e => setForm(f => ({ ...f, bg: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="linear-gradient(135deg,#...,#...)" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                ยกเลิก
              </button>
              <button onClick={save} disabled={saving || !form.label.trim()}
                className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40">
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
