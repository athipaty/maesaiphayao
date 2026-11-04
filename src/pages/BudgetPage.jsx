import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getSettings } from '../services/api'
import { DEFAULT_BUDGET_DATA } from '../utils/budgetDefaults'

export default function BudgetPage() {
  // Falls back to the same ปี 2570 data the admin form starts from until an admin has actually
  // saved something via หน้าแอดมิน → งบประมาณ, so the page never shows an empty/broken state.
  const [data, setData] = useState(DEFAULT_BUDGET_DATA)

  useEffect(() => {
    getSettings()
      .then(r => { if (r?.data?.budgetData) setData(r.data.budgetData) })
      .catch(() => {})
  }, [])

  const { fiscalYear, categories, plans, revenue, yearComparison, pdfUrl } = data
  const total = categories.reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const maxYearAmount = Math.max(1, ...yearComparison.map(y => Number(y.amount) || 0))

  return (
    <div className="space-y-4">

      <PageHeader icon="📋" title={`ข้อบัญญัติงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. ${fiscalYear}`}
        desc={`งบประมาณรายจ่ายประจำปีขององค์การบริหารส่วนตำบลแม่ใส อำเภอเมืองพะเยา จังหวัดพะเยา วงเงินรวมทั้งสิ้น ${total.toLocaleString()} บาท`} />

      {/* Budget summary */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Total */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">งบประมาณรวมทั้งสิ้น</p>
            <p className="text-xl sm:text-3xl font-bold mt-1">{total.toLocaleString()} บาท</p>
          </div>
          <div className="text-4xl sm:text-5xl opacity-30 hidden sm:block">💰</div>
        </div>

        {/* Revenue breakdown — only shown once an admin has entered it */}
        {revenue.length > 0 && (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {revenue.map((r, i) => (
              <div key={i} className={`rounded-lg p-3 text-center border ${i % 3 === 0 ? 'bg-blue-50 border-blue-100' : i % 3 === 1 ? 'bg-green-50 border-green-100' : 'bg-purple-50 border-purple-100'}`}>
                <p className="text-xs text-gray-500 mb-1">{r.label}</p>
                <p className="text-sm font-bold text-primary">{(Number(r.amount) || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400">บาท ({total ? ((Number(r.amount) || 0) / total * 100).toFixed(1) : 0}%)</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* งบตามหมวด */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-secondary px-5 py-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent rounded inline-block"></span>
          <h2 className="text-white font-bold text-sm">📊 สัดส่วนงบประมาณรายจ่ายตามหมวด</h2>
        </div>
        <div className="p-5 space-y-4">
          {categories.map(item => {
            const pct = total ? (Number(item.amount) || 0) / total * 100 : 0
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.color }}>{pct.toFixed(1)}%</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{(Number(item.amount) || 0).toLocaleString()} บ.</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }}></div>
                </div>
              </div>
            )
          })}
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
              {plans.map((item, i) => (
                <tr key={item.name} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-2.5 text-gray-700">{item.name}</td>
                  <td className="px-4 py-2.5 text-right text-gray-800 font-medium">{(Number(item.amount) || 0).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500">{total ? ((Number(item.amount) || 0) / total * 100).toFixed(1) : '0.0'}%</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-bold">
                <td className="px-4 py-2.5 text-primary">รวมทั้งสิ้น</td>
                <td className="px-4 py-2.5 text-right text-primary">{plans.reduce((s, p) => s + (Number(p.amount) || 0), 0).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-primary">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* เปรียบเทียบย้อนหลัง */}
      {yearComparison.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-secondary px-5 py-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded inline-block"></span>
            <h2 className="text-white font-bold text-sm">📈 เปรียบเทียบงบประมาณย้อนหลัง</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {yearComparison.map((item, i) => {
                const prev = yearComparison[i - 1]
                const change = prev && Number(prev.amount) ? ((Number(item.amount) - Number(prev.amount)) / Number(prev.amount) * 100) : null
                return (
                  <div key={item.year} className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-gray-500 mb-1">ปี {item.year}</p>
                    <p className="text-base font-bold text-primary">{((Number(item.amount) || 0) / 1000000).toFixed(2)} ล้าน</p>
                    {change !== null && (
                      <p className={`text-xs font-medium mt-0.5 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="space-y-2">
              {yearComparison.map((item, i) => (
                <div key={item.year} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">ปี {item.year}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(Number(item.amount) || 0) / maxYearAmount * 100}%`, background: `hsl(216, ${45 + i * 10}%, ${55 - i * 6}%)` }}>
                      <span className="text-white text-xs font-bold" style={{ fontSize: '10px' }}>{((Number(item.amount) || 0) / 1000000).toFixed(2)}ล.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Download — only shown once an admin has set a real link */}
      {pdfUrl && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">📄 ดาวน์โหลดเอกสารฉบับเต็ม</p>
            <p className="text-xs text-gray-500 mt-0.5">ข้อบัญญัติงบประมาณรายจ่าย พ.ศ. {fiscalYear}</p>
          </div>
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-xs bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            ดาวน์โหลด
          </a>
        </div>
      )}

    </div>
  )
}
