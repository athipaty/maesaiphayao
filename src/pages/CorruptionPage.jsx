import { useState } from 'react'
import { submitComplaint, trackComplaint } from '../services/api'
import PhotoUploader from '../components/PhotoUploader'

const STATUS_CONFIG = {
  received:     { label: 'รับเรื่องแล้ว',  color: 'bg-blue-100 text-blue-700',    dot: '🔵' },
  investigating:{ label: 'กำลังสอบสวน',   color: 'bg-yellow-100 text-yellow-700', dot: '🟡' },
  done:         { label: 'ดำเนินการเสร็จ', color: 'bg-green-100 text-green-700',  dot: '🟢' },
  rejected:     { label: 'ไม่รับเรื่อง',    color: 'bg-red-100 text-red-600',      dot: '🔴' },
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all bg-white placeholder-gray-300'

export default function CorruptionPage() {
  const [tab, setTab]             = useState('form')
  const [anonymous, setAnonymous] = useState(false)
  const [form, setForm]           = useState({ citizenName: '', phone: '', detail: '', attachments: [] })
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
        type: 'corruption', isAnonymous: anonymous, detail: form.detail,
        citizenName: anonymous ? '' : form.citizenName,
        phone: anonymous ? '' : form.phone,
        attachments: form.attachments,
      })
      setSubmitted(r.data)
      setForm({ citizenName: '', phone: '', detail: '', attachments: [] })
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
          <h1 className="text-sm font-semibold">🚨 ร้องเรียนการทุจริตและประพฤติมิชอบ</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ช่องทางรับแจ้งเบาะแสการทุจริต ประพฤติมิชอบของเจ้าหน้าที่ ข้อมูลของผู้แจ้งจะได้รับการคุ้มครอง
          ตามพระราชบัญญัติคุ้มครองผู้แจ้งเบาะแส การแจ้งข้อมูลเท็จมีความผิดตามกฎหมาย
        </div>
      </div>

      {/* Policy cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
          <p className="text-sm font-semibold text-red-700 mb-1.5">🎗️ No Gift Policy</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            อบต.แม่ใส ประกาศนโยบายไม่รับของขวัญและของกำนัลทุกชนิดจากการปฏิบัติหน้าที่
            (No Gift Policy) ประจำปีงบประมาณ พ.ศ. 2568
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4">
          <p className="text-sm font-semibold text-orange-700 mb-1.5">📋 แผนป้องกันการทุจริต</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            ดำเนินงานตามแผนปฏิบัติการป้องกันการทุจริต เพื่อยกระดับคุณธรรมและความโปร่งใส
            ตามแนวทางการประเมิน ITA
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'form',    label: '📝 แจ้งเบาะแส',    active: 'bg-red-600 text-white border-red-600', hover: 'hover:border-red-400 hover:text-red-500' },
          { key: 'track',   label: '🔍 ติดตามสถานะ',   active: 'bg-primary text-white border-primary', hover: 'hover:border-primary hover:text-primary' },
          { key: 'channel', label: '📢 ช่องทางอื่น',   active: 'bg-primary text-white border-primary', hover: 'hover:border-primary hover:text-primary' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`text-xs px-4 py-2 rounded-full border font-medium transition-colors ${
              tab === t.key ? t.active : `border-gray-200 text-gray-500 bg-white ${t.hover}`
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── FORM TAB ── */}
      {tab === 'form' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Warning */}
          <div className="mb-5 bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div className="text-xs text-red-700 leading-relaxed">
              <p className="font-semibold mb-1">ข้อมูลสำคัญก่อนแจ้งเบาะแส</p>
              <p>กรุณาระบุข้อมูลที่ชัดเจน ได้แก่ ชื่อเจ้าหน้าที่ วัน เวลา สถานที่ และพฤติการณ์ที่เกิดขึ้น
                เพื่อให้สามารถดำเนินการสอบสวนได้อย่างมีประสิทธิภาพ</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-base font-bold text-green-700 mb-2">รับเรื่องแจ้งเบาะแสเรียบร้อย</h2>
              <p className="text-sm text-gray-500 mb-2">เลขที่เรื่องร้องเรียนของคุณ</p>
              <div className="inline-block bg-red-50 border border-red-200 rounded-xl px-6 py-3 mb-4">
                <span className="text-2xl font-bold text-red-600 tracking-widest">{submitted.complaintNo}</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">กรุณาจดเลขนี้ไว้เพื่อติดตามสถานะ ข้อมูลของท่านจะถูกเก็บเป็นความลับ</p>
              <button onClick={() => setSubmitted(null)}
                className="text-sm border-2 border-red-500 text-red-500 px-8 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-colors font-medium">
                แจ้งเรื่องใหม่
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Anonymous toggle */}
              <label className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5 cursor-pointer hover:bg-gray-100 transition-colors">
                <input type="checkbox" checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)} className="w-4 h-4 accent-red-600 flex-shrink-0" />
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
                      onChange={e => set('citizenName', e.target.value)} placeholder="ชื่อ-สกุลผู้แจ้ง" />
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
                <textarea rows={6} className={inputCls + ' resize-none'} value={form.detail}
                  onChange={e => set('detail', e.target.value)}
                  placeholder="ระบุ: ชื่อเจ้าหน้าที่/ผู้ถูกกล่าวหา, วัน เวลา สถานที่, พฤติการณ์ที่เกิดขึ้น, พยานหลักฐาน..." />
              </div>

              <PhotoUploader photos={form.attachments} onChange={urls => set('attachments', urls)} />

              <button type="submit" disabled={submitting}
                className="w-full bg-red-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm">
                {submitting ? 'กำลังส่งเรื่อง...' : '🚨 แจ้งเบาะแส'}
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
              onChange={e => setTrackNo(e.target.value)} placeholder="เช่น CP6804xxxx" />
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
                    ? <div className="flex gap-3"><span className="text-gray-400 w-28 flex-shrink-0">ผู้แจ้ง</span><span className="text-gray-400 italic">ไม่ระบุตัวตน</span></div>
                    : null
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

      {/* ── CHANNEL TAB ── */}
      {tab === 'channel' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">📢 ช่องทางร้องเรียนการทุจริต (O17)</p>
            <div className="space-y-2">
              {[
                { icon: '🏛️', label: 'สำนักงาน ป.ป.ช. ประจำจังหวัดพะเยา', desc: 'โทร 0-5441-2060', href: 'https://www.nacc.go.th/' },
                { icon: '📱', label: 'แอปพลิเคชัน NACC Space', desc: 'แจ้งเบาะแสทุจริตผ่านมือถือ (ป.ป.ช.)', href: 'https://www.nacc.go.th/' },
                { icon: '🏢', label: 'สำนักงาน ป.ป.ท. (เขต 5 เชียงใหม่)', desc: 'โทร 0-5389-1599 | www.pacc.go.th', href: 'https://www.pacc.go.th/' },
                { icon: '📲', label: 'แอปพลิเคชัน PACC', desc: 'แจ้งเบาะแสผ่าน ป.ป.ท.', href: 'https://www.pacc.go.th/' },
                { icon: '📘', label: 'Facebook Page อบต.แม่ใส', desc: 'MaesaiSAOPhayao', href: 'https://www.facebook.com/MaesaiSAOPhayao' },
                { icon: '📞', label: 'โทรศัพท์สายตรง', desc: '0-5488-9909 ต่อ 18 (สายด่วน)', href: 'tel:054889909' },
              ].map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/50 transition-colors">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-gray-300">›</span>
                </a>
              ))}
            </div>
          </div>

          {/* O18 สถิติ */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="section-head" style={{ background: 'linear-gradient(135deg, #c0392b, #e74c3c)' }}>
              <h2 className="text-sm font-semibold">📈 สถิติเรื่องร้องเรียนการทุจริต (O18)</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-400 mb-4">ข้อมูลสถิติ ประจำปีงบประมาณ 2568 (1 ต.ค. 67 – 30 ก.ย. 68)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'รับเรื่องทั้งหมด',   value: '0', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { label: 'อยู่ระหว่างสอบสวน',  value: '0', cls: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                  { label: 'ดำเนินการเสร็จแล้ว', value: '0', cls: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'ไม่รับเรื่อง',        value: '0', cls: 'bg-gray-50 border-gray-200 text-gray-600' },
                ].map(s => (
                  <div key={s.label} className={`text-center p-4 rounded-xl border ${s.cls}`}>
                    <div className="text-3xl font-bold">{s.value}</div>
                    <div className="text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">ดาวน์โหลดรายงานสถิติฉบับสมบูรณ์ (PDF/Excel)</span>
                <span className="text-xs text-gray-400 italic">— อยู่ระหว่างจัดทำ —</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}