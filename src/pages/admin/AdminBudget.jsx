import { useState, useEffect, useRef } from 'react'
import { getSettings, updateSetting, uploadExcel, uploadPdf } from '../../services/api'
import { DEFAULT_BUDGET_DATA } from '../../utils/budgetDefaults'

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

// No width utility baked in here on purpose — Tailwind's generated stylesheet order doesn't
// follow className source order, so appending a width class (w-36, flex-1, ...) after a shared
// class string that already has w-full isn't guaranteed to win the cascade. Each call site sets
// its own width class instead.
const inputCls = 'border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50 focus:bg-white'
const money = n => (Number(n) || 0).toLocaleString()

// A plain "name/amount" list the admin can add or remove rows from — used for both
// งบตามแผนงาน and เปรียบเทียบ 3 ปี (just with different field labels/keys).
function AmountList({ rows, onChange, nameKey, nameLabel, namePlaceholder, addLabel }) {
  function setRow(i, patch) {
    onChange(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r))
  }
  function removeRow(i) {
    onChange(rows.filter((_, idx) => idx !== i))
  }
  function addRow() {
    onChange([...rows, { [nameKey]: '', amount: '' }])
  }
  const total = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0)
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className={inputCls + ' flex-1'} value={r[nameKey]} placeholder={namePlaceholder}
            onChange={e => setRow(i, { [nameKey]: e.target.value })} />
          <input className={inputCls + ' w-36 text-right'} type="number" value={r.amount} placeholder="จำนวนเงิน"
            onChange={e => setRow(i, { amount: e.target.value === '' ? '' : Number(e.target.value) })} />
          <button type="button" onClick={() => removeRow(i)}
            className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 px-1" aria-label="ลบรายการ">✕</button>
        </div>
      ))}
      <button type="button" onClick={addRow}
        className="text-xs text-primary hover:underline font-medium">+ {addLabel}</button>
      {rows.length > 0 && (
        <p className="text-xs text-gray-400 pt-1">รวม {money(total)} บาท</p>
      )}
    </div>
  )
}

export default function AdminBudget() {
  const [form, setForm]       = useState(DEFAULT_BUDGET_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    getSettings()
      .then(r => { if (r?.data?.budgetData) setForm(prev => ({ ...prev, ...r.data.budgetData })) })
      .finally(() => setLoading(false))
  }, [])

  function set(key, value) { setForm(prev => ({ ...prev, [key]: value })) }
  function setCategoryAmount(i, amount) {
    setForm(prev => ({ ...prev, categories: prev.categories.map((c, idx) => idx === i ? { ...c, amount: amount === '' ? '' : Number(amount) } : c) }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSetting('budgetData', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  const categoryTotal = form.categories.reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const planTotal      = form.plans.reduce((s, p) => s + (Number(p.amount) || 0), 0)
  const revenueTotal   = form.revenue.reduce((s, r) => s + (Number(r.amount) || 0), 0)
  const mismatch = form.revenue.length > 0 && revenueTotal !== categoryTotal

  if (loading) {
    return <div className="text-center text-gray-400 text-sm py-24">กำลังโหลด...</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">💰 งบประมาณ</h1>
          <p className="text-xs text-gray-400 mt-1">ข้อมูลที่แสดงในหน้า "งบประมาณ" (/budget) ของเว็บ</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-60 ${
            saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:opacity-90'
          }`}>
          {saving ? 'กำลังบันทึก...' : saved ? '✓ บันทึกแล้ว' : '💾 บันทึก'}
        </button>
      </div>

      <Section icon="📅" title="ปีงบประมาณ">
        <input className={inputCls + ' w-full max-w-[200px]'} value={form.fiscalYear}
          onChange={e => set('fiscalYear', e.target.value)} placeholder="เช่น 2570" />
      </Section>

      <Section icon="📊" title="สัดส่วนงบประมาณรายจ่ายตามหมวด" subtitle={`รวม ${money(categoryTotal)} บาท`}>
        <div className="space-y-2">
          {form.categories.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-center text-lg flex-shrink-0">{c.icon}</span>
              <span className="flex-1 text-sm text-gray-700">{c.label}</span>
              <input className={inputCls + ' w-40 text-right'} type="number" value={c.amount}
                onChange={e => setCategoryAmount(i, e.target.value)} />
            </div>
          ))}
        </div>
      </Section>

      <Section icon="📋" title="งบประมาณรายจ่ายตามแผนงาน" subtitle={planTotal !== categoryTotal ? `รวม ${money(planTotal)} บาท — ⚠️ ไม่เท่ากับผลรวมตามหมวด (${money(categoryTotal)})` : `รวม ${money(planTotal)} บาท`}>
        <AmountList rows={form.plans} onChange={v => set('plans', v)}
          nameKey="name" namePlaceholder="ชื่อแผนงาน เช่น การศึกษา" addLabel="เพิ่มแผนงาน" />
      </Section>

      <Section icon="💵" title="รายได้ (ไม่บังคับ)" subtitle="ยังไม่มีข้อมูลประมาณการรายรับ ปี 2570 — กรอกเองได้เมื่อมีเอกสาร">
        <AmountList rows={form.revenue} onChange={v => set('revenue', v)}
          nameKey="label" namePlaceholder="เช่น รายได้จัดเก็บเอง" addLabel="เพิ่มแหล่งรายได้" />
        {mismatch && (
          <p className="text-xs text-amber-600 mt-2">⚠️ รวมรายได้ ({money(revenueTotal)}) ไม่เท่ากับรวมรายจ่ายตามหมวด ({money(categoryTotal)}) — งบประมาณปกติควรรายรับเท่ากับรายจ่ายพอดี</p>
        )}
      </Section>

      <Section icon="📈" title="เปรียบเทียบงบประมาณย้อนหลัง">
        <AmountList rows={form.yearComparison} onChange={v => set('yearComparison', v)}
          nameKey="year" namePlaceholder="ปี พ.ศ. เช่น 2569" addLabel="เพิ่มปี" />
      </Section>

      <Section icon="📄" title="เอกสารฉบับเต็ม" subtitle="แนบไฟล์ (PDF/Excel) หรือใส่ลิงก์เองก็ได้ — ใช้สำหรับปุ่มดาวน์โหลดในหน้าเว็บ">
        <DocumentUpload value={form.pdfUrl} onChange={v => set('pdfUrl', v)} />
      </Section>

    </div>
  )
}

function DocumentUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const isExcel = /\.(xlsx|xls)$/i.test(file.name)
      const r = isExcel ? await uploadExcel(file) : await uploadPdf(file)
      onChange(r.data.url)
    } catch {
      setError('อัปโหลดไม่สำเร็จ ลองใหม่ หรือวางลิงก์เองด้านล่าง')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input className={inputCls + ' w-full'} value={value}
        onChange={e => onChange(e.target.value)} placeholder="https://... (หรืออัปโหลดไฟล์ด้านล่าง)" />
      <div className="flex items-center gap-2">
        <label className={`text-xs px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-primary/40 transition-colors inline-flex items-center gap-1.5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? '⏳ กำลังอัปโหลด...' : '📎 อัปโหลดไฟล์ (PDF/Excel)'}
          <input ref={inputRef} type="file" accept=".pdf,.xlsx,.xls" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">ตรวจสอบลิงก์ →</a>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
