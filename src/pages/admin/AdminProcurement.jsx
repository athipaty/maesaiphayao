import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import { getProcurement, createProcurement, updateProcurement, deleteProcurement, summarizeProcurement } from '../../services/api'

const EMPTY = { title: '', type: 'news', externalUrl: '', fileUrl: '', winner: '', amount: '', budget: '', method: '', isActive: true }

function fmt(n) {
  if (n == null || n === '') return '-'
  return Number(n).toLocaleString('th-TH') + ' บาท'
}

export default function AdminProcurement() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getProcurement({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    const payload = {
      ...data,
      amount: data.amount === '' || data.amount == null ? null : Number(data.amount),
      budget: data.budget === '' || data.budget == null ? null : Number(data.budget),
    }
    if (editingId) await updateProcurement(editingId, payload)
    else           await createProcurement(payload)
    await load()
  }

  async function handleDelete(id) {
    await deleteProcurement(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    { label: 'หัวข้อ', render: item => <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</span> },
    {
      label: 'ประเภท',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type === 'egp' ? 'bg-orange-50 text-orange-600' : 'bg-pink-50 text-pink-700'}`}>
          {item.type === 'egp' ? 'EGP' : 'ข่าวจัดซื้อ'}
        </span>
      )
    },
    {
      label: 'ผู้ชนะ / วงเงิน',
      render: item => item.winner || item.amount
        ? <div className="text-xs">
            {item.winner && <p className="text-green-700 font-medium truncate max-w-[150px]">🏆 {item.winner}</p>}
            {item.amount != null && <p className="text-gray-500">💰 {fmt(item.amount)}</p>}
          </div>
        : <span className="text-xs text-gray-300">—</span>
    },
    { label: 'วันที่', render: item => <span className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleDateString('th-TH')}</span> },
  ]

  return (
    <AdminCrud
      title="📦 จัดการจัดซื้อจัดจ้าง"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      onReload={load}
      renderForm={{
        onSubmit: handleSubmit,
        extraActions: ({ data, editingId, onFieldsUpdate }) => editingId ? (
          <AISummarizeButton id={editingId} onDone={updated => { onFieldsUpdate(updated); load() }} />
        ) : null,
        fields: ({ data, onChange }) => (
          <div className="space-y-5">

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ประเภท <span className="text-red-400">*</span></label>
              <div className="flex gap-3">
                {[
                  { value: 'news', label: '📋 ข่าวจัดซื้อจัดจ้าง' },
                  { value: 'egp',  label: '🏛️ รายงาน EGP' },
                ].map(t => (
                  <label key={t.value} className={`flex-1 border-2 rounded-lg px-4 py-3 cursor-pointer transition-all text-sm font-medium text-center ${data.type === t.value ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <input type="radio" name="proctype" value={t.value} checked={data.type === t.value} onChange={() => onChange('type', t.value)} className="hidden" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อโครงการ / หัวข้อ <span className="text-red-400">*</span></label>
              <textarea className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                rows={2} value={data.title} onChange={e => onChange('title', e.target.value)}
                placeholder="ชื่อโครงการจัดซื้อจัดจ้าง..." />
            </div>

            {/* Winner + Amount */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-green-700">🏆 ผลการจัดซื้อจัดจ้าง <span className="font-normal text-green-500">(กรอกเองหรือกด AI สรุป)</span></p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">ผู้ชนะการเสนอราคา</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 transition-all"
                  value={data.winner || ''} onChange={e => onChange('winner', e.target.value)}
                  placeholder="ชื่อบริษัท/บุคคลที่ได้รับการคัดเลือก" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ราคาสุทธิ (บาท)</label>
                  <input type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 transition-all"
                    value={data.amount ?? ''} onChange={e => onChange('amount', e.target.value)}
                    placeholder="เช่น 150000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">วงเงินงบประมาณ (บาท)</label>
                  <input type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 transition-all"
                    value={data.budget ?? ''} onChange={e => onChange('budget', e.target.value)}
                    placeholder="เช่น 160000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">วิธีการจัดหา</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 transition-all"
                  value={data.method || ''} onChange={e => onChange('method', e.target.value)}
                  placeholder="เช่น วิธีเฉพาะเจาะจง, e-bidding" />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔗 ลิงค์ระบบ EGP</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-all"
                  value={data.externalUrl} onChange={e => onChange('externalUrl', e.target.value)}
                  placeholder="http://process.gprocurement.go.th/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">📎 ลิงค์ PDF / ไฟล์แนบ <span className="text-xs font-normal text-blue-500">(ใช้กับ AI สรุป)</span></label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 transition-all"
                  value={data.fileUrl} onChange={e => onChange('fileUrl', e.target.value)}
                  placeholder="https://..." />
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActiveP" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActiveP" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

function AISummarizeButton({ id, onDone }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [err, setErr]         = useState('')

  async function run() {
    setLoading(true); setErr(''); setResult(null)
    try {
      const r = await summarizeProcurement(id)
      setResult(r.data.extracted)
      if (onDone) onDone(r.data.item)
    } catch (e) {
      setErr(e?.response?.data?.error || 'AI สรุปไม่สำเร็จ')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-2">
      <button onClick={run} disabled={loading}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
        {loading ? <><span className="animate-spin">⏳</span> AI กำลังอ่าน...</> : <>✨ AI สรุปอัตโนมัติ</>}
      </button>
      {err && <p className="text-xs text-red-500">⚠️ {err}</p>}
      {result && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs space-y-1">
          <p className="font-semibold text-purple-700">AI สรุปแล้ว — ข้อมูลถูกบันทึกอัตโนมัติ:</p>
          {result.winner && <p>🏆 {result.winner}</p>}
          {result.amount != null && <p>💰 {Number(result.amount).toLocaleString('th-TH')} บาท</p>}
          {result.budget != null && <p>📋 วงเงิน {Number(result.budget).toLocaleString('th-TH')} บาท</p>}
          {result.method && <p>⚙️ {result.method}</p>}
        </div>
      )}
    </div>
  )
}
