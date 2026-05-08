import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import { getStaff, createStaff, updateStaff, deleteStaff, getSettings, updateSetting } from '../../services/api'

const DEFAULT_DEPTS = [
  { value: 'executive',   label: 'ผู้บริหาร' },
  { value: 'council',     label: 'สมาชิกสภา อบต.' },
  { value: 'office',      label: 'สำนักปลัด' },
  { value: 'finance',     label: 'กองคลัง' },
  { value: 'engineering', label: 'กองช่าง' },
  { value: 'health',      label: 'กองสาธารณสุขฯ' },
  { value: 'audit',       label: 'หน่วยตรวจสอบภายใน' },
]

function DeptManager({ depts, onChange }) {
  const [newLabel, setNewLabel] = useState('')
  const [saving, setSaving]     = useState(false)
  const [open, setOpen]         = useState(false)

  async function save(next) {
    setSaving(true)
    try {
      await updateSetting('departments', next)
      onChange(next)
    } finally { setSaving(false) }
  }

  function addDept() {
    const label = newLabel.trim()
    if (!label) return
    const value = 'dept_' + Date.now()
    save([...depts, { value, label }])
    setNewLabel('')
  }

  function removeDept(value) {
    if (!window.confirm('ลบกอง/ฝ่ายนี้? บุคลากรที่ผูกกับกองนี้จะยังคงอยู่แต่ชื่อกองจะไม่แสดง')) return
    save(depts.filter(d => d.value !== value))
  }

  function moveUp(i) {
    if (i === 0) return
    const next = [...depts]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    save(next)
  }

  function moveDown(i) {
    if (i === depts.length - 1) return
    const next = [...depts]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    save(next)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-5">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors rounded-xl"
      >
        <span>⚙️ จัดการกอง/ฝ่าย ({depts.length} รายการ)</span>
        <span className="text-gray-400 text-xs">{open ? '▲ ย่อ' : '▼ ขยาย'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100">
          {/* List */}
          <div className="mt-4 space-y-2">
            {depts.map((d, i) => (
              <div key={d.value} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(i)}   disabled={i === 0}              className="text-gray-300 hover:text-gray-600 disabled:opacity-20 leading-none text-xs">▲</button>
                  <button onClick={() => moveDown(i)} disabled={i === depts.length-1} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 leading-none text-xs">▼</button>
                </div>
                <span className="flex-1 text-sm text-gray-700">{d.label}</span>
                <span className="text-xs text-gray-400 font-mono">{d.value}</span>
                <button
                  onClick={() => removeDept(d.value)}
                  disabled={saving}
                  className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>

          {/* Add new */}
          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="ชื่อกอง/ฝ่ายใหม่ เช่น กองการศึกษา"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDept()}
            />
            <button
              onClick={addDept}
              disabled={saving || !newLabel.trim()}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              + เพิ่ม
            </button>
          </div>
          {saving && <p className="text-xs text-gray-400 mt-2">กำลังบันทึก...</p>}
        </div>
      )}
    </div>
  )
}

export default function AdminStaff() {
  const [items, setItems]   = useState([])
  const [depts, setDepts]   = useState(DEFAULT_DEPTS)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [staffRes, settingsRes] = await Promise.all([
        getStaff({ all: 1 }),
        getSettings(),
      ])
      setItems(staffRes?.data || [])
      if (settingsRes?.data?.departments?.length) {
        setDepts(settingsRes.data.departments)
      }
    } finally { setLoading(false) }
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

  const emptyForm = {
    name: '', position: '',
    department: depts[0]?.value || '',
    image: '', phone: '', order: 0, level: 1, isVacant: false, isActive: true,
  }

  const columns = [
    {
      label: 'รูป',
      render: item => item.image
        ? <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
        : <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">👤</div>
    },
    { label: 'ชื่อ',     render: item => <span className="text-sm font-medium text-gray-800">{item.isVacant ? <em className="text-gray-400">ตำแหน่งว่าง</em> : item.name}</span> },
    { label: 'ตำแหน่ง', render: item => <span className="text-xs text-gray-500">{item.position}</span> },
    { label: 'กอง',     render: item => <span className="text-xs text-gray-400">{depts.find(d => d.value === item.department)?.label || item.department}</span> },
    { label: 'โทร',     render: item => <span className="text-xs text-gray-400">{item.phone || '-'}</span> },
  ]

  return (
    <div>
      <DeptManager depts={depts} onChange={setDepts} />

      <AdminCrud
        title="👥 จัดการบุคลากร"
        items={items}
        loading={loading}
        columns={columns}
        onDelete={handleDelete}
        emptyForm={emptyForm}
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
                  {depts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ตำแหน่ง <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={data.position}
                  onChange={e => onChange('position', e.target.value)}
                  placeholder="นักวิชาการ / ผู้อำนวยการ..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชั้นลำดับ (row)</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    value={data.level}
                    onChange={e => onChange('level', parseInt(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>ชั้น {n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ลำดับในชั้น</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    value={data.order}
                    onChange={e => onChange('order', parseInt(e.target.value))}
                    placeholder="1, 2, 3..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รูปภาพ</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                  <ImageUpload value={data.image} onChange={url => onChange('image', url)} />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
                <input type="checkbox" id="isVacantS" checked={data.isVacant} onChange={e => onChange('isVacant', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <div>
                  <label htmlFor="isVacantS" className="text-sm font-medium text-orange-700 cursor-pointer">ตำแหน่งว่าง</label>
                  <p className="text-xs text-orange-400">จะแสดงเป็น "ตำแหน่งว่าง" โดยไม่ต้องกรอกชื่อ</p>
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
    </div>
  )
}
