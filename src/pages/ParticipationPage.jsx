// การเปิดโอกาสให้เกิดการมีส่วนร่วม พ.ศ.2568
// ข้อมูลจาก: ข้อ_020_รูปเล่มประชาสัมพันธ์_การเปิดโอกาสให้.pdf

import { useState } from 'react'

// ── ข้อมูลผู้เข้าร่วมแต่ละหมู่บ้าน ──────────────────────────────────────────
const villages = [
  { no: 1,  people: 30,  projects: 5 },
  { no: 2,  people: 39,  projects: 5 },
  { no: 3,  people: 43,  projects: 4 },
  { no: 4,  people: 55,  projects: 5 },
  { no: 5,  people: 56,  projects: 5 },
  { no: 6,  people: 30,  projects: 5 },
  { no: 7,  people: 30,  projects: 3 },
  { no: 8,  people: 31,  projects: 5 },
  { no: 9,  people: 40,  projects: 5 },
  { no: 10, people: 35,  projects: 5 },
  { no: 11, people: 45,  projects: 3 },
  { no: 12, people: 42,  projects: 5 },
]

// ── โครงการที่เสนอจากประชาคม (55 โครงการ) ───────────────────────────────────
const proposedProjects = {
  1:  ['ก่อสร้างท่าเรือหลวงหมู่ที่ 1 บ้านร่องไฮ','ก่อสร้างแหล่งชมทุ่งดอกบัวแดง','ติดตั้งไฟโซล่าเซลล์ถนนสายโบราณสถานและพื้นที่สาธารณะ','ขุดลอกลำห้วยร่องไฮ','ก่อสร้างรางระบายน้ำ คสล.แบบมีฝาปิด'],
  2:  ['ก่อสร้างฝายน้ำล้น ห้วยร่องใส (ฝายพ่อพูล)','ซ่อมแซมประตูน้ำ ฝายหน้ากรีนวิงส์ แม่ใส','ขุดลอกร่องแหย่งจากหลังวัดแม่ใสถึงซอย 7','ปรับปรุงดาดคอนกรีตถนนสายการเกษตรเลียงร่องเปา','ก่อสร้างรางระบายน้ำ คสล.แบบมีฝาปิด ซอย 2'],
  3:  ['อุดหนุนการประปาส่วนภูมิภาค','เสริมท่อ ขยายถนน เสริมหูช้างข้างศูนย์พัฒนาเด็กเล็ก','ปรับปรุงถนน คสล.ซอยข้างบ้านนายประเสริฐ คำเผ่า','ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ช่วงที่ 3'],
  4:  ['ก่อสร้างเตาเผาศพ (แบบถ่าน)','ปรับปรุงถนน คสล.บ้านนายรพ ขันคำ และบ้านนายมิตร ไทยใหม่','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 5','ปรับปรุงรางระบายน้ำแบบมีฝาปิด หน้า รพ.สต.แม่ใส','ปรับปรุงถนน บ้านนายครรชิต จุมปา'],
  5:  ['ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด (หอกระจายข่าว–สามแยกมินิมาร์ท)','ขยายเขตน้ำดี ซอย 5 และซอย 8','ปรับปรุงคลองทุกสาย ในหมู่บ้าน','เทดาดคอนกรีต ข้างบ้านนางผ่อง โคดี–ข้างบ้านนายนิตย์ บุญยืน','ติดกล้องวงจรปิด จุดเสี่ยง'],
  6:  ['ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ซอย 4 (บ้านนายวิชัย–นางจินตนา)','ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ซอย 4 ช่วงที่ 1–2','ขุดลอกลำเหมือง หมู่ที่ 6','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 1','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ข้างวัดสันป่าถ่อน'],
  7:  ['ปรับปรุงระบบประปาหมู่บ้าน','ติดตั้งไฟโซล่าเซลล์ท่าเรือโบราณ','ปรับปรุงรางระบายน้ำแบบมีฝาปิด (3 แยกทางไปกว๊านพะเยา)'],
  8:  ['เจาะบ่อบาดาล','ก่อสร้างประปาหอถังสูง','ปรับปรุงถนน คสล.ซอยบ้านนางลออ มหาวรรณศรี','ปรับปรุงรางระบายน้ำแบบมีฝาปิด สายปฏิบัติธรรม','ขุดลอกลำห้วยร่องเปา'],
  9:  ['ปรับปรุงถนนสายการเกษตร (สายเข้าเสี้ยวบ้าน)','ปรับปรุงราง คสล.ฝาปิด (ปากทางซอย 4–บ้าน รตต.อดุล อุตะมะ)','เทดาดคอนกรีตน้ำลงกว๊าน (หมู่ 9–ม.4 จากบ้านนายจรูญ–โรงปุ๋ย)','ปรับปรุงรางระบายน้ำทุ่งป่าตาล','ปรับปรุงถนนสายการเกษตร'],
  10: ['แก้ไขปัญหาน้ำท่วม ซอย 7','ปรับปรุงราง คสล.ฝาปิดหน้าบ้าน รตท.วิรัตน์–ทางเข้าป่าสุสาน หมู่ 6,10','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 11','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 9','ก่อสร้างพนังคอนกรีตเหมืองสันทราย'],
  11: ['ก่อสร้างถนน คสล. หมู่ที่ 11 เชื่อมตำบลแม่ต๋ำ','ปรับปรุงน้ำประปาหมู่บ้าน','ขุดลอกลำเหมือง หน้าก๋วยเตี๋ยวบ้านภู–กว๊านพะเยา'],
  12: ['ก่อสร้างเตาเผา (ถ่าน)','ปรับปรุงราง คสล.ฝาปิดหน้าบ้านนายดำรง คำเผ่า–นางสุดา ไชยวงค์','ปรับปรุงไหล่ทาง คสล.ถนนภายในหมู่บ้าน หมู่ 12','ปรับปรุงดาดคอนกรีตหลังบ้านนายเปี๊ยก บ้านทุ่ง ต่อไปอีก 100 ม.','ถนน คสล.หลัง อบต.'],
}

// ── โครงการที่ได้รับอนุมัติและทำสัญญาจ้าง (16 โครงการ รวม 5,501,430.32 บาท) ─
const approvedProjects = [
  { no:1,  name:'ปรับปรุงถนน ค.ส.ล. บ้านร่องไฮ หมู่ที่ 1',                              village:1,  budget:238613.38 },
  { no:2,  name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 2 บ้านแม่ใสกลาง หมู่ที่ 2',   village:2,  budget:313733.61 },
  { no:3,  name:'ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ทางหลวงท้องถิ่น สายบ้านทุ่งวัวแดง (ช่วงที่1) หมู่ที่ 3', village:3, budget:356462.18 },
  { no:4,  name:'ปรับปรุงถนน คสล. บ้านทุ่งวัวแดง หมู่ที่ 3',                              village:3,  budget:106672.89 },
  { no:5,  name:'ปรับปรุงถนนสายการเกษตร บ้านทุ่งวัวแดง หมู่ที่ 3',                        village:3,  budget:484802.17 },
  { no:6,  name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด บ้านแม่ใสเหล่า หมู่ที่ 4',         village:4,  budget:469931.77 },
  { no:7,  name:'ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ทางหลวงท้องถิ่น สายบ้านบ่อแฮว หมู่ที่ 5', village:5, budget:478324.82 },
  { no:8,  name:'ขุดลอกลำเหมืองห้วยลึก บ้านบ่อแฮว หมู่ที่ 5',                             village:5,  budget:34183.08 },
  { no:9,  name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 2 บ้านสันป่าถ่อน หมู่ที่ 6',   village:6,  budget:419669.33 },
  { no:10, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 2 บ้านสันป่าถ่อน หมู่ที่ 6 (ช่วงที่ 2)', village:6, budget:478324.82 },
  { no:11, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด บ้านสันช้างหิน หมู่ที่ 7',          village:7,  budget:472085.58 },
  { no:12, name:'ปรับปรุงถนน ค.ส.ล. ซอยบ้านนายสุพจน์ ยะตา บ้านแม่ใสหัวขัว หมู่ที่ 8',   village:8,  budget:328556.29 },
  { no:13, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 4 บ้านแม่ใสเหนือ หมู่ที่ 9',  village:9,  budget:270354.73 },
  { no:14, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 7 บ้านสันป่าถ่อน หมู่ที่ 10', village:10, budget:438775.37 },
  { no:15, name:'ปรับปรุงถนน ค.ส.ล. ซอยสันกลาง (ช่วงที่1) หมู่ที่ 11',                   village:11, budget:472615.17 },
  { no:16, name:'ปรับปรุงไหล่ทาง ค.ส.ล. ทางหลวงท้องถิ่น สายบ้านแม่ใสเหล่าใต้ หมู่ที่ 12', village:12, budget:346090.10 },
]

const totalBudget = 5501430.32
const totalPeople = 476
const totalProposed = 55
const totalApproved = 16
const contracted = 15

export default function ParticipationPage() {
  const [tab, setTab] = useState('overview')
  const [selectedVillage, setSelectedVillage] = useState(null)

  const maxPeople = Math.max(...villages.map(v => v.people))

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", color: '#2c3e50', lineHeight: 1.7 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1a5276 0%,#2980b9 100%)',
        color: '#fff', padding: '1.5rem 2rem',
        borderRadius: '0 0 16px 16px', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
          อบต.แม่ใส &rsaquo; การเปิดโอกาสให้เกิดการมีส่วนร่วม
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
          การเปิดโอกาสให้เกิดการมีส่วนร่วม พ.ศ. 2568
        </h1>
        <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
          โครงการ อบต.แม่ใสพบประชาชน &nbsp;|&nbsp; 12–14 ตุลาคม 2567
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'ผู้เข้าร่วมประชุมทั้งหมด', value: totalPeople.toLocaleString() + ' คน', sub: '12 หมู่บ้าน', color: '#1a5276', bg: '#d6eaf8' },
          { label: 'โครงการที่เสนอ', value: totalProposed + ' โครงการ', sub: 'เห็นชอบ 100%', color: '#1e8449', bg: '#d5f5e3' },
          { label: 'โครงการที่ได้รับอนุมัติ', value: totalApproved + ' โครงการ', sub: 'ทำสัญญาแล้ว ' + contracted + ' โครงการ', color: '#784212', bg: '#fdebd0' },
          { label: 'งบประมาณรวม 16 โครงการ', value: totalBudget.toLocaleString('th-TH', {maximumFractionDigits:2}) + ' บาท', sub: 'ปีงบประมาณ 2568', color: '#6c3483', bg: '#f5eef8' },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 12, padding: '1rem 1.2rem', borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {[
          { key: 'overview',  label: 'ภาพรวม' },
          { key: 'proposed',  label: 'โครงการที่เสนอ (55)' },
          { key: 'approved',  label: 'โครงการที่อนุมัติ (16)' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontFamily: "'Sarabun',sans-serif", fontSize: 14,
            fontWeight: tab === t.key ? 600 : 400,
            background: tab === t.key ? '#1a5276' : '#eaf0fb',
            color: tab === t.key ? '#fff' : '#1a5276',
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {tab === 'overview' && (
        <div>
          {/* Process timeline */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>กระบวนการมีส่วนร่วม</div>
            <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
              {[
                { step: '1', label: 'จัดประชุมประชาคม', detail: '12–14 ต.ค. 2567\nอาคารอเนกประสงค์\nแต่ละหมู่บ้าน', color: '#1a5276' },
                { step: '2', label: 'รับข้อเสนอ', detail: '476 คน\n55 โครงการ\nเห็นชอบ 100%', color: '#2980b9' },
                { step: '3', label: 'กองช่างสำรวจ', detail: 'สำรวจพื้นที่\nคำนวณราคากลาง\nแต่ละโครงการ', color: '#1e8449' },
                { step: '4', label: 'อนุมัติสภา อบต.', detail: '16 โครงการ\nเข้าสู่แผนพัฒนา\nฉบับเพิ่มเติม ปี 2568', color: '#784212' },
                { step: '5', label: 'ดำเนินการ', detail: 'ทำสัญญา 15\nโครงการ\nคงค้าง 1 โครงการ', color: '#6c3483' },
              ].map((s, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: s.color,
                      color: '#fff', fontWeight: 700, fontSize: 15,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}>{s.step}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#777', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{s.detail}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 24, color: '#ccc', textAlign: 'center', fontSize: 18, flexShrink: 0 }}>›</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Village bar chart */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 12 }}>จำนวนผู้เข้าร่วมแต่ละหมู่บ้าน</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '6px 20px' }}>
              {villages.map(v => (
                <div key={v.no} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, width: 50, flexShrink: 0, color: '#1a5276' }}>หมู่ {v.no}</span>
                  <div style={{ flex: 1, height: 14, background: '#eaf0fb', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(v.people / maxPeople) * 100}%`, height: '100%', background: '#2980b9', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#1a5276', fontWeight: 600, width: 36, textAlign: 'right' }}>{v.people}</span>
                  <span style={{ fontSize: 11, color: '#888', width: 60 }}>({v.projects} โครงการ)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: PROPOSED PROJECTS ── */}
      {tab === 'proposed' && (
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>
            คลิกหมู่บ้านเพื่อดูรายละเอียดโครงการที่เสนอ
          </div>

          {/* Village selector */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <button onClick={() => setSelectedVillage(null)} style={{
              padding: '4px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontFamily: "'Sarabun',sans-serif", fontSize: 12,
              background: selectedVillage === null ? '#1a5276' : '#eaf0fb',
              color: selectedVillage === null ? '#fff' : '#1a5276', fontWeight: selectedVillage === null ? 600 : 400,
            }}>ทั้งหมด</button>
            {villages.map(v => (
              <button key={v.no} onClick={() => setSelectedVillage(v.no)} style={{
                padding: '4px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: "'Sarabun',sans-serif", fontSize: 12,
                background: selectedVillage === v.no ? '#1a5276' : '#eaf0fb',
                color: selectedVillage === v.no ? '#fff' : '#1a5276',
                fontWeight: selectedVillage === v.no ? 600 : 400,
              }}>หมู่ {v.no}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {(selectedVillage ? villages.filter(v => v.no === selectedVillage) : villages).map(v => (
              <div key={v.no} style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1rem 1.2rem', borderLeft: '4px solid #1a5276' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a5276' }}>
                    หมู่ที่ {v.no}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ background: '#d6eaf8', color: '#1a5276', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                      {v.people} คน
                    </span>
                    <span style={{ background: '#d5f5e3', color: '#1e8449', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                      {v.projects} โครงการ
                    </span>
                  </div>
                </div>
                <ol style={{ margin: 0, paddingLeft: 18 }}>
                  {proposedProjects[v.no].map((p, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#444', paddingBottom: 3 }}>{p}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: APPROVED PROJECTS ── */}
      {tab === 'approved' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ background: '#d5f5e3', borderRadius: 12, padding: '1rem 1.2rem', borderLeft: '4px solid #1e8449' }}>
              <div style={{ fontSize: 11, color: '#1e8449', fontWeight: 700, marginBottom: 4 }}>โครงการทั้งหมดที่ผ่านสภา</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1e8449' }}>16 โครงการ</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>ทำสัญญาแล้ว 15 | คงค้าง 1 โครงการ</div>
            </div>
            <div style={{ background: '#f5eef8', borderRadius: 12, padding: '1rem 1.2rem', borderLeft: '4px solid #6c3483' }}>
              <div style={{ fontSize: 11, color: '#6c3483', fontWeight: 700, marginBottom: 4 }}>งบประมาณรวมทั้งหมด</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#6c3483' }}>5,501,430.32 บาท</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>จ่ายขาดเงินสะสม ปีงบประมาณ 2568</div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: '#f8f9fa', borderBottom: '0.5px solid #dee2e6', fontSize: 13, fontWeight: 600, color: '#444' }}>
              รายการโครงการที่ได้รับอนุมัติ 16 โครงการ
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#1a5276', color: '#fff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 500, width: 40 }}>ที่</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 500 }}>โครงการ</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', fontWeight: 500, width: 60 }}>หมู่ที่</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 500, width: 130 }}>งบประมาณ (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedProjects.map((p, i) => (
                    <tr key={p.no} style={{ borderBottom: '0.5px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '8px 12px', textAlign: 'center', color: '#888' }}>{p.no}</td>
                      <td style={{ padding: '8px 12px', color: '#333', lineHeight: 1.5 }}>{p.name}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                        <span style={{ background: '#d6eaf8', color: '#1a5276', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                          {p.village}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#1a5276' }}>
                        {p.budget.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#1a5276', color: '#fff', fontWeight: 700 }}>
                    <td colSpan={3} style={{ padding: '10px 12px' }}>รวมงบประมาณทั้งหมด 16 โครงการ</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>5,501,430.32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}