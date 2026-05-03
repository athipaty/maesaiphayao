export default function BudgetPage() {
  const plans = [
    { label: 'แผนพัฒนา อบต.แม่ใส',              path: '#' },
    { label: 'การเปิดโอกาสให้เกิดการมีส่วนร่วม', path: '#' },
    { label: 'แผนดำเนินงาน',                     path: '#' },
    { label: 'ข้อบัญญัติงบประมาณรายจ่าย',        path: '/budget', active: true },
  ]

  const budgetItems = [
    { icon: '🏛️', label: 'งบกลาง',       amount: 16951402, pct: 40.4, color: '#3266ad' },
    { icon: '👥', label: 'งบบุคลากร',    amount: 14053460, pct: 33.5, color: '#0F6E56' },
    { icon: '⚙️', label: 'งบดำเนินงาน', amount: 9325238,  pct: 22.2, color: '#BA7517' },
    { icon: '🏗️', label: 'งบลงทุน',     amount: 841900,   pct: 2.0,  color: '#993556' },
    { icon: '🤝', label: 'งบอุดหนุน',   amount: 828000,   pct: 2.0,  color: '#888780' },
  ]

  const plans2 = [
    { name: 'งบกลาง',                               amount: 16951402 },
    { name: 'บริหารงานทั่วไป',                       amount: 12005998 },
    { name: 'เคหะและชุมชน',                          amount: 3797900 },
    { name: 'การศึกษา',                              amount: 3460200 },
    { name: 'สาธารณสุข',                             amount: 1972000 },
    { name: 'รักษาความสงบภายใน',                     amount: 1933000 },
    { name: 'สังคมสงเคราะห์',                        amount: 618000 },
    { name: 'ศาสนา วัฒนธรรม และนันทนาการ',           amount: 515000 },
    { name: 'อุตสาหกรรมและการโยธา',                 amount: 300000 },
    { name: 'การเกษตร',                              amount: 30000 },
  ]

  const TOTAL = 42000000

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 flex items-center gap-1.5">
        <a href="/" className="hover:text-secondary">หน้าหลัก</a>
        <span>›</span>
        <span className="text-gray-600">งานแผนและงบประมาณ</span>
        <span>›</span>
        <span className="text-gray-600">ข้อบัญญัติงบประมาณรายจ่าย</span>
      </nav>

      {/* Sub menu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(90deg, #e91e8c, #f06292)' }}>
          📋 งานแผนและงบประมาณ
        </div>
        <div className="divide-y divide-gray-50">
          {plans.map(item => (
            <a key={item.label} href={item.path}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                item.active
                  ? 'bg-pink-50 text-pink-700 font-medium border-l-4 border-pink-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}>
              <span className="text-xs" style={{ color: item.active ? '#e91e8c' : '#aaa' }}>▶</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-primary">ข้อบัญญัติงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. 2568</h1>
          <p className="text-sm text-gray-500 mt-1">องค์การบริหารส่วนตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา</p>
        </div>

        {/* Total */}
        <div className="px-6 py-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">งบประมาณรวมทั้งสิ้น</p>
            <p className="text-3xl font-bold mt-1">42,000,000 บาท</p>
          </div>
          <div className="text-5xl opacity-30">💰</div>
        </div>

        {/* Summary cards */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
            <p className="text-xs text-gray-500 mb-1">รายได้จัดเก็บเอง</p>
            <p className="text-sm font-bold text-primary">713,500</p>
            <p className="text-xs text-gray-400">บาท (1.7%)</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
            <p className="text-xs text-gray-500 mb-1">ภาษีจัดสรรจากรัฐ</p>
            <p className="text-sm font-bold text-primary">18,756,600</p>
            <p className="text-xs text-gray-400">บาท (44.7%)</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-1">เงินอุดหนุนจากรัฐ</p>
            <p className="text-sm font-bold text-primary">22,529,900</p>
            <p className="text-xs text-gray-400">บาท (53.6%)</p>
          </div>
        </div>
      </div>

      {/* งบตามหมวด */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📊 สัดส่วนงบประมาณรายจ่ายตามหมวด</h2>
        </div>
        <div className="p-5 space-y-4">
          {budgetItems.map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.color }}>{item.pct}%</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.amount.toLocaleString()} บ.</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* งบตามแผนงาน */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📋 งบประมาณรายจ่ายตามแผนงาน</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2.5 text-left text-primary font-semibold">แผนงาน</th>
                <th className="px-4 py-2.5 text-right text-primary font-semibold">จำนวนเงิน (บาท)</th>
                <th className="px-4 py-2.5 text-right text-primary font-semibold">ร้อยละ</th>
              </tr>
            </thead>
            <tbody>
              {plans2.map((item, i) => (
                <tr key={item.name} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-2.5 text-gray-700">{item.name}</td>
                  <td className="px-4 py-2.5 text-right text-gray-800 font-medium">{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{(item.amount / TOTAL * 100).toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-bold">
                <td className="px-4 py-2.5 text-primary">รวมทั้งสิ้น</td>
                <td className="px-4 py-2.5 text-right text-primary">{TOTAL.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-primary">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* เปรียบเทียบ 3 ปี */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📈 เปรียบเทียบงบประมาณ 3 ปี</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { year: '2566', amount: '33.85 ล้าน', change: '' },
              { year: '2567', amount: '40.00 ล้าน', change: '+18.2%' },
              { year: '2568', amount: '42.00 ล้าน', change: '+5.0%' },
            ].map(item => (
              <div key={item.year} className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">ปี {item.year}</p>
                <p className="text-base font-bold text-primary">{item.amount}</p>
                {item.change && <p className="text-xs text-green-600 font-medium mt-0.5">{item.change}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { label: 'ปี 2566', amount: 33853125, max: 42000000, color: '#b0c4de' },
              { label: 'ปี 2567', amount: 40000000, max: 42000000, color: '#6495ed' },
              { label: 'ปี 2568', amount: 42000000, max: 42000000, color: '#3266ad' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 flex-shrink-0">{item.label}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${item.amount / item.max * 100}%`, background: item.color }}>
                    <span className="text-white text-xs font-bold" style={{ fontSize: '10px' }}>{(item.amount/1000000).toFixed(2)}ล.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">📄 ดาวน์โหลดเอกสารฉบับเต็ม</p>
          <p className="text-xs text-gray-500 mt-0.5">ข้อบัญญัติงบประมาณรายจ่าย พ.ศ. 2568 (PDF)</p>
        </div>
        <a href="#" className="text-xs bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          ดาวน์โหลด
        </a>
      </div>

    </div>
  )
}