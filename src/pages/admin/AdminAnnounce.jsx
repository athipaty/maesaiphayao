import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import PdfUpload from '../../components/PdfUpload'
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/api'

const EMPTY = { title: '', type: 'announcement', fileUrl: '', fileLabel: '', image: '', isActive: true }

export default function AdminAnnounce() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getAnnouncements({ all: 1 }); setItems(r?.data || []) }
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
    { label: 'หัวข้อ', render: item => <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</span> },
    {
      label: 'ประเภท',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type === 'announcement' ? 'bg-pink-50 text-pink-700' : 'bg-purple-50 text-purple-600'}`}>
          {item.type === 'announcement' ? 'ประชาสัมพันธ์' : 'จดหมายข่าว'}
        </span>
      )
    },
    { label: 'วันที่', render: item => <span className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString('th-TH')}</span> },
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
      title="📢 จัดการประชาสัมพันธ์"
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
                  { value: 'announcement', label: '📢 ข่าวประชาสัมพันธ์' },
                  { value: 'newsletter',   label: '📰 จดหมายข่าว' },
                ].map(t => (
                  <label key={t.value} className={`flex-1 border-2 rounded-lg px-4 py-3 cursor-pointer transition-all text-sm font-medium text-center ${data.type === t.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <input type="radio" name="type" value={t.value} checked={data.type === t.value} onChange={() => onChange('type', t.value)} className="hidden" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">รูปภาพปก (จดหมายข่าว)</label>
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