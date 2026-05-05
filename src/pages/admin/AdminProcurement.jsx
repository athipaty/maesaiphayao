import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import { getProcurement, createProcurement, updateProcurement, deleteProcurement } from '../../services/api'

const EMPTY = { title: '', type: 'egp', externalUrl: '', fileUrl: '', isActive: true }

export default function AdminProcurement() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getProcurement({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateProcurement(editingId, data)
    else           await createProcurement(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteProcurement(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    { label: 'หัวข้อ', render: item => <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</span> },
    {
      label: 'ประเภท',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type === 'egp' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
          {item.type === 'egp' ? 'EGP' : 'ข่าวจัดซื้อ'}
        </span>
      )
    },
    {
      label: 'ลิงค์',
      render: item => item.externalUrl
        ? <a href={item.externalUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">คลิกดู →</a>
        : <span className="text-xs text-gray-300">-</span>
    },
    { label: 'วันที่', render: item => <span className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString('th-TH')}</span> },
  ]

  return (
    <AdminCrud
      title="📦 จัดการจัดซื้อจัดจ้าง"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ประเภท <span className="text-red-400">*</span></label>
              <div className="flex gap-3">
                {[
                  { value: 'egp',  label: '🏛️ รายงาน EGP' },
                  { value: 'news', label: '📋 ข่าวจัดซื้อจัดจ้าง' },
                ].map(t => (
                  <label key={t.value} className={`flex-1 border-2 rounded-lg px-4 py-3 cursor-pointer transition-all text-sm font-medium text-center ${data.type === t.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <input type="radio" name="proctype" value={t.value} checked={data.type === t.value} onChange={() => onChange('type', t.value)} className="hidden" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">หัวข้อ <span className="text-red-400">*</span></label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows={3}
                value={data.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="ชื่อรายการจัดซื้อจัดจ้าง..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔗 ลิงค์ระบบ EGP</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.externalUrl}
                onChange={e => onChange('externalUrl', e.target.value)}
                placeholder="http://process.gprocurement.go.th/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📎 ลิงค์ไฟล์แนบ</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.fileUrl}
                onChange={e => onChange('fileUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActiveP" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActiveP" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}