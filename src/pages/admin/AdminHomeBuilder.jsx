import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeData } from '../../hooks/useHomeData'
import { SECTION_COMPONENTS, buildSectionProps } from '../../components/home/sections'
import { DEFAULT_HOME_ORDER, HOME_SECTION_META, HOME_SECTION_EDIT_PATH, normalizeHomeOrder, normalizeHomeHidden } from '../../config/homeSections'
import { updateSetting } from '../../services/api'

// Sections that hide themselves on the public site when they have no data —
// shown here too (with a note) so admin still sees/can reorder the empty slot.
const EMPTY_CHECK = {
  announce: d => d.annItems.length === 0,
  notices:  d => d.notices.length === 0,
  travel:   d => d.travel.length === 0,
  products: d => d.products.length === 0,
  videos:   d => d.videos.length === 0,
}

// A visual, real-time editor for the homepage: it renders the exact same
// section components the public HomePage does (see components/home/sections.jsx),
// with a small toolbar over each one to drag-reorder, jump to that section's
// content manager, or hide/show it. Dragging or hiding updates the render
// immediately — what you see here IS the page, not a mockup of it — and a
// Save button persists the order/hidden list to the 'homeSectionOrder' /
// 'homeSectionHidden' settings HomePage.jsx reads.
export default function AdminHomeBuilder() {
  const data = useHomeData()
  const navigate = useNavigate()
  const [order, setOrder]   = useState(DEFAULT_HOME_ORDER)
  const [hidden, setHidden] = useState([])
  const [ready, setReady]   = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const dragRef = useRef(null)
  const [dragOverKey, setDragOverKey] = useState(null)

  useEffect(() => {
    if (!data.settings || ready) return
    setOrder(normalizeHomeOrder(data.settings.homeSectionOrder))
    setHidden(normalizeHomeHidden(data.settings.homeSectionHidden))
    setReady(true)
  }, [data.settings, ready])

  function reorder(fromKey, toKey) {
    if (fromKey === toKey) return
    setOrder(prev => {
      const next = [...prev]
      const fromIdx = next.indexOf(fromKey)
      const toIdx   = next.indexOf(toKey)
      if (fromIdx === -1 || toIdx === -1) return prev
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      return next
    })
  }

  function toggleHidden(key) {
    setHidden(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  async function save() {
    setSaving(true)
    try {
      await Promise.all([
        updateSetting('homeSectionOrder', order),
        updateSetting('homeSectionHidden', hidden),
      ])
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally { setSaving(false) }
  }

  const sectionProps = buildSectionProps({ ...data, landingPhoto: data.settings?.landingPhoto || '' })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 mb-6 flex items-center gap-4 sticky top-0 z-30">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-800">🏠 จัดหน้าแรก</h1>
          <p className="text-xs text-gray-400 mt-1">ลาก ⠿ เพื่อจัดเรียง · กด "แก้ไข" เพื่อไปจัดการเนื้อหาส่วนนั้น · กด "ซ่อน" เพื่อไม่แสดงบนหน้าเว็บ — เห็นผลจริงทันทีด้านล่าง</p>
        </div>
        <button onClick={save} disabled={saving || !ready}
          className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0 shadow-sm ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:opacity-90'} disabled:opacity-50`}>
          {saving ? '⏳ กำลังบันทึก...' : saved ? '✓ บันทึกแล้ว' : '💾 บันทึก'}
        </button>
      </div>

      {!ready ? (
        <div className="text-center text-gray-400 text-sm py-20 animate-pulse">กำลังโหลด...</div>
      ) : (
        <div className="space-y-3">
          {order.map(key => {
            const Comp = SECTION_COMPONENTS[key]
            const meta = HOME_SECTION_META[key] || { icon: '📦', label: key }
            if (!Comp) return null
            const isHidden = hidden.includes(key)
            const isOver   = dragOverKey === key
            const isEmpty  = EMPTY_CHECK[key]?.(data)
            return (
              <div key={key}
                onDragOver={e => { e.preventDefault(); setDragOverKey(key) }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={e => { e.preventDefault(); setDragOverKey(null); reorder(dragRef.current, key) }}
                className={`rounded-2xl border-2 bg-white overflow-hidden transition-colors ${isOver ? 'border-primary/50' : 'border-transparent'}`}>
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <span
                    draggable
                    onDragStart={() => { dragRef.current = key }}
                    onDragEnd={() => { dragRef.current = null; setDragOverKey(null) }}
                    className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing text-base leading-none px-1 flex-shrink-0" title="ลากเพื่อจัดเรียง">⠿</span>
                  <span className="text-base flex-shrink-0">{meta.icon}</span>
                  <span className="text-sm font-semibold text-gray-700 flex-1 truncate">{meta.label}</span>
                  {isHidden && <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">ซ่อนอยู่</span>}
                  <button onClick={() => navigate(HOME_SECTION_EDIT_PATH[key] || '/admin')}
                    className="text-xs font-medium text-secondary hover:text-primary bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
                    แก้ไข
                  </button>
                  <button onClick={() => toggleHidden(key)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 border ${isHidden ? 'text-green-700 bg-green-50 hover:bg-green-100 border-green-200' : 'text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-red-50 border-transparent hover:border-red-200'}`}>
                    {isHidden ? '👁️ แสดง' : '🚫 ซ่อน'}
                  </button>
                </div>
                {/* Body — the actual live section, same component the public site renders */}
                <div className={`px-4 pb-4 transition-opacity ${isHidden ? 'opacity-35 pointer-events-none' : ''}`}>
                  {isEmpty && (
                    <p className="text-xs text-gray-300 pt-3 pb-1">ยังไม่มีข้อมูลในส่วนนี้ — จะไม่แสดงบนหน้าเว็บจนกว่าจะมีข้อมูล</p>
                  )}
                  <Comp {...sectionProps[key]} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
