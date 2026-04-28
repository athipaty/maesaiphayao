import { useState, useEffect } from 'react'
import AdminCrud from './AdminCrud'
import ImageUpload from '../../components/ImageUpload'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api'

const EMPTY = { title: '', description: '', image: '', isActive: true }

export default function AdminProducts() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const r = await getProducts(); setItems(r.data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(data, editingId) {
    if (editingId) await updateProduct(editingId, data)
    else           await createProduct(data)
    await load()
  }

  async function handleDelete(id) {
    await deleteProduct(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const columns = [
    {
      label: 'รูป',
      render: item => item.image
        ? <img src={item.image} alt="" className="w-16 h-12 object-cover rounded" />
        : <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300">🛍️</div>
    },
    { label: 'ชื่อสินค้า', render: item => <span className="text-xs font-medium">{item.title}</span> },
    { label: 'คำอธิบาย',  render: item => <span className="text-xs text-gray-400 line-clamp-1">{item.description || '-'}</span> },
    { label: 'วิว',        render: item => <span className="text-xs text-gray-400">{item.views}</span> },
  ]

  return (
    <AdminCrud
      title="🛍️ จัดการสินค้า OTOP"
      items={items}
      loading={loading}
      columns={columns}
      onDelete={handleDelete}
      emptyForm={EMPTY}
      renderForm={{
        onSubmit: handleSubmit,
        fields: ({ data, onChange }) => (
          <>
            <div>
              <label className="form-label">ชื่อสินค้า <span className="text-red-400">*</span></label>
              <input className="form-input" value={data.title} onChange={e => onChange('title', e.target.value)} placeholder="ชื่อสินค้า" />
            </div>
            <div>
              <label className="form-label">คำอธิบาย</label>
              <textarea className="form-input min-h-[80px] resize-y" value={data.description} onChange={e => onChange('description', e.target.value)} placeholder="รายละเอียดสินค้า..." />
            </div>
            <div>
              <label className="form-label">รูปภาพ</label>
              <ImageUpload value={data.image} onChange={url => onChange('image', url)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActivePr" checked={data.isActive} onChange={e => onChange('isActive', e.target.checked)} />
              <label htmlFor="isActivePr" className="text-sm text-gray-700">แสดงผล</label>
            </div>
          </>
        )
      }}
    />
  )
}