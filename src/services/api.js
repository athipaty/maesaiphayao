import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api/abt'
const AUTH_BASE = import.meta.env.VITE_AUTH_URL || '/auth'

const api = axios.create({ baseURL: BASE })
const authApi = axios.create({ baseURL: AUTH_BASE })

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('abt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Admin auth ────────────────────────────────────────────────────────────────
export const loginAdmin  = (password) => authApi.post('/login', { password })
export const verifyAdmin = (token)    => authApi.post('/verify', { token })
export const logoutAdmin = (token)    => authApi.post('/logout', { token })

// ── News ──────────────────────────────────────────────────────────────────────
export const getNews       = (params) => api.get('/news', { params })
export const getNewsById   = (id)     => api.get(`/news/${id}`)
export const createNews    = (data)   => api.post('/news', data)
export const updateNews    = (id, data) => api.put(`/news/${id}`, data)
export const deleteNews    = (id)     => api.delete(`/news/${id}`)

// ── Announcements ─────────────────────────────────────────────────────────────
export const getAnnouncements   = (params)    => api.get('/announcements', { params })
export const createAnnouncement = (data)      => api.post('/announcements', data)
export const updateAnnouncement = (id, data)  => api.put(`/announcements/${id}`, data)
export const deleteAnnouncement = (id)        => api.delete(`/announcements/${id}`)

// ── Procurement ───────────────────────────────────────────────────────────────
export const getProcurement         = (params)    => api.get('/procurement', { params })
export const createProcurement      = (data)      => api.post('/procurement', data)
export const updateProcurement      = (id, data)  => api.put(`/procurement/${id}`, data)
export const deleteProcurement      = (id)        => api.delete(`/procurement/${id}`)
export const summarizeProcurement   = (id)        => api.post(`/procurement/${id}/summarize`)
export const getEgpRss         = (params)    => api.get('/egp-rss', { params })

// ── Staff ─────────────────────────────────────────────────────────────────────
export const getStaff    = (params)    => api.get('/staff', { params })
export const createStaff = (data)      => api.post('/staff', data)
export const updateStaff = (id, data)  => api.put(`/staff/${id}`, data)
export const deleteStaff = (id)        => api.delete(`/staff/${id}`)

// ── Travel ────────────────────────────────────────────────────────────────────
export const getTravel     = (params)    => api.get('/travel', { params })
export const getTravelById = (id)        => api.get(`/travel/${id}`)
export const createTravel  = (data)      => api.post('/travel', data)
export const updateTravel  = (id, data)  => api.put(`/travel/${id}`, data)
export const deleteTravel  = (id)        => api.delete(`/travel/${id}`)

// ── Videos (YouTube) ────────────────────────────────────────────────────────────
export const getVideos    = (params)    => api.get('/videos', { params })
export const createVideo  = (data)      => api.post('/videos', data)
export const updateVideo  = (id, data)  => api.put(`/videos/${id}`, data)
export const deleteVideo  = (id)        => api.delete(`/videos/${id}`)

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts    = (params)    => api.get('/products', { params })
export const getProductById = (id)        => api.get(`/products/${id}`)
export const createProduct  = (data)      => api.post('/products', data)
export const updateProduct  = (id, data)  => api.put(`/products/${id}`, data)
export const deleteProduct  = (id)        => api.delete(`/products/${id}`)

// ── Procurement Plans ─────────────────────────────────────────────────────────
export const getProcurementPlans    = (params)    => api.get('/procurement-plans', { params })
export const createProcurementPlan  = (data)      => api.post('/procurement-plans', data)
export const updateProcurementPlan  = (id, data)  => api.put(`/procurement-plans/${id}`, data)
export const deleteProcurementPlan  = (id)        => api.delete(`/procurement-plans/${id}`)

// ── Stock (วัสดุไฟฟ้า กองช่าง) ───────────────────────────────────────────────────
export const getStockItems         = (params)    => api.get('/stock-items', { params })
export const createStockItem       = (data)      => api.post('/stock-items', data)
export const updateStockItem       = (id, data)  => api.put(`/stock-items/${id}`, data)
export const deleteStockItem       = (id)        => api.delete(`/stock-items/${id}`)
export const getStockTransactions  = (params)    => api.get('/stock-transactions', { params })
export const createStockTransaction = (data)     => api.post('/stock-transactions', data)
export const deleteStockTransaction = (id)       => api.delete(`/stock-transactions/${id}`)

// ── Settings ──────────────────────────────────────────────────────────────────
export const getSettings   = ()           => api.get('/settings')
export const updateSetting = (key, value) => api.put(`/settings/${key}`, { value })

// ── ITA / OIT ─────────────────────────────────────────────────────────────────
export const getOIT      = (params)    => api.get('/oit', { params })
export const getOITYears = ()          => api.get('/oit/years')
export const saveOIT     = (data)      => api.post('/oit', data)
export const updateOIT   = (id, data)  => api.put(`/oit/${id}`, data)
export const deleteOIT   = (id)        => api.delete(`/oit/${id}`)

// ── E-Service Types ───────────────────────────────────────────────────────────
export const getEServiceTypes   = ()         => api.get('/eservice-types')
export const createEServiceType = (data)     => api.post('/eservice-types', data)
export const updateEServiceType = (id, data) => api.put(`/eservice-types/${id}`, data)
export const deleteEServiceType = (id)       => api.delete(`/eservice-types/${id}`)

// ── E-Service ─────────────────────────────────────────────────────────────────
export const getEServices     = (params)    => api.get('/eservice', { params })
export const trackEService    = (no)        => api.get(`/eservice/track/${no}`)
export const submitEService   = (data)      => api.post('/eservice', data)
export const updateEService   = (id, data)  => api.put(`/eservice/${id}`, data)

// ── Complaints ────────────────────────────────────────────────────────────────
export const getComplaints    = (params)    => api.get('/complaints', { params })
export const trackComplaint   = (no)        => api.get(`/complaints/track/${no}`)
export const submitComplaint  = (data)      => api.post('/complaints', data)
export const updateComplaint  = (id, data)  => api.put(`/complaints/${id}`, data)

// ── Feedback (ช่องทางรับฟังความคิดเห็น) ─────────────────────────────────────
export const getFeedback    = (params)    => api.get('/feedback', { params })
export const submitFeedback = (data)      => api.post('/feedback', data)
export const updateFeedback = (id, data)  => api.put(`/feedback/${id}`, data)
export const deleteFeedback = (id)        => api.delete(`/feedback/${id}`)

// ── Satisfaction Survey (แบบสำรวจความพึงพอใจ) ───────────────────────────────
export const getSurveyResponses    = ()      => api.get('/survey-responses')
export const submitSurveyResponse  = (data)  => api.post('/survey-responses', data)
export const deleteSurveyResponse  = (id)    => api.delete(`/survey-responses/${id}`)

// ── Documents ─────────────────────────────────────────────────────────────────
export const getDocuments     = (params)    => api.get('/documents', { params })
export const createDocument   = (data)      => api.post('/documents', data)
export const updateDocument   = (id, data)  => api.put(`/documents/${id}`, data)
export const deleteDocument   = (id)        => api.delete(`/documents/${id}`)

// ── Pages / Menu ──────────────────────────────────────────────────────────────
export const getPages      = ()          => api.get('/pages')
export const getPageBySlug = (slug)      => api.get(`/pages/slug/${slug}`)
export const createPage    = (data)      => api.post('/pages', data)
export const updatePage    = (id, data)  => api.put(`/pages/${id}`, data)
export const deletePage    = (id)        => api.delete(`/pages/${id}`)

// ── Visitor counter ───────────────────────────────────────────────────────────
export const getVisits    = ()  => api.get('/visits')
export const recordVisit  = ()  => api.post('/visits')

// ── Banners ───────────────────────────────────────────────────────────────────
export const getBanners      = ()           => api.get('/banners')
export const getAllBanners   = ()           => api.get('/banners/all')
export const createBanner    = (data)      => api.post('/banners', data)
export const updateBanner    = (id, data)  => api.put(`/banners/${id}`, data)
export const deleteBanner    = (id)        => api.delete(`/banners/${id}`)

// ── Contact Messages ──────────────────────────────────────────────────────
export const getContactMessages    = ()           => api.get('/contact-messages')
export const createContactMessage  = (data)       => api.post('/contact-messages', data)
export const updateContactMessage  = (id, data)   => api.put(`/contact-messages/${id}`, data)
export const deleteContactMessage  = (id)         => api.delete(`/contact-messages/${id}`)
export const replyContactMessage   = (id, data)   => api.post(`/contact-messages/${id}/replies`, data)

// ── Notices (หัวข้อประกาศ) ────────────────────────────────────────────────────
export const getNotices    = (params)    => api.get('/notices', { params })
export const createNotice  = (data)      => api.post('/notices', data)
export const updateNotice  = (id, data)  => api.put(`/notices/${id}`, data)
export const deleteNotice  = (id)        => api.delete(`/notices/${id}`)

// ── Facebook page info ────────────────────────────────────────────────────────
export const getFacebookPage = () => api.get('/facebook-page')

// ── Image upload ──────────────────────────────────────────────────────────────
export const uploadImage = (file) => {
  const form = new FormData()
  form.append('image', file)
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const uploadPdf = (file) => {
  const form = new FormData()
  form.append('pdf', file)
  return api.post('/upload-pdf', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const uploadExcel = (file) => {
  const form = new FormData()
  form.append('excel', file)
  return api.post('/upload-excel', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const uploadWord = (file) => {
  const form = new FormData()
  form.append('word', file)
  return api.post('/upload-word', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
