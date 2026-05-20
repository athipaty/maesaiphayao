export default function ContactPage() {
  return (
    <div>
      <style>{`
        @keyframes siren-blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.15)} }
        @keyframes float-sticker { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
        @keyframes float-sticker2 { 0%,100%{transform:translateY(0) rotate(10deg)} 50%{transform:translateY(-5px) rotate(-5deg)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.5),0 4px 20px rgba(220,38,38,0.3)} 50%{box-shadow:0 0 0 10px rgba(220,38,38,0),0 4px 30px rgba(220,38,38,0.5)} }
        .siren-blink { animation: siren-blink 1s ease-in-out infinite; }
        .float-s1    { animation: float-sticker 3s ease-in-out infinite; }
        .float-s2    { animation: float-sticker2 2.5s ease-in-out infinite; }
        .float-s3    { animation: float-sticker 3.5s ease-in-out 0.5s infinite; }
        .glow-pulse  { animation: glow-pulse 2s ease-in-out infinite; }
      `}</style>

      {/* ── Contact Info (first) ── */}
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📞 ติดต่อเรา</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ช่องทางการติดต่อองค์การบริหารส่วนตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา
          ยินดีให้บริการและตอบข้อสงสัยในวันและเวลาราชการ
        </div>
      </div>
      <div className="card mb-5">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info */}
          <div>
            <h3 className="text-base font-bold text-primary mb-4">องค์การบริหารส่วนตำบลแม่ใส</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-medium">ที่อยู่</p>
                  <p className="text-gray-500">198 ม.12 ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">📞</span>
                <div>
                  <p className="font-medium">โทรศัพท์</p>
                  <p className="text-gray-500">0-5488-9909</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">📧</span>
                <div>
                  <p className="font-medium">อีเมล</p>
                  <p className="text-gray-500">saraban_06560115@dla.go.th</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🕐</span>
                <div>
                  <p className="font-medium">เวลาทำการ</p>
                  <p className="text-gray-500">วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น.</p>
                  <p className="text-gray-400 text-xs">(หยุดวันเสาร์ – อาทิตย์ และวันหยุดนักขัตฤกษ์)</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href="https://www.facebook.com/MaesaiSAOPhayao" target="_blank" rel="noreferrer"
                className="btn-primary text-xs px-3 py-1.5">📘 Facebook</a>
              <a href="https://liff.line.me/1645278921-kWRPP32q/?accountId=traffyfondue" target="_blank" rel="noreferrer"
                className="btn-ghost text-xs px-3 py-1.5">📍 Traffy Fondue</a>
            </div>
          </div>

          {/* Map embed */}
          <div>
            <div className="rounded-md overflow-hidden border border-gray-200 h-64 bg-blue-50 flex items-center justify-center text-gray-400 text-sm">
              <iframe
                title="แผนที่ อบต.แม่ใส"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d968.8!2d99.8763!3d19.1322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9d2bf364e9093%3A0x59f89dc1c3f4d41b!2z!5e0!3m2!1sth!2sth!4v1700000000002"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Emergency Contacts (below contact info) ── */}
      <div className="card overflow-hidden p-0 mb-4">
        {/* Header */}
        <div className="relative overflow-hidden px-4 py-4"
          style={{ background:'linear-gradient(135deg,#450a0a 0%,#991b1b 40%,#dc2626 80%,#f87171 100%)' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-20px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'absolute', bottom:'-40px', left:'-15px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
          <div style={{ position:'absolute', top:'10px', right:'60px', width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
          <div className="relative z-10 flex items-center gap-3">
            <span className="text-4xl siren-blink" style={{ filter:'drop-shadow(0 0 8px rgba(255,200,0,0.8))' }}>🚨</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-black text-lg tracking-wider">เบอร์ฉุกเฉิน</h3>
                <span className="text-[10px] font-bold text-red-900 px-2 py-0.5 rounded-full" style={{ background:'rgba(255,220,0,0.9)' }}>📢 EMERGENCY</span>
              </div>
              <p className="text-red-200 text-xs mt-0.5">อบต.แม่ใส · กดโทรได้ทันที · 24 ชม.</p>
            </div>
            <div className="text-center">
              <div className="text-white text-2xl">☎️</div>
              <div className="text-red-200 text-[9px] font-bold">24 / 7</div>
            </div>
          </div>
          <span className="float-s1" style={{ position:'absolute', top:'6px', right:'50px', fontSize:'20px', opacity:0.5 }}>⭐</span>
          <span className="float-s2" style={{ position:'absolute', bottom:'5px', right:'18px', fontSize:'15px', opacity:0.45 }}>✨</span>
          <span className="float-s3" style={{ position:'absolute', top:'12px', left:'55%', fontSize:'13px', opacity:0.35 }}>💫</span>
        </div>

        <div className="p-3 space-y-3" style={{ background:'linear-gradient(180deg,#fff5f5 0%,#fff 60%)' }}>
          {/* 1669 Hero */}
          <div className="relative mt-2">
            <span className="float-s1" style={{ position:'absolute', top:'-14px', left:'18px', fontSize:'26px', zIndex:10, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>❤️</span>
            <span className="float-s2" style={{ position:'absolute', top:'-16px', right:'22px', fontSize:'28px', zIndex:10, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>💊</span>
            <span className="float-s3" style={{ position:'absolute', bottom:'-10px', right:'50px', fontSize:'20px', zIndex:10, filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}>🩺</span>
            <a href="tel:1669" className="glow-pulse flex items-center gap-4 rounded-2xl p-4 pt-6 pb-4 hover:scale-[1.01] transition-transform"
              style={{ background:'linear-gradient(135deg,#dc2626 0%,#9b1c1c 100%)', textDecoration:'none', display:'flex' }}>
              <div style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(4px)', borderRadius:'50%', width:'68px', height:'68px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'38px', flexShrink:0, border:'2px solid rgba(255,255,255,0.3)' }}>🚑</div>
              <div className="flex-1 min-w-0">
                <p className="text-red-200 text-xs font-semibold mb-0.5">🏥 เจ็บป่วยฉุกเฉิน</p>
                <p className="text-white font-black leading-none tracking-widest" style={{ fontSize:'42px' }}>1669</p>
                <p className="text-red-300 text-[10px]">Emergency Medical Service</p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0, border:'2px solid rgba(255,255,255,0.3)' }}>📞</div>
            </a>
          </div>

          {/* Contacts divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background:'linear-gradient(to right,transparent,#fca5a5)' }}/>
            <span className="text-[10px] font-bold text-red-400 px-2">👥 ติดต่อเจ้าหน้าที่</span>
            <div className="h-px flex-1" style={{ background:'linear-gradient(to left,transparent,#fca5a5)' }}/>
          </div>

          {/* Official contacts list */}
          <div className="rounded-xl overflow-hidden border border-red-100">
            {[
              { label:'นายก อบต.แม่ใส',  phone:'0897577366', display:'089-757-7366', icon:'👨‍💼', badge:'⭐', bg:'#eff6ff', text:'#1d4ed8' },
              { label:'ปลัด อบต.แม่ใส',  phone:'0987496770', display:'098-749-6770', icon:'📋',   badge:'✅', bg:'#f0fdf4', text:'#15803d' },
              { label:'นักป้องกันฯ',      phone:'0812635432', display:'081-263-5432', icon:'🚒',  badge:'🔥', bg:'#fff7ed', text:'#c2410c' },
              { label:'ป้องกัน อบต.',     phone:'054889809',  display:'054-889-809',  icon:'🛡️', badge:'💪', bg:'#fff7ed', text:'#c2410c' },
              { label:'รพ.สต.แม่ใส',     phone:'054889885',  display:'054-889-885',  icon:'🏥',  badge:'💚', bg:'#f0fdf4', text:'#15803d' },
            ].map(({ label, phone, display, icon, badge, bg, text }, i, arr) => (
              <a key={phone} href={`tel:${phone}`}
                className="flex items-center gap-2.5 px-3 py-2 hover:brightness-95 transition-all"
                style={{ background:bg, borderBottom:i < arr.length-1 ? '1px solid rgba(0,0,0,0.05)' : 'none', textDecoration:'none', display:'flex' }}>
                <div className="relative flex-shrink-0">
                  <span className="text-xl">{icon}</span>
                  <span style={{ position:'absolute', top:'-6px', right:'-6px', fontSize:'11px' }}>{badge}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 leading-tight truncate">{label}</p>
                  <p className="text-sm font-bold leading-tight" style={{ color:text }}>{display}</p>
                </div>
                <span className="text-base flex-shrink-0">📞</span>
              </a>
            ))}
          </div>

          {/* Utility divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background:'linear-gradient(to right,transparent,#d1d5db)' }}/>
            <span className="text-[10px] font-bold text-gray-400 px-2">⚙️ สายด่วนสาธารณูปโภค</span>
            <div className="h-px flex-1" style={{ background:'linear-gradient(to left,transparent,#d1d5db)' }}/>
          </div>

          {/* Utility hotlines */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label:'ไฟฟ้า',  number:'1129', icon:'⚡', badge:'💡', bg:'linear-gradient(135deg,#fef3c7,#fefce8)', border:'#fde047', text:'#713f12' },
              { label:'ประปา',  number:'1662', icon:'💧', badge:'🚰', bg:'linear-gradient(135deg,#dbeafe,#eff6ff)', border:'#93c5fd', text:'#1e3a8a' },
              { label:'ตำรวจ', number:'191',  icon:'👮', badge:'🚔', bg:'linear-gradient(135deg,#ede9fe,#f5f3ff)', border:'#c4b5fd', text:'#4c1d95' },
            ].map(({ label, number, icon, badge, bg, border, text }) => (
              <a key={number} href={`tel:${number}`}
                className="relative flex flex-col items-center gap-0.5 rounded-xl py-2.5 hover:scale-[1.04] transition-transform text-center"
                style={{ background:bg, border:`1.5px solid ${border}`, textDecoration:'none' }}>
                <div className="relative">
                  <span className="text-2xl">{icon}</span>
                  <span style={{ position:'absolute', top:'-8px', right:'-8px', fontSize:'12px' }}>{badge}</span>
                </div>
                <p className="text-[10px] font-bold mt-1" style={{ color:text }}>{label}</p>
                <p className="text-2xl font-black tracking-wider" style={{ color:text }}>{number}</p>
              </a>
            ))}
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-0.5">
            <span className="text-base">🌙</span>
            <p className="text-[10px] text-gray-400 text-center">บริการ 24 ชั่วโมง ทุกวัน ไม่เว้นวันหยุดราชการ</p>
            <span className="text-base">☀️</span>
          </div>
        </div>
      </div>
    </div>
  )
}
