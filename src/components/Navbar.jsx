import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSettings } from '../services/api'

export default function Navbar() {
  const [logoImage, setLogoImage] = useState('')

  useEffect(() => {
    getSettings().then(r => {
      if (r?.data?.logoImage) setLogoImage(r.data.logoImage)
    }).catch(() => {})
  }, [])

  return (
    <header className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
      <div className="max-w-[1200px] mx-auto px-3 py-2.5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          {logoImage ? (
            <img src={logoImage} alt="logo" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs text-center leading-tight p-1 flex-shrink-0">
              อบต.<br />แม่ใส
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-tight">องค์การบริหารส่วนตำบลแม่ใส</h1>
            <p className="text-xs opacity-85">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right text-xs opacity-90 hidden sm:block">
            <div>📞 0-5488-9909</div>
            <div>📧 saraban_06560115@dla.go.th</div>
          </div>
          <Link to="/admin"
            className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 rounded transition-colors whitespace-nowrap">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </header>
  )
}
