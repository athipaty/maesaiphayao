// ข้อบัญญัติงบประมาณรายจ่าย ประจำปีงบประมาณ พ.ศ. 2568
// ปรับให้ตรง pattern กับ DevelopmentPlanPage / ParticipationPage / ActionPlanPage

import { useState } from 'react'

const TOTAL = 42000000

const budgetByType = [
  { icon: '🏛️', label: 'งบกลาง',       amount: 16951402, pct: 40.4, color: '#1a5276', bg: '#d6eaf8' },
  { icon: '👥', label: 'งบบุคลากร',    amount: 14053460, pct: 33.5, color: '#1e8449', bg: '#d5f5e3' },
  { icon: '⚙️', label: 'งบดำเนินงาน', amount: 9325238,  pct: 22.2, color: '#784212', bg: '#fdebd0' },
  { icon: '🏗️', label: 'งบลงทุน',     amount: 841900,   pct: 2.0,  color: '#6c3483', bg: '#f5eef8' },
  { icon: '🤝', label: 'งบอุดหนุน',   amount: 828000,   pct: 2.0,  color: '#0e6655', bg: '#d1f2eb' },
]

const budgetByPlan = [
  { name: 'งบกลาง',                             amount: 16951402 },
  { name: 'บริหารงานทั่วไป',                     amount: 12005998 },
  { name: 'เคหะและชุมชน',                        amount: 3797900 },
  { name: 'การศึกษา',                            amount: 3460200 },
  { name: 'สาธารณสุข',                           amount: 1972000 },
  { name: 'รักษาความสงบภายใน',                   amount: 1933000 },
  { name: 'สังคมสงเคราะห์',                      amount: 618000 },
  { name: 'ศาสนา วัฒนธรรม และนันทนาการ',         amount: 515000 },
  { name: 'อุตสาหกรรมและการโยธา',               amount: 300000 },
  { name: 'การเกษตร',                            amount: 30000 },
]

const revenue = [
  { label: 'รายได้จัดเก็บเอง',       amount: 713500,   pct: 1.7,  color: '#1a5276', bg: '#d6eaf8' },
  { label: 'ภาษีจัดสรรจากรัฐ',      amount: 18756600,  pct: 44.7, color: '#1e8449', bg: '#d5f5e3' },
  { label: 'เงินอุดหนุนจากรัฐ',     amount: 22529900,  pct: 53.6, color: '#6c3483', bg: '#f5eef8' },
]

const yearCompare = [
  { year: '2566', amount: 33853125, change: null },
  { year: '2567', amount: 40000000, change: '+18.2%' },
  { year: '2568', amount: 42000000, change: '+5.0%' },
]

function fmtFull(n) {
  return n.toLocaleString('th-TH')
}
function fmtM(n) {
  return (n / 1000000).toFixed(2) + ' ล้าน'
}

export default function BudgetPage() {
  const [tab, setTab] = useState('overview')

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", color: '#2c3e50', lineHeight: 1.7 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1a5276 0%,#2980b9 100%)',
        color: '#fff', padding: '1.5rem 2rem',
        borderRadius: '0 0 16px 16px', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
          อบต.แม่ใส &rsaquo; งานแผนและงบประมาณ &rsaquo; ข้อบัญญัติงบประมาณรายจ่าย
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
          ข้อบัญญัติงบประมาณรายจ่าย ประจำปีงบประมาณ พ.ศ. 2568
        </h1>
        <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
          องค์การบริหารส่วนตำบลแม่ใส อ.เมืองพะเยา จ.พะเยา
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'งบประมาณรวมทั้งสิ้น',  value: '42,000,000 บาท',  sub: 'ปีงบประมาณ 2568',       color: '#1a5276', bg: '#d6eaf8' },
          { label: 'รายได้จัดเก็บเอง',     value: '713,500 บาท',     sub: '1.7% ของงบประมาณ',      color: '#1e8449', bg: '#d5f5e3' },
          { label: 'ภาษีจัดสรรจากรัฐ',    value: '18,756,600 บาท',  sub: '44.7% ของงบประมาณ',     color: '#784212', bg: '#fdebd0' },
          { label: 'เงินอุดหนุนจากรัฐ',   value: '22,529,900 บาท',  sub: '53.6% ของงบประมาณ',     color: '#6c3483', bg: '#f5eef8' },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 12, padding: '1rem 1.2rem', borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {[
          { key: 'overview', label: 'ภาพรวม' },
          { key: 'bytype',   label: 'งบตามหมวด' },
          { key: 'byplan',   label: 'งบตามแผนงาน' },
          { key: 'compare',  label: 'เปรียบเทียบ 3 ปี' },
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
        <div style={{ display: 'grid', gap: 12 }}>

          {/* รายได้ 3 ประเภท */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>โครงสร้างรายได้</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {revenue.map((r, i) => (
                <div key={i} style={{ background: r.bg, borderRadius: 10, padding: '1rem', borderLeft: `4px solid ${r.color}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: r.color, fontWeight: 700, marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: r.color }}>{fmtM(r.amount)}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{r.pct}% ของงบประมาณ</div>
                </div>
              ))}
            </div>
          </div>

          {/* สัดส่วนงบตามหมวด (mini) */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 12 }}>สัดส่วนงบประมาณตามหมวด</div>
            {/* stacked bar */}
            <div style={{ display: 'flex', height: 24, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              {budgetByType.map((b, i) => (
                <div key={i} style={{ width: `${b.pct}%`, background: b.color }} title={`${b.label} ${b.pct}%`} />
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
              {budgetByType.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: b.color, flexShrink: 0 }} />
                  <span style={{ color: '#555' }}>{b.icon} {b.label}</span>
                  <span style={{ fontWeight: 700, color: b.color }}>{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download */}
          <div style={{ background: '#d6eaf8', border: '0.5px solid #aed6f1', borderRadius: 12, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a5276' }}>📄 ดาวน์โหลดเอกสารฉบับเต็ม</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>ข้อบัญญัติงบประมาณรายจ่าย พ.ศ. 2568 (PDF)</div>
            </div>
            <a href="#" style={{
              background: '#1a5276', color: '#fff', padding: '8px 18px',
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'opacity 0.2s',
            }}>ดาวน์โหลด</a>
          </div>
        </div>
      )}

      {/* ── TAB: BY TYPE ── */}
      {tab === 'bytype' && (
        <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
            งบประมาณรายจ่ายตามหมวด — รวม {fmtFull(TOTAL)} บาท
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {budgetByType.map((b, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{b.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#2c3e50' }}>{b.label}</span>
                    <span style={{ background: b.bg, color: b.color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                      {b.pct}%
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: b.color }}>{fmtFull(b.amount)} บาท</span>
                </div>
                <div style={{ height: 12, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 6, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: BY PLAN ── */}
      {tab === 'byplan' && (
        <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: '#f8f9fa', borderBottom: '0.5px solid #dee2e6', fontSize: 13, fontWeight: 600, color: '#444' }}>
            งบประมาณรายจ่ายตามแผนงาน
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#1a5276', color: '#fff' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500 }}>แผนงาน</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>จำนวนเงิน (บาท)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>ร้อยละ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 500, width: 140 }}>สัดส่วน</th>
                </tr>
              </thead>
              <tbody>
                {budgetByPlan.map((item, i) => {
                  const pct = (item.amount / TOTAL * 100).toFixed(1)
                  return (
                    <tr key={i} style={{ borderBottom: '0.5px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '10px 16px', color: '#333' }}>{item.name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a5276' }}>
                        {fmtFull(item.amount)}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#888' }}>{pct}%</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ height: 8, background: '#eaf0fb', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#2980b9', borderRadius: 4 }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                <tr style={{ background: '#1a5276', color: '#fff', fontWeight: 700 }}>
                  <td style={{ padding: '10px 16px' }}>รวมทั้งสิ้น</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>{fmtFull(TOTAL)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>100%</td>
                  <td style={{ padding: '10px 12px' }} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: COMPARE ── */}
      {tab === 'compare' && (
        <div style={{ display: 'grid', gap: 12 }}>
          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {yearCompare.map((y, i) => (
              <div key={i} style={{
                background: i === 2 ? '#d6eaf8' : '#f8f9fa',
                border: `0.5px solid ${i === 2 ? '#aed6f1' : '#dee2e6'}`,
                borderRadius: 12, padding: '1.2rem', textAlign: 'center',
                borderLeft: i === 2 ? '4px solid #1a5276' : '4px solid #ccc',
              }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>ปีงบประมาณ {y.year}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: i === 2 ? '#1a5276' : '#555' }}>
                  {fmtM(y.amount)}
                </div>
                {y.change && (
                  <div style={{ fontSize: 12, color: '#1e8449', fontWeight: 700, marginTop: 4 }}>
                    📈 {y.change} จากปีก่อน
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ background: '#fff', border: '0.5px solid #dee2e6', borderRadius: 12, padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>เปรียบเทียบงบประมาณ 3 ปี</div>
            {yearCompare.map((y, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: i === 2 ? '#1a5276' : '#555' }}>ปี {y.year}</span>
                  <span style={{ color: '#1a5276', fontWeight: 600 }}>{fmtFull(y.amount)} บาท</span>
                </div>
                <div style={{ height: 20, background: '#eaf0fb', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(y.amount / 42000000) * 100}%`,
                    height: '100%',
                    background: i === 0 ? '#aed6f1' : i === 1 ? '#5dade2' : '#1a5276',
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                    transition: 'width 0.5s',
                  }}>
                    <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{fmtM(y.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{ background: '#d5f5e3', border: '0.5px solid #a9dfbf', borderRadius: 12, padding: '1rem 1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e8449', marginBottom: 4 }}>📊 สรุป</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
              งบประมาณเพิ่มขึ้นอย่างต่อเนื่องจาก 33.85 ล้านบาท (ปี 2566) สู่ 42.00 ล้านบาท (ปี 2568) คิดเป็นการเติบโตรวม <strong style={{ color: '#1e8449' }}>+24.1%</strong> ใน 3 ปี
            </div>
          </div>
        </div>
      )}
    </div>
  )
}