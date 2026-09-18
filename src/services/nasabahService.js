import api from './api'

export const getKategoriSampah = () => api.get('/kategori-sampah')
export const getHadiah = () => api.get('/hadiah')
export const getDashboardSummary = () => api.get('/dashboard/summary')
export const getMySetor = (bulan) => api.get('/setor-sampah/my-setor', { params: bulan ? { bulan } : {} })
export const getMyPenukaran = () => api.get('/penukaran-poin/my-penukaran')
export const ajukanSetor = (payload) => api.post('/setor-sampah/pengajuan', payload)
export const tukarPoin = (hadiahId) => api.post('/penukaran-poin/tukar', { hadiahId })
export const getNotaPenukaran = (id) => api.get(`/penukaran-poin/nota/${id}`)
export const getMe = () => api.get('/auth/me')
