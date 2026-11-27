import { useEffect, useRef, useState } from 'react'

// Live posts from the page, through Facebook's own Page Plugin (its SDK draws the timeline): new posts show the moment
// they are posted, with no token and no page-admin rights needed. Browsers with tracker blockers (Brave Shields,
// uBlock, ...) block Facebook's script, which is why the site once dropped the plugin: now, when the script is
// blocked or has not loaded within 8 s, the card the admin fills in by hand (ตั้งค่าเว็บไซต์ → โพสต์ล่าสุดจาก Facebook)
// shows instead, so nobody ever sees an empty box. That card also shows while the plugin loads.
const SDK = 'https://connect.facebook.net/th_TH/sdk.js'
const WAIT_MS = 8000

let sdkPromise = null
function loadSdk() {
  if (window.FB) return Promise.resolve(window.FB)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), WAIT_MS)
    window.fbAsyncInit = () => {
      clearTimeout(timer)
      window.FB.init({ xfbml: false, version: 'v19.0' })
      resolve(window.FB)
    }
    const s = document.createElement('script')
    s.async = true
    s.defer = true
    s.crossOrigin = 'anonymous'
    s.src = SDK
    s.onerror = () => { clearTimeout(timer); reject(new Error('blocked')) }
    document.body.appendChild(s)
  }).catch((err) => { sdkPromise = null; throw err })
  return sdkPromise
}

export default function FacebookLive({ page, fallback, height = 640 }) {
  const box = useRef(null)
  const [state, setState] = useState('loading') // loading | live | blocked

  useEffect(() => {
    let alive = true
    loadSdk().then(() => alive && setState('live')).catch(() => alive && setState('blocked'))
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (state !== 'live' || !box.current || !window.FB) return
    // the plugin takes its width once, when drawn (180–500 px): give it the card's full width
    const plug = box.current.querySelector('.fb-page')
    if (plug) plug.setAttribute('data-width', String(Math.max(180, Math.min(500, Math.floor(box.current.clientWidth)))))
    window.FB.XFBML.parse(box.current)
    // the script loaded but the plugin never drew its frame (blocked further on): back to the card
    const t = setTimeout(() => { if (box.current && !box.current.querySelector('iframe')) setState('blocked') }, WAIT_MS)
    return () => clearTimeout(t)
  }, [state])

  if (state !== 'live') return fallback
  return (
    <div ref={box} className="card p-0 overflow-hidden w-full lg:w-[500px] lg:flex-shrink-0 bg-white">
      <div className="fb-page w-full" data-href={page} data-tabs="timeline" data-width="500" data-height={height}
        data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false">
        <blockquote cite={page} className="fb-xfbml-parse-ignore"><a href={page}>อบต.แม่ใส</a></blockquote>
      </div>
    </div>
  )
}
