import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const villages = [
  { no:1,  people:30,  projects:5 }, { no:2,  people:39,  projects:5 },
  { no:3,  people:43,  projects:4 }, { no:4,  people:55,  projects:5 },
  { no:5,  people:56,  projects:5 }, { no:6,  people:30,  projects:5 },
  { no:7,  people:30,  projects:3 }, { no:8,  people:31,  projects:5 },
  { no:9,  people:40,  projects:5 }, { no:10, people:35,  projects:5 },
  { no:11, people:45,  projects:3 }, { no:12, people:42,  projects:5 },
]

const proposedProjects = {
  1:  ['ก่อสร้างท่าเรือหลวงหมู่ที่ 1 บ้านร่องไฮ','ก่อสร้างแหล่งชมทุ่งดอกบัวแดง','ติดตั้งไฟโซล่าเซลล์ถนนสายโบราณสถาน','ขุดลอกลำห้วยร่องไฮ','ก่อสร้างรางระบายน้ำ คสล.แบบมีฝาปิด'],
  2:  ['ก่อสร้างฝายน้ำล้น ห้วยร่องใส (ฝายพ่อพูล)','ซ่อมแซมประตูน้ำ ฝายหน้ากรีนวิงส์ แม่ใส','ขุดลอกร่องแหย่งจากหลังวัดแม่ใสถึงซอย 7','ปรับปรุงดาดคอนกรีตถนนสายการเกษตรเลียงร่องเปา','ก่อสร้างรางระบายน้ำ คสล.แบบมีฝาปิด ซอย 2'],
  3:  ['อุดหนุนการประปาส่วนภูมิภาค','เสริมท่อ ขยายถนน เสริมหูช้างข้างศูนย์พัฒนาเด็กเล็ก','ปรับปรุงถนน คสล.ซอยข้างบ้านนายประเสริฐ คำเผ่า','ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ช่วงที่ 3'],
  4:  ['ก่อสร้างเตาเผาศพ (แบบถ่าน)','ปรับปรุงถนน คสล.บ้านนายรพ ขันคำ และบ้านนายมิตร ไทยใหม่','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 5','ปรับปรุงรางระบายน้ำแบบมีฝาปิด หน้า รพ.สต.แม่ใส','ปรับปรุงถนน บ้านนายครรชิต จุมปา'],
  5:  ['ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด (หอกระจายข่าว–สามแยกมินิมาร์ท)','ขยายเขตน้ำดี ซอย 5 และซอย 8','ปรับปรุงคลองทุกสาย ในหมู่บ้าน','เทดาดคอนกรีต ข้างบ้านนางผ่อง โคดี–ข้างบ้านนายนิตย์ บุญยืน','ติดกล้องวงจรปิด จุดเสี่ยง'],
  6:  ['ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ซอย 4','ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ซอย 4 ช่วงที่ 1–2','ขุดลอกลำเหมือง หมู่ที่ 6','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 1','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ข้างวัดสันป่าถ่อน'],
  7:  ['ปรับปรุงระบบประปาหมู่บ้าน','ติดตั้งไฟโซล่าเซลล์ท่าเรือโบราณ','ปรับปรุงรางระบายน้ำแบบมีฝาปิด (3 แยกทางไปกว๊านพะเยา)'],
  8:  ['เจาะบ่อบาดาล','ก่อสร้างประปาหอถังสูง','ปรับปรุงถนน คสล.ซอยบ้านนางลออ มหาวรรณศรี','ปรับปรุงรางระบายน้ำแบบมีฝาปิด สายปฏิบัติธรรม','ขุดลอกลำห้วยร่องเปา'],
  9:  ['ปรับปรุงถนนสายการเกษตร (สายเข้าเสี้ยวบ้าน)','ปรับปรุงราง คสล.ฝาปิด (ปากทางซอย 4–บ้าน รตต.อดุล อุตะมะ)','เทดาดคอนกรีตน้ำลงกว๊าน (หมู่ 9–ม.4)','ปรับปรุงรางระบายน้ำทุ่งป่าตาล','ปรับปรุงถนนสายการเกษตร'],
  10: ['แก้ไขปัญหาน้ำท่วม ซอย 7','ปรับปรุงราง คสล.ฝาปิดหน้าบ้าน รตท.วิรัตน์–ทางเข้าป่าสุสาน','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 11','ปรับปรุงรางระบายน้ำแบบมีฝาปิด ซอย 9','ก่อสร้างพนังคอนกรีตเหมืองสันทราย'],
  11: ['ก่อสร้างถนน คสล. หมู่ที่ 11 เชื่อมตำบลแม่ต๋ำ','ปรับปรุงน้ำประปาหมู่บ้าน','ขุดลอกลำเหมือง หน้าก๋วยเตี๋ยวบ้านภู–กว๊านพะเยา'],
  12: ['ก่อสร้างเตาเผา (ถ่าน)','ปรับปรุงราง คสล.ฝาปิดหน้าบ้านนายดำรง คำเผ่า','ปรับปรุงไหล่ทาง คสล.ถนนภายในหมู่บ้าน หมู่ 12','ปรับปรุงดาดคอนกรีตหลังบ้านนายเปี๊ยก บ้านทุ่ง ต่อไปอีก 100 ม.','ถนน คสล.หลัง อบต.'],
}

const approvedProjects = [
  { no:1,  name:'ปรับปรุงถนน ค.ส.ล. บ้านร่องไฮ หมู่ที่ 1',                                          village:1,  budget:238613.38 },
  { no:2,  name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 2 บ้านแม่ใสกลาง หมู่ที่ 2',               village:2,  budget:313733.61 },
  { no:3,  name:'ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ทางหลวงท้องถิ่น สายบ้านทุ่งวัวแดง (ช่วงที่1) หมู่ที่ 3', village:3, budget:356462.18 },
  { no:4,  name:'ปรับปรุงถนน คสล. บ้านทุ่งวัวแดง หมู่ที่ 3',                                          village:3,  budget:106672.89 },
  { no:5,  name:'ปรับปรุงถนนสายการเกษตร บ้านทุ่งวัวแดง หมู่ที่ 3',                                    village:3,  budget:484802.17 },
  { no:6,  name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด บ้านแม่ใสเหล่า หมู่ที่ 4',                     village:4,  budget:469931.77 },
  { no:7,  name:'ปรับปรุงรางระบายน้ำ คสล.แบบมีฝาปิด ทางหลวงท้องถิ่น สายบ้านบ่อแฮว หมู่ที่ 5',        village:5,  budget:478324.82 },
  { no:8,  name:'ขุดลอกลำเหมืองห้วยลึก บ้านบ่อแฮว หมู่ที่ 5',                                         village:5,  budget:34183.08  },
  { no:9,  name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 2 บ้านสันป่าถ่อน หมู่ที่ 6',               village:6,  budget:419669.33 },
  { no:10, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 2 บ้านสันป่าถ่อน หมู่ที่ 6 (ช่วงที่ 2)',   village:6,  budget:478324.82 },
  { no:11, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด บ้านสันช้างหิน หมู่ที่ 7',                      village:7,  budget:472085.58 },
  { no:12, name:'ปรับปรุงถนน ค.ส.ล. ซอยบ้านนายสุพจน์ ยะตา บ้านแม่ใสหัวขัว หมู่ที่ 8',               village:8,  budget:328556.29 },
  { no:13, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 4 บ้านแม่ใสเหนือ หมู่ที่ 9',              village:9,  budget:270354.73 },
  { no:14, name:'ปรับปรุงรางระบายน้ำ ค.ส.ล.แบบมีฝาปิด ซอย 7 บ้านสันป่าถ่อน หมู่ที่ 10',             village:10, budget:438775.37 },
  { no:15, name:'ปรับปรุงถนน ค.ส.ล. ซอยสันกลาง (ช่วงที่1) หมู่ที่ 11',                               village:11, budget:472615.17 },
  { no:16, name:'ปรับปรุงไหล่ทาง ค.ส.ล. ทางหลวงท้องถิ่น สายบ้านแม่ใสเหล่าใต้ หมู่ที่ 12',           village:12, budget:346090.10 },
]

const maxPeople = Math.max(...villages.map(v => v.people))

export default function ParticipationPage() {
  const [tab, setTab] = useState('overview')
  const [selectedVillage, setSelectedVillage] = useState(null)

  return (
    <div className="space-y-4">

      <PageHeader icon="🤝" title="การเปิดโอกาสให้เกิดการมีส่วนร่วม พ.ศ. 2568"
        desc="โครงการ อบต.แม่ใสพบประชาชน ประจำปี 2568 จัดประชุมรับฟังความคิดเห็น 12–14 ตุลาคม 2567 ครบ 12 หมู่บ้าน" />

      {/* Participation summary */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">งบประมาณโครงการที่ได้รับอนุมัติ</p>
            <p className="text-xl sm:text-3xl font-bold mt-1">5,501,430.32 บาท</p>
          </div>
          <div className="text-4xl sm:text-5xl opacity-30 hidden sm:block">🤝</div>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'ผู้เข้าร่วมทั้งหมด',      value:'476 คน',        sub:'12 หมู่บ้าน',              color:'bg-blue-50 border-blue-100 text-primary' },
            { label:'โครงการที่เสนอ',          value:'55 โครงการ',    sub:'เห็นชอบ 100%',            color:'bg-green-50 border-green-100 text-green-700' },
            { label:'โครงการที่อนุมัติ',       value:'16 โครงการ',    sub:'จ่ายขาดเงินสะสม ปี 2568', color:'bg-orange-50 border-orange-100 text-orange-700' },
            { label:'ทำสัญญาแล้ว',             value:'15 โครงการ',    sub:'คงค้าง 1 โครงการ',        color:'bg-purple-50 border-purple-100 text-purple-700' },
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
          { key:'overview',  label:'📊 ภาพรวม' },
          { key:'proposed',  label:'📋 โครงการที่เสนอ (55)' },
          { key:'approved',  label:'✅ โครงการที่อนุมัติ (16)' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'bg-pink-50 text-primary hover:bg-blue-100'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {tab === 'overview' && (
        <>
          {/* Process */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">🔄 กระบวนการมีส่วนร่วม</h2>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-0 overflow-x-auto justify-center">
                {[
                  { step:'1', label:'จัดประชุมประชาคม', detail:'12–14 ต.ค. 2567\nอาคารอเนกประสงค์' },
                  { step:'2', label:'รับข้อเสนอ',        detail:'476 คน\n55 โครงการ' },
                  { step:'3', label:'กองช่างสำรวจ',       detail:'สำรวจพื้นที่\nคำนวณราคากลาง' },
                  { step:'4', label:'อนุมัติสภา อบต.',    detail:'16 โครงการ\nเข้าสู่แผนพัฒนา' },
                  { step:'5', label:'ดำเนินการ',          detail:'ทำสัญญา 15\nโครงการ' },
                ].map((s, i, arr) => (
                  <div key={i} className="flex items-center flex-shrink-0">
                    <div className="text-center w-28">
                      <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-base flex items-center justify-center mx-auto mb-2">{s.step}</div>
                      <p className="text-xs font-semibold text-primary">{s.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 whitespace-pre-line">{s.detail}</p>
                    </div>
                    {i < arr.length - 1 && <span className="text-gray-300 text-xl mx-1 flex-shrink-0">›</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Village bar chart */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">👥 จำนวนผู้เข้าร่วมแต่ละหมู่บ้าน</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {villages.map(v => (
                  <div key={v.no} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary w-14 flex-shrink-0">หมู่ {v.no}</span>
                    <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary/70"
                        style={{ width: `${(v.people / maxPeople) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-primary w-6 text-right">{v.people}</span>
                    <span className="text-xs text-gray-400">({v.projects})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── TAB: PROPOSED ── */}
      {tab === 'proposed' && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-400 mb-2">กรองตามหมู่บ้าน:</p>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setSelectedVillage(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!selectedVillage ? 'bg-primary text-white' : 'bg-pink-50 text-primary hover:bg-blue-100'}`}>
                ทั้งหมด
              </button>
              {villages.map(v => (
                <button key={v.no} onClick={() => setSelectedVillage(v.no)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedVillage === v.no ? 'bg-primary text-white' : 'bg-pink-50 text-primary hover:bg-blue-100'}`}>
                  หมู่ {v.no}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {(selectedVillage ? villages.filter(v => v.no === selectedVillage) : villages).map(v => (
              <div key={v.no} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-secondary px-5 py-2.5 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">หมู่ที่ {v.no}</h3>
                  <div className="flex gap-2">
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{v.people} คน</span>
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{v.projects} โครงการ</span>
                  </div>
                </div>
                <ol className="p-4 space-y-1.5 list-decimal list-inside">
                  {proposedProjects[v.no].map((p, i) => (
                    <li key={i} className="text-sm text-gray-700">{p}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB: APPROVED ── */}
      {tab === 'approved' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs text-gray-500 mb-1">โครงการที่ผ่านสภา</p>
              <p className="text-2xl font-bold text-green-700">16 โครงการ</p>
              <p className="text-xs text-gray-400 mt-0.5">ทำสัญญาแล้ว 15 | คงค้าง 1</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="text-xs text-gray-500 mb-1">งบประมาณรวมทั้งหมด</p>
              <p className="text-2xl font-bold text-purple-700">5,501,430.32</p>
              <p className="text-xs text-gray-400 mt-0.5">บาท (จ่ายขาดเงินสะสม ปี 2568)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary px-5 py-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded inline-block"></span>
              <h2 className="text-white font-bold text-sm">📋 รายการโครงการที่ได้รับอนุมัติ 16 โครงการ</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2.5 text-center text-primary font-semibold w-10">ที่</th>
                    <th className="px-4 py-2.5 text-left text-primary font-semibold">โครงการ</th>
                    <th className="px-4 py-2.5 text-center text-primary font-semibold w-16">หมู่ที่</th>
                    <th className="px-4 py-2.5 text-right text-primary font-semibold whitespace-nowrap">งบประมาณ (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedProjects.map((p, i) => (
                    <tr key={p.no} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-2.5 text-center text-gray-400">{p.no}</td>
                      <td className="px-4 py-2.5 text-gray-700">{p.name}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{p.village}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-primary">{p.budget.toLocaleString('th-TH', { minimumFractionDigits:2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/10 font-bold">
                    <td colSpan={3} className="px-4 py-2.5 text-primary">รวมงบประมาณทั้งหมด 16 โครงการ</td>
                    <td className="px-4 py-2.5 text-right text-primary">5,501,430.32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}