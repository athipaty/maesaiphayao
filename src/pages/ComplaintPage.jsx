import { useState } from 'react'
import { submitComplaint, trackComplaint } from '../services/api'

const STATUS_CONFIG = {
  received:     { label: 'รับเรื่องแล้ว',      color: 'bg-blue-100 text-blue-700',    dot: '🔵' },
  investigating:{ label: 'กำลังดำเนินการ',      color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  done:         { label: 'ดำเนินการเสร็จแล้ว',  color: 'bg-green-100 text-green-700',  dot: '🟢' },
  rejected:     { label: 'ไม่รับเรื่อง',         color: 'bg-red-100 text-red-600',      dot: '🔴' },
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white placeholder-gray-300'

export default function ComplaintPage() {
  const [tab, setTab]             = useState('form')
  const [anonymous, setAnonymous] = useState(false)
  const [form, setForm]           = useState({ citizenName: '', phone: '', detail: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(null)
  const [trackNo, setTrackNo]     = useState('')
  const [tracking, setTracking]   = useState(false)
  const [tracked, setTracked]     = useState(null)
  const [trackErr, setTrackErr]   = useState('')

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.detail) return
    if (!anonymous && (!form.citizenName || !form.phone)) return
    setSubmitting(true)
    try {
      const r = await submitComplaint({
        type: 'general', isAnonymous: anonymous, detail: form.detail,
        citizenName: anonymous ? '' : form.citizenName,
        phone: anonymous ? '' : form.phone,
      })
      setSubmitted(r.data)
      setForm({ citizenName: '', phone: '', detail: '' })
      setAnonymous(false)
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err?.response?.data?.error || err.message))
    } finally { setSubmitting(false) }
  }

  async function handleTrack(e) {
    e.preventDefault()
    if (!trackNo.trim()) return
    setTracking(true); setTrackErr(''); setTracked(null)
    try {
      const r = await trackComplaint(trackNo.trim())
      setTracked(r.data)
    } catch (err) {
      setTrackErr(err?.response?.data?.error || 'ไม่พบเลขที่เรื่องร้องเรียนนี้')
    } finally { setTracking(false) }
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📮 ร้องเรียน/ร้องทุกข์</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ช่องทางรับเรื่องร้องเรียนและร้องทุกข์ของประชาชน เพื่อแก้ไขปัญหาความเดือดร้อน
          ทุกเรื่องจะได้รับการพิจารณาและดำเนินการอย่างเป็นธรรม
          ข้อมูลของผู้ร้องจะได้รับการคุ้มครองตามกฎหมาย
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'form',  label: '📝 ยื่นเรื่องร้องเรียน' },
          { key: 'track', label: '🔍 ติดตามสถานะ' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
              tab === t.key
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── FORM TAB ── */}
      {tab === 'form' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-base font-bold text-green-700 mb-2">ยื่นเรื่องร้องเรียนสำเร็จ</h2>
              <p className="text-sm text-gray-500 mb-2">เลขที่เรื่องร้องเรียนของคุณ</p>
              <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 mb-4">
                <span className="text-2xl font-bold text-primary tracking-widest">{submitted.complaintNo}</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">กรุณาจดบันทึกเลขนี้ไว้สำหรับติดตามสถานะ</p>
              <button onClick={() => setSubmitted(null)}
                className="text-sm border-2 border-primary text-primary px-8 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-colors font-medium">
                ยื่นเรื่องใหม่
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Anonymous toggle */}
              <label className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="checkbox" checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)} className="w-4 h-4 accent-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">ไม่ระบุชื่อ</p>
                  <p className="text-xs text-gray-400">ส่งแบบไม่เปิดเผยตัวตน</p>
                </div>
              </label>

              {!anonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ชื่อ-สกุล <span className="text-red-400">*</span>
                    </label>
                    <input className={inputCls} value={form.citizenName}
                      onChange={e => set('citizenName', e.target.value)} placeholder="ระบุชื่อ-สกุล" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                    </label>
                    <input className={inputCls} value={form.phone}
                      onChange={e => set('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รายละเอียด <span className="text-red-400">*</span>
                </label>
                <textarea rows={5} className={inputCls + ' resize-none'} value={form.detail}
                  onChange={e => set('detail', e.target.value)}
                  placeholder="อธิบายรายละเอียดปัญหา สถานที่ วันเวลา และข้อมูลที่เกี่ยวข้อง..." />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-primary text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm">
                {submitting ? 'กำลังส่งเรื่อง...' : '📤 ส่งเรื่องร้องเรียน'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── TRACK TAB ── */}
      {tab === 'track' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-4">กรอกเลขที่เรื่องร้องเรียนที่ได้รับตอนยื่นเรื่อง</p>
          <form onSubmit={handleTrack} className="flex gap-2 mb-4">
            <input className={inputCls + ' flex-1'} value={trackNo}
              onChange={e => setTrackNo(e.target.value)}
              placeholder="เช่น CP6804xxxx" />
            <button type="submit" disabled={tracking}
              className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex-shrink-0">
              {tracking ? '...' : 'ค้นหา'}
            </button>
          </form>

          {trackErr && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 flex items-center gap-2">
              <span>❌</span> {trackErr}
            </div>
          )}

          {tracked && (() => {
            const sc = STATUS_CONFIG[tracked.status] || STATUS_CONFIG.received
            return (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">{tracked.complaintNo}</span>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${sc.color}`}>{sc.dot} {sc.label}</span>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  {tracked.isAnonymous
                    ? <div className="flex gap-3"><span className="text-gray-400 w-28 flex-shrink-0">ผู้ร้องเรียน</span><span className="text-gray-400 italic">ไม่ระบุตัวตน</span></div>
                    : tracked.citizenName && <div className="flex gap-3"><span className="text-gray-400 w-28 flex-shrink-0">ผู้ร้องเรียน</span><span>{tracked.citizenName}</span></div>
                  }
                  <div className="flex gap-3"><span className="text-gray-400 w-28 flex-shrink-0">รายละเอียด</span><span className="flex-1 leading-relaxed">{tracked.detail}</span></div>
                  {tracked.officerNote && (
                    <div className="flex gap-3"><span className="text-gray-400 w-28 flex-shrink-0">ผลดำเนินการ</span><span className="flex-1 text-secondary">{tracked.officerNote}</span></div>
                  )}
                  <div className="flex gap-3">
                    <span className="text-gray-400 w-28 flex-shrink-0">วันที่แจ้ง</span>
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