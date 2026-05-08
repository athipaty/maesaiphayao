import { useState, useEffect } from 'react'
import { getPages, createPage, updatePage, deletePage } from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import PdfUpload from '../../components/PdfUpload'
import BlockRenderer from '../../components/BlockRenderer'

const ICONS = ['📄','🏛️','📰','📊','💰','📋','👥','🌐','📮','🚨','📝','📚','⚖️','📞','🎭','🌿','🗺️','🛍️','🏠','ℹ️','📌','🔔','✉️','🎓','🏥','🌾','🔨','🤝','⚡','🔗']

const BLOCK_TYPES = [
  { type: 'text',  icon: '📝', label: 'ข้อความ/บทความ', desc: 'เนื้อหา ย่อหน้า บทความ',  color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400', accent: 'bg-indigo-500' },
  { type: 'links', icon: '🔗', label: 'รายการลิงค์',     desc: 'รายการลิงค์ภายใน/ภายนอก', color: 'bg-green-50 border-green-200 hover:border-green-400',   accent: 'bg-green-500'  },
  { type: 'cards', icon: '🃏', label: 'การ์ด',           desc: 'กริดการ์ด มีไอคอนและคำอธิบาย', color: 'bg-purple-50 border-purple-200 hover:border-purple-400', accent: 'bg-purple-500' },
  { type: 'image', icon: '🖼️', label: 'รูปภาพ',          desc: 'อัปโหลดรูป + คำบรรยาย',    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',   accent: 'bg-amber-500'  },
  { type: 'table', icon: '📊', label: 'ตาราง',           desc: 'ตารางข้อมูลแบบกำหนดเอง',   color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',     accent: 'bg-cyan-500'   },
  { type: 'pdf',   icon: '📄', label: 'ไฟล์ PDF',        desc: 'แนบและแสดงไฟล์ PDF',      color: 'bg-red-50 border-red-200 hover:border-red-400',        accent: 'bg-red-500'    },
]
const BLOCK_META = Object.fromEntries(BLOCK_TYPES.map(b => [b.type, b]))

const ACCENT_BORDER = {
  text:  'border-l-indigo-400',
  links: 'border-l-green-400',
  cards: 'border-l-purple-400',
  image: 'border-l-amber-400',
  table: 'border-l-cyan-400',
  pdf:   'border-l-red-400',
}

// ── Shared field helpers ──────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white'
const smallInp = 'border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all bg-white'

function emptyBlock(type) {
  if (type === 'text')  return { type, data: { title: '', content: '' } }
  if (type === 'links') return { type, data: { title: '', items: [{ icon: '🔗', label: '', url: '', external: true }] } }
  if (type === 'cards') return { type, data: { title: '', cols: 2, items: [{ icon: '📄', title: '', desc: '', link: '' }] } }
  if (type === 'image') return { type, data: { layout: 'single', align: 'center', size: 'lg', images: [] } }
  if (type === 'table') return { type, data: { title: '', headers: ['หัวข้อ', 'รายละเอียด'], rows: [['', '']] } }
  if (type === 'pdf')   return { type, data: { url: '', label: '', title: '', description: '' } }
  return { type, data: {} }
}

// ── Block editors ─────────────────────────────────────────────────────────────

function TextBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="หัวข้อ block" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น ข้อมูลทั่วไป" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="เนื้อหา" hint="เว้นบรรทัดเปล่า = แบ่งย่อหน้า">
        <textarea className={`${inp} min-h-[160px] leading-relaxed`} placeholder="พิมพ์เนื้อหาที่นี่..." value={data.content || ''} onChange={e => onChange({ ...data, content: e.target.value })} />
      </Field>
    </div>
  )
}

function LinksBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items = [...(data.items || [])]
    items[i] = { ...items[i], [field]: val }
    onChange({ ...data, items })
  }
  function addItem()    { onChange({ ...data, items: [...(data.items || []), { icon: '🔗', label: '', url: '', external: true }] }) }
  function removeItem(i){ onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-4">
      <Field label="หัวข้อ block" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น ลิงค์ที่เกี่ยวข้อง" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label={`รายการลิงค์ (${(data.items||[]).length} รายการ)`}>
        <div className="space-y-2">
          {(data.items || []).map((item, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input className={`${smallInp} w-14 text-center text-base`} placeholder="🔗" value={item.icon || ''} onChange={e => updateItem(i, 'icon', e.target.value)} />
                <input className={`${smallInp} flex-1`} placeholder="ชื่อลิงค์" value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} />
                <button onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-sm flex-shrink-0">✕</button>
              </div>
              <div className="flex items-center gap-2">
                <input className={`${smallInp} flex-1`} placeholder="URL หรือ /path เช่น /about หรือ https://..." value={item.url} onChange={e => updateItem(i, 'url', e.target.value)} />
                <label className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap cursor-pointer select-none">
                  <input type="checkbox" checked={!!item.external} onChange={e => updateItem(i, 'external', e.target.checked)} className="w-3.5 h-3.5 accent-blue-500" />
                  เปิดแท็บใหม่
                </label>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors">
          + เพิ่มลิงค์
        </button>
      </Field>
    </div>
  )
}

function CardsBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items = [...(data.items || [])]
    items[i] = { ...items[i], [field]: val }
    onChange({ ...data, items })
  }
  function addItem()    { onChange({ ...data, items: [...(data.items || []), { icon: '📄', title: '', desc: '', link: '' }] }) }
  function removeItem(i){ onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Field label="หัวข้อ block">
          <input className={inp} placeholder="ไม่บังคับ" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
        </Field>
        <div className="flex-shrink-0">
          <Field label="จำนวนคอลัมน์">
            <select className={`${inp} w-32`} value={data.cols || 2} onChange={e => onChange({ ...data, cols: parseInt(e.target.value) })}>
              <option value={1}>1 คอลัมน์</option>
              <option value={2}>2 คอลัมน์</option>
              <option value={3}>3 คอลัมน์</option>
            </select>
          </Field>
        </div>
      </div>
      <Field label={`การ์ด (${(data.items||[]).length} รายการ)`}>
        <div className="space-y-2">
          {(data.items || []).map((item, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input className={`${smallInp} w-14 text-center text-base`} placeholder="📄" value={item.icon || ''} onChange={e => updateItem(i, 'icon', e.target.value)} />
                <input className={`${smallInp} flex-1 font-medium`} placeholder="ชื่อการ์ด" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} />
                <button onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-sm flex-shrink-0">✕</button>
              </div>
              <input className={`${smallInp} w-full`} placeholder="คำอธิบายสั้นๆ" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} />
              <input className={`${smallInp} w-full`} placeholder="ลิงค์ (ไม่บังคับ) เช่น /about หรือ https://..." value={item.link} onChange={e => updateItem(i, 'link', e.target.value)} />
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors">
          + เพิ่มการ์ด
        </button>
      </Field>
    </div>
  )
}

const LAYOUTS = [
  { key: 'single', label: 'เดี่ยว',  boxes: [{ w: 32, h: 20 }] },
  { key: 'grid-2', label: '2 คอล',   boxes: [{ w: 14, h: 20 }, { w: 14, h: 20 }] },
  { key: 'grid-3', label: '3 คอล',   boxes: [{ w: 9,  h: 20 }, { w: 9,  h: 20 }, { w: 9,  h: 20 }] },
  { key: 'grid-4', label: '4 คอล',   boxes: [{ w: 6,  h: 20 }, { w: 6,  h: 20 }, { w: 6,  h: 20 }, { w: 6,  h: 20 }] },
]

function ImageBlockEdit({ data, onChange }) {
  const [bulkUploading, setBulkUploading] = useState(false)
  const images  = data.images || []
  const layout  = data.layout || 'single'

  function updateImage(i, field, val) {
    const imgs = [...images]; imgs[i] = { ...imgs[i], [field]: val }
    onChange({ ...data, images: imgs })
  }
  function addEmpty()      { onChange({ ...data, images: [...images, { url: '', caption: '' }] }) }
  function removeImage(i)  { onChange({ ...data, images: images.filter((_, idx) => idx !== i) }) }
  function moveImage(i, d) {
    const imgs = [...images], t = i + d
    if (t < 0 || t >= imgs.length) return
    ;[imgs[i], imgs[t]] = [imgs[t], imgs[i]]
    onChange({ ...data, images: imgs })
  }
  async function bulkAdd(e) {
    const files = Array.from(e.target.files); if (!files.length) return
    setBulkUploading(true)
    try {
      const { uploadImage } = await import('../../services/api')
      const results = await Promise.all(files.map(f => uploadImage(f)))
      const newImgs = results.map(r => ({ url: r.data.url, caption: '' }))
      onChange({ ...data, images: [...images, ...newImgs] })
    } catch { alert('อัปโหลดรูปไม่สำเร็จ') }
    finally { setBulkUploading(false); e.target.value = '' }
  }

  return (
    <div className="space-y-5">

      {/* Layout picker */}
      <Field label="รูปแบบการแสดงผล">
        <div className="grid grid-cols-4 gap-2">
          {LAYOUTS.map(l => (
            <button key={l.key} type="button" onClick={() => onChange({ ...data, layout: l.key })}
              className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                layout === l.key ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              <div className="flex gap-0.5 items-end">
                {l.boxes.map((b, i) => (
                  <div key={i} className={`rounded-sm ${layout === l.key ? 'bg-amber-400' : 'bg-gray-300'}`}
                    style={{ width: b.w * 0.6, height: b.h * 0.6 }} />
                ))}
              </div>
              <span className={`text-[11px] font-semibold ${layout === l.key ? 'text-amber-600' : 'text-gray-500'}`}>{l.label}</span>
            </button>
          ))}
        </div>
      </Field>

      {/* Single-mode options */}
      {layout === 'single' && (
        <div className="flex gap-3">
          <Field label="จัดวาง">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {[['left','◀ ซ้าย'],['center','กลาง'],['right','ขวา ▶']].map(([v, lbl]) => (
                <button key={v} type="button" onClick={() => onChange({ ...data, align: v })}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${(data.align||'center')===v ? 'bg-amber-400 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </Field>
          <Field label="ขนาด">
            <select className={`${inp} w-36`} value={data.size || 'lg'} onChange={e => onChange({ ...data, size: e.target.value })}>
              <option value="sm">เล็ก (300px)</option>
              <option value="md">กลาง (500px)</option>
              <option value="lg">ใหญ่ (700px)</option>
              <option value="full">เต็มความกว้าง</option>
            </select>
          </Field>
        </div>
      )}

      {/* Image list */}
      <Field label={`รูปภาพ${images.length > 0 ? ` (${images.length} รูป)` : ''}`}
             hint={layout !== 'single' ? 'ลากปุ่ม ▲▼ เพื่อเรียงลำดับ' : ''}>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex gap-3 items-start">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                {img.url
                  ? <img src={img.url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">🖼️</div>}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <ImageUpload value={img.url} onChange={url => updateImage(i, 'url', url)} />
                <input className={`${smallInp} w-full`} placeholder="คำบรรยายใต้รูป (ไม่บังคับ)"
                  value={img.caption || ''} onChange={e => updateImage(i, 'caption', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-20 text-xs">▲</button>
                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-20 text-xs">▼</button>
                <button type="button" onClick={() => removeImage(i)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-sm">🗑️</button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="border-2 border-dashed border-amber-200 bg-amber-50/30 rounded-xl p-8 text-center">
              <p className="text-3xl mb-2">🖼️</p>
              <p className="text-xs text-gray-400">ยังไม่มีรูป กดปุ่มด้านล่างเพื่อเพิ่ม</p>
            </div>
          )}
        </div>

        {/* Add buttons */}
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={addEmpty}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors">
            + เพิ่ม 1 รูป
          </button>
          <label className={`flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${bulkUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {bulkUploading ? '⏳ กำลังอัปโหลด...' : '📤 อัปโหลดหลายรูปพร้อมกัน'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={bulkAdd} disabled={bulkUploading} />
          </label>
        </div>
      </Field>
    </div>
  )
}

function TableBlockEdit({ data, onChange }) {
  const headers = data.headers || ['']
  const rows    = data.rows    || [['']]

  function setHeaders(h) { onChange({ ...data, headers: h }) }
  function setRows(r)    { onChange({ ...data, rows: r }) }
  function addCol()      { setHeaders([...headers, '']); setRows(rows.map(r => [...r, ''])) }
  function removeCol(ci) { setHeaders(headers.filter((_, i) => i !== ci)); setRows(rows.map(r => r.filter((_, i) => i !== ci))) }
  function addRow()      { setRows([...rows, headers.map(() => '')]) }
  function removeRow(ri) { setRows(rows.filter((_, i) => i !== ri)) }
  function updateCell(ri, ci, val) {
    setRows(rows.map((row, i) => i === ri ? row.map((c, j) => j === ci ? val : c) : row))
  }

  return (
    <div className="space-y-4">
      <Field label="หัวข้อตาราง" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น ข้อมูลงบประมาณประจำปี" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label={`ตาราง (${headers.length} คอลัมน์ × ${rows.length} แถว)`}>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-8 border-b border-r border-gray-200 p-1 text-gray-400 font-normal">#</th>
                {headers.map((h, ci) => (
                  <th key={ci} className="border-b border-r border-gray-200 p-1.5 min-w-[100px]">
                    <div className="flex gap-1 items-center">
                      <input className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" placeholder={`คอลัมน์ ${ci+1}`} value={h} onChange={e => { const nh = [...headers]; nh[ci] = e.target.value; setHeaders(nh) }} />
                      {headers.length > 1 && <button onClick={() => removeCol(ci)} className="w-5 h-5 flex items-center justify-center rounded text-red-400 hover:bg-red-50 text-[10px] flex-shrink-0">✕</button>}
                    </div>
                  </th>
                ))}
                <th className="border-b border-gray-200 p-1 w-16">
                  <button onClick={addCol} className="text-[10px] text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-2 py-1 rounded font-medium transition-colors whitespace-nowrap">+ คอล</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-blue-50/30">
                  <td className="border-b border-r border-gray-100 p-1 text-center text-gray-400 font-mono">{ri+1}</td>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-r border-gray-100 p-1">
                      <input className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-400 focus:bg-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all" value={cell} onChange={e => updateCell(ri, ci, e.target.value)} />
                    </td>
                  ))}
                  <td className="border-b border-gray-100 p-1 text-center">
                    {rows.length > 1 && <button onClick={() => removeRow(ri)} className="w-5 h-5 flex items-center justify-center rounded text-red-400 hover:bg-red-50 text-[10px] mx-auto">✕</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addRow} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-3 py-1.5 rounded-lg transition-colors">
          + เพิ่มแถว
        </button>
      </Field>
    </div>
  )
}

function PdfBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="ชื่อหัวข้อ PDF">
        <input className={inp} placeholder="เช่น แผนพัฒนาท้องถิ่น พ.ศ. 2566-2570" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="คำอธิบาย" hint="ไม่บังคับ">
        <input className={inp} placeholder="อธิบายสั้นๆ เกี่ยวกับเอกสาร" value={data.description || ''} onChange={e => onChange({ ...data, description: e.target.value })} />
      </Field>
      <Field label="ไฟล์ PDF">
        <PdfUpload value={data.url} label={data.label} onChange={(url, label) => onChange({ ...data, url, label })} />
      </Field>
    </div>
  )
}

function BlockEdit({ block, onChange }) {
  switch (block.type) {
    case 'text':  return <TextBlockEdit  data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'links': return <LinksBlockEdit data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'cards': return <CardsBlockEdit data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'image': return <ImageBlockEdit data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'table': return <TableBlockEdit data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'pdf':   return <PdfBlockEdit   data={block.data} onChange={d => onChange({ ...block, data: d })} />
    default:      return null
  }
}

// ── Block Editor view ─────────────────────────────────────────────────────────

function BlockEditorView({ page, onBack, onPageSaved }) {
  const [blocks, setBlocks]   = useState(page.blocks || [])
  const [saving, setSaving]   = useState(false)
  const [openIdx, setOpenIdx] = useState(null)
  const [err, setErr]         = useState('')
  const [saved, setSaved]     = useState(false)

  function addBlock(type) {
    const b = emptyBlock(type)
    b._tempKey = 'tmp-' + Date.now()
    setBlocks(prev => [...prev, b])
    setOpenIdx(blocks.length)
  }

  function updateBlock(i, b) { setBlocks(prev => prev.map((x, idx) => idx === i ? b : x)) }
  function deleteBlock(i)    { setBlocks(prev => prev.filter((_, idx) => idx !== i)); if (openIdx === i) setOpenIdx(null) }
  function moveBlock(i, dir) {
    const next = [...blocks]
    const target = i + dir
    if (target < 0 || target >= next.length) return
    ;[next[i], next[target]] = [next[target], next[i]]
    setBlocks(next)
    setOpenIdx(target)
  }

  async function save() {
    setSaving(true); setErr(''); setSaved(false)
    try {
      // eslint-disable-next-line no-unused-vars
      const cleanBlocks = blocks.map(({ _tempKey, ...rest }) => rest)
      const updated = await updatePage(page._id, { blocks: cleanBlocks })
      onPageSaved(updated.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || 'บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 mb-6 flex items-center gap-4">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
          ← กลับ
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-gray-800 truncate">{page.icon} {page.title}</h1>
          <p className="text-xs text-gray-400">{blocks.length} block{blocks.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {err   && <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg max-w-[220px] truncate">⚠️ {err}</span>}
          {saved && <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">✓ บันทึกแล้ว</span>}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-sm">
            {saving ? <><span className="animate-spin inline-block">⏳</span> กำลังบันทึก...</> : '💾 บันทึก'}
          </button>
        </div>
      </div>

      {/* Block list */}
      <div className="space-y-3 mb-5">
        {blocks.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-3xl mb-2">✨</p>
            <p className="text-gray-500 text-sm font-medium">ยังไม่มี block</p>
            <p className="text-gray-400 text-xs mt-1">เลือกประเภท block ด้านล่างเพื่อเริ่มต้น</p>
          </div>
        )}

        {blocks.map((block, i) => {
          const meta = BLOCK_META[block.type] || { icon: '📦', label: block.type, accent: 'bg-gray-400' }
          const isOpen = openIdx === i
          return (
            <div key={block._id || block._tempKey || i}
              className={`bg-white rounded-2xl shadow-sm border-l-4 ${ACCENT_BORDER[block.type] || 'border-l-gray-300'} border border-gray-100 overflow-hidden transition-shadow ${isOpen ? 'shadow-md' : ''}`}>

              {/* Block header */}
              <div className={`flex items-center gap-3 px-4 py-3 ${isOpen ? 'bg-gray-50 border-b border-gray-100' : ''}`}>
                <span className="text-base flex-shrink-0">{meta.icon}</span>
                <span className="text-sm font-semibold text-gray-700 flex-1">{meta.label}</span>

                {/* Move buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => moveBlock(i, -1)} disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-20 transition-all text-xs">▲</button>
                  <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-20 transition-all text-xs">▼</button>
                </div>

                <button onClick={() => setOpenIdx(isOpen ? null : i)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${isOpen ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-secondary hover:bg-blue-50'}`}>
                  {isOpen ? '✕ ปิด' : '✏️ แก้ไข'}
                </button>

                <button onClick={() => deleteBlock(i)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-sm flex-shrink-0">
                  🗑️
                </button>
              </div>

              {/* Edit form */}
              {isOpen && (
                <div className="p-5">
                  <BlockEdit block={block} onChange={b => updateBlock(i, b)} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add block panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
        <p className="text-sm font-bold text-gray-700 mb-1">เพิ่ม Block ใหม่</p>
        <p className="text-xs text-gray-400 mb-4">เลือกประเภทเนื้อหาที่ต้องการเพิ่ม</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} onClick={() => addBlock(bt.type)}
              className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${bt.color}`}>
              <span className="text-xl flex-shrink-0 mt-0.5">{bt.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">{bt.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{bt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      {blocks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-dashed border-gray-200" />
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full">
              👁️ ตัวอย่างหน้าแสดงผล
            </span>
            <div className="flex-1 border-t border-dashed border-gray-200" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Fake navbar */}
            <div className="bg-primary h-10 flex items-center px-4 gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20" />
              <div className="h-2.5 w-36 rounded-full bg-white/30" />
              <div className="flex-1" />
              <div className="h-2.5 w-16 rounded-full bg-white/20" />
            </div>
            {/* Body */}
            <div className="bg-[#f0f2f5] flex gap-3 p-3" style={{ minHeight: 200 }}>
              {/* Skeleton sidebar */}
              <div className="flex-shrink-0 space-y-2" style={{ width: 150 }}>
                <div className="bg-white rounded-md overflow-hidden">
                  <div className="h-7 bg-secondary/30" />
                  <div className="p-2 space-y-1.5">
                    {[80,65,75,60,70].map((w,i) => <div key={i} className="h-2 rounded bg-gray-200" style={{ width: `${w}%` }} />)}
                  </div>
                </div>
              </div>
              {/* Real content */}
              <div className="flex-1 min-w-0">
                <div className="card mb-3">
                  <div className="section-head">
                    <h1 className="text-sm font-semibold">{page.icon} {page.title}</h1>
                  </div>
                </div>
                {blocks.map((block, i) => (
                  <BlockRenderer key={block._id || block._tempKey || i} block={block} preview={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Add / Edit page form (modal) ──────────────────────────────────────────────

function PageFormModal({ pages, editPage, onClose, onSaved }) {
  const isEdit = !!editPage
  const [form, setForm] = useState(editPage ? {
    title: editPage.title, icon: editPage.icon,
    parentSlug: editPage.parentSlug || '', isActive: editPage.isActive,
  } : { title: '', icon: '📄', parentSlug: '', isActive: true })
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  async function submit() {
    if (!form.title.trim()) { setErr('กรุณากรอกชื่อเมนู'); return }
    setErr(''); setSaving(true)
    try {
      if (isEdit) {
        const r = await updatePage(editPage._id, form); onSaved(r.data)
      } else {
        const slug = 'page-' + Date.now()
        const r = await createPage({ ...form, slug, path: '/page/'+slug, isBuiltin: false, order: 999, blocks: [] })
        onSaved(r.data)
      }
      onClose()
    } catch (e) { setErr(e?.response?.data?.error || 'เกิดข้อผิดพลาด') }
    finally { setSaving(false) }
  }

  const topLevelPages = pages.filter(p => !p.parentSlug && (!isEdit || p._id !== editPage._id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">{isEdit ? '✏️ แก้ไขเมนู' : '➕ เพิ่มเมนูใหม่'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl">×</button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">ไอคอน</label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2 max-h-32 overflow-y-auto">
              {ICONS.map(ic => (
                <button key={ic} onClick={() => set('icon', ic)}
                  className={`text-lg w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${form.icon === ic ? 'border-secondary bg-blue-50 shadow-sm' : 'border-transparent hover:border-gray-200'}`}>
                  {ic}
                </button>
              ))}
            </div>
            <input className={inp} placeholder="หรือพิมพ์ emoji / ข้อความ" value={form.icon} onChange={e => set('icon', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">ชื่อเมนู <span className="text-red-400">*</span></label>
            <input className={inp} placeholder="เช่น บริการประชาชน" value={form.title} onChange={e => set('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">เมนูหลัก <span className="text-gray-400 font-normal">(ถ้าเป็นเมนูย่อย)</span></label>
            <select className={`${inp}`} value={form.parentSlug} onChange={e => set('parentSlug', e.target.value)}>
              <option value="">— ไม่มี (เมนูหลัก) —</option>
              {topLevelPages.map(p => <option key={p.slug} value={p.slug}>{p.icon} {p.title}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800">แสดงในเมนู</p>
              <p className="text-xs text-blue-500">ถ้าไม่เลือก จะซ่อนจาก sidebar</p>
            </div>
          </label>
          {err && <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">⚠️ {err}</p>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="btn-ghost text-xs">ยกเลิก</button>
          <button onClick={submit} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
            {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Menu manager view ─────────────────────────────────────────────────────────

function MenuManagerView({ pages, loading, onReload, onEditContent }) {
  const [showForm, setShowForm] = useState(false)
  const [editPage, setEditPage] = useState(null)
  const [saving, setSaving]     = useState(false)

  const topLevel = pages.filter(p => !p.parentSlug).sort((a, b) => a.order - b.order)
  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  async function toggleActive(page) {
    await updatePage(page._id, { isActive: !page.isActive }); onReload()
  }

  async function move(page, dir) {
    const siblings = page.parentSlug
      ? pages.filter(p => p.parentSlug === page.parentSlug).sort((a, b) => a.order - b.order)
      : topLevel
    const idx    = siblings.findIndex(p => p._id === page._id)
    const target = siblings[idx + dir]
    if (!target) return
    setSaving(true)
    try {
      await Promise.all([updatePage(page._id, { order: target.order }), updatePage(target._id, { order: page.order })])
      onReload()
    } finally { setSaving(false) }
  }

  async function remove(page) {
    if (!window.confirm(`ลบ "${page.title}"?\nเนื้อหาทั้งหมดจะหายไปถาวร`)) return
    await deletePage(page._id); onReload()
  }

  function renderRow(page, siblings, idx) {
    const children   = getChildren(page.slug)
    const isChild    = !!page.parentSlug
    const isFirst    = idx === 0
    const isLast     = idx === siblings.length - 1
    const publicPath = page.isBuiltin ? page.path : `/page/${page.slug}`

    return (
      <div key={page._id}>
        <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${isChild ? 'pl-10 bg-gray-50/40' : ''}`}>
          {isChild && <span className="text-gray-300 mr-1">└</span>}
          <span className="text-lg w-7 text-center flex-shrink-0">{page.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{page.title}</p>
            <p className="text-xs text-gray-400 font-mono truncate">{publicPath}</p>
          </div>
          {page.isBuiltin && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">ระบบ</span>
          )}
          <button onClick={() => toggleActive(page)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 transition-colors ${page.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
            {page.isActive ? '● แสดง' : '○ ซ่อน'}
          </button>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => move(page, -1)} disabled={isFirst || saving}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-20 transition-all text-xs">▲</button>
            <button onClick={() => move(page, 1)} disabled={isLast || saving}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-20 transition-all text-xs">▼</button>
          </div>
          <button onClick={() => { setEditPage(page); setShowForm(true) }}
            className="text-xs font-medium text-secondary hover:text-primary bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
            แก้ไข
          </button>
          {!page.isBuiltin && (
            <>
              <button onClick={() => onEditContent(page)}
                className="text-xs font-medium text-white bg-primary hover:opacity-90 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
                เนื้อหา
              </button>
              <button onClick={() => remove(page)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-sm flex-shrink-0">
                🗑️
              </button>
            </>
          )}
        </div>
        {children.map((c, ci) => renderRow(c, children, ci))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">🗂️ จัดการเมนูและหน้า</h1>
          <p className="text-xs text-gray-400 mt-1">จัดลำดับ เพิ่ม/ลบ และแก้ไขเนื้อหาหน้าต่างๆ</p>
        </div>
        <button onClick={() => { setEditPage(null); setShowForm(true) }}
          className="btn-primary text-xs flex items-center gap-1.5">
          + เพิ่มหน้าใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">กำลังโหลด...</div>
        ) : (
          topLevel.map((p, i) => renderRow(p, topLevel, i))
        )}
      </div>

      {showForm && (
        <PageFormModal pages={pages} editPage={editPage} onClose={() => setShowForm(false)} onSaved={() => onReload()} />
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPages() {
  const [pages, setPages]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [editingPage, setEditingPage] = useState(null)

  async function load() {
    setLoading(true)
    try { const r = await getPages(); setPages(r.data || []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function handlePageSaved(updated) {
    setPages(prev => prev.map(p => p._id === updated._id ? updated : p))
    setEditingPage(updated)
  }

  if (editingPage) {
    return <BlockEditorView page={editingPage} onBack={() => { setEditingPage(null); load() }} onPageSaved={handlePageSaved} />
  }

  return <MenuManagerView pages={pages} loading={loading} onReload={load} onEditContent={setEditingPage} />
}
