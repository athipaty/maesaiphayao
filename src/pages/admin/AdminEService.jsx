import { useState, useEffect } from 'react'
import {
  getEServices, updateEService,
  getEServiceTypes, createEServiceType, updateEServiceType, deleteEServiceType,
} from '../../services/api'

const STATUSES = [
  { value: 'received',    label: 'รับเรื่องแล้ว',     color: 'bg-blue-50 text-blue-700' },
  { value: 'in_progress', label: 'กำลังดำเนินการ',    color: 'bg-yellow-50 text-yellow-700' },
  { value: 'done',        label: 'เสร็จสิ้น',          color: 'bg-green-50 text-green-700' },
  { value: 'rejected',    label: 'ไม่สามารถดำเนินการ', color: 'bg-red-50 text-red-600' },
]

const ICONS = ['📝','🛣️','💡','💧','🗑️','📢','❓','🏗️','🌳','🚑','🔧','🏠','📮','⚡','🧹','🐛','🌊','🏔️','🔔','📋']

// ── Type Manager ──────────────────────────────────────────────────────────────

function TypeManager() {
  const [types, setTypes]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null | 'new' | { _id, ... }
  const [form, setForm]       = useState({ label: '', icon: '📝' })
  const [saving, setSaving]   = useState(false)
  const [iconOpen, setIconOpen] = useState(false)

  async function load() {
    setLoading(true)
    try { const r = await getEServiceTypes(); setTypes(r?.data || []) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm({ label: '', icon: '📝' }); setEditing('new'); setIconOpen(false) }
  function openEdit(t) { setForm({ label: t.label, icon: t.icon }); setEditing(t); setIconOpen(false) }
  function cancel() { setEditing(null); setIconOpen(false) }

  async function handleSave() {
    if (!form.label.trim()) return
    setSaving(true)
    try {
      if (editing === 'new') {
        await createEServiceType({ label: form.label.trim(), icon: form.icon })
      } else {
        await updateEServiceType(editing._id, { label: form.label.trim(), icon: form.icon })
      }
      await load()
      setEditing(null)
    } catch (e) {
      alert('เกิดข้อผิดพลาด: ' + (e?.response?.data?.error || e.message))
    } finally { setSaving(false) }
  }

  async function handleToggle(t) {
    try { await updateEServiceType(t._id, { isActive: !t.isActive }); await load() }
    catch (e) { alert('เกิดข้อผิดพลาด') }
  }

  async function handleDelete(t) {
    if (!window.confirm(`ลบ "${t.label}"?`)) return
    try { await deleteEServiceType(t._id); await load() }
    catch (e) { alert('เกิดข้อผิดพลาด') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">ประเภทคำร้องที่จะแสดงในฟอร์มสำหรับประชาชน</p>
        <button onClick={openNew}
          className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity">
          + เพิ่มประเภท
        </button>
      </div>

      {/* Add/Edit form */}
      {editing && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4"
          style={{ animation: 'fadeSlideUp 0.25s ease both' }}>
          <p className="text-xs font-semibold text-blue-700 mb-3">
            {editing === 'new' ? '+ เพิ่มประเภทใหม่' : `แก้ไข "${editing.label}"`}
          </p>
          <div className="flex items-center gap-3">
            {/* Icon picker */}
            <div className="relative flex-shrink-0">
              <button type="button" onClick={() => setIconOpen(v => !v)}
                className="w-10 h-10 rounded-xl border-2 border-blue-200 bg-white text-xl flex items-center justify-center hover:border-primary transition-colors">
                {form.icon}
              </button>
              {iconOpen && (
                <div className="absolute top-12 left-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-52">
                  <div className="grid grid-cols-5 gap-1">
                    {ICONS.map(ic => (
                      <button key={ic} type="button"
                        onClick={() => { setForm(f => ({ ...f, icon: ic })); setIconOpen(false) }}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${form.icon === ic ? 'bg-primary/10 ring-1 ring-primary' : ''}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <input
              className="flex-1 border border-blue-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              placeholder="ชื่อประเภทคำร้อง เช่น แจ้งซ่อมถนน"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <button onClick={handleSave} disabled={saving || !form.label.trim()}
              className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0">
              {saving ? '...' : 'บันทึก'}
            </button>
            <button onClick={cancel}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-2 rounded-lg flex-shrink-0">
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Type list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : types.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">ยังไม่มีประเภทคำร้อง</div>
        ) : (
          types.map((t, i) => (
            <div key={t._id}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${!t.isActive ? 'opacity-50' : ''}`}>
              <span className="text-xl w-8 text-center flex-shrink-0">{t.icon}</span>
              <span className="flex-1 text-sm font-medium text-gray-800">{t.label}</span>
              <span className="text-xs text-gray-400 font-mono">{t.value}</span>
              <button onClick={() => handleToggle(t)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors flex-shrink-0 ${t.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                {t.isActive ? '● เปิด' : '○ ปิด'}
              </button>
              <button onClick={() => openEdit(t)}
                className="text-xs font-medium text-secondary hover:text-primary bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
                แก้ไข
              </button>
              <button onClick={() => handleDelete(t)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-sm flex-shrink-0">
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminEService() {
  const [tab, setTab]         = useState('requests')
  const [items, setItems]     = useState([])
  const [types, setTypes]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote]       = useState('')
  const [status, setStatus]   = useState('')
  const [saving, setSaving]   = useState(false)

  function typeLabel(value) {
    const t = types.find(x => x.value === value)
    return t ? `${t.icon} ${t.label}` : value
  }

  async function load() {
    setLoading(true)
    try {
      const [req, typ] = await Promise.all([
        getEServices(filter ? { status: filter } : {}),
        getEServiceTypes(),
      ])
      setItems(req?.data || [])
      setTypes(typ?.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  function openItem(item) { setSelected(item); setNote(item.officerNote || ''); setStatus(item.status) }

  async function handleUpdate() {
    setSaving(true)
    try {
      const r = await updateEService(selected._id, { status, officerNote: note })
      setItems(prev => prev.map(i => i._id === selected._id ? r.data : i))
      setSelected(null)
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err?.response?.data?.error || err.message))
    } finally { setSaving(false) }
  }

  const statusConfig = (s) => STATUSES.find(x => x.value === s)
  const countByStatus = (s) => items.filter(i => i.status === s).length

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-gray-800">🌐 จัดการ e-Service</h1>
        <button onClick={load} className="text-xs text-secondary hover:underline">↻ รีเฟรช</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-gray-100 pb-0">
        {[
          { id: 'requests', label: '📋 คำร้องทั้งหมด' },
          { id: 'types',    label: '🏷️ ประเภทคำร้อง' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'types' && <TypeManager />}

      {tab === 'requests' && (
        <>
          {/* Status filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setFilter('')}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${!filter ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600'}`}>
              ทั้งหมด ({items.length})
            </button>
            {STATUSES.map(s => (
              <button key={s.value} onClick={() => setFilter(s.value)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === s.value ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600'}`}>
                {s.label} ({countByStatus(s.value)})
              </button>
            ))}
          </div>

          {/* Detail modal */}
          {selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                style={{ animation: 'scaleIn 0.2s ease both' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-sm font-semibold">📋 {selected.requestNo}</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                </div>
                <div className="p-6 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3">
                    <div><span className="text-gray-400 text-xs">ประเภท</span><p className="font-medium mt-0.5">{typeLabel(selected.type)}</p></div>
                    <div><span className="text-gray-400 text-xs">ผู้แจ้ง</span><p className="font-medium mt-0.5">{selected.citizenName}</p></div>
                    <div><span className="text-gray-400 text-xs">เบอร์โทร</span><p className="font-medium mt-0.5">{selected.phone}</p></div>
                    <div><span className="text-gray-400 text-xs">หมู่ที่</span><p className="font-medium mt-0.5">{selected.villageNo || '-'}</p></div>
                  </div>
                  {selected.location && (
                    <div>
                      <span className="text-gray-400 text-xs">สถานที่ / จุดเกิดเหตุ</span>
                      <p className="mt-1">{selected.location.address || selected.location}</p>
                      {selected.location.lat && (
                        <a href={`https://www.google.com/maps?q=${selected.location.lat},${selected.location.lng}`}
                          target="_blank" rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline">เปิดใน Google Maps →</a>
                      )}
                    </div>
                  )}
                  <div><span className="text-gray-400 text-xs">รายละเอียด</span><p className="mt-1 leading-relaxed">{selected.detail}</p></div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">อัปเดตสถานะ</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-400"
                      value={status} onChange={e => setStatus(e.target.value)}>
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">หมายเหตุเจ้าหน้าที่</label>
                    <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                      value={note} onChange={e => setNote(e.target.value)} placeholder="บันทึกผลการดำเนินการ..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                  <button onClick={() => setSelected(null)} className="btn-ghost text-xs">ยกเลิก</button>
                  <button onClick={handleUpdate} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
                    {saving ? 'กำลังบันทึก...' : '💾 บันทึกสถานะ'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center text-gray-400">ยังไม่มีคำร้อง</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-3 py-2.5 text-left text-gray-500 font-medium">เลขที่คำร้อง</th>
                      <th className="px-3 py-2.5 text-left text-gray-500 font-medium">ประเภท</th>
                      <th className="px-3 py-2.5 text-left text-gray-500 font-medium">ผู้แจ้ง</th>
                      <th className="px-3 py-2.5 text-left text-gray-500 font-medium">วันที่</th>
                      <th className="px-3 py-2.5 text-left text-gray-500 font-medium">สถานะ</th>
                      <th className="px-3 py-2.5 text-right text-gray-500 font-medium w-20">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const sc = statusConfig(item.status)
                      return (
                        <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/60">
                          <td className="px-3 py-2.5 text-xs font-mono text-primary">{item.requestNo}</td>
                          <td className="px-3 py-2.5 text-xs">{typeLabel(item.type)}</td>
                          <td className="px-3 py-2.5 text-xs">{item.citizenName}</td>
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
        </>
      )}
    </div>
  )
}
