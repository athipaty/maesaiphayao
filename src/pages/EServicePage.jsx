import { useState, useEffect } from 'react'
import { submitEService, trackEService, getEServiceTypes } from '../services/api'
import PhotoUploader from '../components/PhotoUploader'
import LocationPicker from '../components/LocationPicker'

const STATUS_CONFIG = {
  received:    { label: 'รับเรื่องแล้ว',     color: 'bg-blue-100 text-blue-700',   dot: '🔵' },
  in_progress: { label: 'กำลังดำเนินการ',    color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  done:        { label: 'ดำเนินการเสร็จแล้ว', color: 'bg-green-100 text-green-700', dot: '🟢' },
  rejected:    { label: 'ไม่สามารถดำเนินการ', color: 'bg-red-100 text-red-600',    dot: '🔴' },
}

export default function EServicePage() {
  const [types, setTypes]       = useState([])
  const [tab, setTab]           = useState('form')
  const [form, setForm]         = useState({ type: '', citizenName: '', phone: '', address: '', villageNo: '', location: null, detail: '', images: [] })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(null)
  const [formErr, setFormErr]   = useState('')
  const [trackNo, setTrackNo]   = useState('')
  const [tracking, setTracking] = useState(false)
  const [tracked, setTracked]   = useState(null)
  const [trackErr, setTrackErr] = useState('')

  useEffect(() => {
    getEServiceTypes().then(r => {
      const active = (r?.data || []).filter(t => t.isActive)
      setTypes(active)
      if (active.length > 0) setForm(prev => ({ ...prev, type: active[0].value }))
    }).catch(() => {})
  }, [])

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.citizenName.trim() || !form.phone.trim() || !form.detail.trim()) {
      setFormErr('กรุณากรอก ชื่อ-สกุล, เบอร์โทรศัพท์ และรายละเอียด ก่อนส่งคำร้อง')
      return
    }
    setFormErr('')
    setSubmitting(true)
    try {
      const r = await submitEService(form)
      setSubmitted(r.data)
      setForm({ type: types[0]?.value || '', citizenName: '', phone: '', address: '', villageNo: '', location: null, detail: '', images: [] })
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err?.response?.data?.error || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTrack(e) {
    e.preventDefault()
    if (!trackNo.trim()) return
    setTracking(true)
    setTrackErr('')
    setTracked(null)
    try {
      const r = await trackEService(trackNo.trim())
      setTracked(r.data)
    } catch (err) {
      setTrackErr(err?.response?.data?.error || 'ไม่พบเลขที่คำร้องนี้')
    } finally {
      setTracking(false)
    }
  }

  return (
    <div>
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">🌐 e-Service — บริการออนไลน์สำหรับประชาชน</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          แจ้งเรื่องร้องขอบริการจากองค์การบริหารส่วนตำบลแม่ใส ผ่านช่องทางออนไลน์
          ได้รับเลขติดตามเพื่อตรวจสอบสถานะการดำเนินงาน
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { id: 'form',  label: '📝 ยื่นคำร้อง' },
          { id: 'track', label: '🔍 ติดตามสถานะ' },
          { id: 'stat',  label: '📊 สถิติการให้บริการ' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
              tab === t.id ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'form' && (
        <div className="card p-5">
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-base font-bold text-green-700 mb-2">ยื่นคำร้องสำเร็จ!</h2>
              <p className="text-sm text-gray-600 mb-1">เลขที่คำร้องของท่าน:</p>
              <div className="text-2xl font-bold text-primary mb-4">{submitted.requestNo}</div>
              <p className="text-xs text-gray-400 mb-6">กรุณาจดบันทึกเลขนี้ไว้สำหรับติดตามสถานะ</p>
              <button
                onClick={() => setSubmitted(null)}
                className="text-sm border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                ยื่นคำร้องใหม่
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ประเภทคำร้อง <span className="text-red-400">*</span></label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                  value={form.type} onChange={e => set('type', e.target.value)}
                >
                  {types.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-สกุล <span className="text-red-400">*</span></label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={form.citizenName} onChange={e => set('citizenName', e.target.value)}
                    placeholder="ชื่อ-สกุล"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์โทรศัพท์ <span className="text-red-400">*</span></label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">หมู่ที่</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={form.villageNo} onChange={e => set('villageNo', e.target.value)}
                    placeholder="เช่น หมู่ 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ที่อยู่/บ้านเลขที่</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="บ้านเลขที่/ซอย"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">สถานที่ / จุดเกิดเหตุ</label>
                <LocationPicker value={form.location} onChange={v => set('location', v)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รายละเอียด <span className="text-red-400">*</span></label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  value={form.detail} onChange={e => set('detail', e.target.value)}
                  placeholder="อธิบายรายละเอียดปัญหาหรือความต้องการ..."
                />
              </div>

              <PhotoUploader photos={form.images} onChange={urls => set('images', urls)} />

              {formErr && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                  ⚠️ {formErr}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? 'กำลังส่งคำร้อง...' : '📤 ส่งคำร้อง'}
              </button>
            </form>
          )}
        </div>
      )}

      {tab === 'stat' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">📊</span>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">สถิติการให้บริการออนไลน์ (O10)</p>
              <p className="text-xs text-blue-700">ข้อมูลสถิติการรับคำร้องผ่านระบบ e-Service ประจำปีงบประมาณ 2568 แยกตามประเภทบริการและไตรมาส</p>
            </div>
          </div>

          {[
            { year: '2568', rows: [
              { service: 'เสียภาษีที่ดินและสิ่งปลูกสร้าง/ป้าย', q1: 0, q2: 0, q3: 0, q4: 0 },
              { service: 'แจ้งซ่อม/ไฟฟ้าสาธารณะ/ประปา',        q1: 0, q2: 0, q3: 0, q4: 0 },
              { service: 'แจ้งตัดต้นไม้/กิ่งไม้',               q1: 0, q2: 0, q3: 0, q4: 0 },
              { service: 'ยื่นคำร้องขออนุมัติ/อนุญาต',          q1: 0, q2: 0, q3: 0, q4: 0 },
              { service: 'คำร้องทั่วไป/อื่น ๆ',                 q1: 0, q2: 0, q3: 0, q4: 0 },
            ]},
          ].map(({ year, rows }) => {
            const quarters = [
              { label: 'ไตรมาส 1', sub: 'ต.ค.–ธ.ค.' },
              { label: 'ไตรมาส 2', sub: 'ม.ค.–มี.ค.' },
              { label: 'ไตรมาส 3', sub: 'เม.ย.–มิ.ย.' },
              { label: 'ไตรมาส 4', sub: 'ก.ค.–ก.ย.' },
            ]
            return (
              <div key={year} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="section-head">
                  <h2 className="text-sm font-semibold">สถิติการให้บริการออนไลน์ ปีงบประมาณ {year}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-3 py-2.5 text-left text-primary font-semibold min-w-[160px]">ประเภทบริการ</th>
                        {quarters.map(q => (
                          <th key={q.label} className="px-3 py-2.5 text-center text-primary font-semibold">
                            {q.label}<br/><span className="font-normal text-gray-400">{q.sub}</span>
                          </th>
                        ))}
                        <th className="px-3 py-2.5 text-center text-primary font-semibold">รวม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => {
                        const total = r.q1 + r.q2 + r.q3 + r.q4
                        return (
                          <tr key={i} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                            <td className="px-3 py-2.5 text-gray-700">{r.service}</td>
                            {[r.q1, r.q2, r.q3, r.q4].map((v, j) => (
                              <td key={j} className="px-3 py-2.5 text-center text-gray-600">{v || '–'}</td>
                            ))}
                            <td className="px-3 py-2.5 text-center font-semibold text-primary">{total || '–'}</td>
                          </tr>
                        )
                      })}
                      <tr className="bg-primary/10 font-bold">
                        <td className="px-3 py-2.5 text-primary">รวมทั้งหมด</td>
                        {[1,2,3,4].map(q => (
                          <td key={q} className="px-3 py-2.5 text-center text-primary">
                            {rows.reduce((s, r) => s + (r[`q${q}`] || 0), 0) || '–'}
                          </td>
                        ))}
                        <td className="px-3 py-2.5 text-center text-primary">
                          {rows.reduce((s, r) => s + r.q1 + r.q2 + r.q3 + r.q4, 0) || '–'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 px-4 py-2">* ข้อมูลอ้างอิง ณ 30 กันยายน {year} — อัปเดตโดยเจ้าหน้าที่</p>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'track' && (
        <div className="card p-5">
          <form onSubmit={handleTrack} className="flex gap-2 mb-4">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={trackNo} onChange={e => setTrackNo(e.target.value)}
              placeholder="กรอกเลขที่คำร้อง เช่น ES6804xxxx"
            />
            <button type="submit" disabled={tracking}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {tracking ? '...' : 'ค้นหา'}
            </button>
          </form>

          {trackErr && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-600">{trackErr}</div>
          )}

          {tracked && (() => {
            const sc = STATUS_CONFIG[tracked.status] || STATUS_CONFIG.received
            const trackedType = types.find(t => t.value === tracked.type)
            const typeLabel = trackedType ? `${trackedType.icon} ${trackedType.label}` : tracked.type
            return (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">{tracked.requestNo}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${sc.color}`}>
                    {sc.dot} {sc.label}
                  </span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex gap-2"><span className="text-gray-400 w-28">ประเภท</span><span>{typeLabel}</span></div>
                  <div className="flex gap-2"><span className="text-gray-400 w-28">ผู้แจ้ง</span><span>{tracked.citizenName || '-'}</span></div>
                  {tracked.location && (
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-28">สถานที่</span>
                      <div className="flex-1">
                        <p>{tracked.location.address || tracked.location}</p>
                        {tracked.location.lat && (
                          <a href={`https://www.google.com/maps?q=${tracked.location.lat},${tracked.location.lng}`}
                            target="_blank" rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline">เปิดใน Google Maps →</a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2"><span className="text-gray-400 w-28">รายละเอียด</span><span className="flex-1">{tracked.detail}</span></div>
                  {tracked.officerNote && (
                    <div className="flex gap-2"><span className="text-gray-400 w-28">หมายเหตุ</span><span className="flex-1 text-secondary">{tracked.officerNote}</span></div>
                  )}
                  <div className="flex gap-2"><span className="text-gray-400 w-28">วันที่แจ้ง</span>
                    <span>{new Date(tracked.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {tracked.closedAt && (
                    <div className="flex gap-2"><span className="text-gray-400 w-28">วันที่ปิดงาน</span>
                      <span>{new Date(tracked.closedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
