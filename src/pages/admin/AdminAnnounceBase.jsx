import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import PdfUpload from '../../components/PdfUpload'
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/api'

// Shared implementation for the two separate admin pages (ข่าวประชาสัมพันธ์ / จดหมายข่าว) —
// both use the same AbtAnnouncement collection, distinguished only by `type`, so each page
// just fixes that value instead of exposing a type picker.
export default function AdminAnnounceBase({ type, title, imageLabel }) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  const EMPTY = { title: '', type, fileUrl: '', fileLabel: '', image: '', isActive: true }

  async function load() {
    setLoading(true)
    try { const r = await getAnnouncements({ all: 1, type }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(data, editingId) {
    const payload = { ...data, type }
    if (editingId) await updateAnnouncement(editingId, payload)
    else           await createAnnouncement(payload)
    await load()
  }

  async function handleDelete(id) {
    await deleteAnnouncement(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    {
      label: 'รูป',
      render: item => item.image
        ? <img src={item.image} alt="" className="w-14 h-10 object-cover rounded" />
        : <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-lg">📷</div>
    },
    { label: 'หัวข้อ', render: item => <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</span> },
    { label: 'วันที่', render: item => <span className="text-xs text-gray-400">{new Date(item.publishedAt || item.createdAt).toLocaleDateString('th-TH')}</span> },
    {
      label: 'สถานะ',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {item.isActive ? '● เผยแพร่' : '○ ซ่อน'}
        </span>
      )
    },
  ]

  return (
    <AdminCrud
      title={title}
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">หัวข้อ <span className="text-red-400">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                value={data.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="ชื่อหัวข้อ..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📎 ไฟล์แนบ / PDF</label>
              <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <PdfUpload
                  value={data.fileUrl}
                  label={data.fileLabel}
                  onChange={(url, label) => { onChange('fileUrl', url); onChange('fileLabel', label || '') }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{imageLabel}</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <ImageUpload value={data.image} onChange={url => onChange('image', url)} />
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActive2" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActive2" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}
