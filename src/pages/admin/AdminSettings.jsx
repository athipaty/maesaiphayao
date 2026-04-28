import { useState, useEffect } from 'react'
import ImageUpload from '../../components/ImageUpload'
import { getSettings, updateSetting } from '../../services/api'

export default function AdminSettings() {
  const [form, setForm]     = useState({
    mayorName:     '',
    mayorPosition: '',
    mayorPhone:    '',
    mayorImage:    '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    getSettings()
      .then(r => {
        if (r?.data) setForm(prev => ({ ...prev, ...r.data }))
      })
      .finally(() => setLoading(false))
  }, [])

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(form).map(([key, value]) => updateSetting(key, value))
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-gray-800">⚙️ ตั้งค่าเว็บไซต์</h1>
        <button onClick={handleSave} disabled={saving}
          className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2">
          {saving ? 'กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว' : '💾 บันทึก'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">

        {/* Mayor section */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            👤 ข้อมูลนายกองค์การบริหารส่วนตำบล
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">ชื่อ-นามสกุล</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.mayorName}
                  onChange={e => handleChange('mayorName', e.target.value)}
                  placeholder="นาย/นาง/นางสาว..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">ตำแหน่ง</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.mayorPosition}
                  onChange={e => handleChange('mayorPosition', e.target.value)}
                  placeholder="นายกองค์การบริหารส่วนตำบล..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">เบอร์โทร</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.mayorPhone}
                  onChange={e => handleChange('mayorPhone', e.target.value)}
                  placeholder="08x-xxxxxxx"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">รูปภาพ</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <ImageUpload
                  value={form.mayorImage}
                  onChange={url => handleChange('mayorImage', url)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">
            👁 ตัวอย่างที่จะแสดงใน Sidebar
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 max-w-xs">
            {form.mayorImage ? (
              <img src={form.mayorImage} alt="preview"
                className="object-cover border-2 border-yellow-400 rounded flex-shrink-0"
                style={{ width: '70px', height: '105px', objectFit: 'cover', objectPosition: 'top center' }} />
            ) : (
              <div className="bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-2xl flex-shrink-0 rounded border-2 border-yellow-400"
                style={{ width: '70px', height: '105px' }}>👤</div>
            )}
            <div>
              <p className="text-sm font-semibold text-blue-900">{form.mayorName || 'ชื่อ-นามสกุล'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{form.mayorPosition || 'ตำแหน่ง'}</p>
              <p className="text-xs text-blue-500 mt-0.5">{form.mayorPhone || 'เบอร์โทร'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}