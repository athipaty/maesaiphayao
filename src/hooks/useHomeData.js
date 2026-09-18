import { useState, useEffect } from 'react'
import { getNews, getAnnouncements, getProcurement, getTravel, getProducts, getVideos, getFacebookPage, getEgpRss, getNotices, getSettings } from '../services/api'

const DEPARTMENTS = ['council', 'office', 'disaster', 'health', 'engineering', 'finance']

// All the data the homepage sections need, shared between the public HomePage
// and the admin homepage builder (AdminHomeBuilder) so both render the exact
// same content from the exact same fetch logic — the builder is only a
// realtime-editable view over the same live page.
export function useHomeData() {
  const [allNews, setAllNews]       = useState([])
  const [announce, setAnnounce]     = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [egp, setEgp]               = useState([])
  const [egpLoading, setEgpLoading] = useState(true)
  const [egpError, setEgpError]     = useState('')
  const [loading, setLoading]       = useState(true)
  const [travel, setTravel]         = useState([])
  const [products, setProducts]     = useState([])
  const [videos, setVideos]         = useState([])
  const [notices, setNotices]       = useState([])
  const [fbPage, setFbPage]         = useState(null)
  const [settings, setSettings]     = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const deptResults = await Promise.all(
          DEPARTMENTS.map(dept => getNews({ dept, limit: 10 }))
        )
        const flat = []
        DEPARTMENTS.forEach((dept, i) => {
          const items = deptResults[i]?.data || []
          items.forEach(item => flat.push({ ...item, _dept: dept }))
        })
        flat.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        setAllNews(flat)

        const [ann, nl, tv, pd] = await Promise.all([
          getAnnouncements({ type: 'announcement' }),
          getAnnouncements({ type: 'newsletter' }),
          getTravel({ limit: 6 }),
          getProducts({ limit: 6 }),
        ])
        getFacebookPage().then(r => setFbPage(r?.data)).catch(() => {})
        getNotices().then(r => setNotices(Array.isArray(r?.data) ? r.data : [])).catch(() => {})
        getSettings().then(r => setSettings(r?.data || {})).catch(() => setSettings({}))
        getVideos().then(r => setVideos((r?.data || []).slice(0, 6))).catch(() => {})
        setAnnounce(ann?.data || [])
        setNewsletter(nl?.data || [])

        // Fetch EGP W0: serve from DB immediately, then re-fetch after backend background sync completes
        const fetchEgp = () => getEgpRss({ anounceType: 'W0' })
          .then(r => {
            const d = r?.data || {}
            setEgp(Array.isArray(d) ? d : (d.items || []))
            if (d.notice) setEgpError(d.notice)
          })
          .catch(err => {
            const d = err?.response?.data || {}
            setEgpError(d.notice || d.error || 'ระบบ e-GP ไม่พร้อมให้บริการในขณะนี้')
          })
        fetchEgp().finally(() => {
          setEgpLoading(false)
          // Re-fetch after 6s to pick up items the backend just enriched in the background
          setTimeout(() => fetchEgp(), 6000)
        })
        setTravel((tv?.data || []).slice(0, 6))
        setProducts((pd?.data || []).slice(0, 6))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const annItems = [
    ...announce.map(i => ({ ...i, _kind: 'announcement' })),
    ...newsletter.map(i => ({ ...i, _kind: 'newsletter' })),
  ]

  return { allNews, loading, annItems, egp, egpLoading, egpError, travel, products, videos, notices, fbPage, settings }
}
