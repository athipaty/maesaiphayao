import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import PdfUpload from '../../components/PdfUpload'
import { getNotices, createNotice, updateNotice, deleteNotice } from '../../services/api'

const EMPTY = { title: '', topic: '', fileUrl: '', isActive: true, publishedAt: '' }

export default function AdminNotice() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState('')

  async function load() {
    setLoading(true)
    setLoadErr('')
    try {
      const r = await getNotices({ all: 1 })
      setItems(Array.isArray(r?.data) ? r.data : [])
    } catch (err) {
      setLoadErr(err?.response?.data?.error || err?.message || 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateNotice(editingId, data)
    else           await createNotice(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteNotice(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    { label: 'หัวข้อ', render: item => <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</span> },
    { label: 'หมวด', render: item => item.topic ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{item.topic}</span> : <span className="text-xs text-gray-300">—</span> },
    {
      label: 'ไฟล์',
      render: item => item.fileUrl
        ? <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-red-500 hover:underline font-medium">📄 PDF</a>
        : <span className="text-xs text-gray-300">—</span>
    },
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

  if (loadErr) return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <span className="text-3xl">⚠️</span>
      <p className="text-sm text-gray-500">{loadErr}</p>
      <button onClick={load} className="btn-primary text-xs">🔄 ลองใหม่</button>
    </div>
  )

  return (
    <AdminCrud
      title="📋 หัวข้อประกาศ"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">หัวข้อประกาศ <span className="text-red-400">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                value={data.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="ชื่อหัวข้อประกาศ..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">หมวดหมู่</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                value={data.topic}
                onChange={e => onChange('topic', e.target.value)}
                placeholder="เช่น ประกาศทั่วไป, รับสมัครงาน..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📎 ไฟล์ PDF</label>
              <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <PdfUpload
                  value={data.fileUrl}
                  onChange={(url) => onChange('fileUrl', url)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📅 วันที่ประกาศ</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                value={data.publishedAt ? data.publishedAt.slice(0, 10) : ''}
                onChange={e => onChange('publishedAt', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActiveNotice" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActiveNotice" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}
