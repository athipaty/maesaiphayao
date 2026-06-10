function iframeSrc(url) {
  if (!url) return ''
  if (url.includes('backblazeb2.com') || url.includes('drive.google.com')) return url
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

export default function PdfPreviewPanel({ fileUrl, title }) {
  if (!fileUrl) return null
  return (
    <div className="px-4 pb-3 pt-1 bg-blue-50/40 border-t border-blue-100">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-gray-400">📄 ตัวอย่างเอกสาร</span>
        <a href={fileUrl} target="_blank" rel="noreferrer"
          className="text-[10px] font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-full transition-colors">
          เปิดใน Tab ใหม่ ↗
        </a>
      </div>
      <iframe
        src={iframeSrc(fileUrl)}
        className="w-full rounded border border-gray-200"
        style={{ height: '480px' }}
        title={title || 'เอกสาร'}
      />
    </div>
  )
}
