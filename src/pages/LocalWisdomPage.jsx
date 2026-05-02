export default function LocalWisdomPage() {
  const wisdoms = [
    {
      id: 1,
      category: '🌿 เกษตรอินทรีย์',
      title: 'น้ำหมักชีวภาพ',
      expert: 'นายแก้วมูล ยะตา',
      info: 'หมู่ 9 ต.แม่ใส อ.เมือง จ.พะเยา | โทร. 083-0068950',
      experience: 'ประสบการณ์มากกว่า 10 ปี',
      color: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      border: 'border-green-200',
      icon: '🧪',
      highlights: [
        'น้ำหมักชีวภาพจากพืช — ใช้กับผักและเศษพืช',
        'น้ำหมักจากขยะเปียก — ใช้เศษอาหารในครัวเรือน',
        'อัตราส่วนใช้งาน 1:1000 หรือ 1:500 ก่อนใช้',
        'ลดการใช้สารเคมี ปลอดภัยต่อสิ่งแวดล้อม',
      ],
      description: 'น้ำหมักชีวภาพที่ได้จากเศษพืช เศษผักหลังการเก็บจากแปลงเกษตร มีกลิ่นหอม ช่วยบำรุงดินและพืช ลดต้นทุนการผลิต',
    },
    {
      id: 2,
      category: '🌾 เกษตรกรรม',
      title: 'เกษตรผสมผสาน',
      expert: 'นายอดิเรก วงศ์ภริวัฒน์',
      info: 'หมู่ 9 ต.แม่ใส อ.เมือง จ.พะเยา | โทร. 063-1145606 | อายุ 51 ปี',
      experience: 'ประสบการณ์มากกว่า 10 ปี',
      color: 'from-lime-500 to-green-600',
      bgLight: 'bg-lime-50',
      border: 'border-lime-200',
      icon: '🌱',
      highlights: [
        'พื้นที่ทำการเกษตร 7 ไร่ ปลูกผักสวนครัวหลายชนิด',
        'กักเก็บน้ำในบ่อเพื่อเลี้ยงปลา ลดต้นทุนอาหาร',
        'ทำปุ๋ยไว้ใช้เองโดยไม่พึ่งสารเคมี',
        'ยึดหลัก "เลี้ยงดิน ให้ดินเลี้ยงพืช"',
      ],
      description: 'เปลี่ยนที่นาข้าวเดิมเป็นสวนเกษตรผสมผสาน ปลูกพืชหลายชนิด เลี้ยงปลาในบ่อน้ำ สร้างความมั่นคงทางอาหารและรายได้อย่างยั่งยืน',
    },
    {
      id: 3,
      category: '🌿 สมุนไพร',
      title: 'ลูกประคบสมุนไพร',
      expert: 'นางประทุม ศุภการกำจร',
      info: 'หมู่ 12 ต.แม่ใส อ.เมือง จ.พะเยา | เกิด 18 กันยายน 2482',
      experience: 'ประสบการณ์นานกว่า 5 ปี',
      color: 'from-purple-500 to-violet-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200',
      icon: '💆',
      highlights: [
        'บรรเทาอาการปวดเมื่อย',
        'ช่วยลดอาการบวม อักเสบของกล้ามเนื้อ เอ็น ข้อต่อ หลัง',
        'ลดอาการเกร็งของกล้ามเนื้อ',
        'ช่วยเพิ่มการไหลเวียนของเลือด',
      ],
      description: 'กลุ่มผู้สูงอายุอนุรักษ์สมุนไพรตำบลแม่ใส ใช้สมุนไพรพื้นบ้านทำลูกประคบ ช่วยรักษาอาการปวดเมื่อยตามร่างกาย ใช้สมุนไพรจากท้องถิ่น ปลอดภัย ไม่มีสารเคมี',
    },
    {
      id: 4,
      category: '🧺 งานหัตถกรรม',
      title: 'ตะกร้าสาน',
      expert: 'นางเพชร ดวงพะเยา',
      info: '196 ม.2 ต.แม่ใส อ.เมือง จ.พะเยา | โทร. 083-0068950 | เกิด 13 พ.ค. 2494',
      experience: 'ประสบการณ์มากกว่า 10 ปี',
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      border: 'border-amber-200',
      icon: '🧺',
      highlights: [
        'ตะกร้าสานจากไม้ไผ่ ราคาเริ่มต้น 80 บาท',
        'วิธีทำ: นำตอกยืน 4 เส้น วัดกลางแล้ววางตั้งฉาก',
        'สานลายสอง จัดตกแต่งปากตะกร้าให้สวยงาม',
        'จำหน่ายในราคาแพงมาก เหมาะเป็นของฝากและของใช้',
      ],
      description: 'งานตะกร้าสานจากไม้ไผ่ ภูมิปัญญาดั้งเดิมที่สืบทอดมายาวนาน ทำด้วยมือทุกขั้นตอน มีหลายขนาดและรูปแบบ เป็นมิตรกับสิ่งแวดล้อม',
    },
    {
      id: 5,
      category: '🎊 ประเพณี',
      title: 'ประเพณีแห่ไม้ค้ำต้นศรีมหาโพธิ์',
      expert: 'ชุมชนบ้านแม่ใส',
      info: 'จัดขึ้นทุกปี บ้านแม่ใสเหล่า ตำบลแม่ใส',
      experience: 'สืบทอดมายาวนานหลายชั่วอายุคน',
      color: 'from-yellow-500 to-amber-600',
      bgLight: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '🌳',
      highlights: [
        'นำไม้ค้ำต้นศรีมหาโพธิ์เพื่อความเป็นสิริมงคล',
        'จัดขบวนแห่พร้อมดอกไม้ ใบตอง ฯลฯ ตกแต่งสวยงาม',
        'ใช้ไม้ค้ำต้นศรีมหาโพธิ์ไปราวายวัด ประธานในพิธี',
        'สร้างความสามัคคีในชุมชน อนุรักษ์วัฒนธรรม',
      ],
      description: 'ประเพณีที่สืบทอดมายาวนาน ชาวพุทธนิยมจัดต้นไม้ที่เกี่ยวกับพระพุทธศาสนา โดยเฉพาะต้นศรีมหาโพธิ์ ที่มีความเชื่อพันผูกกับพระพุทธเจ้า',
    },
    {
      id: 6,
      category: '🌊 ประเพณี',
      title: 'ประเพณีสืบชะตาแม่น้ำร่องใส',
      expert: 'ชุมชนตำบลแม่ใส',
      info: 'จัดทุกปี วันแรม 8 ค่ำ เดือน 7 บริเวณลำน้ำร่องใส หมู่ 3',
      experience: 'สืบทอดตามความเชื่อดั้งเดิม',
      color: 'from-blue-500 to-cyan-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200',
      icon: '🏞️',
      highlights: [
        'จัดวันแรม 8 ค่ำ เดือน 7 ทุกปี ณ ลำน้ำร่องใส ม.3',
        'พิธีนิมนต์พระอุปคุต วางก้อนหินสีขาว 3 ก้อนในน้ำ',
        'นำดอกไม้ฉัตรเทียนมาบูชา สวดอ้อนวอนขอฝน',
        'สร้างจิตสำนึกรักษ์ธรรมชาติ อนุรักษ์แหล่งน้ำ',
      ],
      description: 'ประเพณีขอฝน อนุรักษ์แหล่งน้ำของชุมชน เพื่อกระตุ้นให้คนในท้องถิ่นตระหนักในคุณค่าของธรรมชาติ และอนุรักษ์วัฒนธรรม ความเชื่อที่สืบทอดมา',
    },
  ]

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-xl overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #1a8a4a 100%)' }}>
        <div className="px-8 py-10 text-white text-center">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-2xl font-bold mb-1">ภูมิปัญญาท้องถิ่น</h1>
          <p className="text-white/80 text-sm">ผญาชาวบ้าน ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา</p>
          <p className="text-white/60 text-xs mt-2">องค์ความรู้และภูมิปัญญาที่สืบทอดจากบรรพบุรุษ</p>
        </div>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🌿', label: 'เกษตร & สมุนไพร', count: 3 },
          { icon: '🎊', label: 'ประเพณี & วัฒนธรรม', count: 2 },
          { icon: '🧺', label: 'งานหัตถกรรม', count: 1 },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-lg font-bold text-primary">{item.count}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Wisdom cards */}
      {wisdoms.map(w => (
        <div key={w.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Card header */}
          <div className={`bg-gradient-to-r ${w.color} px-5 py-4 flex items-center gap-3`}>
            <span className="text-3xl">{w.icon}</span>
            <div>
              <p className="text-white/80 text-xs">{w.category}</p>
              <h2 className="text-white font-bold text-base">{w.title}</h2>
            </div>
          </div>

          <div className="p-5">
            {/* Expert info */}
            <div className={`${w.bgLight} border ${w.border} rounded-lg p-3 mb-4 flex items-start gap-3`}>
              <span className="text-2xl flex-shrink-0">👤</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{w.expert}</p>
                <p className="text-xs text-gray-500 mt-0.5">{w.info}</p>
                <p className="text-xs text-gray-400 mt-0.5">⏱ {w.experience}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{w.description}</p>

            {/* Highlights */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">จุดเด่น / ประโยชน์</p>
              <div className="grid grid-cols-1 gap-2">
                {w.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
        <p className="text-sm text-green-800 font-medium">🌱 ร่วมอนุรักษ์ภูมิปัญญาท้องถิ่น</p>
        <p className="text-xs text-green-600 mt-1">หากสนใจข้อมูลเพิ่มเติม ติดต่อ อบต.แม่ใส โทร. 0-5488-9909</p>
      </div>

    </div>
  )
}