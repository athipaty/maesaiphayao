import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Google-style red drop pin ──────────────────────────────────────────────────
const PIN_ICON = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10.647 14.25 26.51 15.28 27.65a1 1 0 0 0 1.44 0C17.75 42.51 32 26.647 32 16 32 7.163 24.837 0 16 0z" fill="#EA4335"/>
    <circle cx="16" cy="16" r="7" fill="white"/>
  </svg>`,
  className: '',
  iconSize:   [32, 44],
  iconAnchor: [16, 44],
})

const TILES = {
  map: {
    url:        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attr:       '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom:    19,
    subdomains: 'abcd',
  },
  satellite: {
    // Google Maps satellite — full zoom coverage worldwide including Thailand
    url:        'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attr:       '&copy; Google',
    maxZoom:    21,
    subdomains: ['0', '1', '2', '3'],
  },
}

const DEFAULT_CENTER = [19.1322, 99.8763] // อบต.แม่ใส

// ── Raw-Leaflet map component — avoids all react-leaflet context/StrictMode bugs ──
function RawMap({ pos, layer, onPick }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const markerRef    = useRef(null)
  const tileRef      = useRef(null)

  // Init map once on mount
  useEffect(() => {
    if (!containerRef.current) return
    const map = L.map(containerRef.current, { zoomControl: true })
      .setView(pos || DEFAULT_CENTER, pos ? 17 : 13)
    mapRef.current = map

    const t0 = TILES[layer]
    tileRef.current = L.tileLayer(t0.url, {
      attribution: t0.attr, maxZoom: t0.maxZoom, subdomains: t0.subdomains,
    }).addTo(map)

    if (pos) {
      markerRef.current = L.marker(pos, { icon: PIN_ICON }).addTo(map)
    }

    map.on('click', e => onPick(e.latlng))

    // Leaflet needs a size hint after the DOM settles inside a portal
    setTimeout(() => map.invalidateSize(), 50)

    return () => { map.remove(); mapRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally empty — raw Leaflet manages its own lifecycle

  // Sync marker + fly when pos changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!pos) {
      if (markerRef.current) { map.removeLayer(markerRef.current); markerRef.current = null }
      return
    }
    if (markerRef.current) {
      markerRef.current.setLatLng(pos)
    } else {
      markerRef.current = L.marker(pos, { icon: PIN_ICON }).addTo(map)
    }
    map.flyTo(pos, 17, { animate: true, duration: 0.8 })
  }, [pos])

  // Swap tile layer when layer changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (tileRef.current) { map.removeLayer(tileRef.current) }
    const t = TILES[layer]
    map.setMaxZoom(t.maxZoom)
    tileRef.current = L.tileLayer(t.url, {
      attribution: t.attr, maxZoom: t.maxZoom, subdomains: t.subdomains,
    }).addTo(map)
  }, [layer])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LocationPicker({ value, onChange }) {
  const [pos, setPos]         = useState(value?.lat ? [value.lat, value.lng] : null)
  const [search, setSearch]   = useState('')
  const [searching, setSearching] = useState(false)
  const [locating, setLocating]   = useState(false)
  const [open, setOpen]       = useState(false)
  const [layer, setLayer]     = useState('map')

  async function reverseGeocode(lat, lng) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`
      )
      const d = await r.json()
      onChange({ lat, lng, address: d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
    } catch {
      onChange({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
    }
  }

  function handlePick({ lat, lng }) {
    setPos([lat, lng])
    reverseGeocode(lat, lng)
  }

  function handleGPS() {
    if (!navigator.geolocation) { alert('เบราว์เซอร์นี้ไม่รองรับ GPS'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setPos([lat, lng]); reverseGeocode(lat, lng); setLocating(false)
      },
      () => { alert('ไม่สามารถระบุตำแหน่งได้ กรุณาอนุญาตการเข้าถึง GPS'); setLocating(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleSearch(e) {
    e?.preventDefault?.()
    if (!search.trim()) return
    setSearching(true)
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search + ' ประเทศไทย')}&format=json&limit=1&accept-language=th&countrycodes=th`
      )
      const d = await r.json()
      if (d.length > 0) {
        const { lat, lon, display_name } = d[0]
        setPos([parseFloat(lat), parseFloat(lon)])
        onChange({ lat: parseFloat(lat), lng: parseFloat(lon), address: display_name })
      } else {
        alert('ไม่พบสถานที่นี้ ลองพิมพ์ชื่อให้ละเอียดขึ้น')
      }
    } catch { alert('ค้นหาไม่สำเร็จ กรุณาลองใหม่') }
    finally { setSearching(false) }
  }

  function handleClear(e) {
    e?.stopPropagation?.()
    setPos(null); setSearch(''); onChange(null)
  }

  return (
    <div className="space-y-1">

      {/* Trigger */}
      <button type="button" onClick={() => setOpen(true)}
        className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white hover:border-blue-400 focus:outline-none transition-colors flex items-center gap-2 min-h-[46px]">
        <span className="text-base flex-shrink-0">📍</span>
        {value?.address
          ? <span className="flex-1 text-gray-700 line-clamp-1">{value.address}</span>
          : <span className="flex-1 text-gray-400">แตะเพื่อเลือกตำแหน่งบนแผนที่</span>
        }
        {value?.address
          ? <span role="button" onClick={handleClear}
              className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0 cursor-pointer px-1">×</span>
          : <span className="text-xs text-blue-500 flex-shrink-0 font-medium">เลือก →</span>
        }
      </button>

      {value?.lat && (
        <a href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-primary hover:underline px-1">
          🗺️ ดูใน Google Maps →
        </a>
      )}

      {/* Modal */}
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="bg-white w-full sm:rounded-2xl sm:overflow-hidden shadow-2xl flex flex-col"
            style={{ height: '90vh', maxWidth: 680 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <h3 className="text-sm font-bold text-gray-800">เลือกตำแหน่ง</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 text-xl">×</button>
            </div>

            {/* Search */}
            <div className="flex gap-2 px-3 py-2 border-b flex-shrink-0">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  className="w-full border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-pink-100 bg-gray-50"
                  placeholder="ค้นหาสถานที่ เช่น ตำบลแม่ใส พะเยา"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
                />
              </div>
              <button type="button" onClick={handleSearch} disabled={searching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50 flex-shrink-0 transition-colors">
                {searching ? '⏳' : 'ค้นหา'}
              </button>
            </div>

            {/* GPS + tile toggle */}
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-shrink-0">
              <button type="button" onClick={handleGPS} disabled={locating}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-2 rounded-full hover:bg-pink-50 disabled:opacity-60 shadow-sm transition-colors">
                {locating ? <><span className="animate-spin">⏳</span> กำลังระบุ...</> : <>📡 ตำแหน่งของฉัน</>}
              </button>
              <div className="ml-auto flex rounded-full border border-gray-200 overflow-hidden bg-white text-xs font-medium shadow-sm">
                {Object.entries({ map: '🗺️ แผนที่', satellite: '🛰️ ดาวเทียม' }).map(([k, lbl]) => (
                  <button key={k} type="button" onClick={() => setLayer(k)}
                    className={`px-3 py-1.5 transition-colors ${layer === k ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Map — flex-1 gives it all remaining height */}
            <div className="flex-1 relative" style={{ minHeight: 0 }}>
              <RawMap pos={pos} layer={layer} onPick={handlePick} />
              {!pos && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                  <div className="bg-black/65 text-white text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-lg">
                    แตะบนแผนที่เพื่อปักหมุด 📍
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="flex-1 min-w-0">
                {pos && value?.address
                  ? <div>
                      <p className="text-xs font-semibold text-gray-700 line-clamp-1">📍 {value.address}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{value.lat?.toFixed(6)}, {value.lng?.toFixed(6)}</p>
                    </div>
                  : <p className="text-xs text-gray-400">แตะบนแผนที่เพื่อปักหมุด</p>
                }
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {pos && (
                  <button type="button" onClick={handleClear}
                    className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                    ล้าง
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors shadow-sm">
                  ยืนยัน
                </button>
              </div>
            </div>

          </div>
        </div>
      , document.body)}
    </div>
  )
}
