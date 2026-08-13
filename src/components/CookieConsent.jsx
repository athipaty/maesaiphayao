import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cookie_consent_v1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999 }}
      className="bg-primary text-white shadow-[0_-4px_16px_rgba(0,0,0,0.25)]"
    >
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
        <p className="text-xs sm:text-sm leading-relaxed flex-1 text-center sm:text-left">
          เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสิทธิภาพและประสบการณ์ที่ดีในการใช้งานเว็บไซต์ของท่าน
          ท่านสามารถศึกษารายละเอียดเพิ่มเติมได้ที่{' '}
          <a href="/laws" className="underline hover:text-white/80">
            นโยบายความเป็นส่วนตัว (PDPA)
          </a>
        </p>
        <button
          onClick={accept}
          className="bg-white text-primary font-semibold text-sm px-5 py-2 rounded whitespace-nowrap hover:bg-white/90 transition-colors"
        >
          ยอมรับ
        </button>
      </div>
    </div>
  )
}
