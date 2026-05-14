import { useState } from 'react'
import { uploadPdf } from '../services/api'

export default function PdfUpload({ value, label, onChange }) {
  const [tab, setTab]           = useState('upload')
  const [uploading, setUploading] = useState(false)
  const [err, setErr]           = useState('')
  const [urlInput, setUrlInput] = useState('')

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
      setErr('อัปโหลดไม่สำเร็จ ไฟล์อาจใหญ่เกิน 100 MB')
    } finally {
      setUploading(false)
    }
  }

  function handleUrlSave() {
    const url = urlInput.trim()
    if (!url) { setErr('กรุณาวาง URL ก่อน'); return }
    setErr('')
    onChange(url, label || url)
    setUrlInput('')
  }

  return (
    <div>
      {/* Current file */}
      {value && (
        <div className="flex items-center gap-2 mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <span className="text-lg">📄</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex-1 truncate">
            {label || value}
          </a>
          <button type="button" onClick={() => setTab('url')} className="text-gray-400 hover:text-blue-500 text-xs flex-shrink-0">🔗</button>
          <button type="button" onClick={() => onChange('', '')} className="text-gray-400 hover:text-red-500 text-xs flex-shrink-0">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs mb-3">
        <button type="button" onClick={() => { setTab('upload'); setErr('') }}
          className={`flex-1 py-2 font-medium transition-colors ${tab === 'upload' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
          📎 อัปโหลดไฟล์
        </button>
        <button type="button" onClick={() => { setTab('url'); setErr('') }}
          className={`flex-1 py-2 font-medium transition-colors ${tab === 'url' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
          🔗 วางลิงค์
        </button>
      </div>

      {tab === 'upload' && (
        <div>
          <label className="block">
            <span className={`btn-ghost text-xs cursor-pointer inline-flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? '⏳ กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนไฟล์ PDF' : '📎 เลือกไฟล์ PDF'}
            </span>
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          <p className="text-[11px] text-gray-400 mt-1.5">ขนาดไฟล์สูงสุด 100 MB (Backblaze B2)</p>
        </div>
      )}

      {tab === 'url' && (
        <div className="space-y-2">
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="https://drive.google.com/file/d/.../view"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
          />
          <button type="button" onClick={handleUrlSave}
            className="btn-primary text-xs px-3 py-1.5">
            บันทึกลิงค์
          </button>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[11px] text-blue-700 leading-relaxed space-y-1">
            <p className="font-semibold">วิธีใช้กับ Google Drive:</p>
            <p>1. อัปโหลด PDF ไปที่ Google Drive</p>
            <p>2. คลิกขวา → <strong>แชร์</strong> → ตั้งให้ "ทุกคนที่มีลิงค์" มองเห็นได้</p>
            <p>3. คัดลอกลิงค์แล้ววางที่นี่</p>
          </div>
        </div>
      )}

      {err && <p className="text-xs text-red-500 mt-2">{err}</p>}
    </div>
  )
}
