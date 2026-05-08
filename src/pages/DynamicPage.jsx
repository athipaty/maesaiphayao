import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPageBySlug } from '../services/api'
import PageHeader from '../components/PageHeader'
import BlockRenderer from '../components/BlockRenderer'

// ── Main page component ───────────────────────────────────────────────────────

export default function DynamicPage() {
  const { slug } = useParams()
  const [page, setPage]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getPageBySlug(slug)
      .then(r => setPage(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>

  if (notFound || !page) return (
    <div className="card p-10 text-center">
      <p className="text-4xl mb-3">🔍</p>
      <p className="text-gray-500 text-sm">ไม่พบหน้าที่ต้องการ</p>
      <Link to="/" className="mt-4 inline-block text-xs text-secondary hover:underline">← กลับหน้าหลัก</Link>
    </div>
  )

  return (
    <div>
      <PageHeader icon={page.icon} title={page.title} />
      {page.blocks?.length > 0 ? (
        page.blocks.map(block => <BlockRenderer key={block._id} block={block} />)
      ) : (
        <div className="card p-8 text-center text-gray-400 text-sm">ยังไม่มีเนื้อหา</div>
      )}
    </div>
  )
}
