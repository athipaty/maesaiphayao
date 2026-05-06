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
      overflowY: 'auto',
    }}>
      {/* Golden background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg, #c8860a 0%, #f5c518 30%, #ffd700 50%, #f5c518 70%, #c8860a 100%)',
        zIndex: 0,
      }}/>

      {/* Pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
      }}/>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:1} }
        .splash-in { animation: fadeUp 0.8s ease 0.3s both; }
        .shimmer { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      {/* Sparkles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          fontSize: Math.random() * 8 + 7 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animation: `twinkle ${Math.random() * 2 + 1.5}s ease-in-out infinite`,
          animationDelay: Math.random() * 2 + 's',
          color: 'rgba(255,255,255,0.7)',
          zIndex: 0,
          pointerEvents: 'none',
        }}>✦</div>
      ))}

      {/* Main content */}
      <div className="splash-in" style={{
        position: 'relative', zIndex: 1,
        minHeight: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px 32px',
        gap: '16px',
      }}>

        {/* Portrait */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: '-12px',
            background: 'linear-gradient(135deg, #8B6914, #DAA520, #8B6914, #DAA520, #8B6914)',
            borderRadius: '2px',
            boxShadow: '0 0 24px rgba(139,105,20,0.6)',
          }}/>
          <div style={{
            position: 'relative',
            width: 'min(160px, 42vw)', height: 'min(210px, 55vw)',
            background: '#5a3e00',
            border: '3px solid #DAA520',
            overflow: 'hidden',
          }}>
            <img src={KING_IMAGE} alt="ในหลวง ร.10"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
          </div>
          {[[-18,-18],[-18,'auto'],[18,-18],[18,'auto']].map(([t,b], i) => (
            <div key={i} style={{
              position: 'absolute',
              top: t < 0 ? t + 'px' : 'auto', bottom: t > 0 ? '0px' : 'auto',
              left: i % 2 === 0 ? '-18px' : 'auto', right: i % 2 === 1 ? '-18px' : 'auto',
              fontSize: '20px', color: '#8B6914',
            }}>✦</div>
          ))}
        </div>

        {/* Text content */}
        <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>

          <div className="shimmer" style={{
            fontSize: 'clamp(44px, 14vw, 68px)', marginBottom: '8px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            lineHeight: 1,
          }}>🔱</div>

          <p style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', color: '#4a2800', marginBottom: '4px', fontWeight: 600 }}>
            วันฉัตรมงคล
          </p>
          <p style={{ fontSize: 'clamp(18px, 5vw, 26px)', color: '#4a2800', marginBottom: '10px', fontWeight: 700 }}>
            ๔ พฤษภาคม
          </p>

          <div style={{
            fontSize: 'clamp(32px, 10vw, 60px)', fontWeight: 900,
            color: '#4a2800',
            textShadow: '0 2px 4px rgba(255,255,255,0.4), 3px 3px 0 rgba(139,105,20,0.3)',
            letterSpacing: '4px', marginBottom: '10px', lineHeight: 1.1,
          }}>
            ทรงพระเจริญ
          </div>

          <div style={{ marginBottom: '10px' }}>
            <svg width="240" height="16" viewBox="0 0 280 20" fill="none">
              <path d="M0,10 Q35,2 70,10 Q105,18 140,10 Q175,2 210,10 Q245,18 280,10" stroke="#8B6914" strokeWidth="1.5" fill="none"/>
              <circle cx="140" cy="10" r="4" fill="#8B6914"/>
              <circle cx="70" cy="10" r="2.5" fill="#8B6914"/>
              <circle cx="210" cy="10" r="2.5" fill="#8B6914"/>
            </svg>
          </div>

          <p style={{
            fontSize: 'clamp(11px, 3vw, 14px)', color: '#5a3e00', lineHeight: 1.8,
            marginBottom: '20px',
          }}>
            ด้วยเกล้าด้วยกระหม่อม ขอเดชะ<br/>
            ข้าพระพุทธเจ้า ผู้บริหาร ข้าราชการ พนักงานและลูกจ้าง<br/>
            องค์การบริหารส่วนตำบลแม่ใส
          </p>

          <button onClick={handleEnter} style={{
            background: 'linear-gradient(135deg, #8B6914, #DAA520, #8B6914)',
            border: '2px solid #5a3e00',
            color: '#3a1f00',
            padding: '12px 40px',
            borderRadius: '4px',
            fontSize: 'clamp(13px, 3.5vw, 15px)',
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
