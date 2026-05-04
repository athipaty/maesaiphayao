// แผนพัฒนาท้องถิ่น (พ.ศ. 2566-2570) เพิ่มเติม ฉบับที่ 3
// ข้อมูลจากเอกสาร: _6_รวมไฟล์_เพิ่มเติมแผน_ฉบับที่_3_ประจำปี_2567.pdf

import { useState } from "react";

const summaryData = [
  {
    plan: "1.1 แผนงานอุตสาหกรรมและการโยธา (ผ.02)",
    y2566: 0, y2567: 0, y2568: 821000, y2569: 0, y2570: 0, total: 821000,
  },
  {
    plan: "1.2 แผนงานอุตสาหกรรมและการโยธา (ผ.02/2) ขอหน่วยงานอื่น",
    y2566: 0, y2567: 7639000, y2568: 5323000, y2569: 0, y2570: 0, total: 12962000,
  },
  {
    plan: "1.3 แผนงานเคหะและชุมชน (ผ.02)",
    y2566: 0, y2567: 1125000, y2568: 1000000, y2569: 1000000, y2570: 1000000, total: 4125000,
  },
  {
    plan: "1.4 แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)",
    y2566: 0, y2567: 130000, y2568: 130000, y2569: 130000, y2570: 130000, total: 520000,
  },
];

const grandTotal = { y2566: 0, y2567: 8894000, y2568: 7274000, y2569: 1130000, y2570: 1130000, total: 18428000 };

const projects = [
  { id: 1, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02)", name: "จัดซื้อโคมไฟถนนระบบพลังงานแสงอาทิตย์ ขนาด 4,800 วัตต์ พร้อมติดตั้ง", objective: "เพิ่มความสว่างให้กับท้องถนน และลดภาวะโลกร้อน", target: "โคมไฟ 96 ชุด", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "กองช่าง" },
  { id: 2, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02)", name: "ระบบพลังงานแสงอาทิตย์ศาลาประชาคมตำบลแม่ใส", objective: "เพิ่มความสว่าง ประหยัดค่าไฟฟ้า และลดภาวะโลกร้อน", target: "ไฟฟ้าพลังงานแสงอาทิตย์ 1 ชุด ขนาด 5,000 วัตต์", y2566: 0, y2567: 0, y2568: 321000, y2569: 0, y2570: 0, responsible: "กองช่าง" },
  { id: 3, group: "แผนงานเคหะและชุมชน (ผ.02)", name: "ซ่อมแซมทางสาธารณะประโยชน์ในความรับผิดชอบของ อบต.แม่ใส", objective: "บรรเทาความเดือดร้อน ซ่อมแซมถนนให้อยู่ในสภาพดี ปลอดภัย", target: "ซ่อมแซมทางสาธารณะ 10 จุด", y2566: 0, y2567: 500000, y2568: 500000, y2569: 500000, y2570: 500000, responsible: "กองช่าง" },
  { id: 4, group: "แผนงานเคหะและชุมชน (ผ.02)", name: "ซ่อมแซมแหล่งน้ำในความรับผิดชอบของ อบต.แม่ใส", objective: "พัฒนาและซ่อมแซมแหล่งเก็บกักน้ำและระบบส่งน้ำให้เต็มศักยภาพ", target: "ซ่อมแซมแหล่งน้ำ 10 จุด", y2566: 0, y2567: 500000, y2568: 500000, y2569: 500000, y2570: 500000, responsible: "กองช่าง" },
  { id: 5, group: "แผนงานเคหะและชุมชน (ผ.02)", name: "อุดหนุนเทศบาลเมืองพะเยา (ปรับปรุงผังเมืองรวมเมืองพะเยา)", objective: "เป็นแนวทางการพัฒนาเมือง การคมนาคม สาธารณูปโภค", target: "มีผังเมืองรวมชัดเจนขึ้นร้อยละ 70", y2566: 0, y2567: 125000, y2568: 0, y2569: 0, y2570: 0, responsible: "กองช่าง" },
  { id: 6, group: "แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)", name: "โครงการกาดฮิมต้าลำนาร่องไฮเฉลิมพระเกียรติ ร.10", objective: "ส่งเสริมการท่องเที่ยวและเพิ่มรายได้ให้ประชาชน", target: "นักท่องเที่ยวและรายได้เพิ่มร้อยละ 10", y2566: 0, y2567: 100000, y2568: 100000, y2569: 100000, y2570: 100000, responsible: "สำนักปลัด" },
  { id: 7, group: "แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)", name: "ส่งเสริมความรู้ด้านสุขาภิบาลอาหาร", objective: "สร้างความรู้ด้านอาหารปลอดภัยแก่ผู้ประกอบการ", target: "ผู้ประกอบการมีความรู้ไม่น้อยกว่าร้อยละ 80", y2566: 0, y2567: 15000, y2568: 15000, y2569: 15000, y2570: 15000, responsible: "กองสาธารณสุข" },
  { id: 8, group: "แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)", name: "ส่งเสริมเครือข่ายคุ้มครองผู้บริโภคด้านผลิตภัณฑ์อาหารและสุขภาพ", objective: "พัฒนาความรู้และสนับสนุนเครือข่ายคุ้มครองผู้บริโภค", target: "จัดกิจกรรมเฝ้าระวังเชิงรุกอย่างน้อยปีละ 1 ครั้ง", y2566: 0, y2567: 15000, y2568: 15000, y2569: 15000, y2570: 15000, responsible: "กองสาธารณสุข" },
  { id: 9, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงถนนหินคลุกสายการเกษตรบ้านสันปาถอน เชื่อมบ้านสันขี้เหล็ก", objective: "บรรเทาความเดือดร้อนเกษตรกร ปรับปรุงถนน", target: "ถนน 1 สาย (1,300+550 ม.)", y2566: 0, y2567: 0, y2568: 496000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 10, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงถนนหินคลุกสายการเกษตรทุ่งป่าแดง ตำบลแม่ใส", objective: "บรรเทาความเดือดร้อนเกษตรกร", target: "ถนน 1 สาย ยาว 1,500 ม.", y2566: 0, y2567: 0, y2568: 392000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 11, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงถนนหินคลุกสายการเกษตรทุ่งแพะ เชื่อมบ้านเกษตรสุข", objective: "บรรเทาความเดือดร้อนเกษตรกร", target: "ถนน 1 สาย ยาว 920 ม.", y2566: 0, y2567: 0, y2568: 238000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 12, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงถนนหินคลุกสายการเกษตรรองบัว เชื่อมบ้านรองคำ", objective: "บรรเทาความเดือดร้อนเกษตรกร", target: "ถนน 1 สาย ยาว 1,700 ม.", y2566: 0, y2567: 0, y2568: 375000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 13, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงถนนหินคลุกสายการเกษตรสันกลาง เชื่อมชุมชนแม่ต๋ำภูมินทร์", objective: "บรรเทาความเดือดร้อนเกษตรกร", target: "ถนน 1 สาย ยาว 1,050 ม.", y2566: 0, y2567: 0, y2568: 311000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 14, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงถนนคอนกรีตเสริมเหล็กสายโรงงานผลิตปุ๋ยอินทรีย์ หมู่ที่ 4", objective: "บรรเทาความเดือดร้อนเกษตรกร ปรับปรุงถนน", target: "ถนน 1 สาย กว้าง 4.50 ม. ยาว 455 ม.", y2566: 0, y2567: 1879000, y2568: 0, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 15, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงผิวทางแอสฟัลท์ติกคอนกรีต สายบ้านแม่ใส เชื่อมบ้านเกษตรสุข", objective: "ปรับปรุงถนนให้อยู่ในสภาพดี ปลอดภัย", target: "ถนน 1 สาย กว้าง 6 ม. ยาว 1,920 ม.", y2566: 0, y2567: 5760000, y2568: 0, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 16, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ปรับปรุงหินคลุกสายการเกษตรข้างศาลพ่อถ้าไปหากว๊านพะเยา", objective: "บรรเทาความเดือดร้อนเกษตรกร", target: "ถนน 1 สาย ยาว 1,050 ม.", y2566: 0, y2567: 0, y2568: 278000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 17, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ก่อสร้างฝายแกนดินซีเมนต์ชั่วคราว ลำห้วยรองคำ บ้านทุ่งวัวแดง หมู่ที่ 3", objective: "กักเก็บน้ำไว้ใช้ในการเกษตรช่วงฤดูแล้ง", target: "ฝาย 1 จุด สูง 1 ม. สันฝายยาว 8 ม.", y2566: 0, y2567: 0, y2568: 233000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 18, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านหัวขัว เชื่อมบ้านแม่ต๋ำบุญโยง", objective: "เพิ่มความสว่าง ลดภาวะโลกร้อน", target: "เสาไฟโซลาเซลล์ 15 ต้น", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 19, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านแม่ใส เชื่อมบ้านรองคำน้อย", objective: "เพิ่มความสว่าง ลดภาวะโลกร้อน", target: "เสาไฟโซลาเซลล์ 15 ต้น", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 20, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านบ่อแฮว เชื่อมบ้านซอน", objective: "เพิ่มความสว่าง ลดภาวะโลกร้อน", target: "เสาไฟโซลาเซลล์ 15 ต้น", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 21, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านสันปาถอน เชื่อมบ้านห้วยลึก", objective: "เพิ่มความสว่าง ลดภาวะโลกร้อน", target: "เสาไฟโซลาเซลล์ 15 ต้น", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 22, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ติดตั้งไฟส่องสว่างโซลาเซลล์ ถนนสายบ้านสันปาถอน เชื่อมบ้านสันกว้าน", objective: "เพิ่มความสว่าง ลดภาวะโลกร้อน", target: "เสาไฟโซลาเซลล์ 15 ต้น", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
  { id: 23, group: "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)", name: "ติดตั้งไฟส่องสว่างโซลาเซลล์ โบราณสถานบ้านรองไฮ", objective: "เพิ่มความสว่าง ลดภาวะโลกร้อน", target: "เสาไฟโซลาเซลล์ 15 ต้น", y2566: 0, y2567: 0, y2568: 500000, y2569: 0, y2570: 0, responsible: "อบจ.พะเยา" },
];

const groupColors = {
  "แผนงานอุตสาหกรรมและการโยธา (ผ.02)": { bg: "#d6eaf8", accent: "#1a5276" },
  "แผนงานเคหะและชุมชน (ผ.02)": { bg: "#d5f5e3", accent: "#1e8449" },
  "แผนงานสร้างความเข้มแข็งของชุมชน (ผ.02)": { bg: "#fdebd0", accent: "#784212" },
  "แผนงานอุตสาหกรรมและการโยธา (ผ.02/2 ขอ อบจ.พะเยา)": { bg: "#f5eef8", accent: "#6c3483" },
};

const years = ["2566", "2567", "2568", "2569", "2570"];

function fmtBaht(n) {
  if (!n) return "-";
  return n.toLocaleString("th-TH") + " บาท";
}

export default function DevelopmentPlanPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedGroup, setSelectedGroup] = useState("ทั้งหมด");

  const groups = ["ทั้งหมด", ...Object.keys(groupColors)];
  const filtered = selectedGroup === "ทั้งหมด"
    ? projects
    : projects.filter((p) => p.group === selectedGroup);

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", color: "#2c3e50", lineHeight: 1.7 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#1a5276 0%,#2980b9 100%)",
        color: "#fff", padding: "1.5rem 2rem",
        borderRadius: "0 0 16px 16px", marginBottom: "1.5rem",
      }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
          อบต.แม่ใส &rsaquo; แผนพัฒนาท้องถิ่น
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
          แผนพัฒนาท้องถิ่น (พ.ศ. 2566–2570) เพิ่มเติม ฉบับที่ 3
        </h1>
        <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
          ประจำปีงบประมาณ พ.ศ. 2567 &nbsp;|&nbsp; อบต.แม่ใส อ.เมืองพะเยา จ.พะเยา
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "1.5rem" }}>
        {[
          { label: "งบประมาณรวม 5 ปี", value: "18,428,000 บาท", sub: "38 โครงการ", color: "#1a5276", bg: "#d6eaf8" },
          { label: "งบประมาณ ปี 2567 (สูงสุด)", value: "8,894,000 บาท", sub: "8 โครงการ", color: "#1e8449", bg: "#d5f5e3" },
          { label: "งบประมาณ ปี 2568", value: "7,274,000 บาท", sub: "20 โครงการ", color: "#6c3483", bg: "#f5eef8" },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.bg, borderRadius: 12,
            padding: "1rem 1.2rem", borderLeft: `4px solid ${c.color}`,
          }}>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.2rem" }}>
        {[
          { key: "summary", label: "บัญชีสรุป (ผ.01)" },
          { key: "projects", label: `รายละเอียดโครงการ (${projects.length} โครงการ)` },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: "7px 18px", borderRadius: 999, border: "none", cursor: "pointer",
            fontFamily: "'Sarabun',sans-serif", fontSize: 14,
            fontWeight: activeTab === t.key ? 600 : 400,
            background: activeTab === t.key ? "#1a5276" : "#eaf0fb",
            color: activeTab === t.key ? "#fff" : "#1a5276",
            transition: "all 0.2s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: SUMMARY ── */}
      {activeTab === "summary" && (
        <div>
          <div style={{ background: "#fff", border: "0.5px solid #dee2e6", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", background: "#f8f9fa", borderBottom: "0.5px solid #dee2e6", fontSize: 13, fontWeight: 600, color: "#444" }}>
              บัญชีสรุปโครงการพัฒนา (ผ.01) — ยุทธศาสตร์ด้านเศรษฐกิจ
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#1a5276", color: "#fff" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 500 }}>แผนงาน</th>
                    {years.map((y) => (
                      <th key={y} style={{ padding: "10px 8px", textAlign: "right", fontWeight: 500, whiteSpace: "nowrap" }}>ปี {y}</th>
                    ))}
                    <th style={{ padding: "10px 8px", textAlign: "right", fontWeight: 600 }}>รวม 5 ปี</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "0.5px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "10px 12px", color: "#333" }}>{row.plan}</td>
                      {[row.y2566, row.y2567, row.y2568, row.y2569, row.y2570].map((v, j) => (
                        <td key={j} style={{ padding: "10px 8px", textAlign: "right", color: v ? "#1a5276" : "#ccc" }}>
                          {v ? v.toLocaleString("th-TH") : "-"}
                        </td>
                      ))}
                      <td style={{ padding: "10px 8px", textAlign: "right", fontWeight: 700, color: "#1a5276" }}>
                        {row.total.toLocaleString("th-TH")}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#1a5276", color: "#fff", fontWeight: 700 }}>
                    <td style={{ padding: "10px 12px" }}>รวมทั้งสิ้น (38 โครงการ)</td>
                    {[grandTotal.y2566, grandTotal.y2567, grandTotal.y2568, grandTotal.y2569, grandTotal.y2570].map((v, j) => (
                      <td key={j} style={{ padding: "10px 8px", textAlign: "right" }}>
                        {v ? v.toLocaleString("th-TH") : "-"}
                      </td>
                    ))}
                    <td style={{ padding: "10px 8px", textAlign: "right" }}>
                      {grandTotal.total.toLocaleString("th-TH")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ background: "#fff", border: "0.5px solid #dee2e6", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 12 }}>งบประมาณแต่ละปี (บาท)</div>
            {[
              { year: "2566", val: 0 },
              { year: "2567", val: 8894000 },
              { year: "2568", val: 7274000 },
              { year: "2569", val: 1130000 },
              { year: "2570", val: 1130000 },
            ].map((y) => (
              <div key={y.year} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>ปี {y.year}</span>
                  <span style={{ color: "#1a5276" }}>{y.val ? y.val.toLocaleString("th-TH") + " บาท" : "ไม่มีงบประมาณ"}</span>
                </div>
                <div style={{ height: 10, background: "#eaf0fb", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${(y.val / 8894000) * 100}%`, height: "100%", background: "#2980b9", borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: PROJECTS ── */}
      {activeTab === "projects" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#888" }}>กรอง:</span>
            {groups.map((g) => {
              const col = groupColors[g] || { bg: "#eee", accent: "#555" };
              const active = selectedGroup === g;
              return (
                <button key={g} onClick={() => setSelectedGroup(g)} style={{
                  padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer",
                  fontFamily: "'Sarabun',sans-serif", fontSize: 12,
                  background: active ? (g === "ทั้งหมด" ? "#1a5276" : col.accent) : (g === "ทั้งหมด" ? "#eaf0fb" : col.bg),
                  color: active ? "#fff" : (g === "ทั้งหมด" ? "#1a5276" : col.accent),
                  fontWeight: active ? 600 : 400,
                }}>
                  {g === "ทั้งหมด" ? `ทั้งหมด (${projects.length})` : g.replace("แผนงาน", "").trim()}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>แสดง {filtered.length} โครงการ</div>

          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((p) => {
              const col = groupColors[p.group] || { bg: "#f5f5f5", accent: "#555" };
              const totalBudget = p.y2566 + p.y2567 + p.y2568 + p.y2569 + p.y2570;
              return (
                <div key={p.id} style={{
                  background: "#fff", border: "0.5px solid #dee2e6",
                  borderRadius: 10, padding: "1rem 1.2rem",
                  borderLeft: `4px solid ${col.accent}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "inline-block", fontSize: 10, padding: "2px 8px",
                        borderRadius: 999, background: col.bg, color: col.accent,
                        fontWeight: 600, marginBottom: 6,
                      }}>
                        {p.group}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2c3e50", marginBottom: 4 }}>
                        {p.id}. {p.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>🎯 {p.objective}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        📌 {p.target} &nbsp;|&nbsp; หน่วยงาน: <strong>{p.responsible}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: "#999" }}>งบรวม</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: col.accent }}>{fmtBaht(totalBudget)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {years.map((y, i) => {
                      const val = [p.y2566, p.y2567, p.y2568, p.y2569, p.y2570][i];
                      return (
                        <div key={y} style={{
                          background: val ? col.bg : "#f5f5f5",
                          borderRadius: 6, padding: "3px 10px", textAlign: "center",
                        }}>
                          <div style={{ fontSize: 10, color: val ? col.accent : "#bbb" }}>ปี {y}</div>
                          <div style={{ fontSize: 11, fontWeight: val ? 700 : 400, color: val ? col.accent : "#ccc" }}>
                            {val ? val.toLocaleString("th-TH") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}