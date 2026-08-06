import { useState, useEffect, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import {
  getStockItems, createStockItem, deleteStockItem,
  getStockTransactions, createStockTransaction, deleteStockTransaction,
  loginAdmin, verifyAdmin, logoutAdmin,
} from '../services/api'

const EMPTY_ITEM = { code: '', name: '', unit: '', unitPrice: '', balance: '' }
const EMPTY_TXN  = { itemId: '', type: 'จ่าย', qty: '', party: '', docNo: '', date: '', note: '' }

function todayStr() {
  return new Date().toISOString().slice(0, 10)
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

  const [items, setItems]   = useState([])
  const [txns, setTxns]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [itemModal, setItemModal] = useState(false)
  const [itemForm, setItemForm]   = useState(EMPTY_ITEM)
  const [itemSaving, setItemSaving] = useState(false)

  const [txnModal, setTxnModal]   = useState(false)
  const [txnForm, setTxnForm]     = useState(EMPTY_TXN)
  const [txnSaving, setTxnSaving] = useState(false)
  const [txnError, setTxnError]   = useState('')

  const [confirmState, setConfirmState] = useState(null) // { title, message, confirmLabel, onConfirm }
  const [confirmBusy, setConfirmBusy]   = useState(false)

  async function runConfirm() {
    if (!confirmState) return
    setConfirmBusy(true)
    try { await confirmState.onConfirm() }
    finally { setConfirmBusy(false); setConfirmState(null) }
  }

  async function load() {
    setLoading(true)
    try {
      const [ri, rt] = await Promise.all([
        getStockItems({ all: 1 }),
        getStockTransactions({ limit: 50 }),
      ])
      setItems(ri?.data || [])
      setTxns(rt?.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(i => i.name.toLowerCase().includes(q) || String(i.code).includes(q))
  }, [items, search])

  const totalValue = useMemo(() => items.reduce((s, i) => s + (i.balance || 0) * (i.unitPrice || 0), 0), [items])
  const lowStockCount = useMemo(() => items.filter(i => (i.balance || 0) <= 0).length, [items])

  // ── Item add/delete ─────────────────────────────────────────────────────
  function openAddItem() { setItemForm(EMPTY_ITEM); setItemModal(true) }

  async function handleAddItem(e) {
    e.preventDefault()
    setItemSaving(true)
    try {
      await createStockItem({
        code: Number(itemForm.code) || 0,
        name: itemForm.name.trim(),
        unit: itemForm.unit.trim(),
        unitPrice: Number(itemForm.unitPrice) || 0,
        balance: Number(itemForm.balance) || 0,
      })
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
  function openTxn(item, type) {
    setTxnForm({ ...EMPTY_TXN, itemId: item._id, type, date: todayStr() })
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

  return (
    <div>
      <PageHeader icon="⚡" title="บัญชีวัสดุไฟฟ้า กองช่าง"
        desc="ทะเบียนวัสดุไฟฟ้าคงเหลือ พร้อมประวัติการรับเข้า–เบิกจ่าย ของกองช่าง" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-primary">{items.length}</p>
          <p className="text-[11px] text-gray-500">รายการวัสดุ</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-secondary">฿{totalValue.toLocaleString()}</p>
          <p className="text-[11px] text-gray-500">มูลค่าคงเหลือรวม</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-red-500">{lowStockCount}</p>
          <p className="text-[11px] text-gray-500">รายการหมดสต๊อก</p>
        </div>
      </div>

      {/* Item list */}
      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">📋 ทะเบียนวัสดุคงเหลือ</h2>
          {isAdmin && (
            <button onClick={openAddItem} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors">
              + เพิ่มวัสดุใหม่
            </button>
          )}
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
                    <tr key={item._id} className="hover:bg-pink-50/40">
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
                            <button onClick={() => openTxn(item, 'รับ')}
                              className="text-[11px] px-2 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 font-medium transition-colors">
                              รับเข้า
                            </button>
                            <button onClick={() => openTxn(item, 'จ่าย')}
                              className="text-[11px] px-2 py-1 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium transition-colors">
                              เบิกจ่าย
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

      {/* Transaction history */}
      <div className="card">
        <div className="section-head">
          <h2 className="text-sm font-semibold">🧾 ประวัติการรับ-จ่ายล่าสุด</h2>
        </div>
        <div className="p-3">
          {txns.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">ยังไม่มีรายการเคลื่อนไหว</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
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
                  {txns.map(t => (
                    <tr key={t._id} className="hover:bg-pink-50/40">
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

      {!checkingAuth && !isAdmin && (
        <div className="card">
          <div className="section-head">
            <h2 className="text-sm font-semibold">🔐 เข้าสู่ระบบเจ้าหน้าที่กองช่าง</h2>
          </div>
          <form onSubmit={handleLogin} className="p-4 space-y-3 max-w-sm">
            <p className="text-xs text-gray-400">เข้าสู่ระบบเพื่อเพิ่ม/ลบวัสดุ และบันทึกรับเข้า-เบิกจ่าย (ใช้รหัสผ่านเดียวกับผู้ดูแลระบบ)</p>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input pr-12"
                placeholder="รหัสผ่าน"
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
      )}

      {isAdmin && (
        <div className="flex justify-end mb-2">
          <button onClick={handleLogout} className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">
            ออกจากระบบ
          </button>
        </div>
      )}

      {/* ── Add item modal ── */}
      {itemModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setItemModal(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="section-head">
              <h3 className="text-sm font-semibold">➕ เพิ่มวัสดุใหม่</h3>
              <button onClick={() => setItemModal(false)} className="text-white/80 hover:text-white text-lg">×</button>
            </div>
            <form onSubmit={handleAddItem} className="p-4 space-y-3">
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
              <div>
                <label className="form-label">จำนวนคงเหลือเริ่มต้น</label>
                <input type="number" min="0" className="input" value={itemForm.balance}
                  onChange={e => setItemForm({ ...itemForm, balance: e.target.value })} />
              </div>
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
            <div className="section-head">
              <h3 className="text-sm font-semibold">
                {txnForm.type === 'รับ' ? '📥 บันทึกรับวัสดุเข้า' : '📤 บันทึกเบิกจ่ายวัสดุ'}
              </h3>
              <button onClick={() => setTxnModal(false)} className="text-white/80 hover:text-white text-lg">×</button>
            </div>
            <form onSubmit={handleSubmitTxn} className="p-4 space-y-3">
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs">
                <p className="font-semibold text-gray-700">{txnItem?.name}</p>
                <p className="text-gray-400">คงเหลือปัจจุบัน: {(txnItem?.balance || 0).toLocaleString()} {txnItem?.unit}</p>
              </div>

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
