import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import { getProcurement, createProcurement, updateProcurement, deleteProcurement } from '../../services/api'

const EMPTY = { title: '', type: 'egp', externalUrl: '', fileUrl: '', isActive: true }

export default function AdminProcurement() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getProcurement(); setItems(r.data) }
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
    { label: 'หัวข้อ', render: item => <span className="text-xs line-clamp-2">{item.title}</span> },
    {
      label: 'ประเภท',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'egp' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
          {item.type === 'egp' ? 'EGP' : 'ข่าวจัดซื้อ'}
        </span>
      )
    },
    {
      label: 'ลิงค์',
      render: item => item.externalUrl
        ? <a href={item.externalUrl} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline">คลิกดู →</a>
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
          <>
            <div>
              <label className="form-label">ประเภท <span className="text-red-400">*</span></label>
              <select className="form-input" value={data.type} onChange={e => onChange('type', e.target.value)}>
                <option value="egp">รายงาน EGP</option>
                <option value="news">ข่าวจัดซื้อจัดจ้าง</option>
              </select>
            </div>
            <div>
              <label className="form-label">หัวข้อ <span className="text-red-400">*</span></label>
              <input className="form-input" value={data.title} onChange={e => onChange('title', e.target.value)} placeholder="หัวข้อรายการ" />
            </div>
            <div>
              <label className="form-label">ลิงค์ระบบ EGP (gprocurement.go.th)</label>
              <input className="form-input" value={data.externalUrl} onChange={e => onChange('externalUrl', e.target.value)} placeholder="http://process.gprocurement.go.th/..." />
            </div>
            <div>
              <label className="form-label">ลิงค์ไฟล์แนบ</label>
              <input className="form-input" value={data.fileUrl} onChange={e => onChange('fileUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActiveP" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} />
              <label htmlFor="isActiveP" className="text-sm text-gray-700">เผยแพร่ทันที</label>
            </div>
          </>
        )
      }}
    />
  )
}