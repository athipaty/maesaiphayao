import { useState, useEffect } from 'react'

/**
 * Reusable CRUD table for admin pages.
 * Props:
 *  - title: string
 *  - items: array
 *  - loading: bool
 *  - columns: [{ label, render }]
 *  - onDelete: (id) => Promise
 *  - renderForm: ({ data, onChange, onSubmit, onCancel, saving }) => JSX
 *  - emptyForm: object (default blank form state)
 */
export default function AdminCrud({ title, items = [], loading, columns, onDelete, renderForm, emptyForm, onReload }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editing, setEditing]   = useState(null) // id being edited
  const [saving, setSaving]     = useState(false)
  const [saveErr, setSaveErr]   = useState('')
  const [saved, setSaved]       = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteErr, setDeleteErr] = useState('')

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2500)
    return () => clearTimeout(t)
  }, [saved])

  useEffect(() => {
    if (!deleteErr) return
    const t = setTimeout(() => setDeleteErr(''), 4000)
    return () => clearTimeout(t)
  }, [deleteErr])

  function openAdd() {
    setFormData(emptyForm)
    setEditing(null)
    setSaveErr('')
    setShowForm(true)
  }

  function openEdit(item) {
    setFormData({ ...item })
    setEditing(item._id)
    setSaveErr('')
    setShowForm(true)
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleDelete(id) {
    if (!window.confirm('ยืนยันการลบ?')) return
    setDeleting(id)
    setDeleteErr('')
    try {
      await onDelete(id)
    } catch (err) {
      setDeleteErr(err?.response?.data?.error || err?.message || 'ลบไม่สำเร็จ')
    } finally {
      setDeleting(null)
    }
  }

  async function handleSubmit() {
    setSaving(true)
    setSaveErr('')
    try {
      await renderForm.onSubmit(formData, editing)
      setShowForm(false)
      setFormData(emptyForm)
      setEditing(null)
      setSaved(true)
    } catch (err) {
      setSaveErr(err?.response?.data?.error || err?.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Success toast */}
      {saved && (
        <div className="fixed top-4 right-4 z-[9999] bg-green-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          ✅ บันทึกสำเร็จ
        </div>
      )}

      {/* Delete error toast */}
      {deleteErr && (
        <div className="fixed top-4 right-4 z-[9999] bg-red-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          ⚠️ {deleteErr}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-base font-bold text-gray-800">{title}</h1>
        <button onClick={openAdd} className="btn-primary text-xs">
          + เพิ่มรายการ
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">
                {editing ? '✏️ แก้ไขรายการ' : '➕ เพิ่มรายการใหม่'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {renderForm.fields({ data: formData, onChange: handleChange })}
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 space-y-3">
              {/* Extra actions slot (e.g. AI summarize button) */}
              {renderForm.extraActions?.({
                data: formData,
                editingId: editing,
                onFieldsUpdate: updated => setFormData(prev => ({ ...prev, ...updated })),
              })}
              {saveErr && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  ⚠️ {saveErr}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="btn-ghost text-xs">ยกเลิก</button>
                <button onClick={handleSubmit} disabled={saving} className="btn-primary text-xs disabled:opacity-50 min-w-[90px]">
                  {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">ยังไม่มีข้อมูล — กดปุ่ม "เพิ่มรายการ" เพื่อเริ่มต้น</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-2 py-1.5 text-left text-gray-500 font-medium w-8">#</th>
                  {columns.map(c => (
                    <th key={c.label} className="px-2 py-1.5 text-left text-gray-500 font-medium">{c.label}</th>
                  ))}
                  <th className="px-2 py-1.5 text-right text-gray-500 font-medium w-20">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                    {columns.map(c => (
                      <td key={c.label} className="px-2 py-1.5 text-gray-700">{c.render(item)}</td>
                    ))}
                    <td className="px-2 py-1.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(item)}
                          className="text-xs text-secondary hover:underline">แก้ไข</button>
                        <span className="text-gray-200">|</span>
                        <button onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                          className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40">
                          {deleting === item._id ? '...' : 'ลบ'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}