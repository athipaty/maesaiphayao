import { useState, useEffect, useCallback, Component } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Error boundary ─────────────────────────────────────────────────────────────
class MapErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.warn('[LocationPicker] map error:', err.message) }
  render() {
    if (this.state.hasError) return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 flex-col gap-2 text-gray-400 text-sm">
        <span className="text-3xl">🗺️</span>
        <p>ไม่สามารถโหลดแผนที่ได้</p>
        <button className="text-xs text-blue-500 underline" onClick={() => this.setState({ hasError: false })}>ลองอีกครั้ง</button>
      </div>
    )
    return this.props.children
  }
}

// ── Google-style red drop pin ──────────────────────────────────────────────────
const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
  <path d="M16 0C7.163 0 0 7.163 0 16c0 10.647 14.25 26.51 15.28 27.65a1 1 0 0 0 1.44 0C17.75 42.51 32 26.647 32 16 32 7.163 24.837 0 16 0z" fill="#EA4335"/>
  <circle cx="16" cy="16" r="7" fill="white"/>
</svg>`

const PIN_ICON = L.divIcon({
  html: PIN_SVG,
  className: '',
  iconSize:   [32, 44],
  iconAnchor: [16, 44],
  popupAnchor:[0, -44],
})

// ── Map helpers ───────────────────────────────────────────────────────────────
function ClickHandler({ onPick }) {
  useMapEvents({ click(e) { onPick(e.latlng) } })
  return null
}

function FlyTo({ pos }) {
  const map = useMap()
  useEffect(() => { if (pos) map.flyTo(pos, 17, { animate: true, duration: 0.8 }) }, [pos])
  return null
}

// ── Tile layers ───────────────────────────────────────────────────────────────
const TILES = {
  map: {
    url:   'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attr:  '&copy; <a href="https://carto.com/">CARTO</a>',
    label: '🗺️ แผนที่',
  },
  satellite: {
    url:   'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr:  '&copy; Esri, Maxar, Earthstar Geographics',
    label: '🛰️ ดาวเทียม',
  },
}

const DEFAULT_CENTER = [19.1322, 99.8763] // อบต.แม่ใส

// ── Main component ─────────────────────────────────────────────────────────────
export default function LocationPicker({ value, onChange }) {
  const [pos, setPos]         = useState(value?.lat ? [value.lat, value.lng] : null)
  const [search, setSearch]   = useState('')
  const [searching, setSearching] = useState(false)
  const [locating, setLocating]   = useState(false)
  const [open, setOpen]       = useState(false)
  const [layer, setLayer]     = useState('map')   // 'map' | 'satellite'
  // Delay mounting the Leaflet map by one tick so React.StrictMode's
  // double-invoke doesn't leave a stale Leaflet instance in the container.
  const [mapReady, setMapReady] = useState(false)
  useEffect(() => { if (open) { const t = setTimeout(() => setMapReady(true), 10); return () => clearTimeout(t) } else { setMapReady(false) } }, [open])

  async function reverseGeocode(lat, lng) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`
      )
      const d = await r.json()
      const address = d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      onChange({ lat, lng, address })
    } catch {
      onChange({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
    }
  }

  function handlePick(latlng) {
    setPos([latlng.lat, latlng.lng])
    reverseGeocode(latlng.lat, latlng.lng)
  }

  function handleGPS() {
    if (!navigator.geolocation) { alert('เบราว์เซอร์นี้ไม่รองรับ GPS'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setPos([lat, lng])
        reverseGeocode(lat, lng)
        setLocating(false)
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
    } catch {
      alert('ค้นหาไม่สำเร็จ กรุณาลองใหม่')
    } finally { setSearching(false) }
  }

  function handleClear(e) {
    e?.stopPropagation?.()
    setPos(null)
    setSearch('')
    onChange(null)
  }

  const tile = TILES[layer]

  return (
    <div className="space-y-1">

      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white hover:border-blue-400 focus:outline-none focus:border-blue-400 transition-colors flex items-center gap-2 min-h-[46px]"
      >
        <span className="text-base flex-shrink-0">📍</span>
        {value?.address
          ? <span className="flex-1 text-gray-700 line-clamp-1">{value.address}</span>
          : <span className="flex-1 text-gray-400">แตะเพื่อเลือกตำแหน่งบนแผนที่</span>
        }
        {value?.address
          ? <span
              role="button"
              onClick={handleClear}
              className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0 cursor-pointer px-1"
            >×</span>
          : <span className="text-xs text-blue-500 flex-shrink-0 font-medium">เลือก →</span>
        }
      </button>

      {/* Google Maps deep link when location is set */}
      {value?.lat && (
        <a
          href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 hover:underline px-1"
        >
          <img src="https://maps.gstatic.com/favicon3.ico" className="w-3 h-3" alt="" />
          ดูใน Google Maps →
        </a>
      )}

      {/* ── Map modal ── */}
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="bg-white w-full sm:rounded-2xl sm:overflow-hidden shadow-2xl flex flex-col"
            style={{ height: '90vh', maxWidth: 680 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <img src="https://maps.gstatic.com/favicon3.ico" className="w-5 h-5" alt="" />
                <h3 className="text-sm font-bold text-gray-800">เลือกตำแหน่ง</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none">
                ×
              </button>
            </div>

            {/* Search bar */}
            <div className="flex gap-2 px-3 py-2 border-b flex-shrink-0 bg-white">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  className="w-full border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                  placeholder="ค้นหาสถานที่ เช่น ตำบลแม่ใส, วัดพะเยา"
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

            {/* GPS + layer toggle row */}
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 flex-shrink-0">
              <button type="button" onClick={handleGPS} disabled={locating}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-2 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-60 shadow-sm">
                {locating
                  ? <><span className="animate-spin text-sm">⏳</span> กำลังระบุตำแหน่ง...</>
                  : <><span className="text-sm">📡</span> ตำแหน่งของฉัน</>
                }
              </button>

              {/* Tile toggle */}
              <div className="ml-auto flex rounded-full border border-gray-200 overflow-hidden bg-white text-xs font-medium shadow-sm">
                {Object.entries(TILES).map(([k, t]) => (
                  <button key={k} type="button"
                    onClick={() => setLayer(k)}
                    className={`px-3 py-1.5 transition-colors ${layer === k ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map area — use absolute fill so Leaflet always gets real pixel dimensions */}
            <div className="flex-1 relative">
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-gray-400 text-sm animate-pulse">กำลังโหลดแผนที่...</div>
                </div>
              )}
              {mapReady && <MapErrorBoundary>
                <MapContainer
                  center={pos || DEFAULT_CENTER}
                  zoom={pos ? 17 : 13}
                  style={{ position: 'absolute', inset: 0 }}
                  zoomControl={true}
                >
                  {/* Swap url/attribution reactively — never re-mount MapContainer */}
                  <TileLayer key={layer} url={tile.url} attribution={tile.attr} maxZoom={19} />
                  <ClickHandler onPick={handlePick} />
                  {pos && (
                    <>
                      <Marker position={pos} icon={PIN_ICON} />
                      <FlyTo pos={pos} />
                    </>
                  )}
                </MapContainer>
              </MapErrorBoundary>}

              {/* Tap-to-pin hint overlay — shown only when no position yet */}
              {!pos && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                  <div className="bg-black/65 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm whitespace-nowrap shadow-lg">
                    แตะบนแผนที่เพื่อปักหมุด 📍
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="flex-1 min-w-0">
                {pos && value?.address ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-700 line-clamp-1">📍 {value.address}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {value.lat?.toFixed(6)}, {value.lng?.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">ยังไม่ได้เลือกตำแหน่ง</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {pos && (
                  <button type="button" onClick={() => { handleClear(); }}
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
