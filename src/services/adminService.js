import api from './api'

/**
 * Admin API Services
 */

// ── Dashboard & Stats ──
export const getAdminDashboardStats = () => api.get('/dashboard/stats')

// ── Setor Sampah Management ──
export const getAdminSetorList = (params = {}) => api.get('/setor-sampah/admin/list', { params })
export const getAdminSetorDetail = (id) => api.get(`/setor-sampah/${id}`)
export const verifyAdminSetor = (id, payload) => api.put(`/setor-sampah/admin/verify/${id}`, payload)

// ── Nasabah Management (CRUD) ──
// 1. List: GET /admin/nasabah (or fallback /nasabah)
export const getAdminNasabahList = async () => {
  try {
    return await api.get('/admin/nasabah')
  } catch (err) {
    if (err.response?.status === 404) {
      return await api.get('/nasabah')
    }
    throw err
  }
}

// 2. Detail: GET /admin/nasabah/{id}
export const getAdminNasabahDetail = async (id) => {
  try {
    return await api.get(`/admin/nasabah/${id}`)
  } catch (err) {
    if (err.response?.status === 404) {
      return await api.get(`/nasabah/${id}`)
    }
    throw err
  }
}

// 3. Create: POST /admin/nasabah (multipart/form-data)
export const createAdminNasabah = async (payload) => {
  let data = payload
  if (!(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }

  try {
    return await api.post('/admin/nasabah', data)
  } catch (err) {
    if (err.response?.status === 404) {
      return await api.post('/nasabah', data)
    }
    throw err
  }
}

// 4. Update: PUT /admin/nasabah/{id}
export const updateAdminNasabah = async (id, payload) => {
  let data = payload
  const hasFile = payload instanceof FormData || (payload && payload.foto instanceof File)
  
  if (hasFile && !(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }

  try {
    return await api.put(`/admin/nasabah/${id}`, data)
  } catch (err) {
    if (err.response?.status === 404) {
      return await api.put(`/nasabah/${id}`, data)
    }
    throw err
  }
}

// 5. Delete: DELETE /admin/nasabah/{id}
export const deleteAdminNasabah = async (id) => {
  try {
    return await api.delete(`/admin/nasabah/${id}`)
  } catch (err) {
    if (err.response?.status === 404) {
      return await api.delete(`/nasabah/${id}`)
    }
    throw err
  }
}

// ── Kategori Sampah Management (CRUD) ──
// 1. List: GET /kategori-sampah
export const getAdminKategoriList = () => api.get('/kategori-sampah')

// 2. Detail: GET /kategori-sampah/{id}
export const getAdminKategoriDetail = (id) => api.get(`/kategori-sampah/${id}`)

// 3. Create: POST /kategori-sampah
export const createAdminKategori = async (payload) => {
  let data = payload
  if (!(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }

  return api.post('/kategori-sampah', data)
}

// 4. Update: PUT /kategori-sampah/{id}
export const updateAdminKategori = async (id, payload) => {
  let data = payload
  const hasFile = payload instanceof FormData || (payload && payload.foto instanceof File)

  if (hasFile && !(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }

  return api.put(`/kategori-sampah/${id}`, data)
}

// 5. Delete: DELETE /kategori-sampah/{id}
export const deleteAdminKategori = (id) => api.delete(`/kategori-sampah/${id}`)

// ── Hadiah Management ──
// 1. List: GET /hadiah
export const getAdminHadiahList = () => api.get('/hadiah')

// 2. Detail: GET /hadiah/{id}
export const getAdminHadiahDetail = (id) => api.get(`/hadiah/${id}`)

// 3. Create: POST /hadiah
export const createAdminHadiah = async (payload) => {
  let data = payload
  if (!(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }
  return api.post('/hadiah', data)
}

// 4. Update: PUT /hadiah/{id}
export const updateAdminHadiah = async (id, payload) => {
  let data = payload
  const hasFile = payload instanceof FormData || (payload && payload.foto instanceof File)
  if (hasFile && !(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }
  return api.put(`/hadiah/${id}`, data)
}

// 5. Delete: DELETE /hadiah/{id}
export const deleteAdminHadiah = (id) => api.delete(`/hadiah/${id}`)

// ── Penukaran Poin Management ──
// 1. List: GET /penukaran-poin/admin/list?status=...&bulan=...
export const getAdminPenukaranList = (params = {}) =>
  api.get('/penukaran-poin/admin/list', { params })

// 2. Update Status: PUT /penukaran-poin/admin/status/{id}
export const updateAdminPenukaranStatus = (id, payload) =>
  api.put(`/penukaran-poin/admin/status/${id}`, payload)

// ── Rekapitulasi Bulanan ──
// 1. GET /rekapitulasi/bulanan?bulan=YYYY-MM
export const getAdminRekapitulasiBulanan = (bulan) =>
  api.get('/rekapitulasi/bulanan', { params: { bulan } })

// ── Profil Unit & Admin ──
// 1. GET /auth/me
export const getAdminProfile = () => api.get('/auth/me')


