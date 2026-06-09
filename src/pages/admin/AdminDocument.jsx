import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import { getDocuments, createDocument, updateDocument, deleteDocument } from '../../services/api'

const CATEGORIES = [
  { value: 'finance',   label: 'การเงินและบัญชี' },
  { value: 'budget',    label: 'งบประมาณ' },
  { value: 'hr',        label: 'บริหารทรัพยากรบุคคล' },
  { value: 'council',   label: 'กิจการสภา' },
  { value: 'audit',     label: 'ตรวจสอบภายใน' },
  { value: 'risk',      label: 'บริหารความเสี่ยง' },
  { value: 'law',       label: 'กฎหมาย/ข้อบัญญัติ' },
  { value: 'integrity', label: 'ป้องกันทุจริต/No Gift' },
  { value: 'other',     label: 'อื่น ๆ' },
]

const FILE_TYPES = [
  { value: 'pdf',   label: '📄 PDF' },
  { value: 'excel', label: '📊 Excel' },
  { value: 'word',  label: '📝 Word' },
  { value: 'zip',   label: '📦 ZIP' },
  { value: 'other', label: '📎 อื่น ๆ' },
]

const EMPTY = { title: '', category: 'finance', fiscalYear: '', description: '', fileUrl: '', fileType: 'pdf', isActive: true }

export default function AdminDocument() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getDocuments({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateDocument(editingId, data)
    else           await createDocument(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteDocument(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const catLabel = (v) => CATEGORIES.find(c => c.value === v)?.label || v

  const columns = [
    { label: 'หมวด',    render: item => <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{catLabel(item.category)}</span> },
    { label: 'ปี',      render: item => <span className="text-xs text-gray-500">{item.fiscalYear || '-'}</span> },
    { label: 'ชื่อเอกสาร', render: item => <span className="text-xs text-gray-800 line-clamp-1">{item.title}</span> },
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
      title="📂 คลังเอกสารราชการ"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">หมวดหมู่ <span className="text-red-400">*</span></label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white"
                  value={data.category} onChange={e => onChange('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ปีงบประมาณ</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                  value={data.fiscalYear} onChange={e => onChange('fiscalYear', e.target.value)} placeholder="เช่น 2568" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อเอกสาร <span className="text-red-400">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                value={data.title} onChange={e => onChange('title', e.target.value)} placeholder="ชื่อเอกสาร..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">คำอธิบาย</label>
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                value={data.description} onChange={e => onChange('description', e.target.value)} placeholder="คำอธิบายเพิ่มเติม..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ประเภทไฟล์</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white"
                  value={data.fileType} onChange={e => onChange('fileType', e.target.value)}>
                  {FILE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-0.5">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 w-full">
                  <input type="checkbox" id="docActive" checked={data.isActive}
                    onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <label htmlFor="docActive" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔗 ลิงก์ดาวน์โหลด <span className="text-red-400">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400"
                value={data.fileUrl} onChange={e => onChange('fileUrl', e.target.value)} placeholder="https://..." />
              {data.fileUrl && (
                <a href={data.fileUrl} target="_blank" rel="noreferrer" className="inline-block mt-1 text-xs text-blue-500 hover:underline">
                  ตรวจสอบลิงก์ →
                </a>
              )}
            </div>
          </div>
        )
      }}
    />
  )
}
