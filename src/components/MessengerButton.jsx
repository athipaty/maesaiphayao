export default function MessengerButton() {
  return (
    <a
      href="https://m.me/MaesaiSAOPhayao"
      target="_blank"
      rel="noreferrer"
      title="ติดต่อผ่าน Messenger"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9998,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0099ff, #a033ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'
      }}
    >
      {/* Messenger icon SVG */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2C7.373 2 2 7.06 2 13.32c0 3.348 1.39 6.356 3.635 8.524V26l4.37-2.406C11.222 23.847 12.584 24 14 24c6.627 0 12-5.06 12-11.32C26 7.06 20.627 2 14 2z" fill="white"/>
        <path d="M15.07 16.18l-3.05-3.26-5.95 3.26 6.55-6.96 3.12 3.26 5.88-3.26-6.55 6.96z" fill="url(#msgGrad)"/>
        <defs>
          <linearGradient id="msgGrad" x1="6" y1="13" x2="22" y2="13" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0099ff"/>
            <stop offset="100%" stopColor="#a033ff"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Tooltip */}
      <span style={{
        position: 'absolute',
        right: '64px',
        background: '#333',
        color: '#fff',
        fontSize: '12px',
        padding: '4px 10px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.2s',
      }}
        className="messenger-tooltip"
      >
        ติดต่อเจ้าหน้าที่
      </span>
    </a>
  )
}
