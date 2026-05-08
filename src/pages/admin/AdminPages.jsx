import { useState, useEffect } from 'react'
import { getPages, createPage, updatePage, deletePage } from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import BlockRenderer from '../../components/BlockRenderer'

const ICONS = ['📄','🏛️','📰','📊','💰','📋','👥','🌐','📮','🚨','📝','📚','⚖️','📞','🎭','🌿','🗺️','🛍️','🏠','ℹ️','📌','🔔','✉️','🎓','🏥','🌾','🔨','🤝','⚡','🔗']
const BLOCK_TYPES = [
  { type: 'text',  label: '📝 ข้อความ/บทความ' },
  { type: 'links', label: '🔗 รายการลิงค์' },
  { type: 'cards', label: '🃏 การ์ด' },
  { type: 'image', label: '🖼️ รูปภาพ' },
  { type: 'table', label: '📊 ตาราง' },
]

function emptyBlock(type) {
  if (type === 'text')  return { type, data: { title: '', content: '' } }
  if (type === 'links') return { type, data: { title: '', items: [{ icon: '🔗', label: '', url: '', external: true }] } }
  if (type === 'cards') return { type, data: { title: '', cols: 2, items: [{ icon: '📄', title: '', desc: '', link: '' }] } }
  if (type === 'image') return { type, data: { url: '', caption: '' } }
  if (type === 'table') return { type, data: { title: '', headers: ['หัวข้อ', 'รายละเอียด'], rows: [['', '']] } }
  return { type, data: {} }
}

// ── Block editors ─────────────────────────────────────────────────────────────

function TextBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-3">
      <input className="input text-sm" placeholder="หัวข้อ block (ไม่บังคับ)" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      <textarea className="input text-sm min-h-[140px]" placeholder="เนื้อหา (เว้นบรรทัดเปล่าเพื่อแบ่งย่อหน้า)" value={data.content || ''} onChange={e => onChange({ ...data, content: e.target.value })} />
    </div>
  )
}

function LinksBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items = [...(data.items || [])]
    items[i] = { ...items[i], [field]: val }
    onChange({ ...data, items })
  }
  function addItem() { onChange({ ...data, items: [...(data.items || []), { icon: '🔗', label: '', url: '', external: true }] }) }
  function removeItem(i) { onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-3">
      <input className="input text-sm" placeholder="หัวข้อ block (ไม่บังคับ)" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      <div className="space-y-2">
        {(data.items || []).map((item, i) => (
          <div key={i} className="flex gap-2 items-start bg-gray-50 rounded-lg p-2">
            <input className="w-12 border border-gray-200 rounded px-2 py-1.5 text-sm text-center" placeholder="🔗" value={item.icon || ''} onChange={e => updateItem(i, 'icon', e.target.value)} />
            <input className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm" placeholder="ชื่อลิงค์" value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} />
            <input className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm" placeholder="URL หรือ /path" value={item.url} onChange={e => updateItem(i, 'url', e.target.value)} />
            <label className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap pt-2">
              <input type="checkbox" checked={!!item.external} onChange={e => updateItem(i, 'external', e.target.checked)} />
              ภายนอก
            </label>
            <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-xs pt-2">✕</button>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="text-xs text-secondary hover:underline">+ เพิ่มลิงค์</button>
    </div>
  )
}

function CardsBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items = [...(data.items || [])]
    items[i] = { ...items[i], [field]: val }
    onChange({ ...data, items })
  }
  function addItem() { onChange({ ...data, items: [...(data.items || []), { icon: '📄', title: '', desc: '', link: '' }] }) }
  function removeItem(i) { onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input className="input text-sm flex-1" placeholder="หัวข้อ block (ไม่บังคับ)" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={data.cols || 2} onChange={e => onChange({ ...data, cols: parseInt(e.target.value) })}>
          <option value={1}>1 คอลัมน์</option>
          <option value={2}>2 คอลัมน์</option>
          <option value={3}>3 คอลัมน์</option>
        </select>
      </div>
      <div className="space-y-2">
        {(data.items || []).map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input className="w-12 border border-gray-200 rounded px-2 py-1.5 text-sm text-center" placeholder="📄" value={item.icon || ''} onChange={e => updateItem(i, 'icon', e.target.value)} />
              <input className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm" placeholder="ชื่อการ์ด" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} />
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
            </div>
            <input className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" placeholder="คำอธิบาย" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} />
            <input className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm" placeholder="ลิงค์ (ไม่บังคับ) เช่น /about หรือ https://..." value={item.link} onChange={e => updateItem(i, 'link', e.target.value)} />
          </div>
        ))}
      </div>
      <button onClick={addItem} className="text-xs text-secondary hover:underline">+ เพิ่มการ์ด</button>
    </div>
  )
}

function ImageBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-3">
        <ImageUpload value={data.url} onChange={url => onChange({ ...data, url })} />
      </div>
      <input className="input text-sm" placeholder="คำบรรยายใต้รูป (ไม่บังคับ)" value={data.caption || ''} onChange={e => onChange({ ...data, caption: e.target.value })} />
    </div>
  )
}

function TableBlockEdit({ data, onChange }) {
  const headers = data.headers || ['']
  const rows    = data.rows    || [['']]

  function setHeaders(h) { onChange({ ...data, headers: h }) }
  function setRows(r)    { onChange({ ...data, rows: r }) }

  function addCol() {
    setHeaders([...headers, ''])
    setRows(rows.map(r => [...r, '']))
  }
  function removeCol(ci) {
    setHeaders(headers.filter((_, i) => i !== ci))
    setRows(rows.map(r => r.filter((_, i) => i !== ci)))
  }
  function addRow() { setRows([...rows, headers.map(() => '')]) }
  function removeRow(ri) { setRows(rows.filter((_, i) => i !== ri)) }
  function updateCell(ri, ci, val) {
    const r = rows.map((row, i) => i === ri ? row.map((c, j) => j === ci ? val : c) : row)
    setRows(r)
  }

  return (
    <div className="space-y-3">
      <input className="input text-sm" placeholder="หัวข้อตาราง (ไม่บังคับ)" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h, ci) => (
                <th key={ci} className="border-b border-gray-200 p-1">
                  <div className="flex gap-1">
                    <input className="flex-1 border border-gray-200 rounded px-1.5 py-1 text-xs font-semibold" placeholder={`คอลัมน์ ${ci+1}`} value={h} onChange={e => { const nh = [...headers]; nh[ci] = e.target.value; setHeaders(nh) }} />
                    {headers.length > 1 && <button onClick={() => removeCol(ci)} className="text-red-400 text-xs">✕</button>}
                  </div>
                </th>
              ))}
              <th className="border-b border-gray-200 p-1 w-8">
                <button onClick={addCol} className="text-secondary text-xs">+คอล</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border-b border-gray-100 p-1">
                    <input className="w-full border border-gray-200 rounded px-1.5 py-1 text-xs" value={cell} onChange={e => updateCell(ri, ci, e.target.value)} />
                  </td>
                ))}
                <td className="border-b border-gray-100 p-1">
                  <button onClick={() => removeRow(ri)} className="text-red-400 text-xs">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="text-xs text-secondary hover:underline">+ เพิ่มแถว</button>
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
    default:      return null
  }
}

// ── Block Editor view ─────────────────────────────────────────────────────────

function BlockEditorView({ page, onBack, onPageSaved }) {
  const [blocks, setBlocks]   = useState(page.blocks || [])
  const [saving, setSaving]   = useState(false)
  const [openIdx, setOpenIdx] = useState(null)

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
    setSaving(true)
    try {
      // eslint-disable-next-line no-unused-vars
      const cleanBlocks = blocks.map(({ _tempKey, ...rest }) => rest)
      const updated = await updatePage(page._id, { blocks: cleanBlocks })
      onPageSaved(updated.data)
    } finally { setSaving(false) }
  }

  const blockLabel = { text: '📝 ข้อความ', links: '🔗 ลิงค์', cards: '🃏 การ์ด', image: '🖼️ รูปภาพ', table: '📊 ตาราง' }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">← กลับ</button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">{page.icon} {page.title}</h1>
          <p className="text-xs text-gray-400">แก้ไขเนื้อหา — {blocks.length} block</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
          {saving ? 'กำลังบันทึก...' : '💾 บันทึกทั้งหมด'}
        </button>
      </div>

      {/* Block list */}
      <div className="space-y-3 mb-4">
        {blocks.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            ยังไม่มี block — กดปุ่มด้านล่างเพื่อเพิ่ม
          </div>
        )}
        {blocks.map((block, i) => (
          <div key={block._id || block._tempKey || i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Block header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600 flex-1">{blockLabel[block.type] || block.type}</span>
              <div className="flex gap-0.5">
                <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-xs px-1">▲</button>
                <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-xs px-1">▼</button>
              </div>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="text-xs text-secondary hover:underline px-2">
                {openIdx === i ? 'ย่อ' : 'แก้ไข'}
              </button>
              <button onClick={() => deleteBlock(i)} className="text-xs text-red-400 hover:text-red-600 px-1">ลบ</button>
            </div>
            {/* Block edit form */}
            {openIdx === i && (
              <div className="p-4">
                <BlockEdit block={block} onChange={b => updateBlock(i, b)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add block */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">เพิ่ม Block ใหม่</p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} onClick={() => addBlock(bt.type)}
              className="text-xs px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-secondary hover:text-secondary hover:bg-blue-50 transition-colors">
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      {blocks.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 border-t border-dashed border-gray-200" />
            <span className="text-xs font-semibold text-gray-400 px-2">👁️ ตัวอย่างหน้าแสดงผล</span>
            <div className="flex-1 border-t border-dashed border-gray-200" />
          </div>
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="max-w-2xl mx-auto">
              <div className="card mb-3">
                <div className="section-head">
                  <h1 className="text-sm font-semibold">{page.icon} {page.title}</h1>
                </div>
              </div>
              {blocks.map((block, i) => (
                <BlockRenderer key={block._id || block._tempKey || i} block={block} />
              ))}
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
    title:      editPage.title,
    icon:       editPage.icon,
    parentSlug: editPage.parentSlug || '',
    isActive:   editPage.isActive,
  } : {
    title: '', icon: '📄', parentSlug: '', isActive: true,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  async function submit() {
    if (!form.title.trim()) { setErr('กรุณากรอกชื่อเมนู'); return }
    setErr('')
    setSaving(true)
    try {
      if (isEdit) {
        const r = await updatePage(editPage._id, form)
        onSaved(r.data)
      } else {
        const slug = 'page-' + Date.now()
        const path = '/page/' + slug
        const r = await createPage({ ...form, slug, path, isBuiltin: false, order: 999, blocks: [] })
        onSaved(r.data)
      }
      onClose()
    } catch (e) {
      setErr(e?.response?.data?.error || 'เกิดข้อผิดพลาด')
    } finally { setSaving(false) }
  }

  const topLevelPages = pages.filter(p => !p.parentSlug && (!isEdit || p._id !== editPage._id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">{isEdit ? '✏️ แก้ไขเมนู' : '➕ เพิ่มเมนูใหม่'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
        </div>
        <div className="p-5 space-y-4">
          {/* Icon picker */}
          <div>
            <label className="form-label">ไอคอน</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ICONS.map(ic => (
                <button key={ic} onClick={() => set('icon', ic)}
                  className={`text-xl w-9 h-9 rounded-lg border transition-all ${form.icon === ic ? 'border-secondary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  {ic}
                </button>
              ))}
            </div>
            <input className="input text-sm" placeholder="หรือพิมพ์ emoji เอง" value={form.icon} onChange={e => set('icon', e.target.value)} />
          </div>

          {/* Title */}
          <div>
            <label className="form-label">ชื่อเมนู <span className="text-red-400">*</span></label>
            <input className="input" placeholder="เช่น บริการประชาชน" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          {/* Parent */}
          <div>
            <label className="form-label">เมนูหลัก (ถ้าเป็นเมนูย่อย)</label>
            <select className="input bg-white" value={form.parentSlug} onChange={e => set('parentSlug', e.target.value)}>
              <option value="">— ไม่มี (เมนูหลัก) —</option>
              {topLevelPages.map(p => (
                <option key={p.slug} value={p.slug}>{p.icon} {p.title}</option>
              ))}
            </select>
          </div>

          {/* Active */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-700">แสดงในเมนู</span>
          </label>

          {err && <p className="text-xs text-red-500">⚠️ {err}</p>}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
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
  const [saving, setSaving] = useState(false)

  const topLevel = pages.filter(p => !p.parentSlug).sort((a, b) => a.order - b.order)
  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  function openAdd()    { setEditPage(null); setShowForm(true) }
  function openEdit(p)  { setEditPage(p);    setShowForm(true) }

  async function toggleActive(page) {
    await updatePage(page._id, { isActive: !page.isActive })
    onReload()
  }

  async function move(page, dir) {
    const siblings = page.parentSlug
      ? pages.filter(p => p.parentSlug === page.parentSlug).sort((a, b) => a.order - b.order)
      : topLevel
    const idx = siblings.findIndex(p => p._id === page._id)
    const target = siblings[idx + dir]
    if (!target) return
    setSaving(true)
    try {
      await Promise.all([
        updatePage(page._id,   { order: target.order }),
        updatePage(target._id, { order: page.order }),
      ])
      onReload()
    } finally { setSaving(false) }
  }

  async function remove(page) {
    if (!window.confirm(`ลบ "${page.title}"? เนื้อหาทั้งหมดจะหายไป`)) return
    await deletePage(page._id)
    onReload()
  }

  function onSaved() { onReload() }

  function renderRow(page, siblings, idx) {
    const children  = getChildren(page.slug)
    const isChild   = !!page.parentSlug
    const isFirst   = idx === 0
    const isLast    = idx === siblings.length - 1
    const publicPath = page.isBuiltin ? page.path : `/page/${page.slug}`

    return (
      <div key={page._id}>
        <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isChild ? 'pl-10 bg-gray-50/30' : ''}`}>
          {isChild && <span className="text-gray-300 text-xs mr-1">└</span>}
          <span className="text-base w-6 text-center flex-shrink-0">{page.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{page.title}</p>
            <p className="text-xs text-gray-400 truncate">{publicPath}</p>
          </div>
          {page.isBuiltin && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded flex-shrink-0">ระบบ</span>}

          <button onClick={() => toggleActive(page)}
            className={`text-xs px-2 py-1 rounded flex-shrink-0 transition-colors ${page.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
            {page.isActive ? 'แสดง' : 'ซ่อน'}
          </button>

          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button onClick={() => move(page, -1)} disabled={isFirst || saving} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-[10px] leading-none">▲</button>
            <button onClick={() => move(page, 1)}  disabled={isLast  || saving} className="text-gray-300 hover:text-gray-600 disabled:opacity-20 text-[10px] leading-none">▼</button>
          </div>

          <button onClick={() => openEdit(page)} className="text-xs text-secondary hover:underline flex-shrink-0">แก้ไข</button>

          {!page.isBuiltin && (
            <>
              <button onClick={() => onEditContent(page)} className="text-xs text-primary hover:underline flex-shrink-0">เนื้อหา</button>
              <button onClick={() => remove(page)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">ลบ</button>
            </>
          )}
        </div>
        {children.map((c, ci) => renderRow(c, children, ci))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-800">🗂️ จัดการเมนูและหน้า</h1>
          <p className="text-xs text-gray-400 mt-0.5">จัดลำดับ เพิ่ม/ลบ และแก้ไขเนื้อหาหน้าต่างๆ</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs">+ เพิ่มหน้าใหม่</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : (
          topLevel.map((p, i) => renderRow(p, topLevel, i))
        )}
      </div>

      {showForm && (
        <PageFormModal pages={pages} editPage={editPage} onClose={() => setShowForm(false)} onSaved={onSaved} />
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
    try {
      const r = await getPages()
      setPages(r.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function handlePageSaved(updated) {
    setPages(prev => prev.map(p => p._id === updated._id ? updated : p))
    setEditingPage(updated)
  }

  if (editingPage) {
    return (
      <BlockEditorView
        page={editingPage}
        onBack={() => { setEditingPage(null); load() }}
        onPageSaved={handlePageSaved}
      />
    )
  }

  return (
    <MenuManagerView
      pages={pages}
      loading={loading}
      onReload={load}
      onEditContent={setEditingPage}
    />
  )
}
