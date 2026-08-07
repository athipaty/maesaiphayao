import { useState } from 'react'
import { submitSurveyResponse } from '../services/api'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all bg-white placeholder-gray-300'

const CRITERIA = [
  { key: 'process',  label: 'ด้านกระบวนการ/ขั้นตอนการให้บริการ' },
  { key: 'staff',    label: 'ด้านเจ้าหน้าที่ผู้ให้บริการ' },
  { key: 'facility', label: 'ด้านสิ่งอำนวยความสะดวก' },
  { key: 'quality',  label: 'ด้านคุณภาพการให้บริการ/ผลลัพธ์' },
]

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`text-2xl leading-none transition-transform hover:scale-110 ${n <= value ? 'text-amber-400' : 'text-gray-200'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

const EMPTY_RATINGS = { process: 0, staff: 0, facility: 0, quality: 0 }

export default function SurveyPage() {
  const [ratings, setRatings]   = useState(EMPTY_RATINGS)
  const [form, setForm]         = useState({ serviceUsed: '', comment: '', name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [err, setErr]               = useState('')

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }
  function setRating(k, v) { setRatings(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (CRITERIA.some(c => !ratings[c.key])) {
      setErr('กรุณาให้คะแนนครบทุกหัวข้อ')
      return
    }
    setErr('')
    setSubmitting(true)
    try {
      await submitSurveyResponse({ ...form, ratings })
      setSubmitted(true)
      setRatings(EMPTY_RATINGS)
      setForm({ serviceUsed: '', comment: '', name: '', phone: '' })
    } catch (error) {
      setErr(error?.response?.data?.error || error.message)
    } finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📊 แบบสำรวจความพึงพอใจ</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          แบบสำรวจความพึงพอใจต่อการให้บริการ เพื่อนำผลไปใช้ปรับปรุงคุณภาพการให้บริการประชาชน
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-base font-bold text-green-700 mb-2">ส่งแบบสำรวจสำเร็จ</h2>
            <p className="text-sm text-gray-500 mb-6">ขอบคุณสำหรับความคิดเห็นของท่าน</p>
            <button onClick={() => setSubmitted(false)}
              className="text-sm border-2 border-primary text-primary px-8 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-colors font-medium">
              ทำแบบสำรวจใหม่
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">บริการ/งานที่มาติดต่อ</label>
              <input className={inputCls} value={form.serviceUsed}
                onChange={e => set('serviceUsed', e.target.value)} placeholder="เช่น งานทะเบียนราษฎร์, กองช่าง (ถ้ามี)" />
            </div>

            <div className="space-y-4">
              {CRITERIA.map(c => (
                <div key={c.key} className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl px-4 py-3.5">
                  <span className="text-sm font-medium text-gray-700">{c.label}</span>
                  <StarRating value={ratings[c.key]} onChange={v => setRating(c.key, v)} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อ-สกุล</label>
                <input className={inputCls} value={form.name}
                  onChange={e => set('name', e.target.value)} placeholder="ระบุชื่อ-สกุล (ถ้ามี)" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                <input className={inputCls} value={form.phone}
                  onChange={e => set('phone', e.target.value)} placeholder="08x-xxx-xxxx (ถ้ามี)" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ข้อเสนอแนะเพิ่มเติม</label>
              <textarea rows={4} className={inputCls + ' resize-none'} value={form.comment}
                onChange={e => set('comment', e.target.value)}
                placeholder="ข้อเสนอแนะเพิ่มเติม (ถ้ามี)..." />
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                ⚠️ {err}
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm">
              {submitting ? 'กำลังส่ง...' : '📤 ส่งแบบสำรวจ'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
