import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import { getTravel, createTravel, updateTravel, deleteTravel } from '../../services/api'

const EMPTY = { title: '', description: '', images: [], isActive: true }

export default function AdminTravel() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getTravel({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateTravel(editingId, data)
    else           await createTravel(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteTravel(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    {
      label: 'รูป',
      render: item => {
        const img = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image
        return img
          ? <img src={img} alt="" className="w-16 h-12 object-cover rounded" />
          : <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300">🏞️</div>
      }
    },
    { label: 'ชื่อสถานที่', render: item => <span className="text-sm font-medium text-gray-800">{item.title}</span> },
    { label: 'คำอธิบาย',   render: item => <span className="text-xs text-gray-400 line-clamp-1">{item.description || '-'}</span> },
    { label: 'วิว',         render: item => <span className="text-xs text-gray-400">👁 {item.views}</span> },
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
      title="🗺️ จัดการสถานที่ท่องเที่ยว"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => (
          <div className="space-y-5">
            {/* ชื่อสถานที่ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ชื่อสถานที่ <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="เช่น วัดแม่ใส, ลานออกกำลังกาย"
              />
            </div>

            {/* คำอธิบาย */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">คำอธิบาย</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows={4}
                value={data.description}
                onChange={e => onChange('description', e.target.value)}
                placeholder="รายละเอียดสถานที่ท่องเที่ยว..."
              />
            </div>

            {/* รูปภาพ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">รูปภาพ</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <ImageUpload value={data.images} onChange={urls => onChange('images', urls)} multiple={true} />
              </div>
            </div>

            {/* สถานะ */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isActiveT"
                  checked={data.isActive}
                  onChange={e => onChange('isActive', e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
              </div>
              <div>
                <label htmlFor="isActiveT" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}