import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/api'

const EMPTY = { title: '', type: 'announcement', fileUrl: '', image: '', isActive: true }

export default function AdminAnnounce() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getAnnouncements(); setItems(r.data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateAnnouncement(editingId, data)
    else           await createAnnouncement(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteAnnouncement(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    { label: 'หัวข้อ', render: item => <span className="text-xs line-clamp-2">{item.title}</span> },
    {
      label: 'ประเภท',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'announcement' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
          {item.type === 'announcement' ? 'ประชาสัมพันธ์' : 'จดหมายข่าว'}
        </span>
      )
    },
    { label: 'วันที่', render: item => <span className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString('th-TH')}</span> },
    {
      label: 'สถานะ',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {item.isActive ? 'เผยแพร่' : 'ซ่อน'}
        </span>
      )
    },
  ]

  return (
    <AdminCrud
      title="📢 จัดการประชาสัมพันธ์"
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
                <option value="announcement">ข่าวประชาสัมพันธ์</option>
                <option value="newsletter">จดหมายข่าว</option>
              </select>
            </div>
            <div>
              <label className="form-label">หัวข้อ <span className="text-red-400">*</span></label>
              <input className="form-input" value={data.title} onChange={e => onChange('title', e.target.value)} placeholder="หัวข้อ" />
            </div>
            <div>
              <label className="form-label">ลิงค์ไฟล์ / PDF URL</label>
              <input className="form-input" value={data.fileUrl} onChange={e => onChange('fileUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="form-label">รูปภาพปก (จดหมายข่าว)</label>
              <ImageUpload value={data.image} onChange={url => onChange('image', url)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive2" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} />
              <label htmlFor="isActive2" className="text-sm text-gray-700">เผยแพร่ทันที</label>
            </div>
          </>
        )
      }}
    />
  )
}