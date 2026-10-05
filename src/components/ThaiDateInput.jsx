import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Native <input type="date"> always shows the browser's own calendar UI, which has no way to
// display Buddhist-era years — so a custom dropdown calendar is the only way to show พ.ศ.
// Stores/returns a plain ISO "YYYY-MM-DD" string, same as the native input, so callers don't change.
//
// The panel is portaled to <body> with fixed positioning (computed from the trigger button's
// own rect) rather than an absolutely positioned child — callers often sit inside a scrollable
// modal (overflow-y-auto), which would otherwise clip the panel instead of letting it float
// above the rest of the page.
const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
const THAI_DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
function pad2(n) { return String(n).padStart(2, '0') }
function isoFromParts(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}` }
function parseIsoLocal(iso) { return new Date(`${iso}T00:00:00`) }

export default function ThaiDateInput({ value, onChange, className = 'input' }) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState(null)
  const selected = value ? parseIsoLocal(value) : null
  const [viewY, setViewY] = useState((selected || new Date()).getFullYear())
  const [viewM, setViewM] = useState((selected || new Date()).getMonth())
  const triggerRef = useRef(null)
  const panelRef = useRef(null) // the portaled dropdown lives outside triggerRef in the DOM tree

  function reposition() {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect())
  }

  useEffect(() => {
    if (!open) return
    if (selected) { setViewY(selected.getFullYear()); setViewM(selected.getMonth()) }
    reposition()
    function onClickOutside(e) {
      if (triggerRef.current?.contains(e.target)) return
      if (panelRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function changeMonth(delta) {
    let m = viewM + delta, y = viewY
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    setViewM(m); setViewY(y)
  }

  function pickDay(d) {
    onChange(isoFromParts(viewY, viewM, d))
    setOpen(false)
  }

  function pickToday() {
    const t = new Date()
    onChange(isoFromParts(t.getFullYear(), t.getMonth(), t.getDate()))
    setOpen(false)
  }

  const startWeekday = new Date(viewY, viewM, 1).getDay()
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate()
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const today = new Date()
  const displayText = selected ? `${pad2(selected.getDate())}/${pad2(selected.getMonth() + 1)}/${selected.getFullYear() + 543}` : ''

  return (
    <div>
      <button type="button" ref={triggerRef} onClick={() => setOpen(v => !v)}
        className={`${className} text-left flex items-center justify-between gap-2`}>
        <span className={displayText ? 'text-gray-800' : 'text-gray-400'}>{displayText || 'วว/ดด/ปปปป'}</span>
        <span className="text-gray-400 text-sm flex-shrink-0">📅</span>
      </button>
      {open && rect && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 288) }}
          className="z-[999] bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between mb-2 gap-1">
            <button type="button" onClick={() => changeMonth(-12)} className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 text-xs flex-shrink-0">«</button>
            <button type="button" onClick={() => changeMonth(-1)} className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 flex-shrink-0">‹</button>
            <span className="flex-1 text-center text-sm font-semibold text-gray-700">{THAI_MONTHS[viewM]} {viewY + 543}</span>
            <button type="button" onClick={() => changeMonth(1)} className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 flex-shrink-0">›</button>
            <button type="button" onClick={() => changeMonth(12)} className="w-7 h-7 rounded hover:bg-gray-100 text-gray-500 text-xs flex-shrink-0">»</button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {THAI_DOW.map(d => <div key={d} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />
              const isSelected = selected && selected.getFullYear() === viewY && selected.getMonth() === viewM && selected.getDate() === d
              const isToday = today.getFullYear() === viewY && today.getMonth() === viewM && today.getDate() === d
              return (
                <button key={i} type="button" onClick={() => pickDay(d)}
                  className={`h-7 rounded text-xs transition-colors ${
                    isSelected ? 'bg-secondary text-white font-semibold'
                    : isToday ? 'bg-pink-50 text-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  {d}
                </button>
              )
            })}
          </div>
          <button type="button" onClick={pickToday}
            className="w-full mt-2 pt-2 border-t border-gray-100 text-xs font-medium text-secondary hover:text-primary transition-colors">
            วันนี้
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}
