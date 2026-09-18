// Homepage section registry — shared between HomePage.jsx (rendering) and
// AdminSettings.jsx (the drag-and-drop order editor), so both always agree on
// which sections exist and their default order/labels.
//
// Order is stored as a plain array of these keys under the 'homeSectionOrder'
// setting (see services/api.js getSettings/updateSetting). Missing/unknown
// keys are normalized back to this default — see normalizeHomeOrder below.

export const DEFAULT_HOME_ORDER = [
  'news',
  'announce',
  'facebook',
  'notices',
  'procurement',
  'travel',
  'products',
  'videos',
]

export const HOME_SECTION_META = {
  news:        { icon: '📰', label: 'ข่าวสารกิจกรรม' },
  announce:    { icon: '📢', label: 'ข่าวประชาสัมพันธ์ & จดหมายข่าว' },
  facebook:    { icon: '📘', label: 'Facebook' },
  notices:     { icon: '📋', label: 'หัวข้อประกาศ' },
  procurement: { icon: '📦', label: 'ระบบ e-GP (เรียลไทม์)' },
  travel:      { icon: '🗺️', label: 'สถานที่ท่องเที่ยว' },
  products:    { icon: '🛍️', label: 'สินค้า OTOP' },
  videos:      { icon: '▶️', label: 'วีดีทัศน์การดำเนินงานของหน่วยงาน' },
}

// Where the admin homepage builder's "แก้ไข" button sends you for each
// section — its existing content manager, rather than duplicating a second
// editor inline. Facebook/e-GP have no dedicated manager of their own, so
// they go to the closest existing page that touches their content.
export const HOME_SECTION_EDIT_PATH = {
  news:        '/admin/news',
  announce:    '/admin/announcements',
  facebook:    '/admin/settings',
  notices:     '/admin/notices',
  procurement: '/admin/procurement',
  travel:      '/admin/travel',
  products:    '/admin/products',
  videos:      '/admin/videos',
}

// Keeps only known keys, de-dupes, then appends any default section the stored
// order is missing (e.g. a new section shipped after the admin last saved an
// order) at the end, so nothing silently disappears from the page.
export function normalizeHomeOrder(stored) {
  const valid = Array.isArray(stored) ? stored.filter(k => HOME_SECTION_META[k]) : []
  const deduped = [...new Set(valid)]
  const missing = DEFAULT_HOME_ORDER.filter(k => !deduped.includes(k))
  return deduped.length ? [...deduped, ...missing] : DEFAULT_HOME_ORDER
}

// Sections an admin has turned off on the homepage (reversible — this only
// affects whether the section is shown there, never the underlying content,
// e.g. hiding "ข่าวสารกิจกรรม" doesn't touch any news article).
export function normalizeHomeHidden(stored) {
  return Array.isArray(stored) ? [...new Set(stored.filter(k => HOME_SECTION_META[k]))] : []
}
