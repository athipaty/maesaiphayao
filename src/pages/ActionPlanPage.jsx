// แผนดำเนินงาน ประจำปีงบประมาณ พ.ศ.2568
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const summary6M = { total:69, totalBudget:37556572.56, done:30, doneBudget:6479411.42, inProgress:19, inProgressBudget:7204672.56, notStarted:20, notStartedBudget:12018500 }

const strategies = [
  { id:1, name:'พัฒนาระบบเศรษฐกิจ',                    icon:'🏗️', projects:22, budget:18266672.56 },
  { id:2, name:'พัฒนาสังคม การศึกษา วัฒนธรรม',         icon:'📚', projects:39, budget:18912900   },
  { id:3, name:'รักษาความมั่นคงและสงบเรียบร้อย',        icon:'🛡️', projects:4,  budget:72000       },
  { id:4, name:'บริหารจัดการทรัพยากรธรรมชาติ',          icon:'🌿', projects:3,  budget:75000       },
  { id:5, name:'บริหารจัดการให้มีประสิทธิภาพ',           icon:'⚙️', projects:1,  budget:30000       },
]

const projects = [
  { id:1,  s:1, name:'ปรับปรุงถนน ค.ส.ล. บ้านร่องไฮ หมู่ที่ 1',                                       v:1,  budget:238613.38,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:2,  s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 2 บ้านแม่ใสกลาง หมู่ที่ 2',               v:2,  budget:313733.61,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:3,  s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด สายบ้านทุ่งวัวแดง (ช่วงที่1) หมู่ที่ 3',      v:3,  budget:356462.18,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:4,  s:1, name:'ปรับปรุงถนน ค.ส.ล. บ้านทุ่งวัวแดง หมู่ที่ 3',                                     v:3,  budget:106672.89,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:5,  s:1, name:'ปรับปรุงถนนสายการเกษตร บ้านทุ่งวัวแดง หมู่ที่ 3',                                 v:3,  budget:484802.17,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:6,  s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด บ้านแม่ใสเหล่า หมู่ที่ 4',                    v:4,  budget:469931.77,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:7,  s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด สายบ้านบ่อแฮ้ว หมู่ที่ 5',                    v:5,  budget:478324.82,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:8,  s:1, name:'ขุดลอกลำเหมืองห้วยลึก บ้านบ่อแฮ้ว หมู่ที่ 5',                                    v:5,  budget:34183.08,   paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:9,  s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 2 บ้านสันป่าถ่อน หมู่ที่ 6',              v:6,  budget:419669.33,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:10, s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด บ้านสันช้างหิน หมู่ที่ 7',                    v:7,  budget:472085.58,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:11, s:1, name:'ปรับปรุงถนน ค.ส.ล. ซอยบ้านนายสุพจน์ ยะตา หมู่ที่ 8',                             v:8,  budget:328556.29,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:12, s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 4 บ้านแม่ใสเหนือ หมู่ที่ 9',             v:9,  budget:270354.73,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:13, s:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 7 บ้านสันป่าถ่อน หมู่ที่ 10',            v:10, budget:438775.37,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:14, s:1, name:'ปรับปรุงถนน ค.ส.ล. ซอยสันกลาง (ช่วงที่1) หมู่ที่ 11',                            v:11, budget:472615.17,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:15, s:1, name:'ปรับปรุงถนน ค.ส.ล. สายหลัง อบต.แม่ใส หมู่ที่ 12',                                v:12, budget:270559.85,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:16, s:1, name:'ปรับปรุงไหล่ทาง ค.ส.ล. สายบ้านแม่ใสเหล่าใต้ หมู่ที่ 12',                        v:12, budget:346090.10,  paid:0,         unit:'กองช่าง',   status:'inProgress' },
  { id:17, s:1, name:'โครงการที่จอดรถ อบต.แม่ใส (โอนงบครั้งที่ 13/2567)',                               v:0,  budget:300000,     paid:0,         unit:'กองช่าง',   status:'notStarted' },
  { id:18, s:1, name:'ก่อสร้างเมรุบ้านแม่ใสเหล่า หมู่ที่ 4 และ 12 (โอนงบครั้งที่ 13/2567)',            v:0,  budget:1103242.24, paid:0,         unit:'กองช่าง',   status:'notStarted' },
  { id:19, s:1, name:'โครงการที่จอดรถ อบต.แม่ใส (ข้อบัญญัติ 2568)',                                     v:0,  budget:300000,     paid:0,         unit:'กองช่าง',   status:'notStarted' },
  { id:20, s:1, name:'ปรับปรุงถนน คสล. สายโรงงานผลิตปุ๋ยอินทรีย์ หมู่ที่ 4 (อบจ.พะเยา)',               v:4,  budget:1879000,    paid:0,         unit:'อบจ.พะเยา', status:'notStarted' },
  { id:21, s:1, name:'ซ่อมสร้างผิวทางแอสฟัลท์ติกฯ บ้านแม่ใส–บ้านเกษตรสุข (อบจ.พะเยา)',               v:0,  budget:8686000,    paid:0,         unit:'อบจ.พะเยา', status:'notStarted' },
  { id:22, s:1, name:'จัดซื้อชุดเสาไฟ LED โซล่าเซลล์ 14 ชุด สายทุ่งวัวแดง หมู่ที่ 3 (อบจ.พะเยา)',    v:3,  budget:497000,     paid:0,         unit:'อบจ.พะเยา', status:'notStarted' },
  { id:23, s:2, name:'สนับสนุนค่าใช้จ่ายการบริหารสถานศึกษา (ศพด.อบต.แม่ใส)',                            v:0,  budget:477400,     paid:137984,    unit:'สำนักปลัด', status:'inProgress' },
  { id:24, s:2, name:'จัดงานวันเด็กแห่งชาติตำบลแม่ใส',                                                   v:0,  budget:30000,      paid:29950,     unit:'สำนักปลัด', status:'done' },
  { id:25, s:2, name:'ค่าอาหารเสริม (นม) นักเรียนในพื้นที่ตำบลแม่ใส',                                   v:0,  budget:313000,     paid:74259.42,  unit:'สำนักปลัด', status:'inProgress' },
  { id:26, s:2, name:'อุดหนุนโรงเรียนชุมชนบ้านแม่ใส (อาหารกลางวัน)',                                     v:0,  budget:576000,     paid:265340,    unit:'สำนักปลัด', status:'inProgress' },
  { id:27, s:2, name:'ปรับปรุงภูมิทัศน์ศูนย์พัฒนาเด็กเล็ก อบต.แม่ใส',                                  v:0,  budget:490000,     paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:28, s:2, name:'ควบคุมป้องกันโรคไข้เลือดออก',                                                       v:0,  budget:50000,      paid:0,         unit:'กองสธ.',    status:'notStarted' },
  { id:29, s:2, name:'อุดหนุนคณะกรรมการหมู่บ้าน หมู่ที่ 1–12 (สาธารณสุขพระราชดำริ)',                  v:0,  budget:240000,     paid:240000,    unit:'กองสธ.',    status:'done' },
  { id:30, s:2, name:'จ้างเหมาสำรวจข้อมูลสัตว์และขึ้นทะเบียน (สุนัข/แมว)',                              v:0,  budget:6500,       paid:0,         unit:'กองสธ.',    status:'notStarted' },
  { id:31, s:2, name:'ฝึกอบรมเพิ่มทักษะด้านอาชีพเสริม',                                                  v:0,  budget:20000,      paid:20000,     unit:'สำนักปลัด', status:'done' },
  { id:32, s:2, name:'ตรวจสอบคุณภาพน้ำประปาหมู่บ้าน',                                                    v:0,  budget:20000,      paid:0,         unit:'กองช่าง',   status:'notStarted' },
  { id:33, s:2, name:'เพิ่มศักยภาพการบริหารงาน อบต.แม่ใส',                                              v:0,  budget:150000,     paid:37580,     unit:'สำนักปลัด', status:'inProgress' },
  { id:34, s:2, name:'ส่งเสริมและพัฒนาคุณภาพชีวิตผู้สูงอายุ',                                            v:0,  budget:10000,      paid:10000,     unit:'สำนักปลัด', status:'done' },
  { id:35, s:2, name:'ส่งเสริมและพัฒนาคุณภาพชีวิตสตรี',                                                  v:0,  budget:15000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:36, s:2, name:'สัตว์ปลอดโรค คนปลอดภัยจากโรคพิษสุนัขบ้าฯ',                                       v:0,  budget:50000,      paid:0,         unit:'กองสธ.',    status:'notStarted' },
  { id:37, s:2, name:'อบรมคุณธรรมจริยธรรมให้แก่บุคลากร อบต.แม่ใส',                                     v:0,  budget:10000,      paid:7845,      unit:'สำนักปลัด', status:'done' },
  { id:38, s:2, name:'จิตอาสา "เราทำดีด้วยหัวใจ" น้อมถวายในหลวง ร.10',                                  v:0,  budget:30000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:39, s:2, name:'เฉลิมพระเกียรติในหลวง ร.10 เนื่องในโอกาสมหามงคล 6 รอบ',                          v:0,  budget:30000,      paid:28238,     unit:'สำนักปลัด', status:'done' },
  { id:40, s:2, name:'แข่งขันกีฬาแม่ใสสัมพันธ์ตำบลแม่ใส',                                               v:0,  budget:150000,     paid:150000,    unit:'สำนักปลัด', status:'done' },
  { id:41, s:2, name:'ประเพณีลอยกระทงตำบลแม่ใส',                                                         v:0,  budget:150000,     paid:147515,    unit:'สำนักปลัด', status:'done' },
  { id:42, s:2, name:'ประเพณีสงกรานต์ตำบลแม่ใส',                                                         v:0,  budget:100000,     paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:43, s:2, name:'ประเพณีแห่เทียนเข้าพรรษาตำบลแม่ใส',                                               v:0,  budget:25000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:44, s:2, name:'ส่งเสริมการท่องเที่ยวในตำบลแม่ใส',                                                 v:0,  budget:30000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:45, s:2, name:'ประเพณีสืบชะตาลำน้ำแม่ใส',                                                         v:0,  budget:10000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:46, s:2, name:'สรงน้ำพระพุทธศิลาธรชุมชนชนานุสรณ์',                                               v:0,  budget:10000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:47, s:2, name:'เบี้ยยังชีพผู้สูงอายุ',                                                              v:0,  budget:13500000,   paid:4364300,   unit:'สำนักปลัด', status:'inProgress' },
  { id:48, s:2, name:'เบี้ยยังชีพผู้พิการ',                                                                v:0,  budget:2300000,    paid:735600,    unit:'สำนักปลัด', status:'inProgress' },
  { id:49, s:2, name:'เบี้ยยังชีพผู้ป่วยเอดส์',                                                           v:0,  budget:300000,     paid:82000,     unit:'สำนักปลัด', status:'inProgress' },
  { id:50, s:2, name:'เงินสมทบกองทุนหลักประกันสุขภาพตำบลแม่ใส (สปสช.)',                                v:0,  budget:120000,     paid:120000,    unit:'กองสธ.',    status:'done' },
  { id:51, s:3, name:'อาสาสมัครป้องกันภัยฝ่ายพลเรือน (อปพร.) ตำบลแม่ใส',                               v:0,  budget:30000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:52, s:3, name:'ลดอุบัติเหตุทางถนนตำบลแม่ใส',                                                      v:0,  budget:15000,      paid:15000,     unit:'สำนักปลัด', status:'done' },
  { id:53, s:3, name:'ให้ความรู้ป้องกันอัคคีภัยและซักซ้อมอพยพ',                                          v:0,  budget:15000,      paid:0,         unit:'สำนักปลัด', status:'notStarted' },
  { id:54, s:3, name:'อุดหนุนเทศบาลตำบลท่าวังทอง (ศูนย์ปฏิบัติการช่วยเหลือประชาชน)',                  v:0,  budget:12000,      paid:12000,     unit:'สำนักปลัด', status:'done' },
  { id:55, s:4, name:'ส่งเสริมการบริหารจัดการขยะ',                                                        v:0,  budget:30000,      paid:0,         unit:'กองสธ.',    status:'notStarted' },
  { id:56, s:4, name:'อบรมเพิ่มความรู้การจัดการน้ำเสียระดับครัวเรือน',                                   v:0,  budget:30000,      paid:0,         unit:'กองสธ.',    status:'notStarted' },
  { id:57, s:4, name:'อาสาสมัครอนุรักษ์ทรัพยากรธรรมชาติสิ่งแวดล้อมชุมชนท้องถิ่น',                    v:0,  budget:15000,      paid:0,         unit:'กองสธ.',    status:'notStarted' },
  { id:58, s:5, name:'พัฒนาการจัดเก็บรายได้ (พัฒนาการจัดเก็บภาษี)',                                     v:0,  budget:30000,      paid:1800,      unit:'กองคลัง',   status:'inProgress' },
]

const statusCfg = {
  done:       { label:'แล้วเสร็จ',            badge:'bg-green-100 text-green-700',  bar:'bg-green-500'  },
  inProgress: { label:'อยู่ระหว่างดำเนินการ', badge:'bg-yellow-100 text-yellow-700', bar:'bg-yellow-400' },
  notStarted: { label:'ยังไม่ได้ดำเนินการ',   badge:'bg-red-100 text-red-600',      bar:'bg-red-400'    },
}

const pct = (n,d) => d ? Math.round((n/d)*100) : 0

export default function ActionPlanPage() {
  const [tab, setTab]           = useState('overview')
  const [filterS, setFilterS]   = useState(0)
  const [filterSt, setFilterSt] = useState('all')

  const filtered = projects.filter(p =>
    (filterS === 0 || p.s === filterS) &&
    (filterSt === 'all' || p.status === filterSt)
  )

  return (
    <div className="space-y-4">

      <PageHeader icon="📅" title="แผนการดำเนินงาน ประจำปีงบประมาณ พ.ศ. 2568"
        desc="รายงานความก้าวหน้าการดำเนินโครงการรอบ 6 เดือน (ต.ค. 2567 – มี.ค. 2568) ครอบคลุม 5 ยุทธศาสตร์ รวม 69 โครงการ" />

      {/* Action plan summary */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">งบประมาณตามแผนดำเนินงานทั้งหมด</p>
            <p className="text-3xl font-bold mt-1">37,556,572.56 บาท</p>
          </div>
          <div className="text-5xl opacity-30">📅</div>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'โครงการทั้งหมด',       value:`${summary6M.total} โครงการ`,        sub:'5 ยุทธศาสตร์',                           color:'bg-blue-50 border-blue-100 text-primary' },
            { label:'แล้วเสร็จ',            value:`${summary6M.done} โครงการ`,         sub:`${pct(summary6M.done,summary6M.total)}% ของทั้งหมด`, color:'bg-green-50 border-green-100 text-green-700' },
            { label:'อยู่ระหว่างดำเนินการ', value:`${summary6M.inProgress} โครงการ`,   sub:'กำลังดำเนินการ',                         color:'bg-yellow-50 border-yellow-100 text-yellow-700' },
            { label:'ยังไม่ได้ดำเนินการ',  value:`${summary6M.notStarted} โครงการ`,   sub:`${pct(summary6M.notStarted,summary6M.total)}% ของทั้งหมด`, color:'bg-red-50 border-red-100 text-red-600' },
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
          { key:'overview',   label:'📊 ภาพรวม' },
          { key:'strategies', label:'🎯 5 ยุทธศาสตร์' },
          { key:'projects',   label:`📋 รายละเอียดโครงการ (${projects.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {tab === 'overview' && (
        <>
          {/* Progress */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">📈 ความก้าวหน้าโดยรวม รอบ 6 เดือน</h2>
            </div>
            <div className="p-5">
              <div className="flex h-5 rounded-full overflow-hidden mb-3">
                <div className="bg-green-500" style={{ width:`${pct(summary6M.done,summary6M.total)}%` }} />
                <div className="bg-yellow-400" style={{ width:`${pct(summary6M.inProgress,summary6M.total)}%` }} />
                <div className="flex-1 bg-red-400" />
              </div>
              <div className="flex gap-4 flex-wrap text-xs">
                {[
                  { label:`✅ แล้วเสร็จ ${summary6M.done} โครงการ (${pct(summary6M.done,summary6M.total)}%)`, color:'text-green-600' },
                  { label:`🔄 กำลังดำเนิน ${summary6M.inProgress} โครงการ`, color:'text-yellow-600' },
                  { label:`⏳ ยังไม่เริ่ม ${summary6M.notStarted} โครงการ (${pct(summary6M.notStarted,summary6M.total)}%)`, color:'text-red-600' },
                ].map((l,i) => <span key={i} className={`font-semibold ${l.color}`}>{l.label}</span>)}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">💰 งบประมาณ (บาท)</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:'งบทั้งหมด',   val:summary6M.totalBudget,                               color:'text-primary' },
                  { label:'เบิกจ่ายแล้ว', val:summary6M.doneBudget,                               color:'text-green-600' },
                  { label:'คงเหลือ',     val:summary6M.totalBudget - summary6M.doneBudget,        color:'text-red-600' },
                ].map((b,i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">{b.label}</p>
                    <p className={`text-base font-bold ${b.color}`}>{(b.val/1000000).toFixed(2)} ล้าน</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Issues */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <p className="text-sm font-semibold text-yellow-700 mb-2">⚠️ ปัญหา อุปสรรค และข้อเสนอแนะ</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>• โครงการส่วนใหญ่ดำเนินงานได้ตามแผน แต่บางโครงการยังอยู่ระหว่างดำเนินการ ณ วันที่ 31 มีนาคม 2568 โดยเฉพาะงานโครงสร้างพื้นฐาน</li>
              <li>• บางโครงการเป็นงบประมาณจาก อบจ.พะเยา (3 โครงการ รวม 11,062,000 บาท) อยู่นอกการควบคุมของ อบต.แม่ใส</li>
              <li>• <strong>ข้อเสนอแนะ:</strong> ควรวางแผนและประสานกลุ่มเป้าหมายตั้งแต่ต้นปีงบประมาณ เพื่อให้ดำเนินการได้ครบถ้วน</li>
            </ul>
          </div>
        </>
      )}

      {/* ── TAB: STRATEGIES ── */}
      {tab === 'strategies' && (
        <div className="space-y-3">
          {strategies.map(s => {
            const sp = projects.filter(p => p.s === s.id)
            const done = sp.filter(p => p.status === 'done').length
            const inP  = sp.filter(p => p.status === 'inProgress').length
            const notS = sp.filter(p => p.status === 'notStarted').length
            return (
              <div key={s.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-secondary px-5 py-2.5 flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <h3 className="text-white font-bold text-sm">ยุทธศาสตร์ที่ {s.id}: {s.name}</h3>
                  <span className="ml-auto text-white/70 text-xs">{s.projects} โครงการ | {(s.budget/1000000).toFixed(2)} ล้านบาท</span>
                </div>
                <div className="p-4 flex gap-2 flex-wrap">
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">✅ แล้วเสร็จ {done}</span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-full font-medium">🔄 กำลังดำเนิน {inP}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium">⏳ ยังไม่เริ่ม {notS}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── TAB: PROJECTS ── */}
      {tab === 'projects' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
            <div>
              <p className="text-xs text-gray-400 mb-1.5">ยุทธศาสตร์:</p>
              <div className="flex gap-1.5 flex-wrap">
                {[{id:0,name:'ทั้งหมด'},...strategies].map(s => (
                  <button key={s.id} onClick={() => setFilterS(s.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterS === s.id ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
                    }`}>
                    {s.id === 0 ? 'ทั้งหมด' : `ยุทธ ${s.id}`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5">สถานะ:</p>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { key:'all',        label:'ทั้งหมด' },
                  { key:'done',       label:'✅ แล้วเสร็จ' },
                  { key:'inProgress', label:'🔄 กำลังดำเนิน' },
                  { key:'notStarted', label:'⏳ ยังไม่เริ่ม' },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilterSt(f.key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterSt === f.key ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 px-1">แสดง {filtered.length} โครงการ</p>

          <div className="space-y-3">
            {filtered.map(p => {
              const sc = statusCfg[p.status]
              const disbPct = pct(p.paid, p.budget)
              const strat = strategies.find(s => s.id === p.s)
              return (
                <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex gap-1.5 mb-1.5 flex-wrap">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            {strat?.icon} ยุทธ {p.s}
                          </span>
                          {p.v > 0 && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">หมู่ {p.v}</span>}
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{p.unit}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{p.id}. {p.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          งบ: <strong className="text-primary">{p.budget.toLocaleString('th-TH')} บ.</strong>
                          {p.paid > 0 && <> | เบิกจ่าย: <strong className="text-green-600">{p.paid.toLocaleString('th-TH')} บ.</strong></>}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${sc.badge}`}>{sc.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${sc.bar}`} style={{ width:`${disbPct}%` }} />
                    </div>
                    {p.budget > 0 && <p className="text-xs text-gray-400 text-right mt-0.5">เบิกจ่าย {disbPct}%</p>}
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