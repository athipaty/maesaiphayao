import { useState, useEffect, useCallback, Component } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Error boundary to catch react-leaflet Context errors in React 18.3 StrictMode
class MapErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.warn('[LocationPicker] map render error:', err.message) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-sm text-gray-400 flex-col gap-2">
          <span className="text-2xl">🗺️</span>
          <p>ไม่สามารถโหลดแผนที่ได้</p>
          <button className="text-xs text-blue-500 underline" onClick={() => this.setState({ hasError: false })}>ลองอีกครั้ง</button>
        </div>
      )
    }
    return this.props.children
  }
}

// Fix default marker icons broken by bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DEFAULT_CENTER = [19.1322, 99.8763] // อบต.แม่ใส

function ClickHandler({ onPick }) {
  useMapEvents({ click(e) { onPick(e.latlng) } })
  return null
}

function FlyTo({ pos }) {
  const map = useMap()
  useEffect(() => { if (pos) map.flyTo(pos, 16, { animate: true, duration: 1 }) }, [pos])
  return null
}

export default function LocationPicker({ value, onChange }) {
  const [pos, setPos]         = useState(value?.lat ? [value.lat, value.lng] : null)
  const [search, setSearch]   = useState('')
  const [searching, setSearching] = useState(false)
  const [locating, setLocating]   = useState(false)
  const [open, setOpen]       = useState(false)

  function handlePick(latlng) {
    setPos([latlng.lat, latlng.lng])
    reverseGeocode(latlng.lat, latlng.lng)
  }

  function handleGPS() {
    if (!navigator.geolocation) { alert('เบราว์เซอร์นี้ไม่รองรับ GPS'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        setPos([lat, lng])
        reverseGeocode(lat, lng)
        setLocating(false)
      },
      () => { alert('ไม่สามารถระบุตำแหน่งได้ กรุณาอนุญาตการเข้าถึง GPS'); setLocating(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function reverseGeocode(lat, lng) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`,
        { headers: { 'Accept-Language': 'th' } }
      )
      const d = await r.json()
      const address = d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      onChange({ lat, lng, address })
    } catch {
      onChange({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
    }
  }

  async function handleSearch(e) {
    e?.preventDefault?.()
    if (!search.trim()) return
    setSearching(true)
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1&accept-language=th&countrycodes=th`,
        { headers: { 'Accept-Language': 'th' } }
      )
      const d = await r.json()
      if (d.length > 0) {
        const { lat, lon, display_name } = d[0]
        const p = [parseFloat(lat), parseFloat(lon)]
        setPos(p)
        onChange({ lat: parseFloat(lat), lng: parseFloat(lon), address: display_name })
      } else {
        alert('ไม่พบสถานที่นี้ ลองพิมพ์ชื่อให้ละเอียดขึ้น')
      }
    } catch {
      alert('ค้นหาไม่สำเร็จ กรุณาลองใหม่')
    } finally { setSearching(false) }
  }

  function handleClear() {
    setPos(null)
    setSearch('')
    onChange(null)
  }

  const displayText = value?.address || ''

  return (
    <div className="space-y-1">
      {/* Trigger / summary */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white hover:border-blue-400 transition-colors flex items-center gap-2 min-h-[46px]"
      >
        <span className="text-base flex-shrink-0">📍</span>
        {displayText
          ? <span className="flex-1 text-gray-700 truncate">{displayText}</span>
          : <span className="flex-1 text-gray-300">แตะเพื่อเลือกสถานที่บนแผนที่ (ถ้ามี)</span>
        }
        {displayText
          ? <span role="button" onClick={e => { e.stopPropagation(); handleClear() }}
              className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0 cursor-pointer">×</span>
          : <span className="text-xs text-blue-400 flex-shrink-0">เลือก</span>
        }
      </button>

      {/* Google Maps link when location is set */}
      {value?.lat && (
        <a
          href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 hover:underline px-1"
        >
          🗺️ ดูใน Google Maps →
        </a>
      )}

      {/* Map modal — rendered in a portal so it never nests inside another <form> */}
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
          <div className="bg-white w-full sm:rounded-2xl shadow-2xl flex flex-col"
            style={{ height: '90vh', maxWidth: 640 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <h3 className="text-sm font-semibold text-gray-800">📍 เลือกสถานที่</h3>
              <button type="button" onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {/* Search bar — use div+onKeyDown to avoid nested <form> issue */}
            <div className="flex gap-2 px-3 py-2 border-b flex-shrink-0">
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="ค้นหาสถานที่ เช่น อบต.แม่ใส พะเยา"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
              />
              <button type="button" onClick={handleSearch} disabled={searching}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex-shrink-0">
                {searching ? '...' : 'ค้นหา'}
              </button>
            </div>

            {/* GPS button */}
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-blue-50/50 flex-shrink-0">
              <button type="button" onClick={handleGPS} disabled={locating}
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-white border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-60 flex-shrink-0">
                {locating
                  ? <><span className="animate-spin">⏳</span> กำลังระบุตำแหน่ง...</>
                  : <><span>📡</span> ใช้ตำแหน่งปัจจุบัน (GPS)</>
                }
              </button>
              <p className="text-xs text-gray-400">หรือแตะบนแผนที่เพื่อปักหมุด</p>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              <MapErrorBoundary>
                <MapContainer
                  center={pos || DEFAULT_CENTER}
                  zoom={pos ? 16 : 13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                  />
                  <ClickHandler onPick={handlePick} />
                  {pos && (
                    <>
                      <Marker position={pos} />
                      <FlyTo pos={pos} />
                    </>
                  )}
                </MapContainer>
              </MapErrorBoundary>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-4 py-3 border-t bg-gray-50 rounded-b-2xl flex-shrink-0">
              {pos && value?.address
                ? <p className="flex-1 text-xs text-gray-600 truncate">📍 {value.address}</p>
                : <p className="flex-1 text-xs text-gray-400">ยังไม่ได้เลือกสถานที่</p>
              }
              <button type="button" onClick={() => setOpen(false)}
                className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 flex-shrink-0">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  )
}

