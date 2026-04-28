import { useState } from 'react'
import { uploadImage } from '../services/api'

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImage(file)
      onChange(res.data.url)
    } catch {
      alert('อัปโหลดรูปภาพไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value && (
        <img src={value} alt="preview"
          className="rounded mb-2 border border-gray-200"
          style={{ width: '120px', height: '180px', objectFit: 'cover', objectPosition: 'top center' }} />
      )}
      <label className="block">
        <span className={`btn-ghost text-xs cursor-pointer inline-block ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? 'กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนรูป' : '📷 อัปโหลดรูป'}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  )
}