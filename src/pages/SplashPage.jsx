import { useEffect, useState } from 'react'

const KING_IMAGE = 'https://king.kapook.com/kingrama10/images/profile10-sec7.png'

export default function SplashPage({ onEnter }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  function handleEnter() {
    setVisible(false)
    setTimeout(onEnter, 400)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
      fontFamily: "'Sarabun', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Golden background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #c8860a 0%, #f5c518 30%, #ffd700 50%, #f5c518 70%, #c8860a 100%)',
      }}/>

      {/* Thai pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)`,
      }}/>

      {/* Sparkles */}
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:1} }
        .splash-in { animation: fadeUp 0.8s ease 0.3s both; }
        .shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          fontSize: Math.random() * 10 + 8 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animation: `twinkle ${Math.random() * 2 + 1.5}s ease-in-out infinite`,
          animationDelay: Math.random() * 2 + 's',
          color: 'rgba(255,255,255,0.7)',
        }}>✦</div>
      ))}

      {/* Main content */}
      <div className="splash-in" style={{
        position: 'relative', zIndex: 1,
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '60px', flexWrap: 'wrap', padding: '24px',
      }}>

        {/* Portrait in gold frame */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Outer frame decoration */}
          <div style={{
            position: 'absolute', inset: '-16px',
            border: '4px solid #8B6914',
            borderRadius: '4px',
          }}/>
          <div style={{
            position: 'absolute', inset: '-8px',
            background: 'linear-gradient(135deg, #8B6914, #DAA520, #8B6914, #DAA520, #8B6914)',
            borderRadius: '2px',
            boxShadow: '0 0 30px rgba(139,105,20,0.6), inset 0 0 10px rgba(0,0,0,0.3)',
          }}/>
          {/* Inner frame */}
          <div style={{
            position: 'relative',
            width: '260px', height: '340px',
            background: '#5a3e00',
            border: '3px solid #DAA520',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {KING_IMAGE ? (
              <img src={KING_IMAGE} alt="ในหลวง ร.10"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#DAA520', padding: '20px' }}>
                <div style={{ fontSize: '60px', marginBottom: '12px' }}>👑</div>
                <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#f5c518' }}>
                  วางรูป<br/>พระบรมฉายาลักษณ์<br/>ที่นี่
                </div>
              </div>
            )}
          </div>
          {/* Corner ornaments */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              [pos.includes('top') ? 'top' : 'bottom']: '-18px',
              [pos.includes('left') ? 'left' : 'right']: '-18px',
              fontSize: '24px', color: '#8B6914',
            }}>✦</div>
          ))}
        </div>

        {/* Text content */}
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>

          {/* Royal emblem "ว" */}
          <div className="shimmer" style={{
            fontSize: '80px', marginBottom: '16px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            lineHeight: 1,
          }}>
            🔱
          </div>

          {/* Occasion text */}
          <p style={{
            fontSize: '22px', color: '#4a2800', marginBottom: '6px',
            fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.5)',
          }}>
            วันฉัตรมงคล
          </p>

          <p style={{
            fontSize: '26px', color: '#4a2800', marginBottom: '16px',
            fontWeight: 700,
          }}>
            ๔ พฤษภาคม
          </p>

          {/* ทรงพระเจริญ */}
          <div style={{
            fontSize: '64px', fontWeight: 900,
            color: '#4a2800',
            textShadow: '0 2px 4px rgba(255,255,255,0.4), 3px 3px 0 rgba(139,105,20,0.3)',
            letterSpacing: '4px', marginBottom: '16px',
            lineHeight: 1.1,
          }}>
            ทรงพระเจริญ
          </div>

          {/* Ornament line */}
          <div style={{ marginBottom: '16px' }}>
            <svg width="280" height="20" viewBox="0 0 280 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,10 Q35,2 70,10 Q105,18 140,10 Q175,2 210,10 Q245,18 280,10" stroke="#8B6914" strokeWidth="1.5" fill="none"/>
              <circle cx="140" cy="10" r="4" fill="#8B6914"/>
              <circle cx="70" cy="10" r="2.5" fill="#8B6914"/>
              <circle cx="210" cy="10" r="2.5" fill="#8B6914"/>
            </svg>
          </div>

          <p style={{
            fontSize: '14px', color: '#5a3e00', lineHeight: 1.8,
            marginBottom: '28px',
          }}>
            ด้วยเกล้าด้วยกระหม่อม ขอเดชะ<br/>
            ข้าพระพุทธเจ้า ผู้บริหาร ข้าราชการ พนักงานและลูกจ้าง<br/>
            องค์การบริหารส่วนตำบลแม่ใส
          </p>

          {/* Button */}
          <button onClick={handleEnter} style={{
            background: 'linear-gradient(135deg, #8B6914, #DAA520, #8B6914)',
            border: '2px solid #5a3e00',
            color: '#3a1f00',
            padding: '12px 36px',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Sarabun', sans-serif",
            boxShadow: '0 4px 15px rgba(139,105,20,0.5)',
            letterSpacing: '1px',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            เข้าสู่เว็บไซต์
          </button>
        </div>
      </div>
    </div>
  )
}