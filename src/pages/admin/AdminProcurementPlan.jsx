import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import { getProcurementPlans, createProcurementPlan, updateProcurementPlan, deleteProcurementPlan } from '../../services/api'

const FILE_TYPES = [
  { value: 'pdf',   label: '📄 PDF' },
  { value: 'excel', label: '📊 Excel' },
  { value: 'zip',   label: '📦 ZIP' },
]

const FILE_COLOR = {
  excel: 'bg-green-50 text-green-700',
  zip:   'bg-yellow-50 text-yellow-700',
  pdf:   'bg-red-50 text-red-700',
}

const EMPTY = { year: '', title: '', fileUrl: '', fileType: 'pdf', isActive: true }

export default function AdminProcurementPlan() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getProcurementPlans({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateProcurementPlan(editingId, data)
    else           await createProcurementPlan(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteProcurementPlan(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    { label: 'ปี',      render: item => <span className="text-sm font-bold text-primary">{item.year}</span> },
    { label: 'ชื่อเอกสาร', render: item => <span className="text-sm text-gray-800 line-clamp-1">{item.title}</span> },
    {
      label: 'ประเภทไฟล์',
      render: item => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FILE_COLOR[item.fileType] || ''}`}>
          {FILE_TYPES.find(t => t.value === item.fileType)?.label || item.fileType}
        </span>
      )
    },
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
      title="📋 แผนการจัดหาพัสดุหรือการจัดซื้อจัดจ้าง"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ปีงบประมาณ (พ.ศ.) <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={data.year}
                  onChange={e => onChange('year', e.target.value)}
                  placeholder="เช่น 2567"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ประเภทไฟล์ <span className="text-red-400">*</span></label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  value={data.fileType}
                  onChange={e => onChange('fileType', e.target.value)}
                >
                  {FILE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อเอกสาร <span className="text-red-400">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.title}
                onChange={e => onChange('title', e.target.value)}
                placeholder="เช่น รายการจัดซื้อจัดจ้าง ประจำปีงบประมาณ 2567"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔗 ลิงค์ดาวน์โหลดไฟล์ <span className="text-red-400">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                value={data.fileUrl}
                onChange={e => onChange('fileUrl', e.target.value)}
                placeholder="https://..."
              />
              {data.fileUrl && (
                <a href={data.fileUrl} target="_blank" rel="noreferrer"
                  className="inline-block mt-1.5 text-xs text-blue-500 hover:underline">
                  ตรวจสอบลิงค์ →
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActivePP" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActivePP" className="text-sm font-medium text-gray-700 cursor-pointer">เผยแพร่ทันที</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}
