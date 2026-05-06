import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const summaryData = [
  { plan: '1.1 แผนงานอุตสาหกรรมและการโยธา (ผ.02)',                    y2566: 0, y2567: 0,       y2568: 821000,   y2569: 0,       y2570: 0,       total: 821000   },
  { plan: '1.2 แผนงานอุตสาหกรรมและการโยธา (ผ.02/2) ขอหน่วยงานอื่น', y2566: 0, y2567: 7639000,  y2568: 5323000,  y2569: 0,       y2570: 0,       total: 12962000 },
  { plan: '1.3 แผนงานเคหะและชุมชน (ผ.02)',                             y2566: 0, y2567: 1125000,  y2568: 1000000,  y2569: 1000000, y2570: 1000000, total: 4125000  },
  { plan: '1.4 แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)',               y2566: 0, y2567: 130000,   y2568: 130000,   y2569: 130000,  y2570: 130000,  total: 520000   },
]
const grandTotal = { y2566: 0, y2567: 8894000, y2568: 7274000, y2569: 1130000, y2570: 1130000, total: 18428000 }

const projects = [
  { id:1,  group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02)',              name:'จัดซื้อโคมไฟถนนระบบพลังงานแสงอาทิตย์ ขนาด 4,800 วัตต์ พร้อมติดตั้ง',   objective:'เพิ่มความสว่างให้กับท้องถนน และลดภาวะโลกร้อน',   target:'โคมไฟ 96 ชุด',                              y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'กองช่าง' },
  { id:2,  group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02)',              name:'ระบบพลังงานแสงอาทิตย์ศาลาประชาคมตำบลแม่ใส',                             objective:'เพิ่มความสว่าง ประหยัดค่าไฟฟ้า และลดภาวะโลกร้อน', target:'ไฟฟ้าพลังงานแสงอาทิตย์ 1 ชุด ขนาด 5,000 วัตต์', y2566:0, y2567:0,       y2568:321000, y2569:0,      y2570:0,      responsible:'กองช่าง' },
  { id:3,  group:'แผนงานเคหะและชุมชน (ผ.02)',                      name:'ซ่อมแซมทางสาธารณะประโยชน์ในความรับผิดชอบของ อบต.แม่ใส',                objective:'บรรเทาความเดือดร้อน ซ่อมแซมถนนให้อยู่ในสภาพดี',  target:'ซ่อมแซมทางสาธารณะ 10 จุด',                      y2566:0, y2567:500000,  y2568:500000, y2569:500000, y2570:500000, responsible:'กองช่าง' },
  { id:4,  group:'แผนงานเคหะและชุมชน (ผ.02)',                      name:'ซ่อมแซมแหล่งน้ำในความรับผิดชอบของ อบต.แม่ใส',                          objective:'พัฒนาและซ่อมแซมแหล่งเก็บกักน้ำและระบบส่งน้ำ',    target:'ซ่อมแซมแหล่งน้ำ 10 จุด',                        y2566:0, y2567:500000,  y2568:500000, y2569:500000, y2570:500000, responsible:'กองช่าง' },
  { id:5,  group:'แผนงานเคหะและชุมชน (ผ.02)',                      name:'อุดหนุนเทศบาลเมืองพะเยา (ปรับปรุงผังเมืองรวมเมืองพะเยา)',              objective:'เป็นแนวทางการพัฒนาเมือง การคมนาคม สาธารณูปโภค',  target:'มีผังเมืองรวมชัดเจนขึ้นร้อยละ 70',                y2566:0, y2567:125000,  y2568:0,      y2569:0,      y2570:0,      responsible:'กองช่าง' },
  { id:6,  group:'แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)',         name:'โครงการกาดฮิมต้าลำนาร่องไฮเฉลิมพระเกียรติ ร.10',                       objective:'ส่งเสริมการท่องเที่ยวและเพิ่มรายได้ให้ประชาชน',   target:'นักท่องเที่ยวและรายได้เพิ่มร้อยละ 10',             y2566:0, y2567:100000,  y2568:100000, y2569:100000, y2570:100000, responsible:'สำนักปลัด' },
  { id:7,  group:'แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)',         name:'ส่งเสริมความรู้ด้านสุขาภิบาลอาหาร',                                    objective:'สร้างความรู้ด้านอาหารปลอดภัยแก่ผู้ประกอบการ',    target:'ผู้ประกอบการมีความรู้ไม่น้อยกว่าร้อยละ 80',         y2566:0, y2567:15000,   y2568:15000,  y2569:15000,  y2570:15000,  responsible:'กองสาธารณสุข' },
  { id:8,  group:'แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)',         name:'ส่งเสริมเครือข่ายคุ้มครองผู้บริโภคด้านผลิตภัณฑ์อาหารและสุขภาพ',       objective:'พัฒนาความรู้และสนับสนุนเครือข่ายคุ้มครองผู้บริโภค', target:'จัดกิจกรรมเฝ้าระวังเชิงรุกอย่างน้อยปีละ 1 ครั้ง', y2566:0, y2567:15000,   y2568:15000,  y2569:15000,  y2570:15000,  responsible:'กองสาธารณสุข' },
  { id:9,  group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงถนนหินคลุกสายการเกษตรบ้านสันปาถอน เชื่อมบ้านสันขี้เหล็ก',   objective:'บรรเทาความเดือดร้อนเกษตรกร ปรับปรุงถนน',         target:'ถนน 1 สาย (1,300+550 ม.)',                       y2566:0, y2567:0,       y2568:496000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:10, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงถนนหินคลุกสายการเกษตรทุ่งป่าแดง ตำบลแม่ใส',                   objective:'บรรเทาความเดือดร้อนเกษตรกร',                     target:'ถนน 1 สาย ยาว 1,500 ม.',                         y2566:0, y2567:0,       y2568:392000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:11, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงถนนหินคลุกสายการเกษตรทุ่งแพะ เชื่อมบ้านเกษตรสุข',             objective:'บรรเทาความเดือดร้อนเกษตรกร',                     target:'ถนน 1 สาย ยาว 920 ม.',                           y2566:0, y2567:0,       y2568:238000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:12, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงถนนหินคลุกสายการเกษตรรองบัว เชื่อมบ้านรองคำ',                  objective:'บรรเทาความเดือดร้อนเกษตรกร',                     target:'ถนน 1 สาย ยาว 1,700 ม.',                         y2566:0, y2567:0,       y2568:375000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:13, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงถนนหินคลุกสายการเกษตรสันกลาง เชื่อมชุมชนแม่ต๋ำภูมินทร์',     objective:'บรรเทาความเดือดร้อนเกษตรกร',                     target:'ถนน 1 สาย ยาว 1,050 ม.',                         y2566:0, y2567:0,       y2568:311000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:14, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงถนนคอนกรีตเสริมเหล็กสายโรงงานผลิตปุ๋ยอินทรีย์ หมู่ที่ 4',   objective:'บรรเทาความเดือดร้อนเกษตรกร ปรับปรุงถนน',         target:'ถนน 1 สาย กว้าง 4.50 ม. ยาว 455 ม.',            y2566:0, y2567:1879000, y2568:0,      y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:15, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงผิวทางแอสฟัลท์ติกคอนกรีต สายบ้านแม่ใส เชื่อมบ้านเกษตรสุข',  objective:'ปรับปรุงถนนให้อยู่ในสภาพดี ปลอดภัย',             target:'ถนน 1 สาย กว้าง 6 ม. ยาว 1,920 ม.',             y2566:0, y2567:5760000, y2568:0,      y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:16, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ปรับปรุงหินคลุกสายการเกษตรข้างศาลพ่อถ้าไปหากว๊านพะเยา',               objective:'บรรเทาความเดือดร้อนเกษตรกร',                     target:'ถนน 1 สาย ยาว 1,050 ม.',                         y2566:0, y2567:0,       y2568:278000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:17, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ก่อสร้างฝายแกนดินซีเมนต์ชั่วคราว ลำห้วยรองคำ บ้านทุ่งวัวแดง หมู่ที่ 3', objective:'กักเก็บน้ำไว้ใช้ในการเกษตรช่วงฤดูแล้ง',       target:'ฝาย 1 จุด สูง 1 ม. สันฝายยาว 8 ม.',             y2566:0, y2567:0,       y2568:233000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:18, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านหัวขัว เชื่อมบ้านแม่ต๋ำบุญโยง',  objective:'เพิ่มความสว่าง ลดภาวะโลกร้อน',                   target:'เสาไฟโซลาเซลล์ 15 ต้น',                          y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:19, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านแม่ใส เชื่อมบ้านรองคำน้อย',     objective:'เพิ่มความสว่าง ลดภาวะโลกร้อน',                   target:'เสาไฟโซลาเซลล์ 15 ต้น',                          y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:20, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านบ่อแฮว เชื่อมบ้านซอน',          objective:'เพิ่มความสว่าง ลดภาวะโลกร้อน',                   target:'เสาไฟโซลาเซลล์ 15 ต้น',                          y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:21, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านสันปาถอน เชื่อมบ้านห้วยลึก',    objective:'เพิ่มความสว่าง ลดภาวะโลกร้อน',                   target:'เสาไฟโซลาเซลล์ 15 ต้น',                          y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:22, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านสันปาถอน เชื่อมบ้านสันกว้าน',   objective:'เพิ่มความสว่าง ลดภาวะโลกร้อน',                   target:'เสาไฟโซลาเซลล์ 15 ต้น',                          y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
  { id:23, group:'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)', name:'ติดตั้งไฟส่องสว่างโซลาเซลล์ โบราณสถานบ้านรองไฮ',                       objective:'เพิ่มความสว่าง ลดภาวะโลกร้อน',                   target:'เสาไฟโซลาเซลล์ 15 ต้น',                          y2566:0, y2567:0,       y2568:500000, y2569:0,      y2570:0,      responsible:'อบจ.พะเยา' },
]

const years = ['2566','2567','2568','2569','2570']

function fmtBaht(n) {
  if (!n) return '-'
  return n.toLocaleString('th-TH') + ' บาท'
}

const groupColors = {
  'แผนงานอุตสาหกรรมและการโยธา (ผ.02)':              { badge: 'bg-blue-100 text-blue-800' },
  'แผนงานเคหะและชุมชน (ผ.02)':                      { badge: 'bg-green-100 text-green-800' },
  'แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)':         { badge: 'bg-orange-100 text-orange-800' },
  'แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)': { badge: 'bg-purple-100 text-purple-800' },
}

export default function DevelopmentPlanPage() {
  const [tab, setTab] = useState('summary')
  const [selectedGroup, setSelectedGroup] = useState('ทั้งหมด')

  const groups = ['ทั้งหมด', ...Object.keys(groupColors)]
  const filtered = selectedGroup === 'ทั้งหมด' ? projects : projects.filter(p => p.group === selectedGroup)

  return (
    <div className="space-y-4">

      <PageHeader icon="📑" title="แผนพัฒนาท้องถิ่น (พ.ศ. 2566–2570) เพิ่มเติม ฉบับที่ 3"
        desc="แผนพัฒนาท้องถิ่นขององค์การบริหารส่วนตำบลแม่ใส ประจำปีงบประมาณ พ.ศ. 2567 ครอบคลุม 4 แผนงาน รวม 38 โครงการ งบประมาณรวม 18,428,000 บาท" />

      {/* Development plan summary */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">งบประมาณรวม 5 ปี</p>
            <p className="text-3xl font-bold mt-1">18,428,000 บาท</p>
          </div>
          <div className="text-5xl opacity-30">📋</div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {[
            { label: 'โครงการทั้งหมด', value: '38 โครงการ', sub: 'รวม 4 แผนงาน', color: 'bg-blue-50 border-blue-100 text-primary' },
            { label: 'งบสูงสุด ปี 2567', value: '8,894,000 บาท', sub: '8 โครงการ', color: 'bg-green-50 border-green-100 text-green-700' },
            { label: 'งบรอง ปี 2568', value: '7,274,000 บาท', sub: '20 โครงการ', color: 'bg-purple-50 border-purple-100 text-purple-700' },
          ].map((c, i) => (
            <div key={i} className={`rounded-lg p-3 text-center border ${c.color}`}>
              <p className="text-xs text-gray-500 mb-1">{c.label}</p>
              <p className="text-sm font-bold">{c.value}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'summary',  label: '📊 บัญชีสรุป (ผ.01)' },
          { key: 'projects', label: `📋 รายละเอียดโครงการ (${projects.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: SUMMARY ── */}
      {tab === 'summary' && (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">📊 บัญชีสรุปโครงการพัฒนา (ผ.01) — ยุทธศาสตร์ด้านเศรษฐกิจ</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2.5 text-left text-primary font-semibold">แผนงาน</th>
                    {years.map(y => <th key={y} className="px-3 py-2.5 text-right text-primary font-semibold whitespace-nowrap">ปี {y}</th>)}
                    <th className="px-3 py-2.5 text-right text-primary font-semibold">รวม 5 ปี</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-2.5 text-gray-700">{row.plan}</td>
                      {[row.y2566, row.y2567, row.y2568, row.y2569, row.y2570].map((v, j) => (
                        <td key={j} className="px-3 py-2.5 text-right text-gray-800 font-medium">
                          {v ? v.toLocaleString('th-TH') : <span className="text-gray-300">-</span>}
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-right font-bold text-primary">{row.total.toLocaleString('th-TH')}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/10 font-bold">
                    <td className="px-4 py-2.5 text-primary">รวมทั้งสิ้น (38 โครงการ)</td>
                    {[grandTotal.y2566, grandTotal.y2567, grandTotal.y2568, grandTotal.y2569, grandTotal.y2570].map((v, j) => (
                      <td key={j} className="px-3 py-2.5 text-right text-primary">
                        {v ? v.toLocaleString('th-TH') : <span className="text-gray-300">-</span>}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-right text-primary">{grandTotal.total.toLocaleString('th-TH')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">📈 งบประมาณแต่ละปี</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { year:'2566', val:0 },
                { year:'2567', val:8894000 },
                { year:'2568', val:7274000 },
                { year:'2569', val:1130000 },
                { year:'2570', val:1130000 },
              ].map(y => (
                <div key={y.year} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-14 flex-shrink-0 font-medium">ปี {y.year}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(y.val / 8894000) * 100}%`, background: '#3266ad' }}>
                      {y.val > 0 && <span className="text-white font-bold" style={{ fontSize: 10 }}>{(y.val/1000000).toFixed(2)}ล.</span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-24 text-right">{y.val ? y.val.toLocaleString('th-TH') + ' บ.' : 'ไม่มีงบ'}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── TAB: PROJECTS ── */}
      {tab === 'projects' && (
        <>
          {/* Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-400 mb-2">กรองตามแผนงาน:</p>
            <div className="flex gap-2 flex-wrap">
              {groups.map(g => (
                <button key={g} onClick={() => setSelectedGroup(g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedGroup === g ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
                  }`}>
                  {g === 'ทั้งหมด' ? `ทั้งหมด (${projects.length})` : g.replace('แผนงาน','').trim().split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 px-1">แสดง {filtered.length} โครงการ</p>

          <div className="space-y-3">
            {filtered.map(p => {
              const bc = groupColors[p.group] || { badge: 'bg-gray-100 text-gray-600' }
              const total = p.y2566 + p.y2567 + p.y2568 + p.y2569 + p.y2570
              return (
                <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bc.badge} mb-2 inline-block`}>
                          {p.group}
                        </span>
                        <p className="text-sm font-semibold text-gray-800">{p.id}. {p.name}</p>
                        <p className="text-xs text-gray-500 mt-1">🎯 {p.objective}</p>
                        <p className="text-xs text-gray-400 mt-0.5">📌 {p.target} | หน่วยงาน: <strong>{p.responsible}</strong></p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">งบรวม</p>
                        <p className="text-sm font-bold text-primary">{total.toLocaleString('th-TH')} บ.</p>
                      </div>
                    </div>
                    {/* year pills */}
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {years.map((y, i) => {
                        const val = [p.y2566, p.y2567, p.y2568, p.y2569, p.y2570][i]
                        return (
                          <div key={y} className={`rounded-lg px-2 py-1 text-center ${val ? 'bg-blue-50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${val ? 'text-primary' : 'text-gray-300'}`}>ปี {y}</p>
                            <p className={`text-xs font-bold ${val ? 'text-primary' : 'text-gray-300'}`}>
                              {val ? val.toLocaleString('th-TH') : '-'}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}