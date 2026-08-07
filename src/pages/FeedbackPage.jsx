import { useState } from 'react'
import { submitFeedback } from '../services/api'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all bg-white placeholder-gray-300'

export default function FeedbackPage() {
  const [anonymous, setAnonymous] = useState(false)
  const [form, setForm]           = useState({ topic: '', message: '', name: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [err, setErr]               = useState('')

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.message.trim()) {
      setErr('กรุณากรอกความคิดเห็นก่อนส่ง')
      return
    }
    setErr('')
    setSubmitting(true)
    try {
      await submitFeedback({ ...form, isAnonymous: anonymous })
      setSubmitted(true)
      setForm({ topic: '', message: '', name: '', phone: '' })
      setAnonymous(false)
    } catch (error) {
      setErr(error?.response?.data?.error || error.message)
    } finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">💭 ช่องทางรับฟังความคิดเห็น</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ช่องทางรับฟังความคิดเห็น ข้อเสนอแนะ และข้อคิดเห็นต่างๆ จากประชาชน
          เพื่อนำไปปรับปรุงและพัฒนาการให้บริการให้ดียิ่งขึ้น
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-base font-bold text-green-700 mb-2">ส่งความคิดเห็นสำเร็จ</h2>
            <p className="text-sm text-gray-500 mb-6">ขอบคุณสำหรับความคิดเห็นของท่าน</p>
            <button onClick={() => setSubmitted(false)}
              className="text-sm border-2 border-primary text-primary px-8 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-colors font-medium">
              ส่งความคิดเห็นใหม่
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">หัวข้อ</label>
              <input className={inputCls} value={form.topic}
                onChange={e => set('topic', e.target.value)} placeholder="หัวข้อความคิดเห็น (ถ้ามี)" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ความคิดเห็น / ข้อเสนอแนะ <span className="text-red-400">*</span>
              </label>
              <textarea rows={6} className={inputCls + ' resize-none'} value={form.message} required
                onChange={e => set('message', e.target.value)}
                placeholder="เล่ารายละเอียดความคิดเห็นหรือข้อเสนอแนะของท่าน..." />
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                ⚠️ {err}
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm">
              {submitting ? 'กำลังส่ง...' : '📤 ส่งความคิดเห็น'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
