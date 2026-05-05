import { useState, useEffect } from 'react'
import { getAnnouncements, getDocuments } from '../services/api'

const ANNOUNCE_TYPES = {
  general:   { label: 'ประกาศทั่วไป',          color: 'bg-blue-100 text-blue-700' },
  budget:    { label: 'งบประมาณ',              color: 'bg-green-100 text-green-700' },
  personnel: { label: 'บุคลากร',               color: 'bg-purple-100 text-purple-700' },
  tax:       { label: 'ภาษี',                  color: 'bg-yellow-100 text-yellow-700' },
  law:       { label: 'กฎหมาย/ระเบียบ',        color: 'bg-orange-100 text-orange-700' },
  other:     { label: 'อื่น ๆ',               color: 'bg-gray-100 text-gray-700' },
}

const INFO_LINKS = [
  { icon: '📰', label: 'ราชกิจจานุเบกษา',                   href: 'http://www.ratchakitcha.soc.go.th/' },
  { icon: '🏛️', label: 'กรมส่งเสริมการปกครองส่วนท้องถิ่น', href: 'http://www.dla.go.th/' },
  { icon: '📊', label: 'ระบบสารสนเทศ อปท.',                 href: 'http://www.info.dla.go.th/' },
  { icon: '📋', label: 'ระบบข้อมูลกลาง อปท.',               href: 'http://www.odloc.go.th/' },
  { icon: '🔍', label: 'สำนักงาน ป.ป.ช.',                  href: 'https://www.nacc.go.th/' },
  { icon: '⚖️', label: 'สำนักงานผู้ตรวจการแผ่นดิน',        href: 'https://www.ombudsman.go.th/' },
]

export default function InfoCenterPage() {
  const [announcements, setAnnouncements] = useState([])
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAnnouncements(), getDocuments()])
      .then(([a, d]) => {
        setAnnouncements(a?.data?.slice(0, 10) || [])
        setDocs(d?.data?.slice(0, 8) || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="card mb-5">
        <div className="section-head">
          <h1 className="text-sm font-semibold">📚 ศูนย์ข้อมูลข่าวสาร</h1>
        </div>
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
          ศูนย์รวมข้อมูลข่าวสารราชการขององค์การบริหารส่วนตำบลแม่ใส
          ตาม พ.ร.บ.ข้อมูลข่าวสารของราชการ พ.ศ. 2540 ประชาชนสามารถขอรับข้อมูลได้ที่สำนักงาน อบต.แม่ใส
          หรือตรวจสอบผ่านเว็บไซต์นี้
        </div>
      </div>

      {/* Request info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 flex gap-3">
        <span className="text-2xl flex-shrink-0">ℹ️</span>
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-1">ขอข้อมูลข่าวสาร</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            ประชาชนมีสิทธิขอข้อมูลข่าวสารตาม พ.ร.บ.ข้อมูลข่าวสารของราชการ พ.ศ. 2540
            ยื่นคำขอได้ที่สำนักงาน อบต.แม่ใส ในวันและเวลาราชการ
            หรือทาง e-Service บนเว็บไซต์นี้
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="section-head rounded-none">
            <h2 className="text-sm font-semibold">📢 ประกาศล่าสุด</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">กำลังโหลด...</div>
          ) : announcements.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">ยังไม่มีประกาศ</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {announcements.map(a => {
                const tc = ANNOUNCE_TYPES[a.type] || ANNOUNCE_TYPES.other
                return (
                  <div key={a._id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.color}`}>{tc.label}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(a.publishedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">{a.title}</p>
                    {a.fileUrl && (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">⬇ ดาวน์โหลด</a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent documents */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="section-head rounded-none">
            <h2 className="text-sm font-semibold">📂 เอกสารราชการล่าสุด</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">กำลังโหลด...</div>
          ) : docs.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">ยังไม่มีเอกสาร</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {docs.map(d => (
                <div key={d._id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-700 flex-1 line-clamp-2">{d.title}</p>
                  <a href={d.fileUrl} target="_blank" rel="noreferrer"
                    className="flex-shrink-0 text-xs text-primary border border-primary/30 px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors">
                    ⬇
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="section-head">
          <h2 className="text-sm font-semibold">📁 หมวดหมู่ข้อมูลตาม มาตรา 9</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '⚖️', label: 'โครงสร้างและอำนาจหน้าที่',     desc: 'โครงสร้างองค์กร ผู้บริหาร อำนาจหน้าที่' },
            { icon: '📊', label: 'แผนงาน งบประมาณ และผลการปฏิบัติ', desc: 'แผนพัฒนา แผนดำเนินงาน รายงานผล' },
            { icon: '💰', label: 'การเงินและการคลัง',             desc: 'งบประมาณ รายงานทางการเงิน งบทดลอง' },
            { icon: '📦', label: 'การจัดซื้อจัดจ้าง',             desc: 'ประกาศ TOR ผู้ชนะ สัญญา' },
            { icon: '📋', label: 'มติที่ประชุม',                  desc: 'มติสภา มติคณะผู้บริหาร' },
            { icon: '📜', label: 'กฎหมาย ระเบียบ ข้อบัญญัติ',    desc: 'ข้อบัญญัติท้องถิ่น ระเบียบที่เกี่ยวข้อง' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External links */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="section-head">
          <h2 className="text-sm font-semibold">🔗 แหล่งข้อมูลที่เกี่ยวข้อง</h2>
        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INFO_LINKS.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 transition-colors">
              <span className="text-lg flex-shrink-0">{l.icon}</span>
              <span className="text-xs text-gray-700">{l.label}</span>
              <span className="ml-auto text-gray-300 text-xs">›</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
