import { useState, useEffect } from 'react'
import ImageUpload from '../../components/ImageUpload'
import { getSettings, updateSetting } from '../../services/api'

function Section({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50 focus:bg-white'

export default function AdminSettings() {
  const [form, setForm]     = useState({ mayorName: '', mayorPosition: '', mayorPhone: '', mayorImage: '', logoImage: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    getSettings()
      .then(r => { if (r?.data) setForm(prev => ({ ...prev, ...r.data })) })
      .finally(() => setLoading(false))
  }, [])

  function set(key, value) { setForm(prev => ({ ...prev, [key]: value })) }

  async function handleSave() {
    setSaving(true)
    try {
      await Promise.all(Object.entries(form).map(([key, value]) => updateSetting(key, value)))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-sm">กำลังโหลด...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">⚙️ ตั้งค่าเว็บไซต์</h1>
          <p className="text-xs text-gray-400 mt-1">ข้อมูลนายก โลโก้ และการตั้งค่าทั่วไป</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-60 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:opacity-90'
          }`}>
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              บันทึก...
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              บันทึกแล้ว
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              บันทึกการตั้งค่า
            </>
          )}
        </button>
      </div>

      <div className="space-y-5">

        {/* Mayor info */}
        <Section icon="👤" title="ข้อมูลนายกองค์การบริหารส่วนตำบล" subtitle="แสดงในกล่องด้านข้างของเว็บไซต์">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
              <Field label="ชื่อ-นามสกุล">
                <input className={inputCls} value={form.mayorName}
                  onChange={e => set('mayorName', e.target.value)}
                  placeholder="เช่น นายสันติ สารเร็ว" />
              </Field>
              <Field label="ตำแหน่ง">
                <input className={inputCls} value={form.mayorPosition}
                  onChange={e => set('mayorPosition', e.target.value)}
                  placeholder="เช่น นายกองค์การบริหารส่วนตำบลแม่ใส" />
              </Field>
              <Field label="เบอร์โทรศัพท์">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm">📞</span>
                  <input className={`${inputCls} pl-9`} value={form.mayorPhone}
                    onChange={e => set('mayorPhone', e.target.value)}
                    placeholder="08x-xxx-xxxx" />
                </div>
              </Field>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">รูปภาพ</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-primary/40 transition-colors bg-gray-50">
                <ImageUpload value={form.mayorImage} onChange={url => set('mayorImage', url)} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 text-center">แนะนำขนาด 100×150 px</p>
            </div>
          </div>
        </Section>

        {/* Logo */}
        <Section icon="🏛️" title="โลโก้เว็บไซต์" subtitle="แสดงในแถบ Header มุมบนซ้าย">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-3">แนะนำรูปแบบ PNG พื้นหลังโปร่งใส ขนาด 200×200 px</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-primary/40 transition-colors bg-gray-50 max-w-xs">
                <ImageUpload value={form.logoImage} onChange={url => set('logoImage', url)} />
              </div>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">ตัวอย่างใน Header</p>
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-3 flex items-center gap-2.5 min-w-[160px]">
                {form.logoImage ? (
                  <img src={form.logoImage} alt="logo" className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/40" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 border-2 border-white/40">
                    อบต.
                  </div>
                )}
                <div>
                  <p className="text-white text-xs font-bold leading-tight">อบต.แม่ใส</p>
                  <p className="text-white/60 text-[10px]">แม่ใส · พะเยา</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Sidebar preview */}
        <Section icon="👁" title="ตัวอย่าง Sidebar Card" subtitle="แสดงผลจริงในเว็บไซต์">
          <div className="flex items-center justify-center py-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4 w-full max-w-xs">
              {form.mayorImage ? (
                <img src={form.mayorImage} alt="preview"
                  className="flex-shrink-0 rounded-lg border-2 border-yellow-400 object-cover object-top"
                  style={{ width: 72, height: 108 }} />
              ) : (
                <div className="flex-shrink-0 rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-3xl"
                  style={{ width: 72, height: 108 }}>👤</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary leading-snug truncate">
                  {form.mayorName || <span className="text-gray-300">ชื่อ-นามสกุล</span>}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                  {form.mayorPosition || <span className="text-gray-300">ตำแหน่ง</span>}
                </p>
                <p className="text-xs text-secondary mt-1.5 font-medium">
                  {form.mayorPhone || <span className="text-gray-300">เบอร์โทร</span>}
                </p>
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  )
}
