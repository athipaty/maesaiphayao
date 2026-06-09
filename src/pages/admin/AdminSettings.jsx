import { useState, useEffect, useRef } from 'react'
import ImageUpload from '../../components/ImageUpload'
import { getSettings, updateSetting, uploadImage } from '../../services/api'

function LogoUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const r = await uploadImage(file)
      onChange(r.data.url)
    } catch { alert('อัปโหลดไม่สำเร็จ') }
    finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 bg-gray-50 hover:bg-primary/5">
      {value ? (
        <img src={value} alt="logo preview" className="w-full h-auto block" />
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
          <span className="text-4xl mb-2">🏛️</span>
          <p className="text-xs">ยังไม่มีโลโก้</p>
        </div>
      )}
      <div className="border-t border-gray-100 bg-white px-4 py-2.5 flex items-center gap-3">
        <label className={`btn-ghost text-xs cursor-pointer inline-flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? '⏳ กำลังอัปโหลด...' : value ? '🔄 เปลี่ยนรูป' : '📷 อัปโหลดโลโก้'}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange('')}
            className="text-xs text-red-400 hover:text-red-600 transition-colors">
            ลบรูป
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ icon, title, subtitle, delay = 0, children }) {
  return (
    <div
      style={{ animation: `fadeSlideUp 0.45s ease both`, animationDelay: `${delay}ms` }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
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

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50 focus:bg-white focus:scale-[1.01]'

export default function AdminSettings() {
  const [form, setForm]     = useState({ mayorName: '', mayorPosition: '', mayorPhone: '', mayorImage: '', logoImage: '', egpDeptSubId: '', egpDeptId: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [saveKey, setSaveKey] = useState(0)

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
      setSaveKey(k => k + 1)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-gray-400" style={{ animation: 'fadeSlideDown 0.3s ease both' }}>
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
      <div className="flex items-center justify-between mb-6"
        style={{ animation: 'fadeSlideDown 0.35s ease both' }}>
        <div>
          <h1 className="text-xl font-bold text-gray-800">⚙️ ตั้งค่าเว็บไซต์</h1>
          <p className="text-xs text-gray-400 mt-1">ข้อมูลนายก โลโก้ และการตั้งค่าทั่วไป</p>
        </div>
        <button
          key={saveKey}
          onClick={handleSave}
          disabled={saving}
          style={saved ? { animation: 'successPop 0.35s ease' } : {}}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300 active:scale-95 disabled:opacity-60 ${
            saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:opacity-90 hover:shadow-md'
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

        {/* Mayor info + Sidebar preview side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <Section delay={80} icon="👤" title="ข้อมูลนายกองค์การบริหารส่วนตำบล" subtitle="แสดงในกล่องด้านข้างของเว็บไซต์">
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">รูปภาพ</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-primary/40 transition-all duration-300 bg-gray-50 w-48 hover:bg-primary/5">
                  <ImageUpload value={form.mayorImage} onChange={url => set('mayorImage', url)} />
                </div>
                <p className="text-xs text-gray-400">แนะนำขนาด 100×150 px</p>
              </div>
              <div className="w-full space-y-4">
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
            </div>
          </Section>

          {/* Sidebar preview */}
          <Section delay={120} icon="👁" title="ตัวอย่าง Sidebar Card" subtitle="แสดงผลจริงในเว็บไซต์">
            <div className="flex items-center justify-center py-2">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4 w-full max-w-xs transition-all duration-500">
                {form.mayorImage ? (
                  <img src={form.mayorImage} alt="preview"
                    className="flex-shrink-0 rounded-lg border-2 border-yellow-400 object-cover object-top transition-all duration-500"
                    style={{ width: 72, height: 108 }} />
                ) : (
                  <div className="flex-shrink-0 rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-3xl"
                    style={{ width: 72, height: 108 }}>👤</div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary leading-snug truncate transition-all duration-300">
                    {form.mayorName || <span className="text-gray-300">ชื่อ-นามสกุล</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2 transition-all duration-300">
                    {form.mayorPosition || <span className="text-gray-300">ตำแหน่ง</span>}
                  </p>
                  <p className="text-xs text-secondary mt-1.5 font-medium transition-all duration-300">
                    {form.mayorPhone || <span className="text-gray-300">เบอร์โทร</span>}
                  </p>
                </div>
              </div>
            </div>
          </Section>

        </div>

        {/* Logo */}
        <Section delay={160} icon="🏛️" title="โลโก้เว็บไซต์" subtitle="แสดงในแถบ Header มุมบนซ้าย">
          <p className="text-xs text-gray-400 mb-3">แนะนำรูปแบบ PNG พื้นหลังโปร่งใส ขนาด 200×200 px</p>
          <LogoUpload value={form.logoImage} onChange={url => set('logoImage', url)} />
          {form.logoImage && (
            <div className="mt-4" style={{ animation: 'scaleIn 0.3s ease both' }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">ตัวอย่างใน Header</p>
              <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-3 flex items-center gap-2.5">
                <img src={form.logoImage} alt="logo" className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/40" />
                <div>
                  <p className="text-white text-xs font-bold leading-tight">อบต.แม่ใส</p>
                  <p className="text-white/60 text-[10px]">แม่ใส · พะเยา</p>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* e-GP */}
        <Section delay={220} icon="📋" title="ระบบ e-GP (จัดซื้อจัดจ้าง)" subtitle="รหัสหน่วยงานสำหรับดึงข้อมูลจาก e-GP RSS — ต้องกรอกอย่างใดอย่างหนึ่ง">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 space-y-1">
              <p className="font-semibold">วิธีหารหัส:</p>
              <p>1. ไปที่ <a href="https://www.gprocurement.go.th" target="_blank" rel="noreferrer" className="underline">www.gprocurement.go.th</a></p>
              <p>2. คลิก "ลงทะเบียนได้ที่นี่" → "การลงทะเบียนหน่วยงานภาครัฐ"</p>
              <p>3. ค้นหาชื่อหน่วยงาน → ดู <strong>รหัสหน่วยงาน (4 หลัก)</strong></p>
              <p>4. ค้นหาชื่อหน่วยจัดซื้อย่อย → ดู <strong>รหัสหน่วยจัดซื้อย่อย (10 หลัก)</strong></p>
            </div>
            <Field label="รหัสหน่วยจัดซื้อย่อย — deptsubId (10 หลัก) แนะนำ" hint="เช่น 0300400070 — ใช้กรองเฉพาะหน่วยงานของท่าน (แม่นยำกว่า)">
              <div className="flex gap-2">
                <input className={inputCls} value={form.egpDeptSubId || ''} onChange={e => set('egpDeptSubId', e.target.value.trim())} placeholder="0300400070" />
                {form.egpDeptSubId && (
                  <a href={`https://process3.gprocurement.go.th/EPROCRssFeedWeb/egpannouncerss.xml?deptsubId=${form.egpDeptSubId}&anounceType=W0`}
                    target="_blank" rel="noreferrer"
                    className="flex-shrink-0 flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 rounded-xl hover:bg-blue-100 transition-colors">
                    ทดสอบ →
                  </a>
                )}
              </div>
            </Field>
            <Field label="รหัสหน่วยงานหลัก — deptId (4 หลัก) สำรอง" hint="เช่น 0304 — ใช้ถ้าไม่มี deptsubId">
              <input className={inputCls} value={form.egpDeptId || ''} onChange={e => set('egpDeptId', e.target.value.trim())} placeholder="0304" />
            </Field>
          </div>
        </Section>

      </div>
    </div>
  )
}
