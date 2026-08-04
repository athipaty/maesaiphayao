import { useState, useEffect, useRef } from 'react'
import { getPages, createPage, updatePage, deletePage, uploadImage } from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import PdfUpload from '../../components/PdfUpload'
import ExcelUpload from '../../components/ExcelUpload'
import WordUpload from '../../components/WordUpload'
import BlockRenderer from '../../components/BlockRenderer'

const ICONS = ['📄','🏛️','📰','📊','💰','📋','👥','🌐','📮','🚨','📝','📚','⚖️','📞','🎭','🌿','🗺️','🛍️','🏠','ℹ️','📌','🔔','✉️','🎓','🏥','🌾','🔨','🤝','⚡','🔗']

const CARD_ICONS = [
  '📄','📝','📋','📊','📈','📉','📌','📍','📎','🔗',
  '🏛️','🏠','🏢','🏥','🏫','🏪','🏗️','🌐','🗺️','📮',
  '💰','💳','💼','🏆','🥇','🎓','📚','🎭','🌿','🌾',
  '👥','👤','🤝','🧑‍💼','👮','🧑‍🔬','🧑‍🏫','🧑‍⚕️','🏃','🚶',
  '📞','✉️','📧','📱','💬','🔔','📢','📣','🚨','⚡',
  '🔨','⚙️','🔧','🛠️','🔑','🗝️','🔒','💡','🔍','🔎',
  '🌟','⭐','💫','✨','🎯','❤️','💙','💚','💛','🧡',
  '🚗','🚌','✈️','🚢','🚲','🛵','🚑','🚒','🏘️','🌅',
  '🛍️','🍎','🌱','🌺','🌻','🦋','🐦','🌈','☀️','🌙',
  '📅','⏰','💻','🖥️','📷','🎪','🎨','🎵','🎬','🏅',
  // Arrows
  '➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↔️','↕️',
  '↩️','↪️','🔄','🔃','⤴️','⤵️','🔼','🔽','▶️','◀️',
  '⏩','⏪','⏫','⏬','🔁','🔂','➰','➿','↕️','🔀',
  // Gender & people
  '♂️','♀️','⚧️','🚹','🚺','🚻','👨','👩','🧑','🧒',
  '👦','👧','👫','👬','👭','🧑‍🤝‍🧑','👪','🏳️‍🌈','🏳️‍⚧️','⚥',
]

function EmojiPicker({ value, onChange, accentColor = 'purple' }) {
  const [open, setOpen] = useState(false)

  const selCls = accentColor === 'purple' ? 'bg-purple-100 ring-2 ring-purple-400'
    : accentColor === 'green'  ? 'bg-green-100 ring-2 ring-green-400'
    : accentColor === 'orange' ? 'bg-orange-100 ring-2 ring-orange-400'
    : 'bg-blue-100 ring-2 ring-blue-400'

  return (
    <div className="relative flex-shrink-0">
      {/* Trigger button */}
      <button type="button" onClick={() => setOpen(true)}
        title="เลือก icon"
        className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl border-2 transition-colors ${open ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
        {value || <span className="text-[11px] text-gray-300 font-bold">✕</span>}
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-2xl">
                  {value || <span className="text-sm text-gray-300">✕</span>}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">เลือก Icon</p>
                  <p className="text-xs text-gray-400">{value ? `เลือกอยู่: ${value}` : 'ยังไม่ได้เลือก'}</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg">
                ×
              </button>
            </div>

            {/* Icon grid */}
            <div className="p-4">
              <div className="grid grid-cols-8 gap-1.5 max-h-72 overflow-y-auto pr-1">
                {/* Blank option */}
                <button type="button"
                  onClick={() => { onChange(''); setOpen(false) }}
                  title="ไม่มี icon"
                  className={`w-full aspect-square flex items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:bg-red-50 hover:border-red-300 ${!value ? 'border-red-300 bg-red-50' : 'border-gray-200 text-gray-300'}`}>
                  <span className="text-xs font-bold">✕</span>
                </button>
                {CARD_ICONS.map(ic => (
                  <button key={ic} type="button"
                    onClick={() => { onChange(ic); setOpen(false) }}
                    className={`w-full aspect-square flex items-center justify-center text-2xl rounded-xl transition-[transform,background-color] hover:bg-gray-100 hover:scale-110 active:scale-95 ${value === ic ? selCls : ''}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const BLOCK_TYPES = [
  { type: 'text',  icon: '📝', label: 'ข้อความ/บทความ', desc: 'เนื้อหา ย่อหน้า บทความ',  color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400', accent: 'bg-indigo-500' },
  { type: 'links', icon: '🔗', label: 'รายการลิงค์',     desc: 'รายการลิงค์ภายใน/ภายนอก', color: 'bg-green-50 border-green-200 hover:border-green-400',   accent: 'bg-green-500'  },
  { type: 'cards', icon: '🃏', label: 'การ์ด',           desc: 'กริดการ์ด มีไอคอนและคำอธิบาย', color: 'bg-purple-50 border-purple-200 hover:border-purple-400', accent: 'bg-purple-500' },
  { type: 'image', icon: '🖼️', label: 'รูปภาพ',          desc: 'อัปโหลดรูป + คำบรรยาย',    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',   accent: 'bg-amber-500'  },
  { type: 'table', icon: '📊', label: 'ตาราง',           desc: 'ตารางข้อมูลแบบกำหนดเอง',   color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',     accent: 'bg-cyan-500'   },
  { type: 'pdf',      icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2h10l6 6v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#ef4444" />
        <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2z" fill="#fca5a5" />
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.3">PDF</text>
      </svg>
    ), label: 'ไฟล์ PDF',         desc: 'แนบและแสดงไฟล์ PDF',                color: 'bg-red-50 border-red-200 hover:border-red-400',          accent: 'bg-red-500'     },
  { type: 'banner',   icon: '🎨', label: 'Banner/หัวข้อ',  desc: 'กรอบสีพร้อมหัวข้อใหญ่ เลือกสีได้', color: 'bg-rose-50 border-rose-200 hover:border-rose-400',         accent: 'bg-rose-500'    },
  { type: 'inforows', icon: 'ℹ️', label: 'แถวข้อมูล',      desc: 'ไอคอน + ชื่อ + ค่า (ที่อยู่/โทร)', color: 'bg-orange-50 border-orange-200 hover:border-orange-400',   accent: 'bg-orange-500'  },
  { type: 'stats',    icon: '📈', label: 'การ์ดสถิติ',     desc: 'ตัวเลขใหญ่พร้อมไอคอนและสี',        color: 'bg-sky-50 border-sky-200 hover:border-sky-400',            accent: 'bg-sky-500'     },
  { type: 'alert',    icon: '🔔', label: 'กล่อง Alert',    desc: 'ไฮไลต์ข้อมูล/แจ้งเตือน/สำเร็จ',   color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',   accent: 'bg-yellow-500'  },
  { type: 'timeline', icon: '🕐', label: 'Timeline',       desc: 'เหตุการณ์เรียงตามเวลา',              color: 'bg-violet-50 border-violet-200 hover:border-violet-400',   accent: 'bg-violet-500'  },
  { type: 'html',     icon: <span className="font-mono text-[11px] font-bold text-slate-500">&lt;/&gt;</span>, label: 'HTML', desc: 'โค้ด HTML กำหนดเอง', color: 'bg-slate-50 border-slate-200 hover:border-slate-400', accent: 'bg-slate-500' },
  { type: 'excel',    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2h10l6 6v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#16a34a"/>
        <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2z" fill="#86efac"/>
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.3">XLS</text>
      </svg>
    ), label: 'Excel',     desc: 'อัปโหลดและแสดงไฟล์ Excel', color: 'bg-green-50 border-green-200 hover:border-green-400', accent: 'bg-green-500' },
  { type: 'word',     icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2h10l6 6v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#2563eb"/>
        <path d="M14 2l6 6h-4a2 2 0 0 1-2-2V2z" fill="#93c5fd"/>
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.3">DOC</text>
      </svg>
    ), label: 'Word',      desc: 'อัปโหลดและแสดงไฟล์ Word', color: 'bg-blue-50 border-blue-200 hover:border-blue-400', accent: 'bg-blue-500' },
]
const BLOCK_META = Object.fromEntries(BLOCK_TYPES.map(b => [b.type, b]))

const ACCENT_BORDER = {
  text:     'border-l-indigo-400',
  links:    'border-l-green-400',
  cards:    'border-l-purple-400',
  image:    'border-l-amber-400',
  table:    'border-l-cyan-400',
  pdf:      'border-l-red-400',
  banner:   'border-l-rose-400',
  inforows: 'border-l-orange-400',
  stats:    'border-l-sky-400',
  alert:    'border-l-yellow-400',
  timeline: 'border-l-violet-400',
  html:     'border-l-slate-400',
  excel:    'border-l-green-400',
  word:     'border-l-blue-400',
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

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-[border-color,box-shadow] bg-white'
const smallInp = 'border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-[border-color,box-shadow] bg-white'

function emptyBlock(type) {
  if (type === 'text')  return { type, data: { title: '', content: '' } }
  if (type === 'links') return { type, data: { title: '', items: [{ icon: '🔗', label: '', url: '', external: true }] } }
  if (type === 'cards') return { type, data: { title: '', cols: 2, size: 'md', iconPos: 'left', items: [{ icon: '📄', title: '', desc: '', link: '', color: 'white' }] } }
  if (type === 'image') return { type, data: { layout: 'single', align: 'center', size: 'lg', height: 'auto', images: [] } }
  if (type === 'table') return { type, data: { title: '', headers: ['หัวข้อ', 'รายละเอียด'], rows: [['', '']] } }
  if (type === 'pdf')      return { type, data: { url: '', label: '', title: '', description: '' } }
  if (type === 'banner')   return { type, data: { icon: '', title: '', subtitle: '', color: 'primary', align: 'center', height: 'md' } }
  if (type === 'inforows') return { type, data: { title: '', items: [{ icon: '📋', label: '', value: '' }] } }
  if (type === 'stats')    return { type, data: { title: '', cols: 4, items: [{ icon: '📊', label: '', value: '', unit: '', color: 'blue' }], total: { label: '', value: '', unit: '' } } }
  if (type === 'alert')    return { type, data: { variant: 'info', icon: '', title: '', content: '' } }
  if (type === 'timeline') return { type, data: { title: '', items: [{ icon: '📌', year: '', title: '', desc: '', color: 'primary' }] } }
  if (type === 'html')     return { type, data: { html: '' } }
  if (type === 'excel')    return { type, data: { url: '', label: '', title: '', description: '' } }
  if (type === 'word')     return { type, data: { url: '', label: '', title: '', description: '' } }
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

const CARD_COLOR_OPTIONS = [
  { key: 'white',  bg: 'bg-white',       border: 'border-gray-300',     label: 'ขาว'   },
  { key: 'blue',   bg: 'bg-blue-100',    border: 'border-blue-300',     label: 'ฟ้า'   },
  { key: 'green',  bg: 'bg-green-100',   border: 'border-green-300',    label: 'เขียว' },
  { key: 'purple', bg: 'bg-purple-100',  border: 'border-purple-300',   label: 'ม่วง'  },
  { key: 'amber',  bg: 'bg-amber-100',   border: 'border-amber-300',    label: 'เหลือง'},
  { key: 'red',    bg: 'bg-red-100',     border: 'border-red-300',      label: 'แดง'   },
  { key: 'teal',   bg: 'bg-teal-100',    border: 'border-teal-300',     label: 'เทียล' },
  { key: 'pink',   bg: 'bg-pink-100',    border: 'border-pink-300',     label: 'ชมพู'  },
  { key: 'indigo', bg: 'bg-indigo-100',  border: 'border-indigo-300',   label: 'คราม' },
  { key: 'gray',   bg: 'bg-gray-200',    border: 'border-gray-400',     label: 'เทา'   },
]

function CardsBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items = [...(data.items || [])]
    items[i] = { ...items[i], [field]: val }
    onChange({ ...data, items })
  }
  function addItem()    { onChange({ ...data, items: [...(data.items || []), { icon: '📄', title: '', desc: '', link: '', color: 'white' }] }) }
  function removeItem(i){ onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-4">
      {/* Header options row */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <Field label="หัวข้อ block">
            <input className={inp} placeholder="ไม่บังคับ" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
          </Field>
        </div>
        <div className="flex-shrink-0">
          <Field label="คอลัมน์">
            <select className={`${inp} w-28`} value={data.cols || 2} onChange={e => onChange({ ...data, cols: parseInt(e.target.value) })}>
              <option value={1}>1 คอลัมน์</option>
              <option value={2}>2 คอลัมน์</option>
              <option value={3}>3 คอลัมน์</option>
              <option value={4}>4 คอลัมน์</option>
            </select>
          </Field>
        </div>
        <div className="flex-shrink-0">
          <Field label="ขนาดการ์ด">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {[
                { v: 'sm', l: 'เล็ก', sub: 'S' },
                { v: 'md', l: 'กลาง', sub: 'M' },
                { v: 'lg', l: 'ใหญ่', sub: 'L' },
              ].map(({ v, l, sub }) => (
                <button key={v} type="button" onClick={() => onChange({ ...data, size: v })}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold transition-colors flex flex-col items-center leading-tight ${(data.size||'md')===v ? 'bg-purple-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <span>{sub}</span>
                  <span className="text-[9px] opacity-70">{l}</span>
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>

      {/* Icon position picker */}
      <Field label="ตำแหน่ง Icon">
        <div className="grid grid-cols-4 gap-2">
          {[
            { v: 'left',   label: 'ซ้าย',  preview: (
              <div className="flex items-center gap-1 justify-center">
                <div className="w-3 h-3 rounded bg-current opacity-70 flex-shrink-0" />
                <div className="space-y-0.5"><div className="w-6 h-1 rounded bg-current opacity-50"/><div className="w-4 h-1 rounded bg-current opacity-30"/></div>
              </div>
            )},
            { v: 'right',  label: 'ขวา',   preview: (
              <div className="flex items-center gap-1 justify-center flex-row-reverse">
                <div className="w-3 h-3 rounded bg-current opacity-70 flex-shrink-0" />
                <div className="space-y-0.5"><div className="w-6 h-1 rounded bg-current opacity-50"/><div className="w-4 h-1 rounded bg-current opacity-30"/></div>
              </div>
            )},
            { v: 'top',    label: 'บน',    preview: (
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-3 h-3 rounded bg-current opacity-70" />
                <div className="space-y-0.5 w-full flex flex-col items-center"><div className="w-6 h-1 rounded bg-current opacity-50"/><div className="w-4 h-1 rounded bg-current opacity-30"/></div>
              </div>
            )},
            { v: 'bottom', label: 'ล่าง',  preview: (
              <div className="flex flex-col-reverse items-center gap-0.5">
                <div className="w-3 h-3 rounded bg-current opacity-70" />
                <div className="space-y-0.5 w-full flex flex-col items-center"><div className="w-6 h-1 rounded bg-current opacity-50"/><div className="w-4 h-1 rounded bg-current opacity-30"/></div>
              </div>
            )},
          ].map(({ v, label, preview }) => (
            <button key={v} type="button" onClick={() => onChange({ ...data, iconPos: v })}
              className={`py-2.5 px-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${(data.iconPos||'left')===v ? 'border-purple-400 bg-purple-50 text-purple-500' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'}`}>
              {preview}
              <span className={`text-[10px] font-semibold ${(data.iconPos||'left')===v ? 'text-purple-600' : 'text-gray-500'}`}>{label}</span>
            </button>
          ))}
        </div>
      </Field>

      {/* Card list */}
      <Field label={`การ์ด (${(data.items||[]).length} รายการ)`}>
        <div className={`grid gap-2 ${{ 1:'grid-cols-1', 2:'grid-cols-2', 3:'grid-cols-3', 4:'grid-cols-4' }[data.cols||2]||'grid-cols-2'}`}>
          {(data.items || []).map((item, i) => (
            <div key={i} className={`border rounded-xl p-3 space-y-2.5 transition-colors ${CARD_COLOR_OPTIONS.find(c=>c.key===(item.color||'white'))?.bg||'bg-white'} ${CARD_COLOR_OPTIONS.find(c=>c.key===(item.color||'white'))?.border||'border-gray-200'}`}>
              {/* Row 1: icon + title + delete */}
              <div className="flex items-center gap-2">
                <EmojiPicker value={item.icon || '📄'} onChange={v => updateItem(i, 'icon', v)} accentColor="purple" />
                <input className={`${smallInp} flex-1 font-medium`} placeholder="ชื่อการ์ด" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} />
                <button onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors text-sm flex-shrink-0">✕</button>
              </div>
              {/* Row 2: description */}
              <input className={`${smallInp} w-full bg-white/70`} placeholder="คำอธิบายสั้นๆ" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} />
              {/* Row 3: link */}
              <input className={`${smallInp} w-full bg-white/70`} placeholder="ลิงค์ (ไม่บังคับ) เช่น /about หรือ https://..." value={item.link} onChange={e => updateItem(i, 'link', e.target.value)} />
              {/* Row 4: color picker */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 flex-shrink-0">สีพื้นหลัง</span>
                <div className="flex gap-1 flex-wrap">
                  {CARD_COLOR_OPTIONS.map(c => (
                    <button key={c.key} type="button" title={c.label}
                      onClick={() => updateItem(i, 'color', c.key)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${c.bg} ${c.border} ${(item.color||'white')===c.key ? 'ring-2 ring-offset-1 ring-purple-400 scale-110' : 'hover:scale-105'}`} />
                  ))}
                </div>
              </div>
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
  const images = data.images || []
  const layout = data.layout || 'single'
  const isGrid = layout !== 'single'

  function updateImage(i, field, val) {
    const imgs = [...images]; imgs[i] = { ...imgs[i], [field]: val }
    onChange({ ...data, images: imgs })
  }
  function addEmpty()     { onChange({ ...data, images: [...images, { url: '', caption: '' }] }) }
  function removeImage(i) { onChange({ ...data, images: images.filter((_, idx) => idx !== i) }) }
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
      const results = await Promise.all(files.map(f => uploadImage(f)))
      const newImgs = results.map(r => ({ url: r.data.url, caption: '' }))
      onChange({ ...data, images: [...images, ...newImgs] })
    } catch { alert('อัปโหลดรูปไม่สำเร็จ') }
    finally { setBulkUploading(false); e.target.value = '' }
  }

  const editCols  = { single:'grid-cols-1', 'grid-2':'grid-cols-2', 'grid-3':'grid-cols-3', 'grid-4':'grid-cols-4' }[layout] || 'grid-cols-1'
  const thumbAsp  = data.height === 'square' ? 'aspect-square' : 'aspect-[4/3]'
  const isSingle1 = isGrid && images.length === 1
  const gridWrap  = isSingle1 ? 'flex justify-center' : `grid ${editCols} gap-3`
  const cellW     = isSingle1 ? ({ 'grid-2':'w-1/2','grid-3':'w-1/3','grid-4':'w-1/4' }[layout]||'w-1/2') : ''

  return (
    <div className="space-y-4">

      {/* ── Section: Layout ── */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">รูปแบบการแสดงผล</p>
        <div className="grid grid-cols-4 gap-2">
          {LAYOUTS.map(l => {
            const active = layout === l.key
            return (
              <button key={l.key} type="button" onClick={() => onChange({ ...data, layout: l.key })}
                className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${active ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-gray-200 hover:border-amber-200 bg-white'}`}>
                <div className="flex gap-0.5 items-stretch h-8 w-full px-1 justify-center">
                  {l.boxes.map((b, i) => (
                    <div key={i} className={`rounded flex-1 ${active ? 'bg-amber-300' : 'bg-gray-200'}`}
                      style={{ maxWidth: b.w * 0.8 }} />
                  ))}
                </div>
                <span className={`text-[11px] font-bold ${active ? 'text-amber-600' : 'text-gray-400'}`}>{l.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Section: Options ── */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          {isGrid ? 'ความสูงรูป' : 'ขนาดและตำแหน่ง'}
        </p>
        {isGrid ? (
          <div className="grid grid-cols-5 gap-2">
            {[
              { v: 'auto',   l: 'ตามสัดส่วน', bar: 'h-3'  },
              { v: 'sm',     l: 'เล็ก 128px',  bar: 'h-4'  },
              { v: 'md',     l: 'กลาง 192px',  bar: 'h-6'  },
              { v: 'lg',     l: 'ใหญ่ 256px',  bar: 'h-8'  },
              { v: 'square', l: '1 : 1',        bar: 'h-6 w-6 mx-auto' },
            ].map(({ v, l, bar }) => {
              const active = (data.height||'auto') === v
              return (
                <button key={v} type="button" onClick={() => onChange({ ...data, height: v })}
                  className={`py-2.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${active ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-200'}`}>
                  <div className="flex items-end justify-center" style={{ height: 32 }}>
                    <div className={`${bar} w-6 rounded-sm ${active ? 'bg-amber-400' : 'bg-gray-200'}`} />
                  </div>
                  <span className={`text-[10px] font-semibold leading-snug text-center px-1 ${active ? 'text-amber-700' : 'text-gray-500'}`}>{l}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 mb-2">จัดวาง</p>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                {[['left','◀ ซ้าย'],['center','■ กลาง'],['right','ขวา ▶']].map(([v, lbl]) => (
                  <button key={v} type="button" onClick={() => onChange({ ...data, align: v })}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${(data.align||'center')===v ? 'bg-amber-400 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 mb-2">ขนาด</p>
              <select className={`${inp} w-full`} value={data.size || 'lg'} onChange={e => onChange({ ...data, size: e.target.value })}>
                <option value="sm">เล็ก (300px)</option>
                <option value="md">กลาง (500px)</option>
                <option value="lg">ใหญ่ (700px)</option>
                <option value="full">เต็มความกว้าง</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Section: Images ── */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            รูปภาพ {images.length > 0 && <span className="text-amber-500">({images.length} รูป)</span>}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={addEmpty}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors">
              + เพิ่มรูป
            </button>
            <label className={`flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${bulkUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {bulkUploading ? '⏳...' : '📤 หลายรูป'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={bulkAdd} disabled={bulkUploading} />
            </label>
          </div>
        </div>

        {images.length === 0 ? (
          <label className="cursor-pointer block">
            <div className="border-2 border-dashed border-amber-200 hover:border-amber-300 bg-white rounded-xl py-10 text-center transition-colors">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm font-medium text-gray-500 mb-1">ยังไม่มีรูปภาพ</p>
              <p className="text-xs text-amber-500">กด + เพิ่มรูป หรืออัปโหลดหลายรูปพร้อมกัน</p>
            </div>
          </label>
        ) : isGrid ? (
          <div className={gridWrap}>
            {images.map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm group/img ${cellW}`}>
                {/* Thumbnail */}
                <div className={`relative overflow-hidden bg-gray-100 ${thumbAsp}`}>
                  {img.url
                    ? <img src={img.url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
                        <span className="text-3xl">🖼️</span>
                        <span className="text-[10px]">ยังไม่มีรูป</span>
                      </div>}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all rounded-none" />
                  {/* Order controls */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                      className="w-7 h-7 bg-white/95 hover:bg-white rounded-lg text-gray-600 text-xs font-bold disabled:opacity-25 shadow">◀</button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}
                      className="w-7 h-7 bg-white/95 hover:bg-white rounded-lg text-gray-600 text-xs font-bold disabled:opacity-25 shadow">▶</button>
                    <button type="button" onClick={() => removeImage(i)}
                      className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow">×</button>
                  </div>
                  {/* Replace button */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <ImageUpload value={img.url} onChange={url => updateImage(i, 'url', url)} />
                  </div>
                  {/* Index badge */}
                  <div className="absolute top-2 left-2 w-5 h-5 bg-black/40 text-white rounded-md text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                {/* Caption */}
                <div className="px-2.5 py-2 bg-white">
                  <input className={`${smallInp} w-full text-[11px] bg-gray-50`} placeholder="คำบรรยาย (ไม่บังคับ)"
                    value={img.caption || ''} onChange={e => updateImage(i, 'caption', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {images.map((img, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex gap-3 p-3 items-start">
                {/* Thumb */}
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group/thumb">
                  {img.url
                    ? <img src={img.url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🖼️</div>}
                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                    <ImageUpload value={img.url} onChange={url => updateImage(i, 'url', url)} />
                  </div>
                </div>
                {/* Fields */}
                <div className="flex-1 min-w-0 space-y-2 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">#{i + 1}</span>
                    {!img.url && <span className="text-[10px] text-gray-400">ยังไม่ได้อัปโหลด</span>}
                  </div>
                  <input className={`${smallInp} w-full`} placeholder="คำบรรยายใต้รูป (ไม่บังคับ)"
                    value={img.caption || ''} onChange={e => updateImage(i, 'caption', e.target.value)} />
                </div>
                {/* Controls */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-20 text-xs shadow-sm">▲</button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-20 text-xs shadow-sm">▼</button>
                  <button type="button" onClick={() => removeImage(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 text-sm transition-all">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                      <input className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100" placeholder={`คอลัมน์ ${ci+1}`} value={h} onChange={e => { const nh = [...headers]; nh[ci] = e.target.value; setHeaders(nh) }} />
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
                <tr key={ri} className="hover:bg-pink-50/30">
                  <td className="border-b border-r border-gray-100 p-1 text-center text-gray-400 font-mono">{ri+1}</td>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-r border-gray-100 p-1">
                      <input className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-pink-400 focus:bg-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-pink-100 transition-all" value={cell} onChange={e => updateCell(ri, ci, e.target.value)} />
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
      <Field label="ชื่อไฟล์เอกสาร (ใช้เป็นชื่อเมื่อดาวน์โหลด)">
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

// ── Color dot picker (shared) ─────────────────────────────────────────────────
const DOT_COLORS = {
  blue:'bg-blue-400', green:'bg-green-400', indigo:'bg-indigo-400', pink:'bg-pink-400',
  amber:'bg-amber-400', teal:'bg-teal-400', red:'bg-red-400', purple:'bg-purple-400',
}
function ColorDots({ keys, value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {(keys || Object.keys(DOT_COLORS)).map(c => (
        <button key={c} type="button" onClick={() => onChange(c)}
          className={`w-6 h-6 rounded-full transition-all ${DOT_COLORS[c]||'bg-gray-400'} ${value===c ? 'ring-2 ring-offset-1 ring-gray-500 scale-110' : 'opacity-50 hover:opacity-90'}`}
          title={c} />
      ))}
    </div>
  )
}

// ── Banner editor ─────────────────────────────────────────────────────────────
const BANNER_COLORS = [
  { key:'primary',   label:'น้ำเงิน', cls:'from-primary to-secondary' },
  { key:'secondary', label:'ฟ้า',    cls:'from-secondary to-accent' },
  { key:'gold',      label:'ทอง',    cls:'from-yellow-700 to-amber-500' },
  { key:'green',     label:'เขียว',  cls:'from-green-700 to-green-500' },
  { key:'red',       label:'แดง',    cls:'from-red-800 to-red-600' },
  { key:'teal',      label:'เทียล',  cls:'from-teal-700 to-teal-500' },
  { key:'gray',      label:'เทา',    cls:'from-gray-700 to-gray-500' },
]
function BannerBlockEdit({ data, onChange }) {
  const currentColor = BANNER_COLORS.find(c => c.key === (data.color || 'primary')) || BANNER_COLORS[0]
  const HEIGHTS = [
    { v: 'xs',  sub: 'XS',  l: 'เล็กมาก',  barH: 'h-1.5' },
    { v: 'sm',  sub: 'S',   l: 'เตี้ย',     barH: 'h-2.5' },
    { v: 'md',  sub: 'M',   l: 'กลาง',      barH: 'h-4'   },
    { v: 'lg',  sub: 'L',   l: 'สูง',       barH: 'h-6'   },
    { v: 'xl',  sub: 'XL',  l: 'สูงมาก',   barH: 'h-8'   },
    { v: 'xxl', sub: 'XXL', l: 'ใหญ่มาก',  barH: 'h-10'  },
  ]
  const h = data.height || 'md'
  const align = data.align || 'center'

  return (
    <div className="space-y-4">

      {/* ── Live preview ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg relative">
        <div className={`bg-gradient-to-r ${currentColor.cls} px-8 py-10 text-white transition-all ${align === 'left' ? 'text-left' : 'text-center'}`}>
          {data.icon  && <div className="text-5xl mb-3 leading-none">{data.icon}</div>}
          <div className={`text-xl font-bold leading-snug ${!data.title ? 'opacity-25' : ''}`}>
            {data.title || 'หัวข้อ Banner'}
          </div>
          {data.subtitle && <div className="text-white/70 text-sm mt-1.5">{data.subtitle}</div>}
        </div>
        <div className="absolute top-2 right-2 bg-black/20 text-white/70 text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
          preview
        </div>
      </div>

      {/* ── Section: เนื้อหา ── */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">เนื้อหา</p>
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">ไอคอน</p>
            <EmojiPicker value={data.icon||''} onChange={v => onChange({ ...data, icon: v })} accentColor="orange" />
          </div>
          <div className="flex-1 space-y-2.5">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">หัวข้อหลัก</p>
              <input className={inp} placeholder="เช่น ประวัติความเป็นมา"
                value={data.title||''} onChange={e => onChange({ ...data, title: e.target.value })} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">คำอธิบาย <span className="font-normal text-gray-400">— ไม่บังคับ</span></p>
              <input className={inp} placeholder="คำอธิบายสั้นๆ ใต้หัวข้อ"
                value={data.subtitle||''} onChange={e => onChange({ ...data, subtitle: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: สี + จัดวาง ── */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">สีและการจัดวาง</p>
        <div className="flex gap-3 items-start">
          {/* Color swatches */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-2">
              {BANNER_COLORS.map(c => (
                <button key={c.key} type="button" onClick={() => onChange({ ...data, color: c.key })}
                  className={`h-10 rounded-xl bg-gradient-to-br ${c.cls} flex items-end justify-center pb-1.5 transition-all overflow-hidden relative ${(data.color||'primary')===c.key ? 'ring-2 ring-offset-2 ring-white shadow-lg scale-105' : 'opacity-60 hover:opacity-90 hover:scale-102'}`}>
                  <span className="text-white text-[10px] font-bold drop-shadow-md relative z-10">{c.label}</span>
                  {(data.color||'primary')===c.key && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Align */}
          <div className="flex-shrink-0 space-y-1.5">
            <p className="text-xs font-semibold text-gray-600">จัดวาง</p>
            {[['center','≡ กลาง'],['left','◀ ซ้าย']].map(([v,l]) => (
              <button key={v} type="button" onClick={() => onChange({ ...data, align: v })}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${align===v ? 'bg-rose-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section: ความสูง ── */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">ความสูง</p>
        <div className="grid grid-cols-6 gap-2">
          {HEIGHTS.map(({ v, l, sub, barH }) => (
            <button key={v} type="button" onClick={() => onChange({ ...data, height: v })}
              className={`rounded-xl p-2 flex flex-col items-center gap-1.5 border-2 transition-all ${h===v ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              {/* Visual bar */}
              <div className="w-6 flex items-end justify-center" style={{ height: 40 }}>
                <div className={`w-5 rounded-sm ${barH} ${h===v ? 'bg-rose-400' : 'bg-gray-200'}`} />
              </div>
              <span className={`text-[10px] font-bold leading-none ${h===v ? 'text-rose-600' : 'text-gray-500'}`}>{sub}</span>
              <span className={`text-[9px] leading-none ${h===v ? 'text-rose-400' : 'text-gray-400'}`}>{l}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Info rows editor ──────────────────────────────────────────────────────────
function InfoRowsBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items = [...(data.items||[])]; items[i] = { ...items[i], [field]: val }
    onChange({ ...data, items })
  }
  function addItem()     { onChange({ ...data, items: [...(data.items||[]), { icon: '📋', label: '', value: '' }] }) }
  function removeItem(i) { onChange({ ...data, items: (data.items||[]).filter((_,idx) => idx!==i) }) }
  function moveItem(i,d) {
    const items=[...(data.items||[])],t=i+d
    if(t<0||t>=items.length) return
    ;[items[i],items[t]]=[items[t],items[i]]
    onChange({ ...data, items })
  }
  return (
    <div className="space-y-4">
      <Field label="หัวข้อ section" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น ข้อมูลติดต่อ" value={data.title||''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label={`รายการ (${(data.items||[]).length} รายการ)`}>
        <div className="space-y-2">
          {(data.items||[]).map((item,i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex gap-2 items-center">
              <input className={`${smallInp} w-14 text-center text-xl`} placeholder="📍" value={item.icon||''} onChange={e => updateItem(i,'icon',e.target.value)} />
              <input className={`${smallInp} w-28`} placeholder="ชื่อฟิลด์" value={item.label||''} onChange={e => updateItem(i,'label',e.target.value)} />
              <input className={`${smallInp} flex-1`} placeholder="ค่าข้อมูล" value={item.value||''} onChange={e => updateItem(i,'value',e.target.value)} />
              <button type="button" onClick={() => moveItem(i,-1)} disabled={i===0} className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 disabled:opacity-20 text-xs">▲</button>
              <button type="button" onClick={() => moveItem(i,1)} disabled={i===(data.items||[]).length-1} className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 disabled:opacity-20 text-xs">▼</button>
              <button type="button" onClick={() => removeItem(i)} className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 text-sm">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors">
          + เพิ่มรายการ
        </button>
      </Field>
    </div>
  )
}

// ── Stats editor ──────────────────────────────────────────────────────────────
const STAT_KEYS = ['blue','green','indigo','pink','amber','teal','red','purple']
function StatsBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items=[...(data.items||[])]; items[i]={...items[i],[field]:val}
    onChange({ ...data, items })
  }
  function addItem() {
    const color = STAT_KEYS[(data.items||[]).length % STAT_KEYS.length]
    onChange({ ...data, items: [...(data.items||[]), { icon:'📊', label:'', value:'', unit:'', color }] })
  }
  function removeItem(i) { onChange({ ...data, items: (data.items||[]).filter((_,idx) => idx!==i) }) }
  function setTotal(field, val) { onChange({ ...data, total: { ...(data.total||{}), [field]: val } }) }
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Field label="หัวข้อ" hint="ไม่บังคับ">
          <input className={inp} placeholder="สถิติข้อมูล" value={data.title||''} onChange={e => onChange({ ...data, title: e.target.value })} />
        </Field>
        <div className="flex-shrink-0">
          <Field label="คอลัมน์">
            <select className={`${inp} w-28`} value={data.cols||4} onChange={e => onChange({ ...data, cols: parseInt(e.target.value) })}>
              <option value={2}>2 คอล</option><option value={3}>3 คอล</option><option value={4}>4 คอล</option>
            </select>
          </Field>
        </div>
      </div>
      <Field label={`การ์ด (${(data.items||[]).length} ใบ)`}>
        <div className="space-y-2">
          {(data.items||[]).map((item,i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
              <div className="flex gap-2 items-center">
                <input className={`${smallInp} w-14 text-center text-xl`} placeholder="🏘️" value={item.icon||''} onChange={e => updateItem(i,'icon',e.target.value)} />
                <input className={`${smallInp} flex-1`} placeholder="ชื่อ (เช่น หมู่บ้าน)" value={item.label||''} onChange={e => updateItem(i,'label',e.target.value)} />
                <button type="button" onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 text-sm flex-shrink-0">🗑️</button>
              </div>
              <div className="flex gap-2 items-center">
                <input className={`${smallInp} flex-1`} placeholder="ตัวเลข เช่น 5,916" value={item.value||''} onChange={e => updateItem(i,'value',e.target.value)} />
                <input className={`${smallInp} w-24`} placeholder="หน่วย เช่น คน" value={item.unit||''} onChange={e => updateItem(i,'unit',e.target.value)} />
                <ColorDots keys={STAT_KEYS} value={item.color||'blue'} onChange={v => updateItem(i,'color',v)} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors">
          + เพิ่มการ์ด
        </button>
      </Field>
      <Field label="การ์ดยอดรวม" hint="กล่อง gradient สีน้ำเงิน ไม่บังคับ">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
          <input className={inp} placeholder="ชื่อ เช่น ประชากรรวมทั้งหมด" value={data.total?.label||''} onChange={e => setTotal('label', e.target.value)} />
          <div className="flex gap-2">
            <input className={`${smallInp} flex-1`} placeholder="ค่า เช่น 5,916" value={data.total?.value||''} onChange={e => setTotal('value', e.target.value)} />
            <input className={`${smallInp} w-28`} placeholder="หน่วย เช่น คน" value={data.total?.unit||''} onChange={e => setTotal('unit', e.target.value)} />
          </div>
        </div>
      </Field>
    </div>
  )
}

// ── Alert editor ──────────────────────────────────────────────────────────────
const ALERT_VARIANTS = [
  { key:'info',    label:'ℹ️ ข้อมูล',    cls:'bg-blue-50 border-blue-200 text-blue-700' },
  { key:'warning', label:'⚠️ แจ้งเตือน', cls:'bg-amber-50 border-amber-200 text-amber-700' },
  { key:'success', label:'✅ สำเร็จ',    cls:'bg-green-50 border-green-200 text-green-700' },
  { key:'danger',  label:'🚨 สำคัญ',    cls:'bg-red-50 border-red-200 text-red-700' },
]
function AlertBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="ประเภท">
        <div className="grid grid-cols-2 gap-2">
          {ALERT_VARIANTS.map(v => (
            <button key={v.key} type="button" onClick={() => onChange({ ...data, variant: v.key })}
              className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${(data.variant||'info')===v.key ? `${v.cls} border-current` : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="ไอคอนกำหนดเอง" hint="ถ้าว่างจะใช้ไอคอนของประเภท">
        <input className={`${inp} text-xl`} placeholder="เช่น 📢" value={data.icon||''} onChange={e => onChange({ ...data, icon: e.target.value })} />
      </Field>
      <Field label="หัวข้อ" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น หมายเหตุสำคัญ" value={data.title||''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="เนื้อหา">
        <textarea className={`${inp} min-h-[100px] leading-relaxed`} placeholder="รายละเอียด..." value={data.content||''} onChange={e => onChange({ ...data, content: e.target.value })} />
      </Field>
    </div>
  )
}

// ── Timeline editor ───────────────────────────────────────────────────────────
const TIMELINE_KEYS = ['primary','blue','green','amber','red','purple','teal','cyan','indigo','pink']
const TIMELINE_DOT  = {
  primary:'bg-primary', blue:'bg-blue-500', green:'bg-green-500', amber:'bg-amber-500',
  red:'bg-red-500', purple:'bg-purple-500', teal:'bg-teal-500', cyan:'bg-cyan-500',
  indigo:'bg-indigo-500', pink:'bg-pink-500',
}
function TimelineBlockEdit({ data, onChange }) {
  function updateItem(i, field, val) {
    const items=[...(data.items||[])]; items[i]={...items[i],[field]:val}
    onChange({ ...data, items })
  }
  function addItem()     { onChange({ ...data, items: [...(data.items||[]), { icon:'📌', year:'', title:'', desc:'', color:'primary' }] }) }
  function removeItem(i) { onChange({ ...data, items: (data.items||[]).filter((_,idx) => idx!==i) }) }
  function moveItem(i,d) {
    const items=[...(data.items||[])],t=i+d
    if(t<0||t>=items.length) return
    ;[items[i],items[t]]=[items[t],items[i]]
    onChange({ ...data, items })
  }
  return (
    <div className="space-y-4">
      <Field label="หัวข้อ section" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น เส้นทางประวัติศาสตร์" value={data.title||''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label={`เหตุการณ์ (${(data.items||[]).length} รายการ)`}>
        <div className="space-y-3">
          {(data.items||[]).map((item,i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
              <div className="flex gap-2 items-center">
                <input className={`${smallInp} w-14 text-center text-xl`} placeholder="📌" value={item.icon||''} onChange={e => updateItem(i,'icon',e.target.value)} />
                <input className={`${smallInp} flex-1`} placeholder="ปี / ช่วงเวลา เช่น พ.ศ. 2539" value={item.year||''} onChange={e => updateItem(i,'year',e.target.value)} />
                <div className="flex gap-1 flex-wrap">
                  {TIMELINE_KEYS.map(c => (
                    <button key={c} type="button" onClick={() => updateItem(i,'color',c)}
                      className={`w-5 h-5 rounded-full ${TIMELINE_DOT[c]||'bg-gray-400'} transition-all ${item.color===c ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'opacity-50 hover:opacity-90'}`} title={c} />
                  ))}
                </div>
                <button type="button" onClick={() => moveItem(i,-1)} disabled={i===0} className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 disabled:opacity-20 text-xs">▲</button>
                <button type="button" onClick={() => moveItem(i,1)} disabled={i===(data.items||[]).length-1} className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 disabled:opacity-20 text-xs">▼</button>
                <button type="button" onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 text-sm">🗑️</button>
              </div>
              <input className={inp} placeholder="หัวข้อเหตุการณ์" value={item.title||''} onChange={e => updateItem(i,'title',e.target.value)} />
              <textarea className={`${inp} min-h-[60px]`} placeholder="รายละเอียด (ไม่บังคับ)" value={item.desc||''} onChange={e => updateItem(i,'desc',e.target.value)} />
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg transition-colors">
          + เพิ่มเหตุการณ์
        </button>
      </Field>
    </div>
  )
}

function ExcelBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="หัวข้อ" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น ตารางงบประมาณ 2567" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="คำอธิบาย" hint="ไม่บังคับ">
        <input className={inp} placeholder="คำอธิบายสั้น ๆ" value={data.description || ''} onChange={e => onChange({ ...data, description: e.target.value })} />
      </Field>
      <Field label="ไฟล์ Excel (.xlsx / .xls)">
        <ExcelUpload value={data.url} label={data.label} onChange={(url, name) => onChange({ ...data, url, label: name })} />
      </Field>
    </div>
  )
}

function WordBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="หัวข้อ" hint="ไม่บังคับ">
        <input className={inp} placeholder="เช่น หนังสือแจ้งเวียน" value={data.title || ''} onChange={e => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="คำอธิบาย" hint="ไม่บังคับ">
        <input className={inp} placeholder="คำอธิบายสั้น ๆ" value={data.description || ''} onChange={e => onChange({ ...data, description: e.target.value })} />
      </Field>
      <Field label="ไฟล์ Word (.docx / .doc)">
        <WordUpload value={data.url} label={data.label} onChange={(url, name) => onChange({ ...data, url, label: name })} />
      </Field>
    </div>
  )
}

function HtmlBlockEdit({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
        <span className="flex-shrink-0">⚠️</span>
        <span>HTML ดิบ — โค้ดจะแสดงโดยตรงในหน้าเว็บ ตรวจสอบก่อนบันทึก</span>
      </div>
      <Field label="โค้ด HTML" hint="รองรับ HTML, CSS inline">
        <textarea
          className={`${inp} min-h-[220px] font-mono text-xs leading-relaxed`}
          placeholder={'<div style="...">\n  ...\n</div>'}
          value={data.html || ''}
          onChange={e => onChange({ ...data, html: e.target.value })}
          spellCheck={false}
        />
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
    case 'pdf':      return <PdfBlockEdit      data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'banner':   return <BannerBlockEdit   data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'inforows': return <InfoRowsBlockEdit data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'stats':    return <StatsBlockEdit    data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'alert':    return <AlertBlockEdit    data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'timeline': return <TimelineBlockEdit data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'excel':    return <ExcelBlockEdit    data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'word':     return <WordBlockEdit     data={block.data} onChange={d => onChange({ ...block, data: d })} />
    case 'html':     return <HtmlBlockEdit     data={block.data} onChange={d => onChange({ ...block, data: d })} />
    default:         return null
  }
}

// ── Block Editor view ─────────────────────────────────────────────────────────

function DeferredBlockEdit({ initialBlock, onDraftChange }) {
  const [local, setLocal] = useState(initialBlock)
  function handleChange(b) { setLocal(b); onDraftChange(b) }
  return <BlockEdit block={local} onChange={handleChange} />
}

function BlockEditorView({ page, onBack, onPageSaved }) {
  const [blocks, setBlocks]   = useState(page.blocks || [])
  const [saving, setSaving]   = useState(false)
  const [openIdx, setOpenIdx] = useState(null)
  const [err, setErr]         = useState('')
  const [saved, setSaved]     = useState(false)
  const draftRef              = useRef(null)
  const dragBlockRef          = useRef(null)
  const [dragOverBlockIdx, setDragOverBlockIdx] = useState(null)

  function commitDraft() {
    if (draftRef.current !== null && openIdx !== null) {
      const draft = draftRef.current
      setBlocks(prev => prev.map((x, i) => i === openIdx ? draft : x))
      draftRef.current = null
    }
  }

  function switchBlock(newIdx) { commitDraft(); setOpenIdx(newIdx) }

  function getBlocksWithDraft() {
    if (draftRef.current === null || openIdx === null) return blocks
    return blocks.map((x, i) => i === openIdx ? draftRef.current : x)
  }

  function addBlock(type) {
    commitDraft()
    const b = emptyBlock(type)
    b._tempKey = 'tmp-' + Date.now()
    setBlocks(prev => {
      setOpenIdx(prev.length)
      return [...prev, b]
    })
  }

  function updateBlock(i, b) { setBlocks(prev => prev.map((x, idx) => idx === i ? b : x)) }
  function deleteBlock(i)    {
    commitDraft()
    setBlocks(prev => prev.filter((_, idx) => idx !== i))
    if (openIdx === i) setOpenIdx(null)
    else if (openIdx !== null && openIdx > i) setOpenIdx(openIdx - 1)
  }
  function reorderBlocks(fromIdx, toIdx) {
    if (fromIdx === toIdx) return
    const next = [...getBlocksWithDraft()]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    draftRef.current = null
    setBlocks(next)
    if (openIdx === fromIdx) setOpenIdx(toIdx)
    else if (openIdx !== null) {
      if (fromIdx < openIdx && toIdx >= openIdx) setOpenIdx(openIdx - 1)
      else if (fromIdx > openIdx && toIdx <= openIdx) setOpenIdx(openIdx + 1)
    }
  }

  async function save() {
    setSaving(true); setErr(''); setSaved(false)
    try {
      // eslint-disable-next-line no-unused-vars
      const cleanBlocks = getBlocksWithDraft().map(({ _tempKey, ...rest }) => rest)
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
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm">
            {saving ? <><span className="animate-spin inline-block">⏳</span> กำลังบันทึก...</> : '💾 บันทึก'}
          </button>
        </div>
      </div>

      {/* Add block panel — icon-only with tooltip */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-5">
        <p className="text-xs font-semibold text-gray-400 mb-2.5">+ เพิ่ม Block</p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map(bt => (
            <div key={bt.type} className="relative group">
              <button onClick={() => addBlock(bt.type)}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl transition-[transform,border-color,background-color] hover:scale-110 active:scale-95 ${bt.color}`}>
                {bt.icon}
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-[opacity,transform] duration-150 scale-95 group-hover:scale-100">
                <div className="bg-gray-900 text-white rounded-xl px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="text-xs font-semibold">{bt.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug max-w-[160px] whitespace-normal">{bt.desc}</p>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block icon strip */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-4">
        <p className="text-xs font-semibold text-gray-400 mb-2.5">Block ในหน้านี้ ({blocks.length})</p>
        <div className="flex flex-wrap gap-2 min-h-[2.75rem] items-start">
          {blocks.length === 0 && (
            <p className="text-xs text-gray-300 py-1.5">ยังไม่มี block — กดไอคอนด้านบนเพื่อเพิ่ม</p>
          )}
          {blocks.map((block, i) => {
            const meta = BLOCK_META[block.type] || { icon: '📦', label: block.type }
            const bt   = BLOCK_TYPES.find(b => b.type === block.type)
            const isSel = openIdx === i
            const isOver = dragOverBlockIdx === i
            return (
              <div key={block._id || block._tempKey || i}
                className={`relative group transition-transform ${isOver ? 'scale-110 ring-2 ring-blue-400 ring-offset-1 rounded-xl' : ''}`}
                draggable
                onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; dragBlockRef.current = i }}
                onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverBlockIdx(i) }}
                onDragLeave={() => setDragOverBlockIdx(null)}
                onDrop={e => { e.preventDefault(); setDragOverBlockIdx(null); reorderBlocks(dragBlockRef.current, i) }}
                onDragEnd={() => { dragBlockRef.current = null; setDragOverBlockIdx(null) }}>
                <button onClick={() => switchBlock(isSel ? null : i)}
                  className={`w-11 h-11 rounded-xl border-2 flex flex-col items-center justify-center transition-[transform,border-color,background-color] cursor-grab active:cursor-grabbing ${bt?.color || 'bg-gray-50 border-gray-200'} ${isSel ? 'ring-2 ring-offset-1 ring-blue-400 scale-110 shadow-md' : 'hover:scale-105'}`}>
                  <span className="text-lg leading-none">{meta.icon}</span>
                  <span className="text-[9px] font-medium text-gray-500 leading-none mt-0.5">{i + 1}</span>
                </button>
                {/* Delete × on hover */}
                <button onClick={() => deleteBlock(i)}
                  className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 w-[18px] h-[18px] bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-10">
                  ×
                </button>
                {/* Name tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-100">
                  <div className="bg-gray-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-medium whitespace-nowrap shadow-xl">{meta.label}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit panel — single block at a time */}
      {openIdx !== null && openIdx < blocks.length && (() => {
        const block = blocks[openIdx]
        const meta  = BLOCK_META[block.type] || { icon: '📦', label: block.type }
        return (
          <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${ACCENT_BORDER[block.type] || 'border-l-gray-300'} border border-gray-100 overflow-hidden mb-8`}>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-base flex-shrink-0">{meta.icon}</span>
              <span className="text-sm font-semibold text-gray-700 flex-1">{meta.label}</span>
              <span className="text-[11px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">#{openIdx + 1}</span>
              <button onClick={() => switchBlock(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors text-sm">✕</button>
            </div>
            <div className="p-5">
              <DeferredBlockEdit key={openIdx} initialBlock={block} onDraftChange={b => { draftRef.current = b }} />
            </div>
          </div>
        )
      })()}

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
            {/* Fake navbar — hidden on mobile */}
            <div className="bg-primary h-10 hidden sm:flex items-center px-4 gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20" />
              <div className="h-2.5 w-36 rounded-full bg-white/30" />
              <div className="flex-1" />
              <div className="h-2.5 w-16 rounded-full bg-white/20" />
            </div>
            {/* Body */}
            <div className="bg-[#f0f2f5] flex gap-3 p-3" style={{ minHeight: 200 }}>
              {/* Skeleton sidebar — hidden on mobile */}
              <div className="flex-shrink-0 space-y-2 hidden sm:block" style={{ width: 150 }}>
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
    showInNavbar: editPage.showInNavbar || false,
  } : { title: '', icon: '📄', parentSlug: '', isActive: true, showInNavbar: false })
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
            <div className="flex items-center gap-3">
              <EmojiPicker value={form.icon} onChange={v => set('icon', v)} accentColor="blue" />
              <input className={`${inp} flex-1`} placeholder="หรือพิมพ์ emoji / ข้อความ" value={form.icon} onChange={e => set('icon', e.target.value)} />
            </div>
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
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">ตำแหน่งแสดงผล</p>
            <label className="flex items-center gap-3 cursor-pointer bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-800">แสดงในเมนู</p>
                <p className="text-xs text-blue-500">ถ้าไม่เลือก จะซ่อนทั้งหมด</p>
              </div>
            </label>
            {!form.parentSlug && (
              <label className="flex items-center gap-3 cursor-pointer bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                <input type="checkbox" checked={form.showInNavbar} onChange={e => set('showInNavbar', e.target.checked)} className="w-4 h-4 accent-purple-500" />
                <div>
                  <p className="text-sm font-medium text-purple-800">แสดงใน Navbar (แถบด้านบน)</p>
                  <p className="text-xs text-purple-500">ถ้าเลือก จะย้ายจาก Sidebar ไปที่ Navbar</p>
                </div>
              </label>
            )}
          </div>
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
  const [expandedSlugs, setExpandedSlugs] = useState(new Set())
  const dragRef                 = useRef({ id: null, group: null })
  const [dragOverId, setDragOverId] = useState(null)

  const topLevel        = pages.filter(p => !p.parentSlug).sort((a, b) => a.order - b.order)
  const navbarPages     = topLevel.filter(p => p.showInNavbar)
  const sidebarPages    = topLevel.filter(p => !p.showInNavbar)
  function getChildren(slug) {
    return pages.filter(p => p.parentSlug === slug).sort((a, b) => a.order - b.order)
  }

  function toggleExpand(slug) {
    setExpandedSlugs(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  async function toggleActive(page) {
    await updatePage(page._id, { isActive: !page.isActive }); onReload()
  }

  async function moveToNavbar(page) {
    try { await updatePage(page._id, { showInNavbar: true, parentSlug: '' }); onReload() }
    catch (e) { alert('เกิดข้อผิดพลาด: ' + (e?.response?.data?.error || e.message)) }
  }

  async function moveToSidebar(page) {
    try { await updatePage(page._id, { showInNavbar: false, parentSlug: '' }); onReload() }
    catch (e) { alert('เกิดข้อผิดพลาด: ' + (e?.response?.data?.error || e.message)) }
  }

  async function reorderDrop(draggedId, targetPage, group) {
    if (draggedId === targetPage._id) return
    const siblings = group === 'navbar'  ? navbarPages
      : group === 'sidebar' ? sidebarPages
      : pages.filter(p => p.parentSlug === group.replace('child:', '')).sort((a, b) => a.order - b.order)
    const fromIdx = siblings.findIndex(p => p._id === draggedId)
    const toIdx   = siblings.findIndex(p => p._id === targetPage._id)
    if (fromIdx === -1 || toIdx === -1) return
    setSaving(true)
    try {
      const reordered = [...siblings]
      const [moved] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, moved)
      await Promise.all(reordered.map((p, i) => updatePage(p._id, { order: i * 10 })))
      onReload()
    } finally { setSaving(false) }
  }

  async function remove(page) {
    if (!window.confirm(`ลบ "${page.title}"?\nเนื้อหาทั้งหมดจะหายไปถาวร`)) return
    await deletePage(page._id); onReload()
  }

  function renderRow(page, siblings, idx, group) {
    const children    = getChildren(page.slug)
    const isChild     = !!page.parentSlug
    const hasChildren = !isChild && children.length > 0
    const isExpanded  = expandedSlugs.has(page.slug)
    const publicPath  = page.isBuiltin ? page.path : `/page/${page.slug}`
    const isOver      = dragOverId === page._id

    return (
      <div key={page._id}>
        <div
          draggable={!saving}
          onDragStart={() => { dragRef.current = { id: page._id, group } }}
          onDragOver={e => { e.preventDefault(); if (dragRef.current.group === group) setDragOverId(page._id) }}
          onDragLeave={() => setDragOverId(null)}
          onDrop={e => { e.preventDefault(); setDragOverId(null); if (dragRef.current.group === group) reorderDrop(dragRef.current.id, page, group) }}
          onDragEnd={() => { dragRef.current = { id: null, group: null }; setDragOverId(null) }}
          className={`flex items-center gap-2 px-3 py-1.5 border-b transition-colors select-none ${isChild ? 'pl-8 bg-gray-50/40' : ''} ${isOver ? 'bg-blue-50 border-l-2 border-l-blue-400 border-b-gray-50' : 'border-b-gray-50 hover:bg-gray-50/60'}`}>
          <span className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 text-base leading-none" title="ลากเพื่อเรียงลำดับ">⠿</span>
          {isChild && <span className="text-gray-300">└</span>}
          {hasChildren ? (
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); toggleExpand(page.slug) }}
              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all flex-shrink-0 text-[11px] font-bold"
              title={isExpanded ? 'ซ่อนเมนูย่อย' : 'แสดงเมนูย่อย'}>
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : !isChild && (
            <span className="w-6 flex-shrink-0" />
          )}
          <span className="text-lg w-7 text-center flex-shrink-0">{page.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-gray-800 truncate">{page.title}</p>
              {hasChildren && !isExpanded && (
                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                  {children.length}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-mono truncate">{publicPath}</p>
          </div>
          {page.isBuiltin && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">ระบบ</span>
          )}
          {!isChild && (
            group === 'navbar'
              ? <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); moveToSidebar(page) }}
                  title="ย้ายไป Sidebar"
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap">
                  → Sidebar
                </button>
              : <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); moveToNavbar(page) }}
                  title="ย้ายไป Navbar"
                  className="text-[11px] font-medium text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap">
                  → Navbar
                </button>
          )}
          <button onClick={() => toggleActive(page)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 transition-colors ${page.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
            {page.isActive ? '● แสดง' : '○ ซ่อน'}
          </button>
          <button onClick={() => { setEditPage(page); setShowForm(true) }}
            className="text-xs font-medium text-secondary hover:text-primary bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
            แก้ไข
          </button>
          {!page.isBuiltin && (
            <>
              {hasChildren ? (
                <span
                  title="เมนูนี้มีเมนูย่อย — แก้ไขเนื้อหาที่หน้าเมนูย่อยแทน"
                  className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg flex-shrink-0 cursor-not-allowed select-none">
                  เนื้อหา
                </span>
              ) : (
                <button onClick={() => onEditContent(page)}
                  className="text-xs font-medium text-white bg-primary hover:opacity-90 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
                  เนื้อหา
                </button>
              )}
              <button onClick={() => remove(page)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all text-sm flex-shrink-0">
                🗑️
              </button>
            </>
          )}
        </div>
        {isExpanded && children.map((c, ci) => renderRow(c, children, ci, `child:${page.slug}`))}
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

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">กำลังโหลด...</div>
      ) : (
        <>
          {/* Navbar section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">Navbar (แถบด้านบน)</span>
              <span className="text-xs text-gray-400">{navbarPages.length} รายการ</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
              {navbarPages.length === 0 ? (
                <div className="p-6 text-center text-gray-300 text-sm">ไม่มีเมนูใน Navbar</div>
              ) : (
                navbarPages.map((p, i) => renderRow(p, navbarPages, i, 'navbar'))
              )}
            </div>
          </div>

          {/* Sidebar section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">Sidebar (แถบด้านข้าง)</span>
              <span className="text-xs text-gray-400">{sidebarPages.length} รายการ</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              {sidebarPages.length === 0 ? (
                <div className="p-6 text-center text-gray-300 text-sm">ไม่มีเมนูใน Sidebar</div>
              ) : (
                sidebarPages.map((p, i) => renderRow(p, sidebarPages, i, 'sidebar'))
              )}
            </div>
          </div>
        </>
      )}

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
