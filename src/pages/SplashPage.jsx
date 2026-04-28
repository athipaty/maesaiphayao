import { useEffect, useState } from 'react'

const PRINCE_IMAGE = 'https://cache-igetweb-v2.mt108.info/uploads/images-cache/12283/filemanager/99c5e4d8a8e8ca418f4b15e7ccac3272_full.jpg'

const EMBLEM_URL = 'https://v4i.rweb-images.com/www.dgm88.com/images/editor/z10%e0%b8%ad%e0%b8%87%e0%b8%84%e0%b9%8c%e0%b8%97%e0%b8%b5.png'

const EmblemSVG = () => (
  <img
    src={EMBLEM_URL}
    alt="สัญลักษณ์เจ้าฟ้าทีปังกร"
    style={{
      width: '120px',
      height: '140px',
      objectFit: 'contain',
      mixBlendMode: 'screen',
      filter: 'brightness(1.8) contrast(1.2) saturate(1.3)',
    }}
  />
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