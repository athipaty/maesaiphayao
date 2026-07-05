import { useState } from 'react'
import { uploadImage } from '../services/api'

export default function ImageUpload({ value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false)

  // value อาจเป็น string (single) หรือ array (multiple)
  const images = multiple
    ? (Array.isArray(value) ? value : (value ? [value] : []))
    : null

  const handleFile = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      if (multiple) {
        // อัปโหลดทีละไฟล์ แล้ว merge กับรูปเดิม — เก็บรูปที่สำเร็จไว้แม้บางไฟล์จะล้มเหลว
        const results = await Promise.allSettled(files.map(f => uploadImage(f)))
        const newUrls = results.filter(r => r.status === 'fulfilled').map(r => r.value.data.url)
        const failedCount = results.length - newUrls.length
        if (newUrls.length) onChange([...(images || []), ...newUrls])
        if (failedCount) alert(`อัปโหลดไม่สำเร็จ ${failedCount} จาก ${results.length} รูป`)
      } else {
        const res = await uploadImage(files[0])
        onChange(res.data.url)
      }
    } catch {
      alert('อัปโหลดรูปภาพไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  function removeImage(idx) {
    onChange(images.filter((_, i) => i !== idx))
  }

  // Multiple mode
  if (multiple) {
    return (
      <div>
        {/* Preview grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt={`img-${idx}`}
                  className="w-full h-24 object-cover rounded border border-gray-200" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >×</button>
              </div>
            ))}
          </div>
        )}
        <label className="block">
          <span className={`btn-ghost text-xs cursor-pointer inline-flex items-center gap-1.5 ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? '⏳ กำลังอัปโหลด...' : '📷 เพิ่มรูปภาพ'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
        {images.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{images.length} รูป — hover เพื่อลบ</p>
        )}
      </div>
    )
  }

  // Single mode (default)
  return (
    <div className="flex flex-col items-center">
      {value && (
        <img src={value} alt="preview"
          className="rounded mb-2 border border-gray-200"
          style={{ width: '120px', height: '180px', objectFit: 'cover', objectPosition: 'top center' }} />
      )}
      <label className="block">
        <span className={`btn-ghost text-xs cursor-pointer inline-block ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? '⏳ กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนรูป' : '📷 อัปโหลดรูป'}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  )
}