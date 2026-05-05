import { useState, useEffect } from 'react'
import { getOIT, getOITYears, saveOIT, updateOIT, deleteOIT } from '../../services/api'

const STATUSES = [
  { value: 'complete',   label: 'ครบถ้วน',    color: 'bg-green-50 text-green-700' },
  { value: 'incomplete', label: 'ไม่ครบ',      color: 'bg-red-50 text-red-600' },
  { value: 'pending',    label: 'รอดำเนินการ', color: 'bg-yellow-50 text-yellow-700' },
]

const OIT_DEFAULTS_2568 = [
  { itemNo: 1,  title: 'โครงสร้าง',                                                        category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 2,  title: 'ข้อมูลผู้บริหาร',                                                   category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 3,  title: 'อำนาจหน้าที่',                                                       category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 4,  title: 'ข้อมูลการติดต่อ',                                                   category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 5,  title: 'ข่าวประชาสัมพันธ์',                                                 category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 6,  title: 'Q&A',                                                               category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 7,  title: 'Social Network',                                                    category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 8,  title: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล',                                    category: 'ข้อมูลพื้นฐาน' },
  { itemNo: 9,  title: 'แผนดำเนินงานและการใช้งบประมาณประจำปี',                              category: 'การบริหารงาน' },
  { itemNo: 10, title: 'รายงานการกำกับติดตามการดำเนินงานฯ รอบ 6 เดือน',                    category: 'การบริหารงาน' },
  { itemNo: 11, title: 'รายงานผลการดำเนินงานประจำปี',                                       category: 'การบริหารงาน' },
  { itemNo: 12, title: 'คู่มือหรือมาตรฐานการปฏิบัติงาน',                                   category: 'การบริหารงาน' },
  { itemNo: 13, title: 'คู่มือหรือมาตรฐานการให้บริการ',                                     category: 'การบริหารงาน' },
  { itemNo: 14, title: 'ข้อมูลเชิงสถิติการให้บริการ',                                       category: 'การบริหารงาน' },
  { itemNo: 15, title: 'รายงานผลการสำรวจความพึงพอใจการให้บริการ',                           category: 'การบริหารงาน' },
  { itemNo: 16, title: 'E-Service',                                                         category: 'การบริหารงาน' },
  { itemNo: 17, title: 'แผนการจัดซื้อจัดจ้างหรือแผนการจัดหาพัสดุ',                        category: 'การจัดซื้อจัดจ้าง' },
  { itemNo: 18, title: 'ประกาศต่าง ๆ เกี่ยวกับการจัดซื้อจัดจ้างหรือการจัดหาพัสดุ',        category: 'การจัดซื้อจัดจ้าง' },
  { itemNo: 19, title: 'ความก้าวหน้าการจัดซื้อจัดจ้างหรือการจัดหาพัสดุ',                  category: 'การจัดซื้อจัดจ้าง' },
  { itemNo: 20, title: 'รายงานสรุปผลการจัดซื้อจัดจ้างหรือการจัดหาพัสดุประจำปี',           category: 'การจัดซื้อจัดจ้าง' },
  { itemNo: 21, title: 'นโยบายหรือแผนการบริหารทรัพยากรบุคคล',                              category: 'การบริหารทรัพยากรบุคคล' },
  { itemNo: 22, title: 'การดำเนินการตามนโยบายหรือแผนการบริหารทรัพยากรบุคคล',              category: 'การบริหารทรัพยากรบุคคล' },
  { itemNo: 23, title: 'หลักเกณฑ์การบริหารและพัฒนาทรัพยากรบุคคล',                          category: 'การบริหารทรัพยากรบุคคล' },
  { itemNo: 24, title: 'รายงานผลการบริหารและพัฒนาทรัพยากรบุคคลประจำปี',                   category: 'การบริหารทรัพยากรบุคคล' },
  { itemNo: 25, title: 'แนวปฏิบัติการจัดการเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ',       category: 'ส่งเสริมความโปร่งใส' },
  { itemNo: 26, title: 'ช่องทางแจ้งเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ',               category: 'ส่งเสริมความโปร่งใส' },
]

const EMPTY_FORM = { fiscalYear: '', itemNo: '', title: '', category: '', description: '', links: [{ label: '', url: '' }], fileUrl: '', fileName: '', status: 'pending', note: '' }

export default function AdminIta() {
  const [years, setYears]       = useState([])
  const [year, setYear]         = useState('')
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [initYear, setInitYear] = useState('')
  const [initing, setIniting]   = useState(false)

  useEffect(() => {
    getOITYears()
      .then(r => {
        const list = r?.data || []
        setYears(list)
        if (list.length) setYear(list[0])
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!year) return
    setLoading(true)
    getOIT({ year })
      .then(r => setItems(r?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [year])

  function openEdit(item) {
    setForm({
      ...item,
      links: item.links?.length ? item.links : [{ label: '', url: '' }],
    })
    setEditId(item._id)
    setShowForm(true)
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM, fiscalYear: year })
    setEditId(null)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const cleanLinks = form.links.filter(l => l.url)
      const payload = { ...form, links: cleanLinks }
      if (editId) {
        await updateOIT(editId, payload)
      } else {
        await saveOIT(payload)
      }
      setShowForm(false)
      const r = await getOIT({ year })
      setItems(r?.data || [])
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err?.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('ยืนยันการลบ?')) return
    await deleteOIT(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  async function handleInit() {
    if (!initYear.trim()) return alert('กรอกปีงบประมาณก่อน')
    if (!window.confirm(`สร้าง OIT 26 ข้อ สำหรับปีงบประมาณ ${initYear}?`)) return
    setIniting(true)
    try {
      for (const d of OIT_DEFAULTS_2568) {
        await saveOIT({ ...d, fiscalYear: initYear, status: 'pending' })
      }
      const list = [...new Set([...years, initYear])].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      setYears(list)
      setYear(initYear)
      setInitYear('')
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + (err?.response?.data?.error || err.message))
    } finally {
      setIniting(false)
    }
  }

  function setLink(i, key, val) {
    setForm(p => {
      const links = [...p.links]
      links[i] = { ...links[i], [key]: val }
      return { ...p, links }
    })
  }

  const complete = items.filter(i => i.status === 'complete').length
  const statusColor = (s) => STATUSES.find(x => x.value === s)?.color || ''
  const statusLabel = (s) => STATUSES.find(x => x.value === s)?.label || s

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-800">🏆 จัดการ ITA / OIT</h1>
        <button onClick={openAdd} className="btn-primary text-xs">+ เพิ่มรายการ</button>
      </div>

      {/* Init year section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">สร้าง OIT 26 ข้อ สำหรับปีงบประมาณ:</span>
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-28"
          value={initYear} onChange={e => setInitYear(e.target.value)}
          placeholder="เช่น 2568"
        />
        <button onClick={handleInit} disabled={initing}
          className="bg-secondary text-white text-xs px-4 py-2 rounded-lg hover:bg-secondary/90 disabled:opacity-50">
          {initing ? 'กำลังสร้าง...' : '✨ สร้างอัตโนมัติ'}
        </button>
      </div>

      {/* Year tabs */}
      {years.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {years.map(y => (
            <button key={y} onClick={() => setYear(y)}
              className={`text-xs px-4 py-1.5 rounded-full border font-medium transition-colors ${
                year === y ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}>
              ปี {y}
            </button>
          ))}
        </div>
      )}

      {/* Progress */}
      {items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>ความครบถ้วน</span>
              <span className="font-semibold text-primary">{complete}/{items.length}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${(complete / items.length) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold">{editId ? '✏️ แก้ไข OIT' : '➕ เพิ่ม OIT'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ปีงบประมาณ</label>
                  <input className="input" value={form.fiscalYear} onChange={e => setForm(p => ({...p, fiscalYear: e.target.value}))} placeholder="เช่น 2568" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ข้อที่ (O1-O26)</label>
                  <input type="number" min="1" max="26" className="input" value={form.itemNo} onChange={e => setForm(p => ({...p, itemNo: e.target.value}))} placeholder="1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อหัวข้อ</label>
                <input className="input" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="เช่น โครงสร้าง" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">หมวดหมู่</label>
                <input className="input" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} placeholder="เช่น ข้อมูลพื้นฐาน" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">คำอธิบาย</label>
                <textarea rows={2} className="input resize-none" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="คำอธิบายหัวข้อ..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ลิงก์หลักฐาน</label>
                {form.links.map((l, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input flex-1" value={l.label} onChange={e => setLink(i, 'label', e.target.value)} placeholder="ชื่อลิงก์" />
                    <input className="input flex-2" value={l.url} onChange={e => setLink(i, 'url', e.target.value)} placeholder="https://..." style={{ flex: 2 }} />
                    {i > 0 && (
                      <button onClick={() => setForm(p => ({ ...p, links: p.links.filter((_, j) => j !== i) }))}
                        className="text-red-400 hover:text-red-600 text-lg px-1">×</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setForm(p => ({ ...p, links: [...p.links, { label: '', url: '' }] }))}
                  className="text-xs text-secondary hover:underline">+ เพิ่มลิงก์</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL ไฟล์ PDF</label>
                  <input className="input" value={form.fileUrl} onChange={e => setForm(p => ({...p, fileUrl: e.target.value}))} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อไฟล์ (แสดงผล)</label>
                  <input className="input" value={form.fileName} onChange={e => setForm(p => ({...p, fileName: e.target.value}))} placeholder="เช่น รายงาน.pdf" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">สถานะ</label>
                  <select className="input bg-white" value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">หมายเหตุ</label>
                  <input className="input" value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} placeholder="หมายเหตุ..." />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowForm(false)} className="btn-ghost text-xs">ยกเลิก</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs disabled:opacity-50">
                {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">ยังไม่มีข้อมูล OIT — กดปุ่ม "สร้างอัตโนมัติ" เพื่อสร้าง 26 ข้อ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium w-14">ข้อ</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">ชื่อหัวข้อ</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium">หมวด</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-medium w-28">สถานะ</th>
                  <th className="px-3 py-2.5 text-right text-gray-500 font-medium w-24">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        O{String(item.itemNo).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-800 text-xs">{item.title}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{item.category || '-'}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(item)} className="text-xs text-secondary hover:underline">แก้ไข</button>
                        <span className="text-gray-200">|</span>
                        <button onClick={() => handleDelete(item._id)} className="text-xs text-red-400 hover:text-red-600">ลบ</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
