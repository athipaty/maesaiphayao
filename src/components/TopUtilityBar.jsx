import { useState, useEffect } from 'react'

const FONT_SIZES = [16, 18, 20] // px, applied to <html>
const STORAGE_KEY = 'abt_font_scale'

// `collapsed` comes from Layout (the same hysteresis-driven scroll state Navbar collapses on) so
// this bar disappears in sync with the header shrinking, instead of relying on normal-flow
// scroll-away behavior — see Layout.jsx for why plain scroll-away no longer works now that both
// are inside one `fixed` wrapper.
export default function TopUtilityBar({ collapsed }) {
  const [scaleIdx, setScaleIdx] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY))
    return Number.isInteger(saved) && saved >= 0 && saved < FONT_SIZES.length ? saved : 0
  })

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZES[scaleIdx]}px`
    localStorage.setItem(STORAGE_KEY, String(scaleIdx))
  }, [scaleIdx])

  const today = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      className={`hidden sm:block bg-gray-800 text-white/80 text-[11px] overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
        collapsed ? 'max-h-0 opacity-0' : 'max-h-8 opacity-100'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-3 py-1 flex items-center justify-between gap-3">
        <span className="truncate">{today}</span>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1" role="group" aria-label="ปรับขนาดตัวอักษร">
            <span className="text-white/50 mr-0.5">ขนาดอักษร</span>
            {FONT_SIZES.map((_, i) => (
              <button key={i} onClick={() => setScaleIdx(i)}
                aria-label={`ขนาดตัวอักษร ${i === 0 ? 'ปกติ' : i === 1 ? 'ใหญ่' : 'ใหญ่มาก'}`}
                className={`w-5 h-5 flex items-center justify-center rounded transition-colors leading-none ${
                  scaleIdx === i ? 'bg-white/25 text-white font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                style={{ fontSize: 9 + i * 2 }}>
                ก
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
