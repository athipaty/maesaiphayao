import { useEffect, useState } from 'react'

const KING_IMAGE = '/king-rama-x.jpg'

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
      background: `rgba(40,30,0,${backdropOpacity})`,
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
        background: 'linear-gradient(160deg, #3a2a05 0%, #241a02 60%, #1a1200 100%)',
        borderRadius: '6px',
        border: '1px solid rgba(255,215,90,0.35)',
        boxShadow: '0 28px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,215,90,0.15)',
        padding: '28px 20px 22px',
        maxWidth: '340px',
        width: '88%',
        position: 'relative',
        overflow: 'hidden',
        animation: cardAnimation,
      }}>

        {/* Gold ribbon corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '80px', height: '80px',
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '18px', right: '-22px',
            width: '100px', height: '22px',
            background: '#5a4108',
            borderTop: '1px solid rgba(255,215,90,0.3)',
            borderBottom: '1px solid rgba(255,215,90,0.3)',
            transform: 'rotate(45deg)',
            fontSize: '9px', color: 'rgba(255,215,90,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            letterSpacing: '1px',
          }}>✦ ✦ ✦</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>

          {/* Top ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,215,90,0.4))' }}/>
            <span style={{ fontSize: '14px', color: 'rgba(255,215,90,0.7)', animation: 'fadeBreath 3s ease-in-out infinite' }}>✦</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,215,90,0.4))' }}/>
          </div>

          {/* Portrait */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* Outer frame */}
            <div style={{
              position: 'absolute', inset: '-8px',
              border: '1px solid rgba(255,215,90,0.4)',
              borderRadius: '2px',
            }}/>
            <div style={{
              position: 'relative',
              width: '180px', height: '220px',
              background: '#2a1e04',
              border: '2px solid rgba(255,215,90,0.5)',
              overflow: 'hidden',
              margin: '0 auto',
            }}>
              <img
                src={KING_IMAGE}
                alt="พระบาทสมเด็จพระเจ้าอยู่หัว"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center center',
                }}
              />
              {/* Subtle gold vignette over image */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(40,28,0,0.4) 100%)',
              }}/>
            </div>
          </div>

          {/* Text block */}
          <div style={{ textAlign: 'center', width: '100%' }}>

            <div style={{
              fontSize: '18px', fontWeight: 700,
              color: 'rgba(255,225,140,0.95)',
              letterSpacing: '1px', lineHeight: 1.5,
              marginBottom: '4px',
            }}>
              เนื่องในโอกาสวันเฉลิมพระชนมพรรษา<br/>74 พรรษา
            </div>

            <div style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,215,90,0.35), transparent)',
              margin: '10px auto',
              width: '80%',
            }}/>

            <p style={{
              fontSize: '12px', color: 'rgba(255,235,190,0.7)',
              lineHeight: 1.9, marginBottom: '6px',
            }}>
              ข้าพระพุทธเจ้า ผู้บริหาร ข้าราชการ<br/>
              พนักงานและลูกจ้าง<br/>
              องค์การบริหารส่วนตำบลแม่ใส
            </p>

            <p style={{
              fontSize: '11px', color: 'rgba(255,215,90,0.5)',
              letterSpacing: '1px', marginBottom: '18px',
            }}>
              ขอพระองค์ทรงพระเจริญ
            </p>

            {/* Enter button */}
            <button
              onClick={handleEnter}
              className="spl-enter-btn"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,215,90,0.45)',
                color: 'rgba(255,225,140,0.85)',
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
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,215,90,0.3))' }}/>
            <span style={{ fontSize: '10px', color: 'rgba(255,215,90,0.45)' }}>✦</span>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,215,90,0.3))' }}/>
          </div>

        </div>
      </div>
    </div>
  )
}
