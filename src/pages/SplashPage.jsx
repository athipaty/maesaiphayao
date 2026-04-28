import { useEffect, useState } from 'react'

// เปลี่ยนรูปได้ที่นี่ — ใส่ URL Cloudinary หรือ path รูปใน /public
const PRINCE_IMAGE = null // เช่น '/prince.jpg' หรือ 'https://res.cloudinary.com/...'

export default function SplashPage({ onEnter }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // fade in เมื่อ mount
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  function handleEnter() {
    setVisible(false)
    setTimeout(onEnter, 400)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(160deg, #1a3a6b 0%, #1e4d8c 40%, #1a3a6b 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        fontFamily: "'Sarabun', sans-serif",
        padding: '24px',
      }}
    >
      {/* Stars background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(40)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `twinkle ${Math.random() * 2 + 1.5}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle { from { opacity: 0.2 } to { opacity: 1 } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes shimmer { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }
        .splash-content { animation: fadeUp 0.8s ease 0.2s both; }
        .thai-title { font-family: 'Sarabun', sans-serif; }
      `}</style>

      {/* Main content */}
      <div className="splash-content" style={{
        display: 'flex', alignItems: 'center', gap: '48px',
        maxWidth: '900px', width: '100%',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>

        {/* Portrait oval */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Outer glow ring */}
          <div style={{
            position: 'absolute', inset: '-8px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #d4af37, #fff8dc, #d4af37, #b8860b, #d4af37)',
            animation: 'shimmer 3s ease-in-out infinite',
          }} />
          {/* Oval frame */}
          <div style={{
            position: 'relative',
            width: '220px', height: '280px',
            borderRadius: '50%',
            border: '6px solid #d4af37',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #b8d4f0, #dceeff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(212,175,55,0.4), inset 0 0 20px rgba(0,0,0,0.1)',
          }}>
            {PRINCE_IMAGE ? (
              <img src={PRINCE_IMAGE} alt="portrait"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#5588bb', padding: '16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>👤</div>
                <div style={{ fontSize: '11px', opacity: 0.7, lineHeight: 1.5 }}>
                  วางรูปภาพ<br />ที่นี่
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text content */}
        <div style={{ textAlign: 'center', color: '#fff', maxWidth: '480px' }}>

          {/* Crown icon */}
          <div style={{ fontSize: '48px', marginBottom: '12px', filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.6))' }}>
            👑
          </div>

          <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '10px', letterSpacing: '0.5px' }}>
            เนื่องในโอกาสวันคล้ายวันประสูติ
          </p>

          <h1 style={{
            fontSize: '20px', fontWeight: 700, lineHeight: 1.6,
            marginBottom: '12px', color: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            สมเด็จพระเจ้าลูกยาเธอ เจ้าฟ้าทีปังกรรัศมีโชติ<br />
            มหาวชิโรตตมางกูร สิริวิบูลยราชกุมาร
          </h1>

          {/* Date */}
          <p style={{ fontSize: '22px', color: '#ffd700', marginBottom: '8px', fontWeight: 600 }}>
            ๒๙ เมษายน
          </p>

          {/* Big Thai text */}
          <div style={{
            fontSize: '52px', fontWeight: 900, color: '#ffd700',
            textShadow: '0 0 20px rgba(255,215,0,0.5), 2px 2px 0 rgba(0,0,0,0.3)',
            letterSpacing: '4px', marginBottom: '16px',
            lineHeight: 1.1,
          }}>
            ทรงพระเจริญ
          </div>

          {/* Divider ornament */}
          <div style={{ color: '#d4af37', fontSize: '20px', marginBottom: '16px', opacity: 0.8 }}>
            ✦ ✦ ✦
          </div>

          <p style={{ fontSize: '13px', opacity: 0.75, lineHeight: 1.8, marginBottom: '28px' }}>
            ข้าพระพุทธเจ้า ผู้บริหาร สมาชิกสภา ข้าราชการ พนักงานและลูกจ้าง<br />
            องค์การบริหารส่วนตำบลแม่ใส
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #2d8a4e, #27ae60)',
                color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: '6px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Sarabun', sans-serif",
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              ลงนามถวายพระพร
            </button>
            <button
              onClick={handleEnter}
              style={{
                background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: '6px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Sarabun', sans-serif",
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              เข้าสู่เว็บไซต์ องค์การบริหารส่วนตำบลแม่ใส
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}