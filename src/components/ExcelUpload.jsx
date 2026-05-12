import { useState } from 'react'
import { uploadExcel } from '../services/api'

const EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

export default function ExcelUpload({ value, label, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!EXCEL_TYPES.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      setErr('กรุณาเลือกไฟล์ .xlsx หรือ .xls เท่านั้น')
      return
    }
    setErr('')
    setUploading(true)
    try {
      const res = await uploadExcel(file)
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
        <div className="flex items-center gap-2 mb-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          <span className="text-lg">📊</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex-1 truncate">
            {label || value}
          </a>
          <button onClick={() => onChange('', '')} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
        </div>
      )}
      <label className="block">
        <span className={`btn-ghost text-xs cursor-pointer inline-flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? '⏳ กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนไฟล์ Excel' : '📎 อัปโหลด Excel'}
        </span>
        <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  )
}
