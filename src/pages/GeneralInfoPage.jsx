export default function GeneralInfoPage() {
  return (
    <div className="space-y-5">

      {/* ข้อมูลพื้นฐาน */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📋 ข้อมูลพื้นฐาน</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🏷️', label: 'ชื่อหน่วยงาน',  value: 'องค์การบริหารส่วนตำบลแม่ใส' },
            { icon: '📍', label: 'ที่ตั้ง',         value: '198 ม.12 ต.แม่ใส อ.เมืองพะเยา จ.พะเยา 56000' },
            { icon: '📞', label: 'โทรศัพท์',        value: '0-5488-9909' },
            { icon: '📧', label: 'อีเมล',           value: 'saraban_06560115@dla.go.th' },
            { icon: '📏', label: 'พื้นที่',          value: '29.96 ตารางกิโลเมตร (18,163 ไร่)' },
            { icon: '⏰', label: 'เวลาทำการ',       value: 'จันทร์ – ศุกร์ 08:30 – 16:30 น.' },
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

      {/* อาณาเขต */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🧭 อาณาเขตติดต่อ</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { dir: '⬆️', label: 'ทิศเหนือ',    value: 'ติดกับกว๊านพะเยา และตำบลเวียง อำเภอเมืองพะเยา' },
            { dir: '⬇️', label: 'ทิศใต้',      value: 'ติดกับตำบลแม่กา และตำบลแม่นาเรือ' },
            { dir: '➡️', label: 'ทิศตะวันออก', value: 'ติดกับตำบลแม่ต๋ำ และตำบลแม่กา' },
            { dir: '⬅️', label: 'ทิศตะวันตก', value: 'ติดกับตำบลแม่นาเรือ และตำบลบ้านตุ่น อำเภอเมืองพะเยา' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-2xl flex-shrink-0 w-8 text-center">{item.dir}</span>
              <div>
                <p className="text-sm font-bold text-primary mb-0.5">{item.label}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* สถิติประชากร */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">👥 สถิติประชากร (ข้อมูล ณ มกราคม 2568)</h2>
        </div>
        <div className="p-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { icon: '🏘️', label: 'จำนวนหมู่บ้าน',   value: '12', unit: 'หมู่บ้าน', color: 'from-blue-50 to-blue-100 border-blue-200' },
              { icon: '🏠', label: 'จำนวนครัวเรือน',  value: '2,476', unit: 'ครัวเรือน', color: 'from-green-50 to-green-100 border-green-200' },
              { icon: '👨', label: 'ชาย',              value: '2,783', unit: 'คน', color: 'from-indigo-50 to-indigo-100 border-indigo-200' },
              { icon: '👩', label: 'หญิง',             value: '3,133', unit: 'คน', color: 'from-pink-50 to-pink-100 border-pink-200' },
            ].map(item => (
              <div key={item.label} className={`text-center p-4 rounded-xl border bg-gradient-to-br ${item.color}`}>
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-gray-500">{item.unit}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">{item.label}</div>
              </div>
            ))}
          </div>

          {/* รวมประชากร */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-center text-white mb-5">
            <p className="text-sm opacity-80 mb-1">ประชากรรวมทั้งหมด</p>
            <p className="text-4xl font-bold">5,916 <span className="text-xl font-normal">คน</span></p>
          </div>

          {/* ตารางรายหมู่บ้าน */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 text-left text-primary font-semibold">หมู่ที่</th>
                  <th className="px-3 py-2 text-left text-primary font-semibold">ชื่อหมู่บ้าน</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold">ครัวเรือน</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold">ชาย</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold">หญิง</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold">รวม</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mu: 1,  name: 'บ้านร่องไฮ',      hh: 228, m: 237, f: 268, t: 505 },
                  { mu: 2,  name: 'บ้านแม่ใสกลาง',   hh: 194, m: 251, f: 310, t: 561 },
                  { mu: 3,  name: 'บ้านแม่ใสทุ่งวัวแดง', hh: 298, m: 293, f: 354, t: 647 },
                  { mu: 4,  name: 'บ้านแม่ใสเหล่า',  hh: 211, m: 237, f: 243, t: 480 },
                  { mu: 5,  name: 'บ้านบ่อแฮ้ว',     hh: 275, m: 317, f: 381, t: 698 },
                  { mu: 6,  name: 'บ้านสันป่าถ่อน',  hh: 184, m: 172, f: 188, t: 360 },
                  { mu: 7,  name: 'บ้านสันช้างหิน',  hh: 100, m: 142, f: 148, t: 290 },
                  { mu: 8,  name: 'บ้านแม่ใสหัวขัว', hh: 127, m: 169, f: 210, t: 379 },
                  { mu: 9,  name: 'บ้านแม่ใสเหนือ',  hh: 198, m: 243, f: 292, t: 535 },
                  { mu: 10, name: 'บ้านสันป่าถ่อน',  hh: 192, m: 198, f: 225, t: 423 },
                  { mu: 11, name: 'บ้านร่องไฮ',      hh: 283, m: 282, f: 281, t: 563 },
                  { mu: 12, name: 'บ้านแม่ใสเหล่าใต้', hh: 186, m: 242, f: 233, t: 475 },
                ].map((row, i) => (
                  <tr key={row.mu} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'} hover:bg-blue-50/50`}>
                    <td className="px-3 py-2 text-center font-medium text-primary">{row.mu}</td>
                    <td className="px-3 py-2 text-gray-700">{row.name}</td>
                    <td className="px-3 py-2 text-center text-gray-600">{row.hh.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center text-blue-600">{row.m.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center text-pink-600">{row.f.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center font-semibold text-primary">{row.t.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-primary/10 font-bold">
                  <td colSpan={2} className="px-3 py-2 text-primary">รวม</td>
                  <td className="px-3 py-2 text-center text-primary">2,476</td>
                  <td className="px-3 py-2 text-center text-blue-700">2,783</td>
                  <td className="px-3 py-2 text-center text-pink-700">3,133</td>
                  <td className="px-3 py-2 text-center text-primary">5,916</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ลักษณะภูมิประเทศ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🌿 ลักษณะภูมิประเทศและภูมิอากาศ</h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            ตำบลแม่ใสมีลักษณะพื้นที่เป็นที่ราบลุ่มติดกับกว๊านพะเยา มีแม่น้ำแม่ใสเป็นแม่น้ำสายหลักที่ไหลผ่านตำบลลงสู่กว๊านพะเยา
            ตั้งอยู่ทิศตะวันตกของอำเภอเมืองพะเยา ห่างจากตัวอำเภอระยะทาง 8 กิโลเมตร
            ห่างจากจังหวัดพะเยา 10 กิโลเมตร
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '☀️', label: 'ฤดูร้อน',  desc: 'มี.ค. – มิ.ย.\nอุณหภูมิ 30-40°C' },
              { icon: '🌧️', label: 'ฤดูฝน',   desc: 'ก.ค. – ต.ค.\nฝน 1,054 มม./ปี' },
              { icon: '❄️', label: 'ฤดูหนาว', desc: 'พ.ย. – ก.พ.\nอุณหภูมิ 12-18°C' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 bg-sky-50 rounded-xl border border-sky-100">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm font-bold text-primary mb-1">{item.label}</div>
                <div className="text-xs text-gray-500 whitespace-pre-line">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* แหล่งน้ำ */}
          <div>
            <p className="text-sm font-semibold text-primary mb-2">💧 แหล่งน้ำธรรมชาติ 6 สาย</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'ลำห้วยแม่ใส — มาบรรจบกว๊านพะเยา',
                'ลำห้วยร่องไฮ — มาบรรจบกว๊านพะเยา',
                'ลำห้วยร่องห้า — ผ่านมาลำห้วยแม่ใส',
                'ลำห้วยร่องบัว — ผ่านมาลำห้วยแม่ใส',
                'ลำห้วยร่องแล้ง — ผ่านลงสำเหมือง',
                'ลำห้วยร่องเปา — ผ่านมาลำห้วยแม่ใส',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-xs text-gray-600 py-1">
                  <span className="text-blue-400 flex-shrink-0">›</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* สภาพทางสังคม */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🏫 สภาพทางสังคม</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-sm font-semibold text-primary mb-3">การศึกษา</p>
            <div className="space-y-2">
              {[
                { icon: '🧒', label: 'ศูนย์พัฒนาเด็กเล็ก อบต.แม่ใส', value: '1 แห่ง (ม.3) นักเรียน 19 คน' },
                { icon: '🏫', label: 'โรงเรียนชุมชนบ้านแม่ใส', value: '175 คน (อนุบาล–มัธยม)' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                  <span>{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary mb-3">สาธารณสุข</p>
            <div className="space-y-2">
              {[
                { icon: '🏥', label: 'โรงพยาบาลส่งเสริมสุขภาพ', value: '1 แห่ง' },
                { icon: '👨‍⚕️', label: 'พนักงานสาธารณสุขชุมชน', value: '5 คน' },
                { icon: '🏪', label: 'สถานพยาบาลเอกชน', value: '1 แห่ง' },
                { icon: '🩺', label: 'อาสาสมัครสาธารณสุข (อสม.)', value: '168 คน' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <span>{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* เศรษฐกิจ */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">💼 ระบบเศรษฐกิจ</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { icon: '🌾', label: 'เกษตรกรรม',     desc: 'ทำนา ทำสวน\n(อาชีพหลัก)' },
              { icon: '🐟', label: 'ประมงน้ำจืด',   desc: 'บริเวณกว๊านพะเยา\n(อาชีพเสริม)' },
              { icon: '🐄', label: 'ปศุสัตว์',      desc: 'เลี้ยงไก่ เป็ด โค\nสุกร กระบือ' },
              { icon: '🛒', label: 'การพาณิชย์',    desc: 'ปั๊มน้ำมัน ตลาดนัด\nสหกรณ์การเกษตร' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs font-bold text-gray-700 mb-1">{item.label}</div>
                <div className="text-xs text-gray-500 whitespace-pre-line">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            📊 มีเกษตรกรในตำบลแม่ใสลงทะเบียนทำนา จำนวน 2,051 ราย คิดเป็นพื้นที่ปลูกทั้งสิ้น 9,012 ไร่
          </p>
        </div>
      </div>

      {/* ศาสนา ประเพณี วัฒนธรรม */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🙏 ศาสนา ประเพณี วัฒนธรรม</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-sm font-semibold text-primary mb-3">วัดในตำบล 5 แห่ง</p>
            <div className="space-y-1.5">
              {[
                { name: 'วัดแม่ใส',       mu: 'ม.2 (บ้านแม่ใส)' },
                { name: 'วัดร่องไฮ',      mu: 'ม.1 (บ้านร่องไฮ)' },
                { name: 'วัดบ่อแฮ้ว',     mu: 'ม.5 (บ้านบ่อแฮ้ว)' },
                { name: 'วัดสันช้างหิน',  mu: 'ม.7 (บ้านสันช้างหิน)' },
                { name: 'วัดสันป่าถ่อน', mu: 'ม.6 (บ้านสันป่าถ่อน)' },
              ].map(item => (
                <div key={item.name} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100">
                  <span className="flex items-center gap-2"><span>⛪</span> {item.name}</span>
                  <span className="text-xs text-gray-400">{item.mu}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary mb-3">ประเพณีประจำปี</p>
            <div className="space-y-1.5">
              {[
                { name: 'วันขึ้นปีใหม่',          month: 'มกราคม' },
                { name: 'วันสงกรานต์',            month: 'เมษายน' },
                { name: 'วันสลากภัตร',           month: 'ตุลาคม' },
                { name: 'วันลอยกระทง',           month: 'พฤศจิกายน' },
                { name: 'วันเข้าพรรษา ออกพรรษา', month: 'ก.ค. – ต.ค.' },
              ].map(item => (
                <div key={item.name} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100">
                  <span className="flex items-center gap-2"><span>🎉</span> {item.name}</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="bg-amber-50 rounded-lg p-3 text-sm text-gray-700">
            <span className="font-semibold">🔨 สินค้าพื้นเมือง:</span> ข้าวร่องไฮ มีดร่องไฮ กระเป๋าที่ทำจากต้นกก
          </div>
        </div>
      </div>

      {/* ระบบบริการพื้นฐาน */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">🛣️ ระบบบริการพื้นฐาน</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🛣️', label: 'ถนนสายหลัก',
              value: 'ทล.1193 สายแม่นาเรือ–แม่ใจ\nทางหลวงชนบท สายแม่ใส–สันป่าม่วง\nทางหลวงชนบท สายแม่ใส–ร่องคำ\nทางหลวงชนบท สายแม่ใส–แม่กา' },
            { icon: '💡', label: 'ไฟฟ้า',       value: 'ครอบคลุม 100% ทุกครัวเรือน' },
            { icon: '🚿', label: 'ประปา',        value: 'ประปาหมู่บ้าน 6 แห่ง\nประปาส่วนภูมิภาค (บางส่วน)' },
            { icon: '📡', label: 'โทรคมนาคม',   value: 'ไม่มีโทรศัพท์สาธารณะ\nประชาชนใช้โทรศัพท์มือถือ\nมีอินเทอร์เน็ต' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-primary mb-1">{item.label}</p>
                <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}