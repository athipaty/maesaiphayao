import { Link } from 'react-router-dom'

const SERVICES = [
  {
    id: 'infra',
    icon: '🛣️',
    title: 'โครงสร้างพื้นฐาน',
    color: 'bg-blue-50 border-blue-200',
    hColor: 'text-blue-700',
    items: [
      { icon: '🛣️', label: 'ถนนและทางเดิน',        desc: 'ก่อสร้าง ปรับปรุง ถนน ทางเท้า และสะพาน' },
      { icon: '💡', label: 'ไฟฟ้าสาธารณะ',         desc: 'ติดตั้งและซ่อมบำรุงไฟฟ้าสาธารณะ' },
      { icon: '🚿', label: 'ประปาหมู่บ้าน',         desc: 'บริหารจัดการระบบประปาหมู่บ้าน 6 แห่ง' },
      { icon: '🌊', label: 'ระบบระบายน้ำ',          desc: 'ขุดลอก บำรุงรักษาคูคลองระบายน้ำ' },
    ],
    newsLink: '/news/engineering',
    newsLabel: 'ข่าวกองช่าง →',
  },
  {
    id: 'social',
    icon: '👨‍👩‍👧‍👦',
    title: 'การศึกษา สาธารณสุข และสังคม',
    color: 'bg-green-50 border-green-200',
    hColor: 'text-green-700',
    items: [
      { icon: '🧒', label: 'ศูนย์พัฒนาเด็กเล็ก',     desc: 'ดูแลเด็กอายุ 2-5 ปี บ้านแม่ใสทุ่งวัวแดง' },
      { icon: '👴', label: 'ผู้สูงอายุ/ผู้พิการ',      desc: 'เบี้ยยังชีพ สวัสดิการและดูแลสุขภาพ' },
      { icon: '🏥', label: 'สาธารณสุขชุมชน',         desc: 'ดูแลสุขภาพชุมชน อสม. 168 คน' },
      { icon: '📚', label: 'ส่งเสริมการศึกษา',        desc: 'สนับสนุนโรงเรียนและการเรียนรู้ตลอดชีวิต' },
    ],
    newsLink: '/news/health',
    newsLabel: 'ข่าวสาธารณสุข →',
  },
  {
    id: 'economy',
    icon: '💼',
    title: 'เศรษฐกิจชุมชน',
    color: 'bg-amber-50 border-amber-200',
    hColor: 'text-amber-700',
    items: [
      { icon: '🛍️', label: 'สินค้า OTOP',            desc: 'ข้าวร่องไฮ มีดร่องไฮ กระเป๋าจากต้นกก', link: '/products' },
      { icon: '🗺️', label: 'แหล่งท่องเที่ยว',         desc: 'กว๊านพะเยา ธรรมชาติและวัฒนธรรม', link: '/travel' },
      { icon: '🌾', label: 'กลุ่มเกษตรกร',            desc: 'เกษตรกรทำนา 2,051 ราย พื้นที่ 9,012 ไร่' },
      { icon: '🤝', label: 'กลุ่มอาชีพ/สหกรณ์',       desc: 'ส่งเสริมรายได้และสหกรณ์ชุมชน' },
    ],
    newsLink: '/news',
    newsLabel: 'ข่าวสารชุมชน →',
  },
  {
    id: 'culture',
    icon: '🎭',
    title: 'ศิลปะ วัฒนธรรม ประเพณี',
    color: 'bg-purple-50 border-purple-200',
    hColor: 'text-purple-700',
    items: [
      { icon: '🎉', label: 'งานประเพณีประจำปี',       desc: 'สงกรานต์ ลอยกระทง สลากภัตร วันขึ้นปีใหม่' },
      { icon: '⛪', label: 'วัด 5 แห่ง',               desc: 'วัดแม่ใส วัดร่องไฮ วัดบ่อแฮ้ว วัดสันช้างหิน วัดสันป่าถ่อน' },
      { icon: '🔨', label: 'ภูมิปัญญาท้องถิ่น',        desc: 'การตีมีด การทอผ้า ปั้นอิฐมอญ' },
      { icon: '🌿', label: 'อนุรักษ์วัฒนธรรม',         desc: 'ส่งเสริมและอนุรักษ์ศิลปวัฒนธรรมท้องถิ่น' },
    ],
    newsLink: '/news',
    newsLabel: 'ข่าวกิจกรรม →',
  },
  {
    id: 'safety',
    icon: '🚨',
    title: 'ความปลอดภัยและสาธารณภัย',
    color: 'bg-red-50 border-red-200',
    hColor: 'text-red-700',
    items: [
      { icon: '🚒', label: 'ป้องกันและบรรเทาสาธารณภัย', desc: 'พร้อมช่วยเหลือประชาชนในภาวะฉุกเฉิน' },
      { icon: '👮', label: 'อปพร.',                    desc: 'อาสาสมัครป้องกันภัยฝ่ายพลเรือน' },
      { icon: '⚠️', label: 'แจ้งเหตุฉุกเฉิน',           desc: 'โทร 0-5488-9909 หรือ 191' },
      { icon: '🌊', label: 'ภัยพิบัติ/น้ำท่วม',         desc: 'ระบบเตือนภัยและแผนอพยพ' },
    ],
    newsLink: '/news/disaster',
    newsLabel: 'ข่าวสาธารณภัย →',
  },
  {
    id: 'environment',
    icon: '🌿',
    title: 'สิ่งแวดล้อม',
    color: 'bg-teal-50 border-teal-200',
    hColor: 'text-teal-700',
    items: [
      { icon: '🗑️', label: 'การจัดการขยะ',             desc: 'เก็บขยะทุกสัปดาห์ ส่งเสริมขยะรีไซเคิล' },
      { icon: '💧', label: 'น้ำเสียชุมชน',              desc: 'บำบัดน้ำเสียและดูแลคุณภาพน้ำ' },
      { icon: '🌲', label: 'ทรัพยากรธรรมชาติ',          desc: 'อนุรักษ์ป่า ต้นน้ำ และกว๊านพะเยา' },
      { icon: '♻️', label: 'ชุมชนสีเขียว',              desc: 'ส่งเสริมการลดขยะและสิ่งแวดล้อมยั่งยืน' },
    ],
    newsLink: '/news/health',
    newsLabel: 'ข่าวสิ่งแวดล้อม →',
  },
]

export default function PublicServicePage() {
  return (
    <div>
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">🌐 บริการสาธารณะ</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ภารกิจและบริการสาธารณะขององค์การบริหารส่วนตำบลแม่ใส เพื่อพัฒนาคุณภาพชีวิตของประชาชนในทุกด้าน
          ครอบคลุมโครงสร้างพื้นฐาน การศึกษา สาธารณสุข เศรษฐกิจ วัฒนธรรม ความปลอดภัย และสิ่งแวดล้อม
        </div>
      </div>

      {/* e-Service shortcut */}
      <div className="mb-5">
        <Link to="/eservice" className="bg-primary text-white rounded-xl p-4 flex items-center gap-3 hover:bg-primary/90 transition-colors">
          <span className="text-2xl">🌐</span>
          <div>
            <p className="text-sm font-bold">e-Service</p>
            <p className="text-xs opacity-80">ยื่นคำร้องออนไลน์</p>
          </div>
        </Link>
      </div>

      {/* Service sections */}
      <div className="space-y-4">
        {SERVICES.map(s => (
          <div key={s.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${s.color}`}>
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <h2 className={`text-sm font-bold ${s.hColor}`}>{s.title}</h2>
              </div>
              <Link to={s.newsLink} className="text-xs text-primary hover:underline">{s.newsLabel}</Link>
            </div>
            <div className="bg-white px-5 pb-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {s.items.map(item => (
                item.link ? (
                  <Link key={item.label} to={item.link}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 transition-colors">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-primary">{item.label} →</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                ) : (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
