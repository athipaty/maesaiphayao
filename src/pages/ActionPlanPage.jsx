// แผนดำเนินงาน ประจำปีงบประมาณ พ.ศ.2568
// ข้อมูลจาก: 06_แผนและความก้าวหน้าในการดำเนินงานและการ.pdf

import { useState } from 'react'

// ── ข้อมูลสรุปรอบ 6 เดือน ───────────────────────────────────────────────────
const summary6M = {
  total: 69,
  totalBudget: 37556572.56,
  done: 30,
  doneBudget: 6479411.42,
  inProgress: 19,
  inProgressBudget: 7204672.56,
  notStarted: 20,
  notStartedBudget: 12018500,
}

// ── ยุทธศาสตร์ ───────────────────────────────────────────────────────────────
const strategies = [
  { id: 1, name: 'พัฒนาระบบเศรษฐกิจ', icon: '🏗️', color: '#1a5276', bg: '#d6eaf8', projects: 22, budget: 18266672.56 },
  { id: 2, name: 'พัฒนาสังคม การศึกษา วัฒนธรรม', icon: '📚', color: '#1e8449', bg: '#d5f5e3', projects: 39, budget: 18912900 },
  { id: 3, name: 'รักษาความมั่นคงและสงบเรียบร้อย', icon: '🛡️', color: '#784212', bg: '#fdebd0', projects: 4, budget: 72000 },
  { id: 4, name: 'บริหารจัดการทรัพยากรธรรมชาติ', icon: '🌿', color: '#0e6655', bg: '#d1f2eb', projects: 3, budget: 75000 },
  { id: 5, name: 'บริหารจัดการให้มีประสิทธิภาพ', icon: '⚙️', color: '#6c3483', bg: '#f5eef8', projects: 1, budget: 30000 },
]

// ── รายละเอียดโครงการ ────────────────────────────────────────────────────────
const projects = [
  // ยุทธศาสตร์ 1 - เศรษฐกิจ
  { id:1,  strategy:1, name:'ปรับปรุงถนน ค.ส.ล. บ้านร่องไฮ หมู่ที่ 1', village:1,  budget:238613.38,  disbursed:0,         unit:'กองช่าง',   status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:2,  strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 2 บ้านแม่ใสกลาง หมู่ที่ 2', village:2, budget:313733.61, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:3,  strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด สายบ้านทุ่งวัวแดง (ช่วงที่1) หมู่ที่ 3', village:3, budget:356462.18, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:4,  strategy:1, name:'ปรับปรุงถนน ค.ส.ล. บ้านทุ่งวัวแดง หมู่ที่ 3', village:3, budget:106672.89, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:5,  strategy:1, name:'ปรับปรุงถนนสายการเกษตร บ้านทุ่งวัวแดง หมู่ที่ 3', village:3, budget:484802.17, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:6,  strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด บ้านแม่ใสเหล่า หมู่ที่ 4', village:4, budget:469931.77, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:7,  strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด สายบ้านบ่อแฮ้ว หมู่ที่ 5', village:5, budget:478324.82, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:8,  strategy:1, name:'ขุดลอกลำเหมืองห้วยลึก บ้านบ่อแฮ้ว หมู่ที่ 5', village:5, budget:34183.08, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:9,  strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 2 บ้านสันป่าถ่อน หมู่ที่ 6', village:6, budget:419669.33, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:10, strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด บ้านสันช้างหิน หมู่ที่ 7', village:7, budget:472085.58, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:11, strategy:1, name:'ปรับปรุงถนน ค.ส.ล. ซอยบ้านนายสุพจน์ ยะตา บ้านแม่ใสหัวขัว หมู่ที่ 8', village:8, budget:328556.29, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:12, strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 4 บ้านแม่ใสเหนือ หมู่ที่ 9', village:9, budget:270354.73, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:13, strategy:1, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล. มีฝาปิด ซอย 7 บ้านสันป่าถ่อน หมู่ที่ 10', village:10, budget:438775.37, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:14, strategy:1, name:'ปรับปรุงถนน ค.ส.ล. ซอยสันกลาง (ช่วงที่1) หมู่ที่ 11', village:11, budget:472615.17, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:15, strategy:1, name:'ปรับปรุงถนน ค.ส.ล. สายหลัง อบต.แม่ใส หมู่ที่ 12', village:12, budget:270559.85, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:16, strategy:1, name:'ปรับปรุงไหล่ทาง ค.ส.ล. สายบ้านแม่ใสเหล่าใต้ หมู่ที่ 12', village:12, budget:346090.10, disbursed:0, unit:'กองช่าง', status:'inProgress', source:'จ่ายขาดเงินสะสม' },
  { id:17, strategy:1, name:'โครงการที่จอดรถ อบต.แม่ใส (โอนงบครั้งที่ 13/2567)', village:0, budget:300000, disbursed:0, unit:'กองช่าง', status:'notStarted', source:'โอนงบประมาณ' },
  { id:18, strategy:1, name:'ก่อสร้างเมรุบ้านแม่ใสเหล่า หมู่ที่ 4 และ หมู่ที่ 12', village:0, budget:1103242.24, disbursed:0, unit:'กองช่าง', status:'notStarted', source:'โอนงบประมาณ' },
  { id:19, strategy:1, name:'โครงการที่จอดรถ อบต.แม่ใส (ข้อบัญญัติ 2568)', village:0, budget:300000, disbursed:0, unit:'กองช่าง', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:20, strategy:1, name:'ปรับปรุงถนน คสล. สายโรงงานผลิตปุ๋ยอินทรีย์ หมู่ที่ 4 (อบจ.พะเยา)', village:4, budget:1879000, disbursed:0, unit:'อบจ.พะเยา', status:'notStarted', source:'อบจ.พะเยา' },
  { id:21, strategy:1, name:'ซ่อมสร้างผิวทางแอสฟัลท์ติกฯ บ้านแม่ใส–บ้านเกษตรสุข (อบจ.พะเยา)', village:0, budget:8686000, disbursed:0, unit:'อบจ.พะเยา', status:'notStarted', source:'อบจ.พะเยา' },
  { id:22, strategy:1, name:'จัดซื้อชุดเสาไฟ LED โซล่าเซลล์ 14 ชุด สายทุ่งวัวแดง หมู่ที่ 3 (อบจ.พะเยา)', village:3, budget:497000, disbursed:0, unit:'อบจ.พะเยา', status:'notStarted', source:'อบจ.พะเยา' },
  // ยุทธศาสตร์ 2 - การศึกษา
  { id:23, strategy:2, name:'สนับสนุนค่าใช้จ่ายการบริหารสถานศึกษา (ศพด.อบต.แม่ใส)', village:0, budget:477400, disbursed:137984, unit:'สำนักปลัด', status:'inProgress', source:'ข้อบัญญัติ 2568' },
  { id:24, strategy:2, name:'จัดงานวันเด็กแห่งชาติตำบลแม่ใส', village:0, budget:30000, disbursed:29950, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:25, strategy:2, name:'ค่าอาหารเสริม (นม) นักเรียนในพื้นที่ตำบลแม่ใส', village:0, budget:313000, disbursed:74259.42, unit:'สำนักปลัด', status:'inProgress', source:'ข้อบัญญัติ 2568' },
  { id:26, strategy:2, name:'อุดหนุนโรงเรียนชุมชนบ้านแม่ใส (อาหารกลางวัน)', village:0, budget:576000, disbursed:265340, unit:'สำนักปลัด', status:'inProgress', source:'ข้อบัญญัติ 2568' },
  { id:27, strategy:2, name:'ปรับปรุงภูมิทัศน์ศูนย์พัฒนาเด็กเล็ก อบต.แม่ใส', village:0, budget:490000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  // ยุทธศาสตร์ 2 - สาธารณสุข
  { id:28, strategy:2, name:'ควบคุมป้องกันโรคไข้เลือดออก', village:0, budget:50000, disbursed:0, unit:'กองสธ.', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:29, strategy:2, name:'อุดหนุนคณะกรรมการหมู่บ้าน หมู่ที่ 1–12 (สาธารณสุขพระราชดำริ)', village:0, budget:240000, disbursed:240000, unit:'กองสธ.', status:'done', source:'ข้อบัญญัติ 2568' },
  // ยุทธศาสตร์ 2 - ชุมชน
  { id:30, strategy:2, name:'จ้างเหมาสำรวจข้อมูลสัตว์และขึ้นทะเบียน (สุนัข/แมว)', village:0, budget:6500, disbursed:0, unit:'กองสธ.', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:31, strategy:2, name:'ฝึกอบรมเพิ่มทักษะด้านอาชีพเสริม', village:0, budget:20000, disbursed:20000, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:32, strategy:2, name:'ตรวจสอบคุณภาพน้ำประปาหมู่บ้าน', village:0, budget:20000, disbursed:0, unit:'กองช่าง', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:33, strategy:2, name:'เพิ่มศักยภาพการบริหารงาน อบต.แม่ใส', village:0, budget:150000, disbursed:37580, unit:'สำนักปลัด', status:'inProgress', source:'ข้อบัญญัติ 2568' },
  { id:34, strategy:2, name:'ส่งเสริมและพัฒนาคุณภาพชีวิตผู้สูงอายุ', village:0, budget:10000, disbursed:10000, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:35, strategy:2, name:'ส่งเสริมและพัฒนาคุณภาพชีวิตสตรี', village:0, budget:15000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:36, strategy:2, name:'สัตว์ปลอดโรค คนปลอดภัยจากโรคพิษสุนัขบ้าฯ', village:0, budget:50000, disbursed:0, unit:'กองสธ.', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:37, strategy:2, name:'อบรมคุณธรรมจริยธรรมให้แก่บุคลากร อบต.แม่ใส', village:0, budget:10000, disbursed:7845, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:38, strategy:2, name:'จิตอาสา "เราทำดีด้วยหัวใจ" น้อมถวายในหลวง ร.10', village:0, budget:30000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:39, strategy:2, name:'เฉลิมพระเกียรติในหลวง ร.10 เนื่องในโอกาสมหามงคล 6 รอบ', village:0, budget:30000, disbursed:28238, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  // ยุทธศาสตร์ 2 - ศาสนาวัฒนธรรม
  { id:40, strategy:2, name:'แข่งขันกีฬาแม่ใสสัมพันธ์ตำบลแม่ใส', village:0, budget:150000, disbursed:150000, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:41, strategy:2, name:'ประเพณีลอยกระทงตำบลแม่ใส', village:0, budget:150000, disbursed:147515, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:42, strategy:2, name:'ประเพณีสงกรานต์ตำบลแม่ใส', village:0, budget:100000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:43, strategy:2, name:'ประเพณีแห่เทียนเข้าพรรษาตำบลแม่ใส', village:0, budget:25000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:44, strategy:2, name:'ส่งเสริมการท่องเที่ยวในตำบลแม่ใส', village:0, budget:30000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:45, strategy:2, name:'ประเพณีสืบชะตาลำน้ำแม่ใส', village:0, budget:10000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:46, strategy:2, name:'สรงน้ำพระพุทธศิลาธรชุมชนชนานุสรณ์', village:0, budget:10000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  // ยุทธศาสตร์ 2 - งบกลาง
  { id:47, strategy:2, name:'เบี้ยยังชีพผู้สูงอายุ', village:0, budget:13500000, disbursed:4364300, unit:'สำนักปลัด', status:'inProgress', source:'งบกลาง' },
  { id:48, strategy:2, name:'เบี้ยยังชีพผู้พิการ', village:0, budget:2300000, disbursed:735600, unit:'สำนักปลัด', status:'inProgress', source:'งบกลาง' },
  { id:49, strategy:2, name:'เบี้ยยังชีพผู้ป่วยเอดส์', village:0, budget:300000, disbursed:82000, unit:'สำนักปลัด', status:'inProgress', source:'งบกลาง' },
  { id:50, strategy:2, name:'เงินสมทบกองทุนหลักประกันสุขภาพตำบลแม่ใส (สปสช.)', village:0, budget:120000, disbursed:120000, unit:'กองสธ.', status:'done', source:'งบกลาง' },
  // ยุทธศาสตร์ 3 - ความมั่นคง
  { id:51, strategy:3, name:'อาสาสมัครป้องกันภัยฝ่ายพลเรือน (อปพร.) ตำบลแม่ใส', village:0, budget:30000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:52, strategy:3, name:'ลดอุบัติเหตุทางถนนตำบลแม่ใส', village:0, budget:15000, disbursed:15000, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  { id:53, strategy:3, name:'ให้ความรู้ป้องกันอัคคีภัยและซักซ้อมอพยพ', village:0, budget:15000, disbursed:0, unit:'สำนักปลัด', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:54, strategy:3, name:'อุดหนุนเทศบาลตำบลท่าวังทอง (ศูนย์ปฏิบัติการช่วยเหลือประชาชน)', village:0, budget:12000, disbursed:12000, unit:'สำนักปลัด', status:'done', source:'ข้อบัญญัติ 2568' },
  // ยุทธศาสตร์ 4 - ทรัพยากรธรรมชาติ
  { id:55, strategy:4, name:'ส่งเสริมการบริหารจัดการขยะ', village:0, budget:30000, disbursed:0, unit:'กองสธ.', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:56, strategy:4, name:'อบรมเพิ่มความรู้การจัดการน้ำเสียระดับครัวเรือน', village:0, budget:30000, disbursed:0, unit:'กองสธ.', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  { id:57, strategy:4, name:'อาสาสมัครอนุรักษ์ทรัพยากรธรรมชาติสิ่งแวดล้อมชุมชนท้องถิ่น', village:0, budget:15000, disbursed:0, unit:'กองสธ.', status:'notStarted', source:'ข้อบัญญัติ 2568' },
  // ยุทธศาสตร์ 5 - บริหารจัดการ
  { id:58, strategy:5, name:'พัฒนาการจัดเก็บรายได้ (พัฒนาการจัดเก็บภาษี)', village:0, budget:30000, disbursed:1800, unit:'กองคลัง', status:'inProgress', source:'ข้อบัญญัติ 2568' },
]

const statusConfig = {
  done:       { label: 'แล้วเสร็จ',          bg: '#d5f5e3', color: '#1e8449', dot: '#1e8449' },
  inProgress: { label: 'อยู่ระหว่างดำเนินการ', bg: '#fef9e7', color: '#b7950b', dot: '#f1c40f' },
  notStarted: { label: 'ยังไม่ได้ดำเนินการ',   bg: '#fadbd8', color: '#922b21', dot: '#e74c3c' },
}

function fmtM(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + ' ล้าน'
  return n.toLocaleString('th-TH')
}
function fmtFull(n) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ActionPlanPage() {
  const [tab, setTab]           = useState('overview')
  const [filterStrategy, setFilterStrategy] = useState(0)
  const [filterStatus, setFilterStatus]     = useState('all')

  const filtered = projects.filter(p =>
    (filterStrategy === 0 || p.strategy === filterStrategy) &&
    (filterStatus === 'all' || p.status === filterStatus)
  )

  const pct = (n, d) => d ? Math.round((n / d) * 100) : 0

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", color: '#2c3e50', lineHeight: 1.7 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1a5276 0%,#2980b9 100%)',
        color: '#fff', padding: '1.5rem 2rem',
        borderRadius: '0 0 16px 16px', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>อบต.แม่ใส &rsaquo; แผนดำเนินงาน</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>แผนการดำเนินงาน ประจำปีงบประมาณ พ.ศ. 2568</h1>
        <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
          องค์การบริหารส่วนตำบลแม่ใส อ.เมืองพะเยา จ.พะเยา &nbsp;|&nbsp; รายงานความก้าวหน้ารอบ 6 เดือน (ต.ค.67–มี.ค.68)
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'โครงการทั้งหมด',        value: `${summary6M.total} โครงการ`,  sub: `งบ ${fmtM(summary6M.totalBudget)} บาท`, color:'#1a5276', bg:'#d6eaf8' },
          { label: 'ดำเนินการแล้วเสร็จ',    value: `${summary6M.done} โครงการ`,   sub: `${pct(summary6M.done,summary6M.total)}% ของทั้งหมด`, color:'#1e8449', bg:'#d5f5e3' },
          { label: 'อยู่ระหว่างดำเนินการ',  value: `${summary6M.inProgress} โครงการ`, sub: `งบ ${fmtM(summary6M.inProgressBudget)} บาท`, color:'#b7950b', bg:'#fef9e7' },
          { label: 'ยังไม่ได้ดำเนินการ',    value: `${summary6M.notStarted} โครงการ`, sub: `${pct(summary6M.notStarted,summary6M.total)}% ของทั้งหมด`, color:'#922b21', bg:'#fadbd8' },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 12, padding: '1rem 1.2rem', borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {[
          { key: 'overview',   label: 'ภาพรวม' },
          { key: 'strategies', label: '5 ยุทธศาสตร์' },
          { key: 'projects',   label: `รายละเอียดโครงการ (${projects.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontFamily: "'Sarabun',sans-serif", fontSize: 14,
            fontWeight: tab === t.key ? 600 : 400,
            background: tab === t.key ? '#1a5276' : '#eaf0fb',
            color: tab === t.key ? '#fff' : '#1a5276', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gap: 12 }}>
          {/* Progress bar */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 12 }}>ความก้าวหน้าโดยรวม รอบ 6 เดือน</div>
            <div style={{ display: 'flex', height: 20, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${pct(summary6M.done,summary6M.total)}%`, background: '#1e8449', transition: 'width 0.5s' }} title="แล้วเสร็จ" />
              <div style={{ width: `${pct(summary6M.inProgress,summary6M.total)}%`, background: '#f1c40f' }} title="กำลังดำเนินการ" />
              <div style={{ flex: 1, background: '#e74c3c' }} title="ยังไม่เริ่ม" />
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              {[
                { label: `แล้วเสร็จ ${summary6M.done} โครงการ (${pct(summary6M.done,summary6M.total)}%)`, color: '#1e8449' },
                { label: `กำลังดำเนินการ ${summary6M.inProgress} โครงการ`, color: '#b7950b' },
                { label: `ยังไม่เริ่ม ${summary6M.notStarted} โครงการ (${pct(summary6M.notStarted,summary6M.total)}%)`, color: '#922b21' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                  <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget disbursed */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 12 }}>งบประมาณ (บาท)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { label: 'งบทั้งหมด',  val: summary6M.totalBudget,       color: '#1a5276' },
                { label: 'เบิกจ่ายแล้ว', val: summary6M.doneBudget,      color: '#1e8449' },
                { label: 'คงเหลือ',    val: summary6M.totalBudget - summary6M.doneBudget, color: '#922b21' },
              ].map((b, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: b.color }}>{fmtM(b.val)}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>บาท</div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          <div style={{ background: '#fef9e7', border: '0.5px solid #f9e79f', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#b7950b', marginBottom: 8 }}>⚠️ ปัญหา อุปสรรค และข้อเสนอแนะ</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 6px' }}>• โครงการส่วนใหญ่สามารถดำเนินงานตามแผนได้ แต่บางโครงการยังอยู่ระหว่างดำเนินการ ณ วันที่ 31 มีนาคม 2568 โดยเฉพาะงานโครงสร้างพื้นฐาน</p>
              <p style={{ margin: '0 0 6px' }}>• บางโครงการเป็นงบประมาณจาก อบจ.พะเยา (3 โครงการ รวม 11,062,000 บาท) ซึ่งอยู่นอกการควบคุมของ อบต.แม่ใส</p>
              <p style={{ margin: 0 }}>• <strong>ข้อเสนอแนะ:</strong> ควรวางแผนและประสานกลุ่มเป้าหมายตั้งแต่ต้นปีงบประมาณ เพื่อให้ดำเนินการได้ครบถ้วนตามแผน</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: STRATEGIES ── */}
      {tab === 'strategies' && (
        <div style={{ display: 'grid', gap: 12 }}>
          {strategies.map(s => {
            const sProjects = projects.filter(p => p.strategy === s.id)
            const sDone = sProjects.filter(p => p.status === 'done').length
            const sInProgress = sProjects.filter(p => p.status === 'inProgress').length
            const sNotStarted = sProjects.filter(p => p.status === 'notStarted').length
            return (
              <div key={s.id} style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem', borderLeft: `5px solid ${s.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: '#999' }}>ยุทธศาสตร์ที่ {s.id}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.name}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{fmtM(s.budget)}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>บาท ({s.projects} โครงการ)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: `✅ แล้วเสร็จ ${sDone}`, bg: '#d5f5e3', color: '#1e8449' },
                    { label: `🔄 กำลังดำเนิน ${sInProgress}`, bg: '#fef9e7', color: '#b7950b' },
                    { label: `⏳ ยังไม่เริ่ม ${sNotStarted}`, bg: '#fadbd8', color: '#922b21' },
                  ].map((b, i) => (
                    <div key={i} style={{ background: b.bg, color: b.color, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── TAB: PROJECTS ── */}
      {tab === 'projects' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#888' }}>ยุทธศาสตร์:</span>
            {[{ id: 0, name: 'ทั้งหมด' }, ...strategies].map(s => (
              <button key={s.id} onClick={() => setFilterStrategy(s.id)} style={{
                padding: '3px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: "'Sarabun',sans-serif", fontSize: 12,
                background: filterStrategy === s.id ? '#1a5276' : '#eaf0fb',
                color: filterStrategy === s.id ? '#fff' : '#1a5276',
                fontWeight: filterStrategy === s.id ? 600 : 400,
              }}>{s.id === 0 ? 'ทั้งหมด' : `ยุทธ ${s.id}`}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#888' }}>สถานะ:</span>
            {[
              { key: 'all', label: 'ทั้งหมด' },
              { key: 'done', label: '✅ แล้วเสร็จ' },
              { key: 'inProgress', label: '🔄 กำลังดำเนิน' },
              { key: 'notStarted', label: '⏳ ยังไม่เริ่ม' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
                padding: '3px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: "'Sarabun',sans-serif", fontSize: 12,
                background: filterStatus === f.key ? '#1a5276' : '#eaf0fb',
                color: filterStatus === f.key ? '#fff' : '#1a5276',
                fontWeight: filterStatus === f.key ? 600 : 400,
              }}>{f.label}</button>
            ))}
          </div>

          <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>แสดง {filtered.length} โครงการ</div>

          <div style={{ display: 'grid', gap: 8 }}>
            {filtered.map(p => {
              const s = strategies.find(s => s.id === p.strategy)
              const sc = statusConfig[p.status]
              const disbursedPct = pct(p.disbursed, p.budget)
              return (
                <div key={p.id} style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 10, padding: '1rem 1.2rem', borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{ background: s.bg, color: s.color, fontSize: 10, padding: '1px 7px', borderRadius: 999, fontWeight: 600 }}>
                          {s.icon} ยุทธ {s.id}
                        </span>
                        {p.village > 0 && (
                          <span style={{ background: '#eaf0fb', color: '#1a5276', fontSize: 10, padding: '1px 7px', borderRadius: 999 }}>
                            หมู่ {p.village}
                          </span>
                        )}
                        <span style={{ background: '#f5f5f5', color: '#666', fontSize: 10, padding: '1px 7px', borderRadius: 999 }}>
                          {p.unit}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2c3e50', marginBottom: 4 }}>
                        {p.id}. {p.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        งบ: <strong style={{ color: s.color }}>{fmtFull(p.budget)} บาท</strong>
                        {p.disbursed > 0 && <> &nbsp;|&nbsp; เบิกจ่าย: <strong style={{ color: '#1e8449' }}>{fmtFull(p.disbursed)} บาท</strong></>}
                      </div>
                    </div>
                    <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {sc.label}
                    </span>
                  </div>
                  {p.budget > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 5, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${disbursedPct}%`, height: '100%', background: p.status === 'done' ? '#1e8449' : p.status === 'inProgress' ? '#f1c40f' : '#e74c3c', borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 2, textAlign: 'right' }}>เบิกจ่าย {disbursedPct}%</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}