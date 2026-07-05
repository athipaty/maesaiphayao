import { useRef, useState } from 'react'
import { uploadImage } from '../services/api'

export default function PhotoUploader({ photos = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  async function handleFiles(files) {
    if (!files.length) return
    setUploading(true)
    try {
      const results = await Promise.allSettled(
        Array.from(files).map(f => uploadImage(f).then(r => r.data.url))
      )
      const urls = results.filter(r => r.status === 'fulfilled').map(r => r.value)
      const failedCount = results.length - urls.length
      if (urls.length) onChange([...photos, ...urls])
      if (failedCount) alert(`อัปโหลดไม่สำเร็จ ${failedCount} จาก ${results.length} รูป กรุณาลองใหม่`)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function remove(i) {
    onChange(photos.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        รูปภาพประกอบ <span className="text-xs font-normal text-gray-400">(ไม่บังคับ เลือกได้หลายรูป)</span>
      </label>

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {photos.map((url, i) => (
            <div key={i} className="relative group w-20 h-20 flex-shrink-0">
              <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
              <button type="button" onClick={() => remove(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => handleFiles(e.target.files)} />

      <button type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-400 hover:text-blue-500 rounded-xl py-3 text-sm transition-colors disabled:opacity-50">
        {uploading
          ? <><span className="animate-spin">⏳</span> กำลังอัปโหลด...</>
          : <><span>📷</span> เพิ่มรูปภาพ</>}
      </button>
    </div>
  )
}
