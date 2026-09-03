import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSettings } from '../services/api'

// `scrolled` is owned by Layout (shared with TopUtilityBar, which collapses in sync) — see
// Layout.jsx for why: this header used to track scroll and position itself independently, but
// that combination (position: sticky + animating this element's own height while stuck) is what
// caused a browser scroll-position reset bug, fixed by switching to a Layout-level `fixed` wrapper
// instead. This component just reacts to the prop now.
//
// The desktop secondary nav (page links) used to live here too, but it's now its own component
// (DesktopNav) rendered separately by Layout — it needs to stay fixed under the header at all
// times, not hide along with this main row on scroll-down, and nesting a `position: fixed`
// element inside this one wouldn't work: Layout's hide/show wrapper always carries a `transform`
// (even at its resting translateY(0)), which makes it the containing block for any `fixed`
// descendant, trapping DesktopNav inside it instead of positioning it against the viewport.
export default function Navbar({ onMenuClick, scrolled }) {
  const [logoImage, setLogoImage]           = useState('')
  const [headerBgImage, setHeaderBgImage]   = useState('')

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage) setLogoImage(r.data.logoImage)
      if (r?.data?.headerBgImage) setHeaderBgImage(r.data.headerBgImage)
    }).catch(() => {})
  }, [])

  return (
    <header>

      {/* ── Main header row ─────────────────────────────────────────── */}
      <div className={`bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-md flex items-center transition-[min-height] duration-300 ease-in-out ${
          scrolled ? 'min-h-[72px]' : (headerBgImage ? 'min-h-[110px] lg:min-h-[170px]' : '')
        }`}
        style={headerBgImage ? {
          backgroundImage: `linear-gradient(to right, rgba(190,24,93,0.55), rgba(236,72,153,0.50), rgba(249,168,212,0.40)), url(${headerBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: scrolled ? 'center 37%' : 'center 32%',
          backgroundRepeat: 'no-repeat',
          // Must list every animated property here explicitly: this inline `transition`
          // shorthand overrides (not merges with) the `transition-[min-height]` utility
          // class above, since inline styles always win over class-based CSS. Previously
          // this only listed `background-position`, which silently killed the min-height
          // transition whenever a header background image was set — the header would
          // snap to its new height instantly while the logo/title kept animating smoothly,
          // producing a jarring, out-of-sync "jank" on scroll.
          transition: 'min-height 300ms ease-in-out, background-position 300ms ease-in-out',
        } : undefined}>
        <div className={`max-w-[1200px] mx-auto px-3 w-full flex items-center justify-between gap-3 transition-[padding] duration-300 ease-in-out ${scrolled ? 'py-1.5' : 'py-2 lg:py-3'}`}>

          {/* Logo */}
          <Link to="/" className={`flex items-center min-w-0 flex-1 transition-[gap,margin-left] duration-300 ease-in-out ${scrolled ? 'gap-0 ml-0' : 'gap-3 lg:gap-4 lg:ml-10'}`}>
            <div className={`overflow-hidden flex-shrink-0 flex items-center justify-center aspect-square transition-[width,opacity] duration-300 ease-in-out ${scrolled ? 'w-0 opacity-0' : 'w-14 lg:w-36 opacity-100'}`}>
              {logoImage ? (
                <img src={logoImage} alt="logo"
                  className="w-12 h-12 lg:w-32 lg:h-32 rounded-full object-cover ring-2 lg:ring-4 ring-white/40 shadow flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 lg:w-32 lg:h-32 rounded-full bg-white/20 ring-2 lg:ring-4 ring-white/40 flex items-center justify-center text-white font-bold text-[11px] lg:text-lg text-center leading-tight p-1 backdrop-blur-sm flex-shrink-0">
                  อบต.<br />แม่ใส
                </div>
              )}
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Hamburger — mobile only, right side */}
            <button
              className="lg:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors text-xl"
              onClick={onMenuClick}
              aria-label="เปิดเมนู"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
