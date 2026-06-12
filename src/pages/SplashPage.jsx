import { useEffect, useState } from 'react'

const PRINCESS_IMAGE = 'https://th-images.th-hellomagazine.com/wp-content/uploads/2023/01/08103033/F12FE394-89D1-4736-9AAC-7D4BBE116809.png?tr=w-1600'

export default function SplashPage({ onEnter }) {
  const [anim, setAnim] = useState('hidden') // hidden → entering → visible → leaving

  useEffect(() => {
    const t1 = setTimeout(() => setAnim('entering'), 30)
    const t2 = setTimeout(() => setAnim('visible'),  730)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  function handleEnter() {
    setAnim('leaving')
    setTimeout(onEnter, 450)
  }

  const backdropOpacity =
    anim === 'hidden'   ? 0 :
    anim === 'entering' ? 0.85 :
    anim === 'visible'  ? 0.85 : 0

  const cardAnimation =
    anim === 'entering' ? 'sliceDown 0.65s cubic-bezier(0.16,1,0.3,1) forwards' :
    anim === 'leaving'  ? 'sliceUp   0.4s ease-in              forwards' : 'none'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `rgba(0,0,0,${backdropOpacity})`,
      backdropFilter: anim === 'hidden' || anim === 'leaving' ? 'blur(0px)' : 'blur(6px)',
      transition: 'background 0.6s ease, backdrop-filter 0.6s ease',
      fontFamily: "'Sarabun', sans-serif",
      pointerEvents: anim === 'hidden' ? 'none' : 'auto',
    }}>
      <style>{`
        @keyframes sliceDown {
          0%   { clip-path: inset(0 0 100% 0); transform: translateY(-24px) scale(0.97); opacity: 0.4; }
          60%  { opacity: 1; }
          100% { clip-path: inset(0 0 0%   0); transform: translateY(0)     scale(1);    opacity: 1; }
        }
        @keyframes sliceUp {
          0%   { clip-path: inset(0   0 0 0); transform: translateY(0);    opacity: 1; }
          100% { clip-path: inset(100% 0 0 0); transform: translateY(-24px); opacity: 0; }
        }
        @keyframes fadeBreath { 0%,100%{opacity:0.5} 50%{opacity:0.85} }
        .spl-enter-btn:hover { opacity: 0.75; }
        .spl-enter-btn { transition: opacity 0.2s; }
      `}</style>

      {/* Card */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1a1a 0%, #111111 60%, #0d0d0d 100%)',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 28px 72px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)',
        padding: '28px 20px 22px',
        maxWidth: '340px',
        width: '88%',
        position: 'relative',
        overflow: 'hidden',
        animation: cardAnimation,
      }}>

        {/* Black ribbon corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '80px', height: '80px',
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '18px', right: '-22px',
            width: '100px', height: '22px',
            background: '#2a2a2a',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            transform: 'rotate(45deg)',
            fontSize: '9px', color: 'rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            letterSpacing: '1px',
          }}>▪ ▪ ▪</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>

          {/* Top ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))' }}/>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', animation: 'fadeBreath 3s ease-in-out infinite' }}>✦</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))' }}/>
          </div>

          {/* Portrait */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* Outer frame */}
            <div style={{
              position: 'absolute', inset: '-8px',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '2px',
            }}/>
            <div style={{
              position: 'relative',
              width: '180px', height: '220px',
              background: '#222',
              border: '2px solid rgba(255,255,255,0.25)',
              overflow: 'hidden',
              margin: '0 auto',
            }}>
              <img
                src={PRINCESS_IMAGE}
                alt="พระองค์หญิง"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center center',
                  filter: 'grayscale(100%) contrast(0.9) brightness(0.85)',
                }}
              />
              {/* Subtle dark vignette over image */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)',
              }}/>
            </div>
          </div>

          {/* Text block */}
          <div style={{ textAlign: 'center', width: '100%' }}>

            <div style={{
              fontSize: '20px', fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: '2px', lineHeight: 1.5,
              marginBottom: '4px',
            }}>
              น้อมส่งเสด็จสู่สวรรคาลัย
            </div>

            <div style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
              margin: '10px auto',
              width: '80%',
            }}/>

            <p style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.9, marginBottom: '6px',
            }}>
              ข้าพระพุทธเจ้า ผู้บริหาร ข้าราชการ<br/>
              พนักงานและลูกจ้าง<br/>
              องค์การบริหารส่วนตำบลแม่ใส
            </p>

            <p style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.3)',
              letterSpacing: '1px', marginBottom: '18px',
            }}>
              ขอน้อมรำลึกในพระกรุณาธิคุณ
            </p>

            {/* Enter button */}
            <button
              onClick={handleEnter}
              className="spl-enter-btn"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.65)',
                padding: '9px 28px',
                borderRadius: '3px',
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Sarabun', sans-serif",
                letterSpacing: '1.5px',
                width: '100%', maxWidth: '230px',
              }}>
              เข้าสู่เว็บไซต์
            </button>
          </div>

          {/* Bottom ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))' }}/>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>✦</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))' }}/>
          </div>

        </div>
      </div>
    </div>
  )
}
