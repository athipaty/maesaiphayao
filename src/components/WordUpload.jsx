import { useState } from 'react'
import { uploadWord } from '../services/api'

const WORD_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]

export default function WordUpload({ value, label, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!WORD_TYPES.includes(file.type) && !file.name.match(/\.(docx|doc)$/i)) {
      setErr('กรุณาเลือกไฟล์ .docx หรือ .doc เท่านั้น')
      return
    }
    setErr('')
    setUploading(true)
    try {
      const res = await uploadWord(file)
      onChange(res.data.url, file.name)
    } catch {
      setErr('อัปโหลดไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value && (
        <div className="flex items-center gap-2 mb-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <span className="text-lg">📄</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex-1 truncate">
            {label || value}
          </a>
          <button onClick={() => onChange('', '')} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
        </div>
      )}
      <label className="block">
        <span className={`btn-ghost text-xs cursor-pointer inline-flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? '⏳ กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนไฟล์ Word' : '📎 อัปโหลด Word'}
        </span>
        <input type="file" accept=".docx,.doc" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  )
}
