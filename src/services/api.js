import axios from 'axios'

// Base URL yang digunakan untuk komunikasi ke backend Bank Sampah.
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://learn.smktelkom-mlg.sch.id/bank_sampah/api/v1'

// Helper untuk memastikan URL foto valid (menangani URL absolut maupun relative path backend)
export const resolveFotoUrl = (foto) => {
  if (!foto || typeof foto !== 'string') return null
  const trimmed = foto.trim()
  if (!trimmed) return null
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const baseOrigin = BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${baseOrigin}${cleanPath}`
}

const api = axios.create({ baseURL: BASE_URL })

// Interceptor Request: Menyertakan x-app-key dan Authorization Bearer token secara konsisten
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('banksampah_session')
    let session = null

    if (raw) {
      try {
        session = JSON.parse(raw)
      } catch (e) {
        console.error('[API Interceptor] Gagal parse banksampah_session dari localStorage:', e)
      }
    }

    if (session?.appKey) {
      config.headers['x-app-key'] = session.appKey
    }

    if (session?.token) {
      config.headers['Authorization'] = `Bearer ${session.token.trim()}`
    }

    console.log(`[API Request Outgoing] ${config.method?.toUpperCase()} ${config.url}`, {
      url: `${config.baseURL || ''}${config.url}`,
      headers: {
        'x-app-key': config.headers['x-app-key'] || '(TIDAK ADA)',
        'Authorization': config.headers['Authorization'] || '(TIDAK ADA)',
      },
      data: config.data,
      sessionInStorage: session,
    })

    return config
  },
  (error) => {
    console.error('[API Request Interceptor Error]:', error)
    return Promise.reject(error)
  }
)

// Interceptor Response: Log respons & error untuk inspeksi status dan response body
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response Success] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        data: response.data,
      }
    )
    return response
  },
  (error) => {
    console.error(
      `[API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headersSent: {
          'x-app-key': error.config?.headers?.['x-app-key'],
          'Authorization': error.config?.headers?.['Authorization'],
        },
      }
    )
    return Promise.reject(error)
  }
)

export default api
