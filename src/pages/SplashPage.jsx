import { useEffect, useState } from 'react'

const PRINCE_IMAGE = 'https://cache-igetweb-v2.mt108.info/uploads/images-cache/12283/filemanager/99c5e4d8a8e8ca418f4b15e7ccac3272_full.jpg'

const EmblemSVG = () => (
  <svg width="120" height="140" viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff8dc" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#1a3a6b" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="340" cy="200" rx="180" ry="180" fill="url(#glow2)"/>
    <g transform="translate(340,195)">
      <rect x="-72" y="28" width="144" height="22" rx="4" fill="#c8922a" stroke="#f0c040" strokeWidth="1.2"/>
      <ellipse cx="-48" cy="39" rx="7" ry="5" fill="#1a6aaa"/>
      <ellipse cx="0"   cy="39" rx="7" ry="5" fill="#cc2222"/>
      <ellipse cx="48"  cy="39" rx="7" ry="5" fill="#1a6aaa"/>
      <path d="M-72,30 Q-72,-10 -42,-30 L-30,28" fill="#d4a020" stroke="#f0c040" strokeWidth="0.8"/>
      <path d="M72,30 Q72,-10 42,-30 L30,28" fill="#d4a020" stroke="#f0c040" strokeWidth="0.8"/>
      <path d="M-30,28 Q-20,-55 0,-75 Q20,-55 30,28 Z" fill="#d4a020" stroke="#f0c040" strokeWidth="0.8"/>
      <line x1="-42" y1="-30" x2="-42" y2="28" stroke="#f0c040" strokeWidth="0.6" opacity="0.5"/>
      <line x1="42"  y1="-30" x2="42"  y2="28" stroke="#f0c040" strokeWidth="0.6" opacity="0.5"/>
      <polygon points="-42,-30 -48,-60 -36,-60" fill="#f0c040"/>
      <circle cx="-42" cy="-64" r="5" fill="#f0c040"/>
      <polygon points="42,-30 36,-60 48,-60" fill="#f0c040"/>
      <circle cx="42" cy="-64" r="5" fill="#f0c040"/>
      <polygon points="0,-75 -10,-105 10,-105" fill="#f0c040"/>
      <circle cx="0" cy="-112" r="7" fill="#f0c040"/>
      <ellipse cx="0" cy="-88" rx="5" ry="6" fill="#cc2222"/>
      <circle cx="-56" cy="54" r="4" fill="#fffacd" stroke="#d4a020" strokeWidth="0.8"/>
      <circle cx="-28" cy="56" r="4" fill="#fffacd" stroke="#d4a020" strokeWidth="0.8"/>
      <circle cx="0"   cy="57" r="4" fill="#fffacd" stroke="#d4a020" strokeWidth="0.8"/>
      <circle cx="28"  cy="56" r="4" fill="#fffacd" stroke="#d4a020" strokeWidth="0.8"/>
      <circle cx="56"  cy="54" r="4" fill="#fffacd" stroke="#d4a020" strokeWidth="0.8"/>
    </g>
    <g transform="translate(340,295)">
      <path d="M-45,0 C-45,-30 -20,-45 0,-45 C20,-45 45,-30 45,0 C45,25 30,38 10,40 L10,20 C22,18 28,10 28,0 C28,-18 16,-28 0,-28 C-16,-28 -28,-18 -28,0 C-28,18 -16,28 0,28 L0,45 C-30,45 -45,25 -45,0 Z"
        fill="none" stroke="#1aaad4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10,-45 C10,-62 30,-68 30,-55 C30,-44 18,-40 18,-30"
        fill="none" stroke="#1aaad4" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="0" cy="0" r="6" fill="#1aaad4" opacity="0.4"/>
    </g>
    <circle cx="340" cy="220" r="145" fill="none" stroke="#d4a020" strokeWidth="1" strokeDasharray="6,4" opacity="0.5"/>
    <circle cx="340" cy="220" r="155" fill="none" stroke="#d4a020" strokeWidth="0.5" opacity="0.3"/>
    <rect x="160" y="218" width="8" height="8" rx="1" fill="#f0c040" opacity="0.6" transform="rotate(45,164,222)"/>
    <rect x="508" y="218" width="8" height="8" rx="1" fill="#f0c040" opacity="0.6" transform="rotate(45,512,222)"/>
  </svg>
)

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
      background: 'linear-gradient(160deg, #1a3a6b 0%, #1e4d8c 40%, #1a3a6b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
      fontFamily: "'Sarabun', sans-serif",
      padding: '24px',
      overflowY: 'auto',
    }}>

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(40)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `twinkle ${Math.random() * 2 + 1.5}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle { from{opacity:0.2} to{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.55} }
        .splash-in { animation: fadeUp 0.8s ease 0.2s both; }
        .gold-shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>

      <div className="splash-in" style={{
        display: 'flex', alignItems: 'center', gap: '52px',
        maxWidth: '920px', width: '100%',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>

        {/* Portrait oval */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div className="gold-shimmer" style={{
            position: 'absolute', inset: '-10px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #d4af37, #fff8dc, #d4af37, #b8860b, #d4af37)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}/>
          <div style={{
            position: 'relative',
            width: '220px', height: '280px',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            border: '5px solid #d4af37',
            overflow: 'hidden',
            background: 'linear-gradient(160deg,#b8d4f0,#dceeff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(212,175,55,0.35)',
          }}>
            {PRINCE_IMAGE ? (
              <div style={{
                width:'100%',
                height:'100%',
                backgroundImage:`url(${PRINCE_IMAGE})`,
                backgroundSize:'cover',
                backgroundPosition:'center 15%',
                backgroundRepeat:'no-repeat',
              }}/>
            ) : (
              <div style={{ textAlign:'center', color:'#5588bb', padding:'16px' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#5588bb" strokeWidth="1.2">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <div style={{ fontSize:'11px', opacity:0.6, marginTop:'6px', lineHeight:1.5 }}>
                  วางรูปภาพที่นี่
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign:'center', color:'#fff', maxWidth:'480px' }}>

          {/* Emblem SVG */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'10px',
            filter:'drop-shadow(0 2px 10px rgba(212,175,55,0.5))' }}>
            <EmblemSVG />
          </div>

          <p style={{ fontSize:'15px', opacity:0.88, marginBottom:'10px', letterSpacing:'0.5px' }}>
            เนื่องในโอกาสวันคล้ายวันประสูติ
          </p>

          <h1 style={{
            fontSize:'19px', fontWeight:700, lineHeight:1.65,
            marginBottom:'10px', color:'#fff',
            textShadow:'0 2px 12px rgba(0,0,0,0.4)',
          }}>
            สมเด็จพระเจ้าลูกยาเธอ เจ้าฟ้าทีปังกรรัศมีโชติ<br/>
            มหาวชิโรตตมางกูร สิริวิบูลยราชกุมาร
          </h1>

          <p style={{ fontSize:'22px', color:'#ffd700', marginBottom:'6px', fontWeight:600,
            textShadow:'0 0 12px rgba(255,215,0,0.4)' }}>
            ๒๙ เมษายน
          </p>

          <div style={{
            fontSize:'52px', fontWeight:900, color:'#ffd700',
            textShadow:'0 0 20px rgba(255,215,0,0.45), 2px 2px 0 rgba(0,0,0,0.3)',
            letterSpacing:'4px', marginBottom:'14px', lineHeight:1.1,
          }}>
            ทรงพระเจริญ
          </div>

          <div style={{ color:'#d4af37', fontSize:'18px', marginBottom:'14px', opacity:0.8 }}>
            ✦ ✦ ✦
          </div>

          <p style={{ fontSize:'13px', opacity:0.72, lineHeight:1.9, marginBottom:'26px' }}>
            ข้าพระพุทธเจ้า ผู้บริหาร สมาชิกสภา ข้าราชการ พนักงานและลูกจ้าง<br/>
            องค์การบริหารส่วนตำบลแม่ใส
          </p>

          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <a href="https://wellwishes.royaloffice.th/home/index/52"
              target="_blank" rel="noreferrer"
              style={{
                display:'inline-block',
                background:'linear-gradient(135deg,#2d8a4e,#27ae60)',
                color:'#fff', textDecoration:'none',
                padding:'10px 22px', borderRadius:'6px',
                fontSize:'14px', fontWeight:600, cursor:'pointer',
                fontFamily:"'Sarabun',sans-serif",
                boxShadow:'0 4px 14px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}
            >
              ลงนามถวายพระพร
            </a>
            <button onClick={handleEnter} style={{
              background:'linear-gradient(135deg,#1565c0,#1976d2)',
              color:'#fff', border:'none',
              padding:'10px 22px', borderRadius:'6px',
              fontSize:'14px', fontWeight:600, cursor:'pointer',
              fontFamily:"'Sarabun',sans-serif",
              boxShadow:'0 4px 14px rgba(0,0,0,0.25)',
            }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}
            >
              เข้าสู่เว็บไซต์ องค์การบริหารส่วนตำบลแม่ใส
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}