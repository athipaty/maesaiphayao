import { useState } from 'react'
import { submitComplaint, trackComplaint } from '../services/api'

const STATUS_CONFIG = {
  received:     { label: 'รับเรื่องแล้ว',  color: 'bg-blue-100 text-blue-700',    dot: '🔵' },
  investigating:{ label: 'กำลังสอบสวน',   color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  done:         { label: 'ดำเนินการเสร็จ', color: 'bg-green-100 text-green-700',  dot: '🟢' },
  rejected:     { label: 'ไม่รับเรื่อง',    color: 'bg-red-100 text-red-600',      dot: '🔴' },
}

export default function CorruptionPage() {
  const [tab, setTab]           = useState('form') // 'form' | 'track' | 'stat'
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
      const r = await submitComplaint({
        type: 'corruption',
        isAnonymous: anonymous,
        detail: form.detail,
        citizenName: anonymous ? '' : form.citizenName,
        phone: anonymous ? '' : form.phone,
      })
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

  return (
    <div>
      {/* Header */}
      <div className="card mb-5">
        <div className="section-head" style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)' }}>
          <h1 className="text-sm font-semibold">🚨 ร้องเรียนการทุจริตและประพฤติมิชอบ</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ช่องทางรับแจ้งเบาะแสการทุจริต ประพฤติมิชอบของเจ้าหน้าที่ ข้อมูลของผู้แจ้งจะได้รับการคุ้มครอง
          ตามพระราชบัญญัติคุ้มครองผู้แจ้งเบาะแส การแจ้งข้อมูลเท็จมีความผิดตามกฎหมาย
        </div>
      </div>

      {/* Policy links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
          <p className="text-sm font-semibold text-red-700 mb-2">🎗️ No Gift Policy</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            อบต.แม่ใส ประกาศนโยบายไม่รับของขวัญและของกำนัลทุกชนิดจากการปฏิบัติหน้าที่
            (No Gift Policy) ประจำปีงบประมาณ พ.ศ. 2568
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4">
          <p className="text-sm font-semibold text-orange-700 mb-2">📋 แผนป้องกันการทุจริต</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            ดำเนินงานตามแผนปฏิบัติการป้องกันการทุจริต เพื่อยกระดับคุณธรรมและความโปร่งใส
            ตามแนวทางการประเมิน ITA
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setTab('form')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${tab === 'form' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}`}>
          📝 แจ้งเบาะแส
        </button>
        <button onClick={() => setTab('track')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${tab === 'track' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}`}>
          🔍 ติดตามสถานะ
        </button>
        <button onClick={() => setTab('channel')}
          className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${tab === 'channel' ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}`}>
          📢 ช่องทางอื่น
        </button>
      </div>

      {tab === 'form' && (
        <div className="card p-5">
          <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div className="text-xs text-red-700 leading-relaxed">
              <p className="font-semibold mb-1">ข้อมูลสำคัญก่อนแจ้งเบาะแส</p>
              <p>กรุณาระบุข้อมูลที่ชัดเจน ได้แก่ ชื่อเจ้าหน้าที่ วัน เวลา สถานที่ และพฤติการณ์ที่เกิดขึ้น
                เพื่อให้สามารถดำเนินการสอบสวนได้อย่างมีประสิทธิภาพ</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-base font-bold text-green-700 mb-2">รับเรื่องแจ้งเบาะแสเรียบร้อย</h2>
              <p className="text-sm text-gray-600 mb-1">เลขที่เรื่องร้องเรียน:</p>
              <div className="text-2xl font-bold text-red-600 mb-4">{submitted.complaintNo}</div>
              <p className="text-xs text-gray-400 mb-6">กรุณาจดเลขนี้ไว้เพื่อติดตามสถานะ ข้อมูลของท่านจะถูกเก็บเป็นความลับ</p>
              <button onClick={() => setSubmitted(null)} className="text-sm border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                แจ้งเรื่องใหม่
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <input type="checkbox" id="anon" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="w-4 h-4 accent-red-600" />
                <label htmlFor="anon" className="text-sm text-gray-700 cursor-pointer">ไม่ระบุชื่อ (ส่งแบบไม่เปิดเผยตัวตน)</label>
              </div>

              {!anonymous && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-สกุล <span className="text-red-400">*</span></label>
                    <input className="input" value={form.citizenName} onChange={e => set('citizenName', e.target.value)} placeholder="ชื่อ-สกุลผู้แจ้ง" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์โทรศัพท์ <span className="text-red-400">*</span></label>
                    <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08x-xxx-xxxx" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รายละเอียด <span className="text-red-400">*</span></label>
                <textarea rows={6} className="input resize-none" value={form.detail} onChange={e => set('detail', e.target.value)}
                  placeholder="ระบุ: ชื่อเจ้าหน้าที่/ผู้ถูกกล่าวหา, วัน เวลา สถานที่, พฤติการณ์ที่เกิดขึ้น, พยานหลักฐาน..." />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-red-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                {submitting ? 'กำลังส่งเรื่อง...' : '🚨 แจ้งเบาะแส'}
              </button>
            </form>
          )}
        </div>
      )}

      {tab === 'track' && (
        <div className="card p-5">
          <form onSubmit={handleTrack} className="flex gap-2 mb-4">
            <input className="input flex-1" value={trackNo} onChange={e => setTrackNo(e.target.value)}
              placeholder="กรอกเลขที่เรื่องร้องเรียน เช่น CP6804xxxx" />
            <button type="submit" disabled={tracking}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {tracking ? '...' : 'ค้นหา'}
            </button>
          </form>
          {trackErr && <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-600">{trackErr}</div>}
          {tracked && (() => {
            const sc = STATUS_CONFIG[tracked.status] || STATUS_CONFIG.received
            return (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">{tracked.complaintNo}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${sc.color}`}>{sc.dot} {sc.label}</span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  {tracked.isAnonymous ? <div><span className="text-gray-400 w-28 inline-block">ผู้แจ้ง</span><span className="text-gray-400">ไม่ระบุตัวตน</span></div> : null}
                  <div><span className="text-gray-400 w-28 inline-block">รายละเอียด</span><span>{tracked.detail}</span></div>
                  {tracked.officerNote && <div><span className="text-gray-400 w-28 inline-block">ผลการดำเนินการ</span><span className="text-secondary">{tracked.officerNote}</span></div>}
                  <div><span className="text-gray-400 w-28 inline-block">วันที่แจ้ง</span>
                    <span>{new Date(tracked.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {tab === 'channel' && (
        <div className="card p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">ช่องทางร้องเรียนการทุจริตเพิ่มเติม</p>
          {[
            { icon: '🏛️', label: 'สำนักงาน ป.ป.ช. ประจำจังหวัดพะเยา', desc: 'โทร 0-5441-2060', href: 'https://www.nacc.go.th/' },
            { icon: '📱', label: 'แอปพลิเคชัน NACC Space', desc: 'แจ้งเบาะแสทุจริตผ่านมือถือ', href: 'https://www.nacc.go.th/' },
            { icon: '📘', label: 'Facebook Page อบต.แม่ใส', desc: 'MaesaiSAOPhayao', href: 'https://www.facebook.com/MaesaiSAOPhayao' },
            { icon: '📞', label: 'โทรศัพท์สายตรง', desc: '0-5488-9909 ต่อ 18 (สายด่วน)', href: 'tel:054889909' },
          ].map(item => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50/50 transition-colors">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <span className="text-gray-300 text-xs">›</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
