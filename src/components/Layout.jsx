import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MessengerButton from './MessengerButton'
import TopUtilityBar from './TopUtilityBar'
import CookieConsent from './CookieConsent'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const fixedRef = useRef(null)
  const scrolledRef = useRef(false)
  // Reserves space in normal document flow for the fixed TopUtilityBar+Navbar block below (fixed
  // elements don't reserve their own space the way the old `position: sticky` header did) — see
  // the effect below for why it's frozen at the *expanded* measurement rather than tracking the
  // live (possibly collapsed) height.
  const [spacerHeight, setSpacerHeight] = useState(0)

  useEffect(() => {
    // A single threshold here causes a feedback loop: collapsing the header shrinks its height by
    // 38-98px, which shifts where content sits relative to a fixed scroll position — so right
    // around scrollY===40, collapsing could pull the "same" scroll position back under 40,
    // expanding again, which pushes it back over 40, etc. A dead zone (collapse past 64px, only
    // re-expand once back under 24px) means scrollY has to move a real, deliberate amount before
    // it can flip again — a small layout shift alone can't cross that gap and re-trigger itself.
    function onScroll() {
      setScrolled(prev => {
        const next = (window.scrollY > 64) ? true : (window.scrollY < 24) ? false : prev
        scrolledRef.current = next
        return next
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = fixedRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      // Only commit a measurement taken while expanded. This block was previously `position:
      // sticky` with its own height animating while stuck — Chrome (at least) recomputes/re-sticks
      // a sticky element's offset whenever its box resizes, and doing that mid-scroll snapped
      // scrollY back to 0, which then re-triggered the collapse/expand hysteresis above from the
      // other direction — the residual "shake" a wider dead zone alone couldn't close, since it
      // was a hard reset to 0, not a proportional nudge. `position: fixed` here removes that
      // failure mode entirely (fixed elements don't participate in "stuck" recomputation), but it
      // also means this block no longer reserves its own space in the flow, hence this spacer. If
      // the spacer tracked the *live* (collapsing) height instead of freezing at expanded, it
      // would itself be a plain block element resizing above wherever the user has already
      // scrolled to — inviting the exact same class of anchor-driven jump right back in.
      if (!scrolledRef.current) setSpacerHeight(entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedRef} className="fixed top-0 left-0 right-0 z-50 [overflow-anchor:none]">
        <TopUtilityBar collapsed={scrolled} />
        <Navbar onMenuClick={() => setSidebarOpen(v => !v)} scrolled={scrolled} />
      </div>
      <div style={{ height: spacerHeight }} />

      {/* Mobile sidebar overlay — always mounted, toggled with CSS for smooth animation */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div
          className={`absolute left-0 top-0 bottom-0 w-full bg-white overflow-y-auto z-50 shadow-xl transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-3 py-4 flex gap-4 flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MessengerButton />
      <CookieConsent />
    </div>
  )
}
