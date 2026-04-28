import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import { getNews, createNews, updateNews, deleteNews } from '../../services/api'

const DEPTS = [
  { value: 'council',     label: '🏛️ กิจการสภา' },
  { value: 'office',      label: '📋 สำนักปลัด' },
  { value: 'childdev',    label: '🧒 ศูนย์พัฒนาเด็กเล็ก' },
  { value: 'disaster',    label: '🚒 ป้องกันและบรรเทาสาธารณภัย' },
  { value: 'health',      label: '🏥 กองสาธารณสุขและสิ่งแวดล้อม' },
  { value: 'engineering', label: '🔧 กองช่าง' },
  { value: 'finance',     label: '💰 กองคลัง' },
]

const EMPTY = { title: '', content: '', image: '', department: 'council', publishedAt: '', isActive: true }

export default function AdminNews() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getNews(); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateNews(editingId, data)
    else           await createNews(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteNews(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    {
      label: 'รูป',
      render: item => item.image
        ? <img src={item.image} alt="" className="w-14 h-10 object-cover rounded" />
        : <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-lg">📷</div>
    },
    { label: 'หัวข้อ',   render: item => <span className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</span> },
    { label: 'กอง/ฝ่าย', render: item => <span className="text-xs text-gray-500">{DEPTS.find(d => d.value === item.department)?.label}</span> },
    { label: 'วิว',      render: item => <span className="text-xs text-gray-400">👁 {item.views}</span> },
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
      title="📰 จัดการข่าวสารกิจกรรม"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">กอง/ฝ่าย <span className="text-red-400">*</span></label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={data.department}
                onChange={e => onChange('department', e.target.value)}
              >
                {DEPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">หัวข้อข่าว <span className="text-red-400">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="ชื่อหัวข้อข่าว..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">เนื้อหา</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows={5}
                value={data.content}
                onChange={e => onChange('content', e.target.value)}
                placeholder="เนื้อหาข่าว..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">รูปภาพ</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <ImageUpload value={data.image} onChange={url => onChange('image', url)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📅 วันที่เผยแพร่</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.publishedAt ? data.publishedAt.slice(0,10) : ''}
                onChange={e => onChange('publishedAt', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActiveN" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActiveN" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}