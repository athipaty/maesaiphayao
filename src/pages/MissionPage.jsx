export default function MissionPage() {
  const mandatory = [
    { icon: '🛣️', text: 'จัดให้มีและบำรุงรักษาทางน้ำและทางบก รักษาความเป็นระเบียบเรียบร้อย ดูแลการจราจร' },
    { icon: '🧹', text: 'รักษาความสะอาดของถนน ทางน้ำ ทางเดินและที่สาธารณะ รวมถึงกำจัดขยะมูลฝอยและสิ่งปฏิกูล' },
    { icon: '🦠', text: 'ป้องกันโรคและระงับโรคติดต่อ' },
    { icon: '🚒', text: 'ป้องกันและบรรเทาสาธารณภัย' },
    { icon: '🎓', text: 'จัดการ ส่งเสริมและสนับสนุนการจัดการศึกษา ศาสนา วัฒนธรรม และการฝึกอบรมให้แก่ประชาชน' },
    { icon: '👧', text: 'ส่งเสริมการพัฒนาสตรี เด็กและเยาวชน ผู้สูงอายุและพิการ' },
    { icon: '🌿', text: 'คุ้มครอง ดูแลและบำรุงรักษาทรัพยากรธรรมชาติและสิ่งแวดล้อม' },
    { icon: '🎭', text: 'บำรุงรักษาศิลปะ จารีตประเพณี ภูมิปัญญาท้องถิ่นและวัฒนธรรมอันดีของท้องถิ่น' },
    { icon: '📋', text: 'ปฏิบัติหน้าที่อื่นตามที่ทางราชการมอบหมาย' },
  ]

  const optional = [
    { icon: '💧', text: 'ให้มีน้ำเพื่อการอุปโภค บริโภค และการเกษตร' },
    { icon: '💡', text: 'ให้มีและบำรุงไฟฟ้าหรือแสงสว่างโดยวิธีอื่น' },
    { icon: '🌊', text: 'ให้มีและบำรุงรักษาทางระบายน้ำ' },
    { icon: '⚽', text: 'ให้มีและบำรุงสถานที่ประชุม การกีฬา การพักผ่อนหย่อนใจและสวนสาธารณะ' },
    { icon: '🌾', text: 'ให้มีและส่งเสริมกลุ่มการเกษตร และกิจการสหกรณ์' },
    { icon: '🏭', text: 'ส่งเสริมให้มีอุตสาหกรรมในครอบครัว' },
    { icon: '💼', text: 'บำรุงและส่งเสริมการประกอบอาชีพของราษฎร' },
    { icon: '🏛️', text: 'การคุ้มครองดูแลและรักษาทรัพย์สินอันเป็นสาธารณสมบัติของแผ่นดิน' },
    { icon: '🏪', text: 'ให้มีตลาด ท่าเทียบเรือ และท่าข้าม' },
    { icon: '🛍️', text: 'กิจการเกี่ยวกับการพาณิชย์' },
    { icon: '🗺️', text: 'การท่องเที่ยว' },
    { icon: '🏙️', text: 'การผังเมือง' },
  ]

  const services = [
    'การจัดทำแผนพัฒนาท้องถิ่น', 'การจัดให้มีและบำรุงรักษาทางบก ทางน้ำ และทางระบายน้ำ',
    'การจัดให้มีและควบคุมตลาด ท่าเทียบเรือ ท่าข้าม และที่จอดรถ', 'การสาธารณูปโภคและการก่อสร้างอื่นๆ',
    'การส่งเสริมการฝึกและประกอบอาชีพ', 'การพาณิชย์และการส่งเสริมการลงทุน',
    'การส่งเสริมการท่องเที่ยว', 'การจัดการศึกษา',
    'การสังคมสงเคราะห์และการพัฒนาคุณภาพชีวิตเด็ก สตรี คนชรา และผู้ด้อยโอกาส',
    'การบำรุงรักษาศิลปะ จารีตประเพณี ภูมิปัญญาท้องถิ่น และวัฒนธรรมอันดีของท้องถิ่น',
    'การจัดให้มีและบำรุงรักษาสถานที่พักผ่อนหย่อนใจ', 'การส่งเสริมกีฬา',
    'การส่งเสริมประชาธิปไตย ความเสมอภาค และสิทธิเสรีภาพของประชาชน',
    'ส่งเสริมการมีส่วนร่วมของราษฎรในการพัฒนาท้องถิ่น',
    'การรักษาความสะอาดและความเป็นระเบียบเรียบร้อยของบ้านเมือง',
    'การกำจัดขยะมูลฝอย สิ่งปฏิกูล และน้ำเสีย',
    'การสาธารณสุข การอนามัยครอบครัว และการรักษาพยาบาล',
    'การป้องกันและบรรเทาสาธารณภัย',
    'การรักษาความสงบเรียบร้อย การป้องกันและรักษาความปลอดภัยในชีวิตและทรัพย์สิน',
    'การจัดการ การบำรุงรักษา และการใช้ประโยชน์จากป่าไม้ ที่ดิน ทรัพยากรธรรมชาติ และสิ่งแวดล้อม',
    'การผังเมือง', 'การขนส่งและการวิศวกรรมจราจร',
    'การดูแลรักษาที่สาธารณะ', 'การควบคุมอาคาร',
  ]

  return (
    <div className="space-y-5">

      {/* บทบาทหลัก */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🏛️ บทบาทขององค์การบริหารส่วนตำบล</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="text-sm font-bold text-primary mb-2">องค์กรปกครองส่วนท้องถิ่น</h3>
            <p className="text-xs text-gray-600 leading-relaxed">มีฐานะเป็นนิติบุคคล เป็นราชการบริหารส่วนท้องถิ่นระดับตำบล</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="text-2xl mb-2">🌱</div>
            <h3 className="text-sm font-bold text-primary mb-2">พัฒนาตำบลรอบด้าน</h3>
            <p className="text-xs text-gray-600 leading-relaxed">มีอำนาจหน้าที่พัฒนาตำบลทั้งด้านเศรษฐกิจ สังคม และวัฒนธรรม เพื่อประโยชน์ของประชาชนในท้องถิ่น</p>
          </div>
        </div>
      </div>

      {/* มาตรา 67 - หน้าที่ที่ต้องทำ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">✅ อำนาจหน้าที่ที่ต้องดำเนินการ (มาตรา 67)</h2>
        </div>
        <div className="px-5 py-2 bg-blue-50/50 border-b border-blue-100">
          <p className="text-xs text-gray-500">ตาม พ.ร.บ.สภาตำบลและองค์การบริหารส่วนตำบล พ.ศ.2537 แก้ไขเพิ่มเติม ฉบับที่ 7 พ.ศ.2562</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {mandatory.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-blue-50/50 transition-colors">
              <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon}</span>
              <div className="flex-1">
                <span className="text-xs font-bold text-secondary mr-1">({i+1})</span>
                <span className="text-xs text-gray-700 leading-relaxed">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* มาตรา 68 - หน้าที่ที่อาจทำ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🔵 อำนาจหน้าที่ที่อาจดำเนินการ (มาตรา 68)</h2>
        </div>
        <div className="px-5 py-2 bg-blue-50/50 border-b border-blue-100">
          <p className="text-xs text-gray-500">กิจกรรมที่ อบต. สามารถดำเนินการได้ตามความเหมาะสม</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {optional.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-green-50/50 transition-colors">
              <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon}</span>
              <div className="flex-1">
                <span className="text-xs font-bold text-accent mr-1">({i+1})</span>
                <span className="text-xs text-gray-700 leading-relaxed">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* มาตรา 16 - บริการสาธารณะ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🌐 การจัดระบบบริการสาธารณะ (มาตรา 16)</h2>
        </div>
        <div className="px-5 py-2 bg-blue-50/50 border-b border-blue-100">
          <p className="text-xs text-gray-500">ตาม พ.ร.บ.กำหนดแผนและขั้นตอนการกระจายอำนาจให้แก่องค์กรปกครองส่วนท้องถิ่น พ.ศ.2542</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {services.map((item, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50">
                <span className="text-xs font-bold text-primary flex-shrink-0 w-6">({i+1})</span>
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* กฎหมายที่เกี่ยวข้อง */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📚 กฎหมายที่เกี่ยวข้อง</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: '📜', label: 'รัฐธรรมนูญ',        value: 'รัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560' },
            { icon: '📗', label: 'กฎหมายจัดตั้ง',    value: 'พ.ร.บ.สภาตำบลและองค์การบริหารส่วนตำบล พ.ศ.2537 แก้ไขเพิ่มเติมถึงฉบับที่ 7 พ.ศ.2562' },
            { icon: '📘', label: 'กฎหมายกระจายอำนาจ', value: 'พ.ร.บ.กำหนดแผนและขั้นตอนกระจายอำนาจให้แก่องค์กรปกครองส่วนท้องถิ่น พ.ศ.2542 และฉบับที่ 2 พ.ศ.2549' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-primary mb-0.5">{item.label}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
