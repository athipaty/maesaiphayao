import { useState } from 'react'
import { submitComplaint, trackComplaint } from '../services/api'

const STATUS_CONFIG = {
  received:     { label: 'รับเรื่องแล้ว',     color: 'bg-blue-100 text-blue-700',   dot: '🔵' },
  investigating:{ label: 'กำลังสอบสวน',        color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  done:         { label: 'ดำเนินการเสร็จแล้ว', color: 'bg-green-100 text-green-700', dot: '🟢' },
  rejected:     { label: 'ไม่รับเรื่อง',        color: 'bg-red-100 text-red-600',    dot: '🔴' },
}

export default function ComplaintPage() {
  const [tab, setTab]           = useState('general') // 'general' | 'corruption' | 'track'
  const [anonymous, setAnonymous] = useState(false)
  const [form, setForm]         = useState({ citizenName: '', phone: '', detail: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(null)
  const [trackNo, setTrackNo]   = useState('')
  const [tracking, setTracking] = useState(false)
  const [tracked, setTracked]   = useState(null)
  const [trackErr, setTrackErr] = useState('')

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.detail) return
    if (!anonymous && (!form.citizenName || !form.phone)) return
    setSubmitting(true)
    try {
      const payload = {
        type: tab,
        isAnonymous: anonymous,
        detail: form.detail,
        citizenName: anonymous ? '' : form.citizenName,
        phone: anonymous ? '' : form.phone,
      }
      const r = await submitComplaint(payload)
      setSubmitted(r.data)
      setForm({ citizenName: '', phone: '', detail: '' })
      setAnonymous(false)
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
      const r = await trackComplaint(trackNo.trim())
      setTracked(r.data)
    } catch (err) {
      setTrackErr(err?.response?.data?.error || 'ไม่พบเลขที่เรื่องร้องเรียนนี้')
    } finally {
      setTracking(false)
    }
  }

  const isFormTab = tab === 'general' || tab === 'corruption'

  return (
    <div>
      {/* Header */}
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📮 ร้องเรียน/ร้องทุกข์</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ช่องทางรับเรื่องร้องเรียนจากประชาชน ทั้งเรื่องทั่วไปและการร้องเรียนเรื่องทุจริตของเจ้าหน้าที่
          ทุกเรื่องจะได้รับการพิจารณาอย่างเป็นธรรม และข้อมูลผู้ร้องจะได้รับการคุ้มครอง
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setTab('general')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
            tab === 'general' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
          }`}>
          📝 ร้องเรียนทั่วไป
        </button>
        <button onClick={() => setTab('corruption')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
            tab === 'corruption' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
          }`}>
          🚨 แจ้งเบาะแสทุจริต
        </button>
        <button onClick={() => setTab('track')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
            tab === 'track' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
          }`}>
          🔍 ติดตามสถานะ
        </button>
      </div>

      {isFormTab && (
        <div className="card p-5">
          {tab === 'corruption' && (
            <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div className="text-xs text-red-700 leading-relaxed">
                <p className="font-semibold mb-1">การร้องเรียนเรื่องทุจริตและประพฤติมิชอบ</p>
                <p>ข้อมูลของท่านจะถูกเก็บรักษาเป็นความลับและได้รับความคุ้มครองตามพระราชบัญญัติคุ้มครองผู้แจ้งเบาะแส
                  การแจ้งข้อมูลเท็จอาจมีความผิดตามกฎหมาย</p>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-base font-bold text-green-700 mb-2">ยื่นเรื่องร้องเรียนสำเร็จ</h2>
              <p className="text-sm text-gray-600 mb-1">เลขที่เรื่องร้องเรียน:</p>
              <div className="text-2xl font-bold text-primary mb-4">{submitted.complaintNo}</div>
              <p className="text-xs text-gray-400 mb-6">กรุณาจดบันทึกเลขนี้ไว้สำหรับติดตามสถานะ</p>
              <button onClick={() => setSubmitted(null)}
                className="text-sm border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                ยื่นเรื่องใหม่
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anonymous toggle */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <input type="checkbox" id="anon" checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                <label htmlFor="anon" className="text-sm text-gray-700 cursor-pointer">
                  ไม่ระบุชื่อ (ส่งแบบไม่เปิดเผยตัวตน)
                </label>
              </div>

              {!anonymous && (
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
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รายละเอียด <span className="text-red-400">*</span></label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  value={form.detail} onChange={e => set('detail', e.target.value)}
                  placeholder={tab === 'corruption'
                    ? 'อธิบายเหตุการณ์ที่พบ ระบุเจ้าหน้าที่ที่เกี่ยวข้อง วันเวลา สถานที่ และพยานหลักฐานที่มี...'
                    : 'อธิบายรายละเอียดเรื่องที่ต้องการร้องเรียน...'}
                />
              </div>

              <button type="submit" disabled={submitting}
                className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                  tab === 'corruption' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'
                }`}>
                {submitting ? 'กำลังส่งเรื่อง...' : '📤 ส่งเรื่องร้องเรียน'}
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
              placeholder="กรอกเลขที่เรื่องร้องเรียน เช่น CP6804xxxx"
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
            return (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">{tracked.complaintNo}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${sc.color}`}>
                    {sc.dot} {sc.label}
                  </span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-28">ประเภท</span>
                    <span>{tracked.type === 'corruption' ? '🚨 ร้องเรียนทุจริต' : '📝 ร้องเรียนทั่วไป'}</span>
                  </div>
                  {!tracked.isAnonymous && tracked.citizenName && (
                    <div className="flex gap-2"><span className="text-gray-400 w-28">ผู้ร้องเรียน</span><span>{tracked.citizenName}</span></div>
                  )}
                  <div className="flex gap-2"><span className="text-gray-400 w-28">รายละเอียด</span><span className="flex-1">{tracked.detail}</span></div>
                  {tracked.officerNote && (
                    <div className="flex gap-2"><span className="text-gray-400 w-28">ผลการดำเนินการ</span><span className="flex-1 text-secondary">{tracked.officerNote}</span></div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-28">วันที่แจ้ง</span>
                    <span>{new Date(tracked.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
