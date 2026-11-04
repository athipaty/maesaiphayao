// Shared by BudgetPage.jsx (public) and admin/AdminBudget.jsx (admin form) — kept in its own
// module, separate from the admin page, so the public bundle never pulls in admin-only code.
// This is the ข้อบัญญัติงบประมาณ พ.ศ. 2570 data (computed from the "B_RegulationExpense.xlsx"
// ประมาณการรายจ่าย export), used as the starting point for both until an admin saves an edit.
export const DEFAULT_BUDGET_DATA = {
  fiscalYear: '2570',
  categories: [
    { icon: '🏛️', label: 'งบกลาง',       amount: 19382222, color: '#3266ad' },
    { icon: '👥', label: 'งบบุคลากร',    amount: 14749160, color: '#0F6E56' },
    { icon: '⚙️', label: 'งบดำเนินงาน', amount: 10210518, color: '#BA7517' },
    { icon: '🏗️', label: 'งบลงทุน',     amount: 180100,   color: '#993556' },
    { icon: '🤝', label: 'งบอุดหนุน',   amount: 978000,   color: '#888780' },
  ],
  plans: [
    { name: 'งบกลาง', amount: 19382222 },
    { name: 'บริหารงานทั่วไป', amount: 12532778 },
    { name: 'เคหะและชุมชน', amount: 4185100 },
    { name: 'การศึกษา', amount: 3162400 },
    { name: 'รักษาความสงบภายใน', amount: 2358000 },
    { name: 'สาธารณสุข', amount: 2183000 },
    { name: 'การศาสนา วัฒนธรรม และนันทนาการ', amount: 580000 },
    { name: 'สังคมสงเคราะห์', amount: 545000 },
    { name: 'สร้างความเข้มแข็งของชุมชน', amount: 421500 },
    { name: 'อุตสาหกรรมและการโยธา', amount: 120000 },
    { name: 'การเกษตร', amount: 30000 },
  ],
  // No ประมาณการรายรับ (revenue) report has been provided yet for ปี 2570 — left empty rather
  // than guessing a breakdown; fill in once that document is available.
  revenue: [],
  yearComparison: [
    { year: '2568', amount: 42000000 },
    { year: '2570', amount: 45500000 },
  ],
  pdfUrl: '',
}
