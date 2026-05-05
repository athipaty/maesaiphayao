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
export const getProcurement    = (params)    => api.get('/procurement', { params })
export const createProcurement = (data)      => api.post('/procurement', data)
export const updateProcurement = (id, data)  => api.put(`/procurement/${id}`, data)
export const deleteProcurement = (id)        => api.delete(`/procurement/${id}`)

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

// ── Settings ──────────────────────────────────────────────────────────────────
export const getSettings   = ()           => api.get('/settings')
export const updateSetting = (key, value) => api.put(`/settings/${key}`, { value })

// ── Image upload ──────────────────────────────────────────────────────────────
export const uploadImage = (file) => {
  const form = new FormData()
  form.append('image', file)
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
