import { useState } from 'react'
import { submitEService, trackEService } from '../services/api'

const TYPES = [
  { value: 'general',      label: '📝 คำร้องทั่วไป' },
  { value: 'road',         label: '🛣️ แจ้งซ่อมถนน/ทางเท้า' },
  { value: 'street_light', label: '💡 แจ้งซ่อมไฟฟ้าสาธารณะ' },
  { value: 'water',        label: '💧 แจ้งปัญหาน้ำประปา' },
  { value: 'garbage',      label: '🗑️ ขอถังขยะ/เก็บขยะ' },
  { value: 'noise',        label: '📢 ร้องเรียนเสียงรบกวน' },
  { value: 'other',        label: '❓ อื่น ๆ' },
]

const STATUS_CONFIG = {
  received:    { label: 'รับเรื่องแล้ว',     color: 'bg-blue-100 text-blue-700',   dot: '🔵' },
  in_progress: { label: 'กำลังดำเนินการ',    color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  done:        { label: 'ดำเนินการเสร็จแล้ว', color: 'bg-green-100 text-green-700', dot: '🟢' },
  rejected:    { label: 'ไม่สามารถดำเนินการ', color: 'bg-red-100 text-red-600',    dot: '🔴' },
}

const EMPTY = { type: 'general', citizenName: '', phone: '', address: '', villageNo: '', detail: '' }

export default function EServicePage() {
  const [tab, setTab]           = useState('form') // 'form' | 'track'
  const [form, setForm]         = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(null)
  const [trackNo, setTrackNo]   = useState('')
  const [tracking, setTracking] = useState(false)
  const [tracked, setTracked]   = useState(null)
  const [trackErr, setTrackErr] = useState('')

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.citizenName || !form.phone || !form.detail) return
    setSubmitting(true)
    try {
      const r = await submitEService(form)
      setSubmitted(r.data)
      setForm(EMPTY)
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
      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('form')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
            tab === 'form' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
          }`}>
          📝 ยื่นคำร้อง
        </button>
        <button onClick={() => setTab('track')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
            tab === 'track' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
          }`}>
          🔍 ติดตามสถานะ
        </button>
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
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รายละเอียด <span className="text-red-400">*</span></label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  value={form.detail} onChange={e => set('detail', e.target.value)}
                  placeholder="อธิบายรายละเอียดปัญหาหรือความต้องการ..."
                />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? 'กำลังส่งคำร้อง...' : '📤 ส่งคำร้อง'}
              </button>
            </form>
          )}
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
            const typeLabel = TYPES.find(t => t.value === tracked.type)?.label || tracked.type
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
