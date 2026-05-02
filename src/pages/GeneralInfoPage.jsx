export default function GeneralInfoPage() {
  return (
    <div className="space-y-5">

      {/* Header banner */}
      <div className="rounded-xl overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #1a5276 0%, #2980b9 60%, #1abc9c 100%)' }}>
        <div className="px-8 py-10 text-white text-center">
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-2xl font-bold mb-1">องค์การบริหารส่วนตำบลแม่ใส</h1>
          <p className="text-white/80 text-sm">ตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา 56000</p>
        </div>
      </div>

      {/* ข้อมูลพื้นฐาน */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📋 ข้อมูลพื้นฐาน</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🏷️', label: 'ชื่อหน่วยงาน',      value: 'องค์การบริหารส่วนตำบลแม่ใส' },
            { icon: '📍', label: 'ที่ตั้ง',             value: '198 ม.12 ต.แม่ใส อ.เมืองพะเยา จ.พะเยา 56000' },
            { icon: '📞', label: 'โทรศัพท์',            value: '0-5488-9909' },
            { icon: '📧', label: 'อีเมล',               value: 'saraban_06560115@dla.go.th' },
            { icon: '🌐', label: 'เว็บไซต์',            value: 'www.maesaiphayao.go.th' },
            { icon: '⏰', label: 'เวลาทำการ',           value: 'จันทร์ – ศุกร์ 08:30 – 16:30 น.' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* วิสัยทัศน์ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🎯 วิสัยทัศน์และพันธกิจ</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="border-l-4 border-accent pl-4 py-2">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">วิสัยทัศน์</p>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              "ตำบลแม่ใสน่าอยู่ ชุมชนเข้มแข็ง ประชาชนมีคุณภาพชีวิตที่ดี บนพื้นฐานของหลักธรรมาภิบาล"
            </p>
          </div>
          <div className="border-l-4 border-secondary pl-4 py-2">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">พันธกิจ</p>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">›</span>พัฒนาโครงสร้างพื้นฐาน ระบบสาธารณูปโภค ให้ได้มาตรฐาน</li>
              <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">›</span>ส่งเสริมคุณภาพชีวิต การศึกษา สาธารณสุข และสวัสดิการสังคม</li>
              <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">›</span>อนุรักษ์ทรัพยากรธรรมชาติ สิ่งแวดล้อม และวัฒนธรรมท้องถิ่น</li>
              <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">›</span>บริหารจัดการภายใต้หลักธรรมาภิบาล โปร่งใส ตรวจสอบได้</li>
              <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">›</span>ส่งเสริมการมีส่วนร่วมของประชาชนในการพัฒนาท้องถิ่น</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ข้อมูลประชากร */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">👥 ข้อมูลประชากรและพื้นที่</h2>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🗺️', label: 'พื้นที่',         value: '~30', unit: 'ตร.กม.' },
            { icon: '🏘️', label: 'จำนวนหมู่บ้าน', value: '13',   unit: 'หมู่บ้าน' },
            { icon: '👨‍👩‍👧‍👦', label: 'จำนวนครัวเรือน', value: '~2,800', unit: 'ครัวเรือน' },
            { icon: '🧑', label: 'ประชากร',        value: '~7,500', unit: 'คน' },
          ].map(item => (
            <div key={item.label}
              className="text-center p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xl font-bold text-primary">{item.value}</div>
              <div className="text-xs text-gray-400">{item.unit}</div>
              <div className="text-xs text-gray-600 mt-1 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* อาณาเขต */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🧭 อาณาเขตติดต่อ</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {[
            { dir: '⬆️ ทิศเหนือ',  value: 'ติดต่อกับตำบลบ้านตุ่น อ.เมืองพะเยา' },
            { dir: '⬇️ ทิศใต้',    value: 'ติดต่อกับตำบลบ้านต๋อม อ.เมืองพะเยา' },
            { dir: '⬅️ ทิศตะวันตก', value: 'ติดต่อกับตำบลแม่ปืม อ.เมืองพะเยา' },
            { dir: '➡️ ทิศตะวันออก', value: 'ติดต่อกับตำบลบ้านสาง อ.เมืองพะเยา' },
          ].map(item => (
            <div key={item.dir} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-lg flex-shrink-0">{item.dir.split(' ')[0]}</span>
              <div>
                <p className="text-xs font-semibold text-primary mb-0.5">{item.dir.split(' ').slice(1).join(' ')}</p>
                <p className="text-xs text-gray-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* สภาพทั่วไป */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🌿 สภาพทั่วไปของตำบล</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            ตำบลแม่ใส เป็นตำบลหนึ่งในอำเภอเมืองพะเยา จังหวัดพะเยา มีลักษณะภูมิประเทศเป็นที่ราบลุ่ม
            บริเวณริมกว๊านพะเยา ประชาชนส่วนใหญ่ประกอบอาชีพเกษตรกรรม ทำนา ทำสวน และประมงน้ำจืด
            มีแหล่งน้ำธรรมชาติที่สำคัญคือกว๊านพะเยา ซึ่งเป็นแหล่งน้ำจืดขนาดใหญ่ที่สุดในภาคเหนือ
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: '🌾', label: 'เกษตรกรรม' },
              { icon: '🐟', label: 'ประมงน้ำจืด' },
              { icon: '🏭', label: 'อุตสาหกรรมขนาดย่อม' },
            ].map(item => (
              <div key={item.label}
                className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs text-gray-600 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}