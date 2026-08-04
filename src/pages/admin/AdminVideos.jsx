import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import { getVideos, createVideo, updateVideo, deleteVideo } from '../../services/api'

const EMPTY = { title: '', youtubeUrl: '', isActive: true }

function getYoutubeId(url) {
  if (!url) return ''
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : ''
}

export default function AdminVideos() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getVideos({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateVideo(editingId, data)
    else           await createVideo(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteVideo(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    {
      label: 'ตัวอย่าง',
      render: item => {
        const id = getYoutubeId(item.youtubeUrl)
        return id
          ? <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="" className="w-24 h-14 object-cover rounded" />
          : <div className="w-24 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-300">▶️</div>
      }
    },
    { label: 'ชื่อวิดีโอ', render: item => <span className="text-sm font-medium text-gray-800">{item.title}</span> },
    { label: 'ลิงก์',       render: item => <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline line-clamp-1">{item.youtubeUrl}</a> },
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
      title="▶️ จัดการวิดีโอ YouTube"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => {
          const previewId = getYoutubeId(data.youtubeUrl)
          return (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ชื่อวิดีโอ <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  value={data.title}
                  onChange={e => onChange('title', e.target.value)}
                  placeholder="เช่น แนะนำแหล่งท่องเที่ยวตำบลแม่ใส"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ลิงก์ YouTube <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                  value={data.youtubeUrl}
                  onChange={e => onChange('youtubeUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {data.youtubeUrl && !previewId && (
                  <p className="text-xs text-red-500 mt-1.5">ไม่พบรหัสวิดีโอ กรุณาตรวจสอบลิงก์อีกครั้ง</p>
                )}
                {previewId && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 aspect-video">
                    <iframe
                      key={previewId}
                      src={`https://www.youtube.com/embed/${previewId}`}
                      className="w-full h-full"
                      title="preview"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <input
                  type="checkbox"
                  id="isActiveV"
                  checked={data.isActive}
                  onChange={e => onChange('isActive', e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
                <div>
                  <label htmlFor="isActiveV" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                  <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
                </div>
              </div>
            </div>
          )
        }
      }}
    />
  )
}
