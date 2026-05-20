import { useEffect, useState } from 'react'

const KING_IMAGE = 'https://king.kapook.com/kingrama10/images/profile10-sec7.png'

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
    anim === 'entering' ? 0.6 :
    anim === 'visible'  ? 0.6 : 0

  const cardAnimation =
    anim === 'entering' ? 'sliceDown 0.65s cubic-bezier(0.16,1,0.3,1) forwards' :
    anim === 'leaving'  ? 'sliceUp   0.4s ease-in              forwards' : 'none'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `rgba(10,20,40,${backdropOpacity})`,
      backdropFilter: anim === 'hidden' || anim === 'leaving' ? 'blur(0px)' : 'blur(4px)',
      transition: 'background 0.45s ease, backdrop-filter 0.45s ease',
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
          0%   { clip-path: inset(0   0 0 0); transform: translateY(0);   opacity: 1; }
          100% { clip-path: inset(100% 0 0 0); transform: translateY(-24px); opacity: 0; }
        }
        @keyframes twinkle  { 0%,100%{opacity:0.15;transform:scale(0.7)} 50%{opacity:0.9;transform:scale(1.3)} }
        @keyframes shimmer  { 0%,100%{opacity:0.65} 50%{opacity:1} }
        @keyframes pulseGold {
          0%,100%{box-shadow:0 4px 14px rgba(139,105,20,0.45)}
          50%    {box-shadow:0 4px 26px rgba(139,105,20,0.85), 0 0 0 3px rgba(218,165,32,0.25)}
        }
        .spl-shimmer  { animation: shimmer 2s ease-in-out infinite; }
        .spl-sign:hover  { opacity: 0.86; transform: translateY(-1px); }
        .spl-enter:hover { opacity: 0.82; }
      `}</style>

      {/* Card */}
      <div style={{
        background: 'linear-gradient(150deg, #c8860a 0%, #f5c518 35%, #ffd700 55%, #f5c518 75%, #c8860a 100%)',
        borderRadius: '10px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(218,165,32,0.4)',
        padding: '22px 18px 20px',
        maxWidth: '340px',
        width: '88%',
        position: 'relative',
        overflow: 'hidden',
        animation: cardAnimation,
      }}>

        {/* Sparkles */}
        {[
          [8,12,'13px',1.8,0.3], [92,8,'9px',2.2,0.7], [15,88,'10px',1.6,1.1],
          [85,85,'11px',2.0,0.5], [50,5,'8px',1.9,1.4], [5,50,'12px',2.3,0.1],
          [75,40,'9px',1.7,0.9], [30,70,'10px',2.1,0.6],
        ].map(([l, t, fs, dur, delay], i) => (
          <div key={i} style={{
            position: 'absolute', left: l + '%', top: t + '%',
            fontSize: fs, color: 'rgba(255,255,255,0.55)',
            animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
            pointerEvents: 'none',
          }}>✦</div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>

          {/* Portrait */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: '-7px',
              background: 'linear-gradient(135deg, #8B6914, #DAA520, #8B6914)',
              borderRadius: '3px',
              boxShadow: '0 0 14px rgba(139,105,20,0.5)',
            }}/>
            <div style={{
              position: 'relative',
              width: '96px', height: '126px',
              background: '#5a3e00',
              border: '2px solid #DAA520',
              overflow: 'hidden',
            }}>
              <img src={KING_IMAGE} alt="ในหลวง ร.10"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
            {[[-14,-14],[-14,null],[null,-14],[null,null]].map(([t2, l2], i) => (
              <div key={i} style={{
                position: 'absolute',
                top: i < 2 ? '-14px' : 'auto', bottom: i >= 2 ? '-14px' : 'auto',
                left: i % 2 === 0 ? '-14px' : 'auto', right: i % 2 === 1 ? '-14px' : 'auto',
                fontSize: '16px', color: '#8B6914',
              }}>✦</div>
            ))}
          </div>

          {/* Text */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div className="spl-shimmer" style={{ fontSize: '36px', marginBottom: '4px', lineHeight: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🔱</div>

            <p style={{ fontSize: '14px', color: '#4a2800', marginBottom: '2px', fontWeight: 600 }}>
              วันฉัตรมงคล ๔ พฤษภาคม
            </p>
            <div style={{
              fontSize: '26px', fontWeight: 900, color: '#4a2800',
              textShadow: '0 2px 3px rgba(255,255,255,0.35)',
              letterSpacing: '3px', marginBottom: '6px',
            }}>ทรงพระเจริญ</div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <svg width="200" height="14" viewBox="0 0 240 16" fill="none">
                <path d="M0,8 Q30,2 60,8 Q90,14 120,8 Q150,2 180,8 Q210,14 240,8"
                  stroke="#8B6914" strokeWidth="1.2" fill="none"/>
                <circle cx="120" cy="8" r="3" fill="#8B6914"/>
                <circle cx="60"  cy="8" r="2" fill="#8B6914"/>
                <circle cx="180" cy="8" r="2" fill="#8B6914"/>
              </svg>
            </div>

            <p style={{ fontSize: '11px', color: '#5a3e00', lineHeight: 1.75, marginBottom: '14px' }}>
              ด้วยเกล้าด้วยกระหม่อม ขอเดชะ<br/>
              ข้าพระพุทธเจ้า ผู้บริหาร ข้าราชการ พนักงานและลูกจ้าง<br/>
              องค์การบริหารส่วนตำบลแม่ใส
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <a href="https://wellwishes.royaloffice.th/" target="_blank" rel="noreferrer"
                className="spl-sign"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #3a1f00, #6b3a00, #3a1f00)',
                  border: '2px solid #DAA520', color: '#ffd700',
                  padding: '9px 24px', borderRadius: '4px',
                  fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                  fontFamily: "'Sarabun', sans-serif",
                  animation: 'pulseGold 2.5s ease-in-out infinite',
                  letterSpacing: '1px', transition: 'opacity 0.2s, transform 0.2s',
                  width: '100%', maxWidth: '230px',
                }}>✍️ ลงนามถวายพระพร</a>

              <button onClick={handleEnter} className="spl-enter"
                style={{
                  background: 'linear-gradient(135deg, #8B6914, #DAA520, #8B6914)',
                  border: '2px solid #5a3e00', color: '#3a1f00',
                  padding: '8px 28px', borderRadius: '4px',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'Sarabun', sans-serif",
                  boxShadow: '0 3px 12px rgba(139,105,20,0.45)',
                  letterSpacing: '1px', transition: 'opacity 0.2s',
                  width: '100%', maxWidth: '230px',
                }}>เข้าสู่เว็บไซต์</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
