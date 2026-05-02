export default function HistoryPage() {
  const timeline = [
    {
      year: 'ก่อน พ.ศ. 2101',
      title: 'ยุคล้านนาเจริญรุ่งเรือง',
      desc: 'เมืองพะเยาเป็นส่วนหนึ่งของอาณาจักรล้านนา มีความเจริญรุ่งเรืองและมีความสำคัญทางประวัติศาสตร์',
      icon: '🏰',
      color: 'bg-purple-500',
    },
    {
      year: 'พ.ศ. 2101–2317',
      title: 'ล้านนาตกอยู่ใต้การปกครองพม่า 200 ปี',
      desc: 'พม่ายึดครองล้านนา เมืองพะเยาถูกลดความสำคัญและกลายเป็นเมืองร้าง ประชาชนอพยพหลบหนีไปยังเมืองลำปาง',
      icon: '⚔️',
      color: 'bg-red-500',
    },
    {
      year: 'พ.ศ. 2317',
      title: 'ขับไล่พม่าสำเร็จ เริ่มฟื้นฟูล้านนา',
      desc: 'ล้านนาร่วมกับสยามขับไล่พม่าได้สำเร็จ เริ่มฟื้นฟูเมืองต่างๆ รวมถึงเมืองพะเยาในรัชสมัย ร.3',
      icon: '🕊️',
      color: 'bg-green-500',
    },
    {
      year: 'พ.ศ. 2387',
      title: 'ตั้งเจ้าเมืองพะเยาคนแรกในยุครัตนโกสินทร์',
      desc: 'เจ้าพุทธวงศ์ (เจ้าหลวงวงศ์) ได้รับพระราชทานบรรดาศักดิ์เป็น "พระยาประเทศอุดรทิศ" เป็นเจ้าเมืองพะเยาคนแรก นำชาวเมืองกลับมาฟื้นฟูเมืองพะเยา',
      icon: '👑',
      color: 'bg-yellow-500',
    },
    {
      year: 'พ.ศ. 2458',
      title: 'ก่อตั้งชุมชนบ้านร่องไฮ',
      desc: 'กลุ่มชนจากบ้านท่ากว๊าน ต.เวียงพะเยา มาตั้งบ้านเรือน ประกอบอาชีพทำนาและเลี้ยงสัตว์ ต้นตระกูลแรกคือ "ชุ่มคำลือ" ต่อมาชาวลำปางอพยพมานำวัฒนธรรมการตีมีดมาด้วย',
      icon: '🏡',
      color: 'bg-amber-500',
    },
    {
      year: 'พ.ศ. 2481',
      title: 'ตั้งตำบลแม่นาเรือ รวมบ้านแม่ใส',
      desc: 'มีการเปลี่ยนแปลงเขตตำบล ยุบตำบลบ่อแฮ้ว บ้านแม่ใสจึงอยู่ในตำบลแม่นาเรือ อำเภอพะเยา จังหวัดเชียงราย',
      icon: '📜',
      color: 'bg-blue-500',
    },
    {
      year: 'พ.ศ. 2484',
      title: 'กำเนิดกว๊านพะเยา',
      desc: 'สร้างประตูระบายน้ำกั้นแม่น้ำอิง น้ำท่วมพื้นที่หนองกว๊านรวมกันกลายเป็น "กว๊านพะเยา" ขนาดกว่า 12,000 ไร่ ประชาชนบางส่วนต้องอพยพขึ้นที่สูง',
      icon: '🌊',
      color: 'bg-cyan-500',
    },
    {
      year: 'พ.ศ. 2520',
      title: 'ยกฐานะเป็นจังหวัดพะเยา',
      desc: 'พระบาทสมเด็จพระเจ้าอยู่หัว ร.9 โปรดเกล้าฯ ตั้งจังหวัดพะเยา ประกอบด้วย 7 อำเภอ มีนายสัญญา ปาลวัฒน์วิไชย เป็นผู้ว่าราชการจังหวัดคนแรก',
      icon: '🏛️',
      color: 'bg-indigo-500',
    },
    {
      year: 'พ.ศ. 2522',
      title: 'ตั้งตำบลแม่ใส',
      desc: 'แยกออกจากตำบลแม่นาเรือ โอนหมู่บ้าน 7 แห่ง ได้แก่ ร่องไฮ แม่ใส แม่ใสทุ่ง แม่ใสเหล่า บ่อแฮ้ว สันป่าถ่อน และสันช้างหิน เป็นตำบลแม่ใส อ.เมืองพะเยา จ.พะเยา',
      icon: '📍',
      color: 'bg-teal-500',
    },
    {
      year: 'พ.ศ. 2539',
      title: 'จัดตั้งองค์การบริหารส่วนตำบลแม่ใส',
      desc: 'ประกาศจัดตั้ง อบต.แม่ใส เมื่อวันที่ 19 มกราคม 2539 มีฐานะเป็นนิติบุคคล ดูแลพื้นที่ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา',
      icon: '🏗️',
      color: 'bg-primary',
    },
  ]

  const villages = [
    { mu: 1,  name: 'บ้านร่องไฮ',          origin: 'ชาวลำปางอพยพมา นำวัฒนธรรมการตีมีดมาด้วย' },
    { mu: 2,  name: 'บ้านแม่ใสกลาง',       origin: 'ชุมชนดั้งเดิมริมกว๊านพะเยา' },
    { mu: 3,  name: 'บ้านแม่ใสทุ่งวัวแดง', origin: 'ตั้งโดยพ่อท้าวใจวัง แยกจากบ้านแม่ใสหลวง มีวัวป่า (วัวแดง) อาศัยอยู่มาก' },
    { mu: 4,  name: 'บ้านแม่ใสเหล่า',      origin: 'ตั้งโดยพ่อเฒ่าแสนวงศ์ พื้นที่เป็นป่าเหล่า ดินเหนียวเหมาะปั้นอิฐมอญ' },
    { mu: 5,  name: 'บ้านบ่อแฮ้ว',         origin: 'ชุมชนเก่าแก่ มีบ่อน้ำที่สำคัญ' },
    { mu: 6,  name: 'บ้านสันป่าถ่อน',      origin: 'ตั้งถิ่นฐานบนสันดินริมป่า' },
    { mu: 7,  name: 'บ้านสันช้างหิน',      origin: 'พื้นที่มีหินและช้างป่าผ่าน' },
    { mu: 8,  name: 'บ้านแม่ใสหัวขัว',     origin: 'ชุมชนหัวขัวริมน้ำ' },
    { mu: 9,  name: 'บ้านแม่ใสเหนือ',      origin: 'แยกจากชุมชนแม่ใสดั้งเดิม' },
    { mu: 10, name: 'บ้านสันป่าถ่อน',      origin: 'ขยายจากหมู่ที่ 6' },
    { mu: 11, name: 'บ้านร่องไฮ',          origin: 'ขยายจากหมู่ที่ 1 บ้านร่องไฮ' },
    { mu: 12, name: 'บ้านแม่ใสเหล่าใต้',   origin: 'แยกจากบ้านแม่ใสเหล่า' },
  ]

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-xl overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #7f5a00 0%, #b8860b 50%, #daa520 100%)' }}>
        <div className="px-8 py-10 text-white text-center">
          <div className="text-5xl mb-3">📜</div>
          <h1 className="text-2xl font-bold mb-1">ประวัติความเป็นมา</h1>
          <p className="text-white/80 text-sm">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา</p>
          <p className="text-white/60 text-xs mt-2">องค์การบริหารส่วนตำบลแม่ใส ก่อตั้ง 19 มกราคม พ.ศ. 2539</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🕐 เส้นทางประวัติศาสตร์</h2>
        </div>
        <div className="p-5">
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-4">
                  {/* dot */}
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-xl flex-shrink-0 z-10 shadow-md`}>
                    {item.icon}
                  </div>
                  {/* content */}
                  <div className="flex-1 pb-2">
                    <span className="text-xs font-bold text-secondary bg-blue-50 px-2 py-0.5 rounded-full">{item.year}</span>
                    <h3 className="text-sm font-bold text-gray-800 mt-1.5 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ที่มาของชื่อ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">💡 ที่มาของชื่อ "บ้านร่องไฮ"</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              ชื่อ <strong>"ร่องไฮ"</strong> มาจากลักษณะทางภูมิศาสตร์ของพื้นที่ที่มีน้ำไหลผ่านกลางหมู่บ้านลงสู่แม่น้ำอิงหรือหนองน้ำ
              สองข้างร่องน้ำมีต้นไทรใหญ่ขึ้นอยู่ เรียกกันว่า <strong>"ร่องไฮ"</strong> จนกลายมาเป็นชื่อหมู่บ้านในปัจจุบัน
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-primary mb-2">🔨 วัฒนธรรมการตีมีดจากลำปาง</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              ชาวบ้านร่องไฮที่อพยพมาจากบ้านกาดเมฆและบ้านฟ่อน จ.ลำปาง นำทักษะการตีมีด
              การทำอุปกรณ์การเกษตรด้วยเหล็กมาด้วย ซึ่งยังคงสืบทอดมาจนถึงปัจจุบัน
              <strong>"มีดบ้านร่องไฮ"</strong> จึงเป็นสินค้าที่ขึ้นชื่อของตำบลแม่ใส
            </p>
          </div>
        </div>
      </div>

      {/* หมู่บ้าน */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🏘️ 12 หมู่บ้านในตำบลแม่ใส</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-2">
            {villages.map(v => (
              <div key={v.mu} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-blue-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{v.mu}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{v.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* แหล่งอ้างอิง */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 mb-2">📚 แหล่งอ้างอิง</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          พระธรรมวิมลโมลี. ประวัติศาสตร์เมืองพะเยายุคหลัง. กรุงเทพฯ : สำนักพิมพ์มติชน, 2531.<br/>
          วิกิชุมชน สถาบันวิจัยสังคม (SAC) — wikicommunity.sac.or.th
        </p>
      </div>

    </div>
  )
}