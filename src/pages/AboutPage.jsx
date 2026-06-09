import { useState } from 'react'

const TABS = [
  { id: 'info',    label: '📋 ข้อมูลพื้นฐาน' },
  { id: 'history', label: '📜 ประวัติความเป็นมา' },
  { id: 'mission', label: '🏛️ วิสัยทัศน์/พันธกิจ' },
  { id: 'power',   label: '⚖️ อำนาจหน้าที่' },
]

function TabInfo() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
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
            <div key={item.label} className="flex items-start gap-3 p-3 bg-pink-50/50 rounded-lg">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
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
              <span className="text-2xl flex-shrink-0">{item.dir}</span>
              <div>
                <p className="text-sm font-bold text-primary mb-0.5">{item.label}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">👥 สถิติประชากร (ข้อมูล ณ มกราคม 2568)</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { icon: '🏘️', label: 'หมู่บ้าน',    value: '12',    unit: 'หมู่บ้าน', color: 'from-blue-50 to-blue-100 border-blue-200' },
              { icon: '🏠', label: 'ครัวเรือน',   value: '2,476', unit: 'ครัวเรือน', color: 'from-green-50 to-green-100 border-green-200' },
              { icon: '👨', label: 'ชาย',          value: '2,783', unit: 'คน',       color: 'from-indigo-50 to-indigo-100 border-indigo-200' },
              { icon: '👩', label: 'หญิง',         value: '3,133', unit: 'คน',       color: 'from-pink-50 to-pink-100 border-pink-200' },
            ].map(item => (
              <div key={item.label} className={`text-center p-4 rounded-xl border bg-gradient-to-br ${item.color}`}>
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-gray-500">{item.unit}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-center text-white mb-5">
            <p className="text-sm opacity-80 mb-1">ประชากรรวมทั้งหมด</p>
            <p className="text-4xl font-bold">5,916 <span className="text-xl font-normal">คน</span></p>
          </div>

          {/* ตารางรายหมู่บ้าน */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 text-left text-primary font-semibold text-xs">หมู่ที่</th>
                  <th className="px-3 py-2 text-left text-primary font-semibold text-xs">ชื่อหมู่บ้าน</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold text-xs">ครัวเรือน</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold text-xs">ชาย</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold text-xs">หญิง</th>
                  <th className="px-3 py-2 text-center text-primary font-semibold text-xs">รวม</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mu: 1,  name: 'บ้านร่องไฮ',           hh: 228, m: 237, f: 268, t: 505 },
                  { mu: 2,  name: 'บ้านแม่ใสกลาง',        hh: 194, m: 251, f: 310, t: 561 },
                  { mu: 3,  name: 'บ้านแม่ใสทุ่งวัวแดง',  hh: 298, m: 293, f: 354, t: 647 },
                  { mu: 4,  name: 'บ้านแม่ใสเหล่า',       hh: 211, m: 237, f: 243, t: 480 },
                  { mu: 5,  name: 'บ้านบ่อแฮ้ว',          hh: 275, m: 317, f: 381, t: 698 },
                  { mu: 6,  name: 'บ้านสันป่าถ่อน',       hh: 184, m: 172, f: 188, t: 360 },
                  { mu: 7,  name: 'บ้านสันช้างหิน',       hh: 100, m: 142, f: 148, t: 290 },
                  { mu: 8,  name: 'บ้านแม่ใสหัวขัว',      hh: 127, m: 169, f: 210, t: 379 },
                  { mu: 9,  name: 'บ้านแม่ใสเหนือ',       hh: 198, m: 243, f: 292, t: 535 },
                  { mu: 10, name: 'บ้านสันป่าถ่อน',       hh: 192, m: 198, f: 225, t: 423 },
                  { mu: 11, name: 'บ้านร่องไฮ',           hh: 283, m: 282, f: 281, t: 563 },
                  { mu: 12, name: 'บ้านแม่ใสเหล่าใต้',    hh: 186, m: 242, f: 233, t: 475 },
                ].map((row, i) => (
                  <tr key={row.mu} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-pink-50/50`}>
                    <td className="px-3 py-2 text-center font-medium text-primary text-xs">{row.mu}</td>
                    <td className="px-3 py-2 text-gray-700 text-xs">{row.name}</td>
                    <td className="px-3 py-2 text-center text-gray-600 text-xs">{row.hh.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center text-blue-600 text-xs">{row.m.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center text-pink-600 text-xs">{row.f.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center font-semibold text-primary text-xs">{row.t.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-primary/10 font-bold">
                  <td colSpan={2} className="px-3 py-2 text-primary text-xs">รวมทั้งหมด</td>
                  <td className="px-3 py-2 text-center text-primary text-xs">2,476</td>
                  <td className="px-3 py-2 text-center text-blue-700 text-xs">2,783</td>
                  <td className="px-3 py-2 text-center text-pink-700 text-xs">3,133</td>
                  <td className="px-3 py-2 text-center text-primary text-xs">5,916</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">🌿 ลักษณะภูมิประเทศและภูมิอากาศ</h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            ตำบลแม่ใสมีลักษณะพื้นที่เป็นที่ราบลุ่มติดกับกว๊านพะเยา มีแม่น้ำแม่ใสเป็นแม่น้ำสายหลักที่ไหลผ่านตำบลลงสู่กว๊านพะเยา
            ตั้งอยู่ทิศตะวันตกของอำเภอเมืองพะเยา ห่างจากตัวอำเภอระยะทาง 8 กิโลเมตร ห่างจากจังหวัดพะเยา 10 กิโลเมตร
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
        </div>
      </div>
    </div>
  )
}

function TabHistory() {
  const timeline = [
    { year: 'ก่อน พ.ศ. 2101', title: 'ยุคล้านนาเจริญรุ่งเรือง', desc: 'เมืองพะเยาเป็นส่วนหนึ่งของอาณาจักรล้านนา มีความเจริญรุ่งเรืองและสำคัญทางประวัติศาสตร์', icon: '🏰', color: 'bg-purple-500' },
    { year: 'พ.ศ. 2101–2317', title: 'ล้านนาตกอยู่ใต้การปกครองพม่า 200 ปี', desc: 'พม่ายึดครองล้านนา เมืองพะเยากลายเป็นเมืองร้าง ประชาชนอพยพหลบหนี', icon: '⚔️', color: 'bg-red-500' },
    { year: 'พ.ศ. 2317', title: 'ขับไล่พม่าสำเร็จ', desc: 'ล้านนาร่วมกับสยามขับไล่พม่าได้สำเร็จ เริ่มฟื้นฟูเมืองต่างๆ', icon: '🕊️', color: 'bg-green-500' },
    { year: 'พ.ศ. 2458', title: 'ก่อตั้งชุมชนบ้านร่องไฮ', desc: 'กลุ่มชนจากบ้านท่ากว๊าน ต.เวียงพะเยา มาตั้งบ้านเรือน ต้นตระกูล "ชุ่มคำลือ"', icon: '🏡', color: 'bg-amber-500' },
    { year: 'พ.ศ. 2484', title: 'กำเนิดกว๊านพะเยา', desc: 'สร้างประตูระบายน้ำกั้นแม่น้ำอิง น้ำท่วมกลายเป็น "กว๊านพะเยา" กว่า 12,000 ไร่', icon: '🌊', color: 'bg-cyan-500' },
    { year: 'พ.ศ. 2520', title: 'ยกฐานะเป็นจังหวัดพะเยา', desc: 'ประกอบด้วย 7 อำเภอ นายสัญญา ปาลวัฒน์วิไชย เป็นผู้ว่าฯ คนแรก', icon: '🏛️', color: 'bg-indigo-500' },
    { year: 'พ.ศ. 2522', title: 'ตั้งตำบลแม่ใส', desc: 'แยกออกจากตำบลแม่นาเรือ โอนหมู่บ้าน 7 แห่ง เป็นตำบลแม่ใส อ.เมืองพะเยา จ.พะเยา', icon: '📍', color: 'bg-teal-500' },
    { year: 'พ.ศ. 2539', title: 'จัดตั้ง อบต.แม่ใส', desc: 'ประกาศจัดตั้ง อบต.แม่ใส เมื่อวันที่ 19 มกราคม 2539 มีฐานะเป็นนิติบุคคล', icon: '🏗️', color: 'bg-primary' },
  ]
  return (
    <div className="space-y-5">
      <div className="rounded-xl overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #7f5a00 0%, #b8860b 50%, #daa520 100%)' }}>
        <div className="px-8 py-8 text-white text-center">
          <div className="text-4xl mb-2">📜</div>
          <h1 className="text-xl font-bold mb-1">ประวัติความเป็นมา</h1>
          <p className="text-white/70 text-xs">องค์การบริหารส่วนตำบลแม่ใส ก่อตั้ง 19 มกราคม พ.ศ. 2539</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">🕐 เส้นทางประวัติศาสตร์</h2>
        </div>
        <div className="p-5 relative">
          <div className="absolute left-11 top-5 bottom-5 w-0.5 bg-gray-200"/>
          <div className="space-y-5">
            {timeline.map((item, i) => (
              <div key={i} className="relative flex gap-4">
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-lg flex-shrink-0 z-10 shadow-md`}>{item.icon}</div>
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">💡 ที่มาของชื่อ "บ้านร่องไฮ"</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">ชื่อ <strong>"ร่องไฮ"</strong> มาจากลักษณะทางภูมิศาสตร์ที่มีน้ำไหลผ่านกลางหมู่บ้านลงสู่แม่น้ำอิง สองข้างร่องน้ำมีต้นไทรใหญ่ขึ้นอยู่ เรียกว่า <strong>"ร่องไฮ"</strong></p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-primary mb-2">🔨 วัฒนธรรมการตีมีดจากลำปาง</p>
            <p className="text-xs text-gray-600 leading-relaxed">ชาวบ้านร่องไฮที่อพยพมาจากลำปางนำทักษะการตีมีดมาด้วย <strong>"มีดบ้านร่องไฮ"</strong> จึงเป็นสินค้าขึ้นชื่อของตำบลแม่ใส</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabMission() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white text-center">
            <div className="text-3xl mb-2">🔭</div>
            <h3 className="font-bold text-sm mb-1">วิสัยทัศน์</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-700 leading-relaxed text-center font-medium">
              "ตำบลแม่ใสน่าอยู่ ชุมชนเข้มแข็ง บริการดี มีคุณภาพชีวิตที่ดี บนพื้นฐานของความโปร่งใสและธรรมาภิบาล"
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-accent p-5 text-white text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-sm mb-1">พันธกิจ</h3>
          </div>
          <div className="p-5 space-y-2">
            {[
              'พัฒนาโครงสร้างพื้นฐานให้ได้มาตรฐาน',
              'ส่งเสริมคุณภาพชีวิตของประชาชนทุกกลุ่ม',
              'อนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อม',
              'ส่งเสริมการมีส่วนร่วมของประชาชน',
              'บริหารจัดการที่ดีมีธรรมาภิบาล',
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs flex-shrink-0">{i+1}</span>
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">📊 ยุทธศาสตร์การพัฒนา</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { no: 1, icon: '🛣️', title: 'ด้านโครงสร้างพื้นฐาน', desc: 'พัฒนาถนน ระบบประปา ไฟฟ้า และสาธารณูปโภค' },
            { no: 2, icon: '👨‍👩‍👧‍👦', title: 'ด้านสังคมและคุณภาพชีวิต', desc: 'ดูแลผู้สูงอายุ เด็ก ผู้พิการ และผู้ด้อยโอกาส' },
            { no: 3, icon: '💼', title: 'ด้านเศรษฐกิจ', desc: 'ส่งเสริมอาชีพ OTOP และเศรษฐกิจชุมชน' },
            { no: 4, icon: '🌿', title: 'ด้านสิ่งแวดล้อม', desc: 'จัดการขยะ น้ำเสีย และดูแลทรัพยากรธรรมชาติ' },
            { no: 5, icon: '🎭', title: 'ด้านศิลปวัฒนธรรม', desc: 'อนุรักษ์ประเพณีและภูมิปัญญาท้องถิ่น' },
            { no: 6, icon: '🏛️', title: 'ด้านการบริหาร', desc: 'บริหารจัดการที่ดี โปร่งใส และมีส่วนร่วม' },
          ].map(item => (
            <div key={item.no} className="flex gap-3 p-3 rounded-lg border border-gray-100">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-primary">{item.no}. {item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabPower() {
  const mandatory = [
    { icon: '🛣️', text: 'จัดให้มีและบำรุงรักษาทางน้ำและทางบก รักษาความเป็นระเบียบเรียบร้อย' },
    { icon: '🧹', text: 'รักษาความสะอาดของถนน ทางน้ำ ทางเดินและที่สาธารณะ กำจัดขยะมูลฝอย' },
    { icon: '🦠', text: 'ป้องกันโรคและระงับโรคติดต่อ' },
    { icon: '🚒', text: 'ป้องกันและบรรเทาสาธารณภัย' },
    { icon: '🎓', text: 'จัดการ ส่งเสริมและสนับสนุนการจัดการศึกษา ศาสนา วัฒนธรรม' },
    { icon: '👧', text: 'ส่งเสริมการพัฒนาสตรี เด็กและเยาวชน ผู้สูงอายุและพิการ' },
    { icon: '🌿', text: 'คุ้มครอง ดูแลและบำรุงรักษาทรัพยากรธรรมชาติและสิ่งแวดล้อม' },
    { icon: '🎭', text: 'บำรุงรักษาศิลปะ จารีตประเพณี ภูมิปัญญาท้องถิ่นและวัฒนธรรมอันดี' },
    { icon: '📋', text: 'ปฏิบัติหน้าที่อื่นตามที่ทางราชการมอบหมาย' },
  ]
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">✅ อำนาจหน้าที่ที่ต้องดำเนินการ (มาตรา 67)</h2>
        </div>
        <div className="px-5 py-2 bg-pink-50/50 border-b border-blue-100">
          <p className="text-xs text-gray-500">ตาม พ.ร.บ.สภาตำบลและองค์การบริหารส่วนตำบล พ.ศ.2537 แก้ไขเพิ่มเติม ฉบับที่ 7 พ.ศ.2562</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {mandatory.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon}</span>
              <div>
                <span className="text-xs font-bold text-secondary mr-1">({i+1})</span>
                <span className="text-xs text-gray-700 leading-relaxed">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"/>
          <h2 className="text-white font-bold text-sm">📚 กฎหมายที่เกี่ยวข้อง</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: '📜', label: 'รัฐธรรมนูญ',         value: 'รัฐธรรมนูญแห่งราชอาณาจักรไทย พุทธศักราช 2560' },
            { icon: '📗', label: 'กฎหมายจัดตั้ง',     value: 'พ.ร.บ.สภาตำบลและองค์การบริหารส่วนตำบล พ.ศ.2537 แก้ไขถึงฉบับที่ 7 พ.ศ.2562' },
            { icon: '📘', label: 'กฎหมายกระจายอำนาจ', value: 'พ.ร.บ.กำหนดแผนและขั้นตอนกระจายอำนาจฯ พ.ศ.2542 และฉบับที่ 2 พ.ศ.2549' },
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

export default function AboutPage() {
  const [tab, setTab] = useState('info')

  const content = { info: <TabInfo />, history: <TabHistory />, mission: <TabMission />, power: <TabPower /> }

  return (
    <div>
      <div className="card mb-4">
        <div className="section-head">
          <h1 className="text-sm font-semibold">🏛️ เกี่ยวกับ อบต.แม่ใส</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ข้อมูลพื้นฐาน ประวัติความเป็นมา วิสัยทัศน์ พันธกิจ และอำนาจหน้าที่ขององค์การบริหารส่วนตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา
        </div>
        <div className="flex flex-wrap gap-1 p-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {content[tab]}
    </div>
  )
}
