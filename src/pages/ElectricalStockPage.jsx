import { useState, useEffect, useMemo } from 'react'
import {
  getStockItems, createStockItem, updateStockItem, deleteStockItem,
  getStockTransactions, createStockTransaction, deleteStockTransaction,
  loginAdmin, verifyAdmin, logoutAdmin,
  getSettings, updateSetting,
} from '../services/api'

const EMPTY_ITEM = { code: '', name: '', unit: '', unitPrice: '', balance: '' }
const EMPTY_TXN  = { itemId: '', type: 'จ่าย', qty: '', party: '', docNo: '', date: '', note: '', unitPrice: '' }

// Default signers shown on the printed "รายงานวัสดุคงเหลือ" report — editable
// by admins, saved server-side under the "stockReportSigners" setting since
// staff in these positions change over time.
const REPORT_SIGNERS_SETTING_KEY = 'stockReportSigners'
const DEFAULT_REPORT_SIGNERS = [
  { name: 'นายจิตรกร  แปงมูล', position: 'นายช่างไฟฟ้าชำนาญงาน' },
  { name: 'นายประวิทย์  อาจหาญ', position: 'ผู้อำนวยการกองช่าง' },
]

function money2(n) {
  return (n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function thaiDateShort(dateInput) {
  const d = new Date(dateInput)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543}`
}

const NAV = [
  { key: 'dashboard', icon: '🏠', label: 'แดชบอร์ด' },
  { key: 'registry',  icon: '📋', label: 'ทะเบียนวัสดุ' },
  { key: 'history',   icon: '🧾', label: 'ประวัติรับ-จ่าย' },
  { key: 'summary',   icon: '📈', label: 'รายงานประจำปี' },
]

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// Thai fiscal year (Buddhist): Oct 1 - Sep 30. Oct-Dec belongs to the *next* fiscal year.
function fiscalYearOf(dateInput) {
  const d = new Date(dateInput)
  const buddhist = d.getFullYear() + 543
  return d.getMonth() >= 9 ? buddhist + 1 : buddhist
}
function fiscalYearEnd(fy) {
  return new Date(fy - 543, 8, 30, 23, 59, 59, 999) // Sep 30, end of day
}

// For a given item, reconstruct opening balance / received / withdrawn / closing balance
// for a fiscal year, purely from that item's transaction history (sorted by date).
function computeItemYear(item, itemTxns, fy) {
  const prevEnd = fiscalYearEnd(fy - 1)
  const yearEnd = fiscalYearEnd(fy)
  const sorted = itemTxns.slice().sort((a, b) => new Date(a.date) - new Date(b.date))
  const beforeYear = sorted.filter(t => new Date(t.date) <= prevEnd)
  const withinYear = sorted.filter(t => { const dt = new Date(t.date); return dt > prevEnd && dt <= yearEnd })

  let opening
  if (beforeYear.length) {
    opening = beforeYear[beforeYear.length - 1].balanceAfter
  } else if (sorted.length) {
    const first = sorted[0]
    opening = first.balanceAfter - (first.type === 'รับ' ? first.qty : -first.qty)
  } else {
    opening = item.balance || 0
  }

  const received  = withinYear.filter(t => t.type === 'รับ').reduce((s, t) => s + t.qty, 0)
  const withdrawn = withinYear.filter(t => t.type === 'จ่าย').reduce((s, t) => s + t.qty, 0)
  const closing = opening + received - withdrawn

  return { opening, received, withdrawn, closing }
}

export default function ElectricalStockPage() {
  const [isAdmin, setIsAdmin]   = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [pw, setPw]             = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('abt_token')
    if (!token) { setCheckingAuth(false); return }
    verifyAdmin(token)
      .then(r => { if (r.data.valid) setIsAdmin(true) })
      .catch(() => {})
      .finally(() => setCheckingAuth(false))
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginErr('')
    setLoggingIn(true)
    try {
      const r = await loginAdmin(pw)
      sessionStorage.setItem('abt_token', r.data.token)
      setIsAdmin(true)
      setPw('')
    } catch (err) {
      setLoginErr(err?.response?.status === 401 ? 'รหัสผ่านไม่ถูกต้อง' : 'ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่')
    } finally {
      setLoggingIn(false)
    }
  }

  function handleLogout() {
    const token = sessionStorage.getItem('abt_token')
    if (token) logoutAdmin(token).catch(() => {})
    sessionStorage.removeItem('abt_token')
    setIsAdmin(false)
  }

  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Live clock in the top bar — reinforces this is a live operational screen, not a static page
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const [items, setItems]   = useState([])
  const [txns, setTxns]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [itemModal, setItemModal]     = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [itemForm, setItemForm]       = useState(EMPTY_ITEM)
  const [itemSaving, setItemSaving]   = useState(false)

  const [txnModal, setTxnModal]   = useState(false)
  const [txnForm, setTxnForm]     = useState(EMPTY_TXN)
  const [txnSaving, setTxnSaving] = useState(false)
  const [txnError, setTxnError]   = useState('')

  const [confirmState, setConfirmState] = useState(null) // { title, message, confirmLabel, onConfirm }
  const [confirmBusy, setConfirmBusy]   = useState(false)

  const currentFY = fiscalYearOf(new Date())
  const [historyYear, setHistoryYear] = useState(currentFY)
  const [summaryYear, setSummaryYear] = useState(currentFY)
  const [hideZeroStock, setHideZeroStock] = useState(true)
  const [hideZeroRegistry, setHideZeroRegistry] = useState(true)

  const [printMode, setPrintMode] = useState(null) // null | 'report' | 'withdraw' | 'ledger'
  const [withdrawSelection, setWithdrawSelection] = useState(new Set())
  const [ledgerItem, setLedgerItem] = useState(null) // item whose full in/out history (บัญชีวัสดุ) is open

  const [signers, setSigners]           = useState(DEFAULT_REPORT_SIGNERS)
  const [signerModal, setSignerModal]   = useState(false)
  const [signerForm, setSignerForm]     = useState(DEFAULT_REPORT_SIGNERS)
  const [signerSaving, setSignerSaving] = useState(false)

  useEffect(() => {
    const onAfterPrint = () => setPrintMode(null)
    window.addEventListener('afterprint', onAfterPrint)
    return () => window.removeEventListener('afterprint', onAfterPrint)
  }, [])

  function triggerPrint(mode) {
    setPrintMode(mode)
    setTimeout(() => window.print(), 50)
  }

  function toggleWithdrawSelect(id) {
    setWithdrawSelection(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Editable report signers (who signs the printed report / withdraw slip) ──
  function openSignerModal() { setSignerForm(signers); setSignerModal(true) }
  function updateSignerField(idx, field, value) {
    setSignerForm(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }
  async function handleSaveSigners(e) {
    e.preventDefault()
    setSignerSaving(true)
    try {
      await updateSetting(REPORT_SIGNERS_SETTING_KEY, signerForm)
      setSigners(signerForm)
      setSignerModal(false)
    } catch (err) {
      alert(err?.response?.data?.error || 'บันทึกไม่สำเร็จ')
    } finally {
      setSignerSaving(false)
    }
  }

  async function runConfirm() {
    if (!confirmState) return
    setConfirmBusy(true)
    try { await confirmState.onConfirm() }
    finally { setConfirmBusy(false); setConfirmState(null) }
  }

  async function load() {
    setLoading(true)
    try {
      const [ri, rt, rs] = await Promise.all([
        getStockItems({ all: 1 }),
        getStockTransactions({ limit: 2000 }),
        getSettings().catch(() => null),
      ])
      setItems(ri?.data || [])
      setTxns(rt?.data || [])
      const savedSigners = rs?.data?.[REPORT_SIGNERS_SETTING_KEY]
      if (Array.isArray(savedSigners) && savedSigners.length === 2) setSigners(savedSigners)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = items
    if (q) list = list.filter(i => i.name.toLowerCase().includes(q) || String(i.code).includes(q))
    if (hideZeroRegistry) list = list.filter(i => (i.balance || 0) !== 0)
    return list
  }, [items, search, hideZeroRegistry])

  const totalValue = useMemo(() => items.reduce((s, i) => s + (i.balance || 0) * (i.unitPrice || 0), 0), [items])
  const lowStockItems = useMemo(() => items.filter(i => (i.balance || 0) <= 0), [items])
  const lowStockCount = lowStockItems.length

  // ── Dashboard-only derived data ─────────────────────────────────────────
  const recentTxns = useMemo(() =>
    txns.slice().sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 8),
    [txns])
  const todayTxnCount = useMemo(() => txns.filter(t => (t.date || '').slice(0, 10) === todayStr()).length, [txns])

  // ── Years available for the dropdowns (from transaction dates + current FY, always) ──
  const availableYears = useMemo(() => {
    const set = new Set([currentFY])
    txns.forEach(t => set.add(fiscalYearOf(t.date)))
    set.add(summaryYear)
    set.add(historyYear)
    return Array.from(set).sort((a, b) => b - a)
  }, [txns, currentFY, summaryYear, historyYear])

  const historyFiltered = useMemo(() => txns.filter(t => fiscalYearOf(t.date) === historyYear), [txns, historyYear])

  useEffect(() => { setWithdrawSelection(new Set()) }, [historyYear])

  const selectedWithdrawRows = useMemo(
    () => historyFiltered.filter(t => t.type === 'จ่าย' && withdrawSelection.has(t._id)),
    [historyFiltered, withdrawSelection]
  )

  // Full in/out history for one item (บัญชีวัสดุ) — oldest first, running balance from each txn
  const ledgerTxns = useMemo(() => {
    if (!ledgerItem) return []
    return txns
      .filter(t => String(t.item) === String(ledgerItem._id))
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
  }, [txns, ledgerItem])

  const yearSummaryRows = useMemo(() => {
    return items
      .map(item => {
        const itemTxns = txns.filter(t => String(t.item) === String(item._id))
        const existedThisYear = new Date(item.createdAt || 0) <= fiscalYearEnd(summaryYear)
        if (!existedThisYear) return null
        const calc = computeItemYear(item, itemTxns, summaryYear)
        return { item, ...calc }
      })
      .filter(Boolean)
      .sort((a, b) => (a.item.code || 0) - (b.item.code || 0))
  }, [items, txns, summaryYear])

  const yearSummaryRowsDisplayed = useMemo(
    () => hideZeroStock ? yearSummaryRows.filter(r => r.closing !== 0) : yearSummaryRows,
    [yearSummaryRows, hideZeroStock]
  )

  const yearTotals = useMemo(() => yearSummaryRows.reduce((acc, r) => ({
    opening:  acc.opening + r.opening,
    received: acc.received + r.received,
    withdrawn: acc.withdrawn + r.withdrawn,
    closing:  acc.closing + r.closing,
    value:    acc.value + r.closing * (r.item.unitPrice || 0),
  }), { opening: 0, received: 0, withdrawn: 0, closing: 0, value: 0 }), [yearSummaryRows])

  // ── Item add/edit/delete ────────────────────────────────────────────────
  function openAddItem() { setEditingItemId(null); setItemForm(EMPTY_ITEM); setItemModal(true) }
  function openEditItem(item) {
    setEditingItemId(item._id)
    setItemForm({
      code: item.code ?? '', name: item.name ?? '', unit: item.unit ?? '',
      unitPrice: item.unitPrice ?? '', balance: item.balance ?? '',
    })
    setItemModal(true)
  }

  async function handleSaveItem(e) {
    e.preventDefault()
    setItemSaving(true)
    try {
      if (editingItemId) {
        await updateStockItem(editingItemId, {
          code: Number(itemForm.code) || 0,
          name: itemForm.name.trim(),
          unit: itemForm.unit.trim(),
          unitPrice: Number(itemForm.unitPrice) || 0,
        })
      } else {
        await createStockItem({
          code: Number(itemForm.code) || 0,
          name: itemForm.name.trim(),
          unit: itemForm.unit.trim(),
          unitPrice: Number(itemForm.unitPrice) || 0,
          balance: Number(itemForm.balance) || 0,
        })
      }
      setItemModal(false)
      await load()
    } catch (err) {
      alert(err?.response?.data?.error || 'บันทึกไม่สำเร็จ')
    } finally {
      setItemSaving(false)
    }
  }

  function handleDeleteItem(item) {
    setConfirmState({
      title: 'ลบวัสดุ',
      message: `ลบวัสดุ "${item.name}" ออกจากระบบ? ประวัติการรับ-จ่ายของรายการนี้จะถูกลบไปด้วย`,
      confirmLabel: 'ลบวัสดุ',
      onConfirm: async () => {
        try {
          await deleteStockItem(item._id)
          await load()
        } catch (err) {
          alert(err?.response?.data?.error || 'ลบไม่สำเร็จ')
        }
      },
    })
  }

  // ── Receive / withdraw transaction ──────────────────────────────────────
  // `item` is optional — the dashboard's quick-entry buttons open this blank, with the item
  // picked from a dropdown inside the modal, instead of always starting from a registry row.
  function openTxn(item, type) {
    setTxnForm({ ...EMPTY_TXN, itemId: item?._id || '', type, date: todayStr(), unitPrice: item ? String(item.unitPrice ?? '') : '' })
    setTxnError('')
    setTxnModal(true)
  }

  async function handleSubmitTxn(e) {
    e.preventDefault()
    setTxnError('')
    setTxnSaving(true)
    try {
      await createStockTransaction({
        itemId: txnForm.itemId,
        type: txnForm.type,
        qty: Number(txnForm.qty),
        date: txnForm.date || undefined,
        party: txnForm.party.trim(),
        docNo: txnForm.docNo.trim(),
        note: txnForm.note.trim(),
        // Only meaningful for a receive — the backend ignores it for a withdrawal, which
        // always values out at the item's current cost.
        unitPrice: txnForm.type === 'รับ' && txnForm.unitPrice !== '' ? Number(txnForm.unitPrice) : undefined,
      })
      setTxnModal(false)
      await load()
    } catch (err) {
      setTxnError(err?.response?.data?.error || 'บันทึกไม่สำเร็จ')
    } finally {
      setTxnSaving(false)
    }
  }

  function handleDeleteTxn(txn) {
    setConfirmState({
      title: 'ยกเลิกรายการ',
      message: `ยกเลิกรายการ "${txn.type}" ${txn.itemName} จำนวน ${txn.qty} ${txn.unit}? ยอดคงเหลือจะถูกปรับคืน`,
      confirmLabel: 'ยกเลิกรายการ',
      onConfirm: async () => {
        try {
          await deleteStockTransaction(txn._id)
          await load()
        } catch (err) {
          alert(err?.response?.data?.error || 'ยกเลิกไม่สำเร็จ')
        }
      },
    })
  }

  const txnItem = items.find(i => i._id === txnForm.itemId)

  // Standalone page (no site header/sidebar — see App.jsx) with its own login wall: the whole
  // page requires the admin password to view at all, not just to edit.
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        กำลังตรวจสอบสิทธิ์...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card w-full max-w-sm">
          <div className="section-head">
            <h2 className="text-sm font-semibold">🔐 เข้าสู่ระบบเจ้าหน้าที่กองช่าง</h2>
          </div>
          <form onSubmit={handleLogin} className="p-4 space-y-3">
            <p className="text-xs text-gray-400">บัญชีวัสดุไฟฟ้า กองช่าง — ใช้รหัสผ่านเดียวกับผู้ดูแลระบบ</p>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input pr-12"
                placeholder="รหัสผ่าน"
                autoFocus
                value={pw}
                onChange={e => { setPw(e.target.value); setLoginErr('') }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                {showPw ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
            {loginErr && <p className="text-xs text-red-500">⚠️ {loginErr}</p>}
            <button type="submit" disabled={loggingIn || !pw} className="btn-primary w-full disabled:opacity-50">
              {loggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex" style={{ fontFamily: "'Sarabun', sans-serif" }}>

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 bg-slate-900 text-slate-300 flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <p className="text-white font-bold text-base leading-snug">ระบบคลังวัสดุไฟฟ้า<br />กองช่าง อบต.แม่ใส</p>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-medium transition-colors border-l-2 ${
                tab === n.key
                  ? 'bg-slate-800 text-white border-amber-400'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-white'
              }`}>
              <span className="text-base">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-800">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 text-[11px] text-slate-400 hover:text-red-400 transition-colors">
            🚪 ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ── Sidebar (mobile) — slide-over drawer, toggled by the hamburger in the top bar ── */}
      <div className={`fixed inset-0 z-[70] lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
        <div className={`absolute inset-0 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between gap-2">
            <p className="text-white font-bold text-base leading-snug">ระบบคลังวัสดุไฟฟ้า<br />กองช่าง อบต.แม่ใส</p>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white text-xl flex-shrink-0" aria-label="ปิดเมนู">×</button>
          </div>
          <nav className="flex-1 py-3 overflow-y-auto">
            {NAV.map(n => (
              <button key={n.key} onClick={() => { setTab(n.key); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors border-l-2 ${
                  tab === n.key
                    ? 'bg-slate-800 text-white border-amber-400'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-white'
                }`}>
                <span className="text-base">{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
          <div className="px-5 py-4 border-t border-slate-800">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 text-[11px] text-slate-400 hover:text-red-400 transition-colors">
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-sm font-bold text-gray-800 truncate">{NAV.find(n => n.key === tab)?.icon} {NAV.find(n => n.key === tab)?.label}</h1>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              ออนไลน์
            </span>
            <span className="hidden md:inline">{now.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' })}</span>
            <span className="font-mono font-semibold text-gray-700 tabular-nums">{now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' })}</span>
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors text-lg"
              aria-label="เปิดเมนู">
              ☰
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">

      {/* ── TAB: แดชบอร์ด ── */}
      {tab === 'dashboard' && (
        <div className="space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-2xl font-bold text-slate-800">{items.length}</p>
              <p className="text-xs text-gray-400 mt-1">รายการวัสดุทั้งหมด</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-2xl font-bold text-blue-600">฿{totalValue.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">มูลค่าคงเหลือรวม</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-2xl font-bold text-amber-500">{todayTxnCount}</p>
              <p className="text-xs text-gray-400 mt-1">รายการเคลื่อนไหววันนี้</p>
            </div>
            <div className={`bg-white rounded-xl shadow-sm border p-4 ${lowStockCount > 0 ? 'border-red-200' : 'border-gray-100'}`}>
              <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-800'}`}>{lowStockCount}</p>
              <p className="text-xs text-gray-400 mt-1">รายการหมดสต๊อก</p>
            </div>
          </div>

          {/* Quick entry */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => openTxn(null, 'รับ')}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all p-4 flex items-center gap-3 text-left">
              <span className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-xl flex-shrink-0">📥</span>
              <div>
                <p className="text-sm font-semibold text-gray-700">รับวัสดุเข้า</p>
                <p className="text-[11px] text-gray-400">บันทึกรายการรับวัสดุใหม่</p>
              </div>
            </button>
            <button onClick={() => openTxn(null, 'จ่าย')}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all p-4 flex items-center gap-3 text-left">
              <span className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">📤</span>
              <div>
                <p className="text-sm font-semibold text-gray-700">เบิกจ่ายวัสดุ</p>
                <p className="text-[11px] text-gray-400">บันทึกรายการเบิกจ่าย</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xs font-bold text-gray-700">🕐 ความเคลื่อนไหวล่าสุด</h2>
                <button onClick={() => setTab('history')} className="text-[11px] text-blue-600 hover:underline">ดูทั้งหมด →</button>
              </div>
              {recentTxns.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-8">ยังไม่มีรายการเคลื่อนไหว</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentTxns.map(t => (
                    <li key={t._id} className="px-4 py-2.5 flex items-center gap-2.5 text-xs">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${t.type === 'รับ' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {t.type === 'รับ' ? '↓' : '↑'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 truncate">{t.itemName}</p>
                        <p className="text-[10px] text-gray-400">{new Date(t.date).toLocaleDateString('th-TH')} · {t.party || 'ไม่ระบุ'}</p>
                      </div>
                      <span className="text-gray-500 font-medium flex-shrink-0">{t.type === 'รับ' ? '+' : '-'}{t.qty.toLocaleString()} {t.unit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Low stock alert */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xs font-bold text-gray-700">⚠️ วัสดุหมดสต๊อก</h2>
                <button onClick={() => setTab('registry')} className="text-[11px] text-blue-600 hover:underline">ดูทั้งหมด →</button>
              </div>
              {lowStockItems.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-8">ไม่มีวัสดุหมดสต๊อกในขณะนี้ 🎉</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {lowStockItems.slice(0, 8).map(item => (
                    <li key={item._id} className="px-4 py-2.5 flex items-center justify-between gap-2.5 text-xs">
                      <span className="text-gray-700 truncate">{item.name}</span>
                      <button onClick={() => openTxn(item, 'รับ')}
                        className="text-[10px] px-2 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 font-medium transition-colors flex-shrink-0">
                        รับเข้า
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: ทะเบียนวัสดุ ── */}
      {tab === 'registry' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold text-gray-700">📋 ทะเบียนวัสดุคงเหลือ</h2>
            <div className="flex gap-2">
              <button onClick={() => setHideZeroRegistry(v => !v)}
                className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  hideZeroRegistry
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'border-gray-200 text-gray-500 hover:border-slate-800 hover:text-slate-800 bg-white'
                }`}>
                {hideZeroRegistry ? '🙈 ซ่อนรายการหมดสต๊อก' : '👁️ แสดงรายการหมดสต๊อก'}
              </button>
              <button onClick={openAddItem} className="text-xs bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                + เพิ่มวัสดุใหม่
              </button>
            </div>
          </div>
          <div className="p-3">
            <input
              className="input mb-3"
              placeholder="ค้นหาชื่อวัสดุ หรือรหัสวัสดุ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
              <p className="text-center text-gray-400 text-sm py-8">กำลังโหลด...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">ไม่พบข้อมูลวัสดุ</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500">
                      <th className="text-left p-2 border-b border-gray-100">รหัส</th>
                      <th className="text-left p-2 border-b border-gray-100">ชื่อวัสดุ</th>
                      <th className="text-center p-2 border-b border-gray-100">หน่วย</th>
                      <th className="text-right p-2 border-b border-gray-100">ราคา/หน่วย</th>
                      <th className="text-right p-2 border-b border-gray-100">คงเหลือ</th>
                      <th className="text-right p-2 border-b border-gray-100">มูลค่ารวม</th>
                      {isAdmin && <th className="text-center p-2 border-b border-gray-100">จัดการ</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50">
                        <td className="p-2 border-b border-gray-50 text-gray-400">{item.code}</td>
                        <td className="p-2 border-b border-gray-50 font-medium text-gray-700">{item.name}</td>
                        <td className="p-2 border-b border-gray-50 text-center text-gray-500">{item.unit}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-500">{(item.unitPrice || 0).toLocaleString()}</td>
                        <td className={`p-2 border-b border-gray-50 text-right font-semibold ${item.balance <= 0 ? 'text-red-500' : 'text-gray-700'}`}>
                          {(item.balance || 0).toLocaleString()}
                        </td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-500">
                          {((item.balance || 0) * (item.unitPrice || 0)).toLocaleString()}
                        </td>
                        {isAdmin && (
                          <td className="p-2 border-b border-gray-50">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setLedgerItem(item)}
                                className="text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors">
                                📇 บัญชี
                              </button>
                              <button onClick={() => openTxn(item, 'รับ')}
                                className="text-[11px] px-2 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 font-medium transition-colors">
                                รับเข้า
                              </button>
                              <button onClick={() => openTxn(item, 'จ่าย')}
                                className="text-[11px] px-2 py-1 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium transition-colors">
                                เบิกจ่าย
                              </button>
                              <button onClick={() => openEditItem(item)}
                                className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors">
                                แก้ไข
                              </button>
                              <button onClick={() => handleDeleteItem(item)}
                                className="text-[11px] px-2 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 font-medium transition-colors">
                                ลบ
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: ประวัติรับ-จ่าย ── */}
      {tab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold text-gray-700">🧾 ประวัติการรับ-จ่าย</h2>
            <select value={historyYear} onChange={e => setHistoryYear(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white">
              {availableYears.map(y => <option key={y} value={y}>ปีงบประมาณ {y}</option>)}
            </select>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className="text-xs text-gray-400">
                ✅ เลือกรายการ "จ่าย" เพื่อรวมเป็นใบเบิกวัสดุ — เลือกแล้ว {selectedWithdrawRows.length} รายการ
              </p>
              <div className="flex gap-2">
                {withdrawSelection.size > 0 && (
                  <button onClick={() => setWithdrawSelection(new Set())}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 bg-white font-medium transition-colors">
                    ล้างการเลือก
                  </button>
                )}
                <button onClick={() => triggerPrint('withdraw')} disabled={selectedWithdrawRows.length === 0}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white font-medium transition-colors disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500">
                  🖨️ พิมพ์ใบเบิกวัสดุ
                </button>
              </div>
            </div>
            {historyFiltered.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">ไม่มีรายการเคลื่อนไหวในปีงบประมาณ {historyYear}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500">
                      <th className="text-center p-2 border-b border-gray-100"></th>
                      <th className="text-left p-2 border-b border-gray-100">วันที่</th>
                      <th className="text-center p-2 border-b border-gray-100">ประเภท</th>
                      <th className="text-left p-2 border-b border-gray-100">รายการ</th>
                      <th className="text-right p-2 border-b border-gray-100">จำนวน</th>
                      <th className="text-left p-2 border-b border-gray-100">รับจาก/จ่ายให้</th>
                      <th className="text-left p-2 border-b border-gray-100">เลขที่เอกสาร</th>
                      <th className="text-right p-2 border-b border-gray-100">คงเหลือ</th>
                      {isAdmin && <th className="text-center p-2 border-b border-gray-100"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {historyFiltered.map(t => (
                      <tr key={t._id} className="hover:bg-slate-50">
                        <td className="p-2 border-b border-gray-50 text-center">
                          {t.type === 'จ่าย' && (
                            <input type="checkbox" checked={withdrawSelection.has(t._id)}
                              onChange={() => toggleWithdrawSelect(t._id)} />
                          )}
                        </td>
                        <td className="p-2 border-b border-gray-50 text-gray-500 whitespace-nowrap">
                          {new Date(t.date).toLocaleDateString('th-TH')}
                        </td>
                        <td className="p-2 border-b border-gray-50 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.type === 'รับ' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="p-2 border-b border-gray-50 text-gray-700">{t.itemName}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-600">{t.qty.toLocaleString()} {t.unit}</td>
                        <td className="p-2 border-b border-gray-50 text-gray-500">{t.party || '-'}</td>
                        <td className="p-2 border-b border-gray-50 text-gray-500">{t.docNo || '-'}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-600">{t.balanceAfter.toLocaleString()}</td>
                        {isAdmin && (
                          <td className="p-2 border-b border-gray-50 text-center">
                            <button onClick={() => handleDeleteTxn(t)}
                              className="text-[11px] px-2 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 font-medium transition-colors">
                              ยกเลิก
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: สรุปคงเหลือประจำปี ── */}
      {tab === 'summary' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs font-bold text-gray-700">📈 รายงานวัสดุคงเหลือ</h2>
            <select value={summaryYear} onChange={e => setSummaryYear(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white">
              {availableYears.map(y => <option key={y} value={y}>ปีงบประมาณ {y}</option>)}
            </select>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">
                ณ วันที่ 30 กันยายน {summaryYear} · กองช่าง · วัสดุไฟฟ้า
              </p>
              <div className="flex gap-2">
                <button onClick={() => setHideZeroStock(v => !v)}
                  className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    hideZeroStock
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white'
                  }`}>
                  {hideZeroStock ? '🙈 ซ่อนรายการหมดสต๊อก' : '👁️ แสดงรายการหมดสต๊อก'}
                </button>
                <button onClick={() => triggerPrint('report')}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white font-medium transition-colors">
                  🖨️ พิมพ์รายงาน
                </button>
                <button onClick={openSignerModal}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white font-medium transition-colors">
                  ✏️ แก้ไขชื่อผู้ลงนาม
                </button>
              </div>
            </div>
            {yearSummaryRows.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">ไม่มีวัสดุในปีงบประมาณ {summaryYear}</p>
            ) : yearSummaryRowsDisplayed.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">ไม่มีวัสดุคงเหลือ (ทุกรายการหมดสต๊อก)</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500">
                      <th className="text-left p-2 border-b border-gray-100">รหัส</th>
                      <th className="text-left p-2 border-b border-gray-100">รายการ</th>
                      <th className="text-center p-2 border-b border-gray-100">หน่วย</th>
                      <th className="text-right p-2 border-b border-gray-100">ยกมา</th>
                      <th className="text-right p-2 border-b border-gray-100">รับ</th>
                      <th className="text-right p-2 border-b border-gray-100">จ่าย</th>
                      <th className="text-right p-2 border-b border-gray-100">คงเหลือ</th>
                      <th className="text-right p-2 border-b border-gray-100">ราคา/หน่วย</th>
                      <th className="text-right p-2 border-b border-gray-100">จำนวนเงิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearSummaryRowsDisplayed.map(r => (
                      <tr key={r.item._id} className="hover:bg-slate-50">
                        <td className="p-2 border-b border-gray-50 text-gray-400">{r.item.code}</td>
                        <td className="p-2 border-b border-gray-50 font-medium text-gray-700">{r.item.name}</td>
                        <td className="p-2 border-b border-gray-50 text-center text-gray-500">{r.item.unit}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-500">{r.opening.toLocaleString()}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-green-600">{r.received.toLocaleString()}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-amber-600">{r.withdrawn.toLocaleString()}</td>
                        <td className={`p-2 border-b border-gray-50 text-right font-semibold ${r.closing <= 0 ? 'text-red-500' : 'text-gray-700'}`}>
                          {r.closing.toLocaleString()}
                        </td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-500">{(r.item.unitPrice || 0).toLocaleString()}</td>
                        <td className="p-2 border-b border-gray-50 text-right text-gray-500">
                          {(r.closing * (r.item.unitPrice || 0)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold text-gray-700">
                      <td className="p-2" colSpan={3}>รวม</td>
                      <td className="p-2 text-right">{yearTotals.opening.toLocaleString()}</td>
                      <td className="p-2 text-right text-green-600">{yearTotals.received.toLocaleString()}</td>
                      <td className="p-2 text-right text-amber-600">{yearTotals.withdrawn.toLocaleString()}</td>
                      <td className="p-2 text-right">{yearTotals.closing.toLocaleString()}</td>
                      <td className="p-2"></td>
                      <td className="p-2 text-right">฿{yearTotals.value.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Print-only: รายงานวัสดุคงเหลือ (with signature slots) ── */}
      {printMode === 'report' && (
      <div className="print-only p-6 text-black text-xs">
        <h1 className="text-center text-lg font-bold mb-1">รายงานวัสดุคงเหลือ</h1>
        <p className="text-center mb-1">ณ วันที่ 30 กันยายน {summaryYear}</p>
        <p className="text-center mb-3">กองช่าง · วัสดุไฟฟ้า</p>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="border border-black p-1">ลำดับ</th>
              <th className="border border-black p-1">รายการ</th>
              <th className="border border-black p-1">ปริมาณ</th>
              <th className="border border-black p-1">หน่วยนับ</th>
              <th className="border border-black p-1">ราคาต่อหน่วย<br />(บาท)</th>
              <th className="border border-black p-1">จำนวนเงิน<br />(บาท)</th>
              <th className="border border-black p-1">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {yearSummaryRowsDisplayed.map((r, idx) => (
              <tr key={r.item._id}>
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1">{r.item.name}</td>
                <td className="border border-black p-1 text-right">{r.closing ? money2(r.closing) : '-'}</td>
                <td className="border border-black p-1 text-center">{r.item.unit}</td>
                <td className="border border-black p-1 text-right">{money2(r.item.unitPrice)}</td>
                <td className="border border-black p-1 text-right">{r.closing ? money2(r.closing * (r.item.unitPrice || 0)) : '-'}</td>
                <td className="border border-black p-1"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border border-black p-1 text-center font-semibold" colSpan={5}>รวมรายการ</td>
              <td className="border border-black p-1 text-right font-semibold">{money2(yearTotals.value)}</td>
              <td className="border border-black p-1"></td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-around mt-12 text-center">
          {signers.map((s, i) => (
            <div key={i}>
              <p>ลงชื่อ ....................................................... ผู้จัดทำ</p>
              <p className="mt-1">( {s.name} )</p>
              <p>ตำแหน่ง {s.position}</p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ── Print-only: ใบเบิกวัสดุ (withdraw slip, built from selected history rows) ── */}
      {printMode === 'withdraw' && (
      <div className="print-only p-6 text-black text-xs">
        <h1 className="text-center text-lg font-bold mb-3">ใบเบิกวัสดุ</h1>
        <p className="mb-1">วันที่ {selectedWithdrawRows.length && new Set(selectedWithdrawRows.map(t => new Date(t.date).toDateString())).size === 1
          ? thaiDateShort(selectedWithdrawRows[0].date)
          : '.......................'}</p>
        <p className="mb-1">
          ข้าพเจ้า {signers[0].name} ตำแหน่ง {signers[0].position}
        </p>
        <p className="mb-1">ขอเบิกวัสดุ ประเภท วัสดุไฟฟ้า เพื่อใช้ในงาน .....................................</p>
        <p className="mb-3">ดังรายการต่อไปนี้</p>

        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="border border-black p-1 w-12">ลำดับ</th>
              <th className="border border-black p-1">รายการ</th>
              <th className="border border-black p-1 w-32">จำนวนที่เบิก</th>
            </tr>
          </thead>
          <tbody>
            {selectedWithdrawRows.map((t, idx) => (
              <tr key={t._id}>
                <td className="border border-black p-1 text-center">{idx + 1}</td>
                <td className="border border-black p-1">{t.itemName}</td>
                <td className="border border-black p-1 text-center">{t.qty.toLocaleString()} {t.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-around mt-12 text-center">
          <div>
            <p>ลงชื่อ ....................................................... ผู้เบิก</p>
            <p className="mt-1">( {signers[0].name} )</p>
            <p>ตำแหน่ง {signers[0].position}</p>
          </div>
          <div>
            <p>ลงชื่อ ....................................................... ผู้จ่าย</p>
            <p className="mt-1">( {signers[1].name} )</p>
            <p>ตำแหน่ง {signers[1].position}</p>
          </div>
        </div>
      </div>
      )}

        </div>
      </div>

      {/* ── Add/edit item modal ── */}
      {itemModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setItemModal(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{editingItemId ? '✏️ แก้ไขวัสดุ' : '➕ เพิ่มวัสดุใหม่'}</h3>
              <button onClick={() => setItemModal(false)} className="text-white/70 hover:text-white text-lg">×</button>
            </div>
            <form onSubmit={handleSaveItem} className="p-4 space-y-3">
              <div>
                <label className="form-label">รหัสวัสดุ</label>
                <input type="number" className="input" required value={itemForm.code}
                  onChange={e => setItemForm({ ...itemForm, code: e.target.value })} />
              </div>
              <div>
                <label className="form-label">ชื่อวัสดุ</label>
                <input className="input" required value={itemForm.name}
                  onChange={e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="เช่น หลอด LED T8 18W" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="form-label">หน่วยนับ</label>
                  <input className="input" value={itemForm.unit}
                    onChange={e => setItemForm({ ...itemForm, unit: e.target.value })} placeholder="อัน / ชุด / ตัว" />
                </div>
                <div className="flex-1">
                  <label className="form-label">ราคา/หน่วย (฿)</label>
                  <input type="number" min="0" step="0.01" className="input" value={itemForm.unitPrice}
                    onChange={e => setItemForm({ ...itemForm, unitPrice: e.target.value })} />
                </div>
              </div>
              {editingItemId ? (
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                  จำนวนคงเหลือ: <span className="font-semibold text-gray-700">{(itemForm.balance || 0).toLocaleString()}</span> — ปรับผ่านรายการ "รับเข้า" / "เบิกจ่าย" เท่านั้น
                </div>
              ) : (
                <div>
                  <label className="form-label">จำนวนคงเหลือเริ่มต้น</label>
                  <input type="number" min="0" className="input" value={itemForm.balance}
                    onChange={e => setItemForm({ ...itemForm, balance: e.target.value })} />
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setItemModal(false)} className="flex-1 btn-ghost">ยกเลิก</button>
                <button type="submit" disabled={itemSaving} className="flex-1 btn-primary disabled:opacity-50">
                  {itemSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Receive / withdraw modal ── */}
      {txnModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setTxnModal(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {txnForm.type === 'รับ' ? '📥 บันทึกรับวัสดุเข้า' : '📤 บันทึกเบิกจ่ายวัสดุ'}
              </h3>
              <button onClick={() => setTxnModal(false)} className="text-white/70 hover:text-white text-lg">×</button>
            </div>
            <form onSubmit={handleSubmitTxn} className="p-4 space-y-3">
              <div>
                <label className="form-label">รายการวัสดุ</label>
                <select className="input" required value={txnForm.itemId}
                  onChange={e => {
                    const picked = items.find(i => i._id === e.target.value)
                    setTxnForm({ ...txnForm, itemId: e.target.value, unitPrice: picked ? String(picked.unitPrice ?? '') : '' })
                  }}>
                  <option value="" disabled>เลือกวัสดุ...</option>
                  {items.map(i => (
                    <option key={i._id} value={i._id}>{i.code ? `[${i.code}] ` : ''}{i.name}</option>
                  ))}
                </select>
              </div>
              {txnItem && (
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs">
                  <p className="text-gray-400">คงเหลือปัจจุบัน: <span className="font-semibold text-gray-700">{(txnItem.balance || 0).toLocaleString()} {txnItem.unit}</span> · ราคาล่าสุด: <span className="font-semibold text-gray-700">฿{(txnItem.unitPrice || 0).toLocaleString()}</span>/{txnItem.unit}</p>
                </div>
              )}

              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {[['รับ', 'รับเข้า'], ['จ่าย', 'เบิกจ่าย']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setTxnForm({ ...txnForm, type: v })}
                    className={`flex-1 py-2 text-xs font-semibold transition-colors ${txnForm.type === v ? 'bg-secondary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    {l}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="form-label">จำนวน</label>
                  <input type="number" min="1" step="1" className="input" required value={txnForm.qty}
                    onChange={e => setTxnForm({ ...txnForm, qty: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label className="form-label">วันที่</label>
                  <input type="date" className="input" value={txnForm.date}
                    onChange={e => setTxnForm({ ...txnForm, date: e.target.value })} />
                </div>
              </div>

              {txnForm.type === 'รับ' && (
                <div>
                  <label className="form-label">ราคา/หน่วยที่รับ (฿)</label>
                  <input type="number" min="0" step="0.01" className="input" value={txnForm.unitPrice}
                    onChange={e => setTxnForm({ ...txnForm, unitPrice: e.target.value })}
                    placeholder="เว้นว่างไว้ = ใช้ราคาเดิมของวัสดุ" />
                  {txnItem && txnForm.unitPrice !== '' && Number(txnForm.unitPrice) !== txnItem.unitPrice && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      ⚠️ ราคาต่างจากเดิม (฿{(txnItem.unitPrice || 0).toLocaleString()}) — ระบบจะอัปเดตราคาวัสดุเป็นราคานี้หลังบันทึก
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="form-label">{txnForm.type === 'รับ' ? 'รับจาก' : 'จ่ายให้ / ผู้เบิก'}</label>
                <input className="input" value={txnForm.party}
                  onChange={e => setTxnForm({ ...txnForm, party: e.target.value })}
                  placeholder={txnForm.type === 'รับ' ? 'เช่น ร้านค้า / ผู้จำหน่าย' : 'เช่น ชื่อผู้เบิก / งานที่ใช้'} />
              </div>

              <div>
                <label className="form-label">เลขที่เอกสาร <span className="text-gray-400 font-normal">(ไม่บังคับ)</span></label>
                <input className="input" value={txnForm.docNo}
                  onChange={e => setTxnForm({ ...txnForm, docNo: e.target.value })} />
              </div>

              <div>
                <label className="form-label">หมายเหตุ <span className="text-gray-400 font-normal">(ไม่บังคับ)</span></label>
                <input className="input" value={txnForm.note}
                  onChange={e => setTxnForm({ ...txnForm, note: e.target.value })} />
              </div>

              {txnError && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{txnError}</p>}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setTxnModal(false)} className="flex-1 btn-ghost">ยกเลิก</button>
                <button type="submit" disabled={txnSaving} className="flex-1 btn-primary disabled:opacity-50">
                  {txnSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Item ledger modal (บัญชีวัสดุ — full in/out history for one item) ── */}
      {ledgerItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setLedgerItem(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm font-semibold">📇 บัญชีวัสดุ — {ledgerItem.name}</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => triggerPrint('ledger')} className="text-white/80 hover:text-white text-xs font-medium">🖨️ พิมพ์</button>
                <button onClick={() => setLedgerItem(null)} className="text-white/70 hover:text-white text-lg">×</button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-3 bg-gray-50 rounded-lg p-3">
                <p>รหัสวัสดุ : <span className="font-semibold text-gray-800">{ledgerItem.code}</span></p>
                <p>ประเภทวัสดุ : <span className="font-semibold text-gray-800">วัสดุไฟฟ้า</span></p>
                <p>ชื่อวัสดุ : <span className="font-semibold text-gray-800">{ledgerItem.name}</span></p>
                <p>หน่วยนับ : <span className="font-semibold text-gray-800">{ledgerItem.unit}</span></p>
              </div>
              {ledgerTxns.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">ยังไม่มีประวัติรับ-จ่ายของวัสดุนี้</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500">
                        <th className="text-left p-2 border-b border-gray-100">วันที่</th>
                        <th className="text-center p-2 border-b border-gray-100">รับ/จ่าย</th>
                        <th className="text-left p-2 border-b border-gray-100">รับจาก/จ่ายให้</th>
                        <th className="text-left p-2 border-b border-gray-100">เลขที่เอกสาร</th>
                        <th className="text-right p-2 border-b border-gray-100">จำนวน</th>
                        <th className="text-center p-2 border-b border-gray-100">หน่วย</th>
                        <th className="text-right p-2 border-b border-gray-100">ราคาต่อหน่วย</th>
                        <th className="text-right p-2 border-b border-gray-100">รวมเงิน</th>
                        <th className="text-right p-2 border-b border-gray-100">คงเหลือ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerTxns.map(t => (
                        <tr key={t._id} className="hover:bg-slate-50">
                          <td className="p-2 border-b border-gray-50 text-gray-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString('th-TH')}</td>
                          <td className="p-2 border-b border-gray-50 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.type === 'รับ' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{t.type}</span>
                          </td>
                          <td className="p-2 border-b border-gray-50 text-gray-500">{t.party || '-'}</td>
                          <td className="p-2 border-b border-gray-50 text-gray-500">{t.docNo || '-'}</td>
                          <td className="p-2 border-b border-gray-50 text-right text-gray-600">{t.qty.toLocaleString()}</td>
                          <td className="p-2 border-b border-gray-50 text-center text-gray-500">{t.unit}</td>
                          <td className="p-2 border-b border-gray-50 text-right text-gray-500">{money2(t.unitPrice)}</td>
                          <td className="p-2 border-b border-gray-50 text-right text-gray-500">{money2(t.amount ?? t.qty * (t.unitPrice || 0))}</td>
                          <td className="p-2 border-b border-gray-50 text-right font-semibold text-gray-700">{t.balanceAfter.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold text-gray-700">
                        <td className="p-2" colSpan={8}>คงเหลือปัจจุบัน</td>
                        <td className="p-2 text-right">{(ledgerItem.balance || 0).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Print-only: บัญชีวัสดุ (item ledger) ── */}
      {printMode === 'ledger' && ledgerItem && (
      <div className="print-only p-6 text-black text-xs">
        <h1 className="text-center text-lg font-bold mb-3">บัญชีวัสดุ</h1>
        <div className="flex justify-between mb-1">
          <p>ประเภทวัสดุ : วัสดุไฟฟ้า</p>
          <p>รหัสวัสดุ : {ledgerItem.code}</p>
        </div>
        <div className="flex justify-between mb-3">
          <p>ชื่อวัสดุ : {ledgerItem.name}</p>
          <p>หน่วยนับ : {ledgerItem.unit}</p>
        </div>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="border border-black p-1">วันที่</th>
              <th className="border border-black p-1">รับ/จ่าย</th>
              <th className="border border-black p-1">รับจาก/จ่ายให้</th>
              <th className="border border-black p-1">เลขที่เอกสาร</th>
              <th className="border border-black p-1">ชื่อวัสดุ</th>
              <th className="border border-black p-1">จำนวน</th>
              <th className="border border-black p-1">หน่วย</th>
              <th className="border border-black p-1">ราคาต่อหน่วย</th>
              <th className="border border-black p-1">รวมเงิน</th>
              <th className="border border-black p-1">คงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {ledgerTxns.map(t => (
              <tr key={t._id}>
                <td className="border border-black p-1 text-center">{thaiDateShort(t.date)}</td>
                <td className="border border-black p-1 text-center">{t.type}</td>
                <td className="border border-black p-1">{t.party || '-'}</td>
                <td className="border border-black p-1">{t.docNo || '-'}</td>
                <td className="border border-black p-1">{t.itemName}</td>
                <td className="border border-black p-1 text-right">{t.qty.toLocaleString()}</td>
                <td className="border border-black p-1 text-center">{t.unit}</td>
                <td className="border border-black p-1 text-right">{money2(t.unitPrice)}</td>
                <td className="border border-black p-1 text-right">{money2(t.amount ?? t.qty * (t.unitPrice || 0))}</td>
                <td className="border border-black p-1 text-right">{t.balanceAfter.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border border-black p-1 text-center" colSpan={9}>-</td>
              <td className="border border-black p-1 text-right font-semibold">{(ledgerItem.balance || 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      )}

      {/* ── Edit report signers modal ── */}
      {signerModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setSignerModal(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">✏️ แก้ไขชื่อผู้ลงนาม</h3>
              <button onClick={() => setSignerModal(false)} className="text-white/70 hover:text-white text-lg">×</button>
            </div>
            <form onSubmit={handleSaveSigners} className="p-4 space-y-4">
              <p className="text-xs text-gray-400">
                ชื่อ-ตำแหน่งผู้ลงนามที่แสดงบนรายงานวัสดุคงเหลือและใบเบิกวัสดุที่พิมพ์
              </p>
              {signerForm.map((s, idx) => (
                <div key={idx} className="space-y-2 border border-gray-100 rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-gray-500">
                    {idx === 0 ? 'ผู้ลงนามที่ 1 (ผู้จัดทำ / ผู้เบิก)' : 'ผู้ลงนามที่ 2 (ผู้จัดทำ / ผู้จ่าย)'}
                  </p>
                  <div>
                    <label className="form-label">ชื่อ-สกุล</label>
                    <input className="input" required value={s.name}
                      onChange={e => updateSignerField(idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">ตำแหน่ง</label>
                    <input className="input" required value={s.position}
                      onChange={e => updateSignerField(idx, 'position', e.target.value)} />
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setSignerModal(false)} className="flex-1 btn-ghost">ยกเลิก</button>
                <button type="submit" disabled={signerSaving} className="flex-1 btn-primary disabled:opacity-50">
                  {signerSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm modal ── */}
      {confirmState && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget && !confirmBusy) setConfirmState(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 pt-6 pb-2 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-3">🗑️</div>
              <h3 className="text-sm font-bold text-gray-800">{confirmState.title}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{confirmState.message}</p>
            </div>
            <div className="flex gap-2 p-4 pt-3">
              <button type="button" onClick={() => setConfirmState(null)} disabled={confirmBusy} className="flex-1 btn-ghost disabled:opacity-50">
                ยกเลิก
              </button>
              <button type="button" onClick={runConfirm} disabled={confirmBusy} className="flex-1 btn-danger disabled:opacity-50">
                {confirmBusy ? 'กำลังดำเนินการ...' : confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
