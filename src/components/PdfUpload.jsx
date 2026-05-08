import { useState } from 'react'
import { uploadPdf } from '../services/api'

export default function PdfUpload({ value, label, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setErr('กรุณาเลือกไฟล์ .pdf เท่านั้น'); return }
    setErr('')
    setUploading(true)
    try {
      const res = await uploadPdf(file)
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
        <div className="flex items-center gap-2 mb-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <span className="text-lg">📄</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex-1 truncate">
            {label || value}
          </a>
          <button onClick={() => onChange('', '')} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
        </div>
      )}
      <label className="block">
        <span className={`btn-ghost text-xs cursor-pointer inline-flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? '⏳ กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนไฟล์ PDF' : '📎 อัปโหลด PDF'}
        </span>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  )
}
