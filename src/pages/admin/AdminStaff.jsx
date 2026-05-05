import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import { getStaff, createStaff, updateStaff, deleteStaff } from '../../services/api'

const DEPTS = [
  { value: 'executive',   label: 'ผู้บริหาร' },
  { value: 'council',     label: 'สมาชิกสภา อบต.' },
  { value: 'office',      label: 'สำนักปลัด' },
  { value: 'finance',     label: 'กองคลัง' },
  { value: 'engineering', label: 'กองช่าง' },
  { value: 'health',      label: 'กองสาธารณสุขฯ' },
  { value: 'audit',       label: 'หน่วยตรวจสอบภายใน' },
]

const EMPTY = { name: '', position: '', department: 'executive', image: '', phone: '', order: 0, isActive: true }

export default function AdminStaff() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getStaff({ all: 1 }); setItems(r?.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateStaff(editingId, data)
    else           await createStaff(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteStaff(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    {
      label: 'รูป',
      render: item => item.image
        ? <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
        : <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">👤</div>
    },
    { label: 'ชื่อ',     render: item => <span className="text-sm font-medium text-gray-800">{item.name}</span> },
    { label: 'ตำแหน่ง', render: item => <span className="text-xs text-gray-500">{item.position}</span> },
    { label: 'กอง',     render: item => <span className="text-xs text-gray-400">{DEPTS.find(d => d.value === item.department)?.label}</span> },
    { label: 'โทร',     render: item => <span className="text-xs text-gray-400">{item.phone || '-'}</span> },
  ]

  return (
    <AdminCrud
      title="👥 จัดการบุคลากร"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">กอง/ฝ่าย <span className="text-red-400">*</span></label>
              <select
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                value={data.department}
                onChange={e => onChange('department', e.target.value)}
              >
                {DEPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={data.name}
                  onChange={e => onChange('name', e.target.value)}
                  placeholder="นาย/นาง/นางสาว..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์โทร</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={data.phone}
                  onChange={e => onChange('phone', e.target.value)}
                  placeholder="08x-xxxxxxx"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ตำแหน่ง <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={data.position}
                  onChange={e => onChange('position', e.target.value)}
                  placeholder="นักวิชาการ / ผู้อำนวยการ..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ลำดับการแสดงผล</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={data.order}
                  onChange={e => onChange('order', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">รูปภาพ</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <ImageUpload value={data.image} onChange={url => onChange('image', url)} />
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <input type="checkbox" id="isActiveS" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <label htmlFor="isActiveS" className="text-sm font-medium text-gray-700 cursor-pointer">แสดงผล</label>
                <p className="text-xs text-gray-400">ถ้าไม่เลือก จะซ่อนจากหน้าเว็บ</p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}