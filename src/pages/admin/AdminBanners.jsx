import { useState, useEffect, useRef } from 'react'
import { getAllBanners, createBanner, updateBanner, deleteBanner, uploadImage } from '../../services/api'

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

const EMPTY = { label: '', sub: '', href: 'https://', bg: GRADIENT_PRESETS[0].value, imageUrl: '', order: 0, active: true }

function bannerStyle(item) {
  if (item.imageUrl) return { backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  return { background: item.bg }
}

export default function AdminBanners() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting]   = useState(null)
  const fileRef = useRef()

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
    setForm({
      label: item.label, sub: item.sub || '', href: item.href || '#',
      bg: item.bg || GRADIENT_PRESETS[0].value, imageUrl: item.imageUrl || '',
      order: item.order || 0, active: item.active !== false,
    })
    setEditing(item._id)
  }

  function closeModal() { setEditing(null) }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const r = await uploadImage(file)
      setForm(f => ({ ...f, imageUrl: r.data.url || r.data.secure_url || '' }))
    } catch { }
    setUploading(false)
  }

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
          <p className="text-sm text-gray-500 mt-0.5">แนะนำขนาดรูปภาพ <strong>600 × 200 px</strong> (JPG/PNG/WebP)</p>
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
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-3 px-3 min-w-[80px] relative overflow-hidden"
                  style={bannerStyle(i)}>
                  {i.imageUrl && <div className="absolute inset-0 bg-black/30" />}
                  <span className="text-[9px] font-bold text-white/70 tracking-widest relative z-10">{i.sub}</span>
                  <span className="text-[11px] font-bold text-white text-center leading-snug relative z-10">{i.label}</span>
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
                        <div className="flex flex-col items-center justify-center rounded-lg py-2 px-3 min-w-[70px] flex-shrink-0 relative overflow-hidden"
                          style={bannerStyle(item)}>
                          {item.imageUrl && <div className="absolute inset-0 bg-black/30" />}
                          <span className="text-[9px] font-bold text-white/70 tracking-widest relative z-10">{item.sub}</span>
                          <span className="text-[11px] font-bold text-white text-center leading-snug relative z-10">{item.label}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.label}</p>
                          {item.sub && <p className="text-xs text-gray-400">{item.sub}</p>}
                          {item.imageUrl && <p className="text-[10px] text-blue-400 mt-0.5">📷 มีรูปภาพ</p>}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">
                {editing === 'new' ? 'เพิ่มแบนเนอร์ใหม่' : 'แก้ไขแบนเนอร์'}
              </h2>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Preview */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center justify-start gap-0.5 rounded-xl pt-3 pb-5 px-8 min-w-[160px] min-h-[80px] relative overflow-hidden"
                  style={bannerStyle(form)}>
                  {form.imageUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-transparent" />}
                  <span className="text-[10px] font-bold text-white/70 tracking-widest relative z-10">{form.sub || 'SUB'}</span>
                  <span className="text-sm font-bold text-white text-center leading-snug relative z-10">{form.label || 'ชื่อแบนเนอร์'}</span>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">รูปภาพแบนเนอร์</label>
                <div className="mb-2 rounded-lg overflow-hidden border border-gray-100 text-xs">
                  <div className="grid grid-cols-2 bg-gray-50 px-3 py-1.5 font-semibold text-gray-500 border-b border-gray-100">
                    <span></span><span>ขนาด</span>
                  </div>
                  <div className="grid grid-cols-2 px-3 py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">ขั้นต่ำ</span><span className="text-gray-700 font-medium">240 × 140 px</span>
                  </div>
                  <div className="grid grid-cols-2 px-3 py-1.5 border-b border-gray-50 bg-blue-50">
                    <span className="text-blue-600 font-semibold">แนะนำ</span><span className="text-blue-700 font-semibold">400 × 200 px</span>
                  </div>
                  <div className="grid grid-cols-2 px-3 py-1.5">
                    <span className="text-gray-500">ฟอร์แมต</span><span className="text-gray-700 font-medium">JPG หรือ PNG</span>
                  </div>
                </div>
                {form.imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.imageUrl} alt="banner" className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-100">
                        เปลี่ยนรูป
                      </button>
                      <button type="button" onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600">
                        ลบรูป
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50">
                    {uploading ? (
                      <span className="text-sm text-blue-500 animate-pulse">กำลังอัพโหลด...</span>
                    ) : (
                      <>
                        <span className="text-2xl">🖼️</span>
                        <span className="text-xs text-gray-500">คลิกเพื่ออัพโหลดรูปภาพ</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG, WebP — สูงสุด 10 MB</span>
                      </>
                    )}
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {form.imageUrl && (
                  <p className="text-[10px] text-gray-400 mt-1">เมื่อมีรูปภาพ สีพื้นหลัง Gradient จะถูกซ่อน</p>
                )}
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

              {/* Gradient — shown always as fallback when no image */}
              <div className={form.imageUrl ? 'opacity-40 pointer-events-none' : ''}>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  สีพื้นหลัง Gradient {form.imageUrl && <span className="text-gray-400">(ถูกซ่อนเมื่อมีรูป)</span>}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map(p => (
                    <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, bg: p.value }))}
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
              <button onClick={save} disabled={saving || uploading || !form.label.trim()}
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
