import axios from 'axios'
import api, { BASE_URL } from './api'

/**
 * 1. App Maker Registration (App Key)
 * POST /maker/register (tanpa header apapun)
 * Body: { email, password, namaSiswa, kelas, namaApp }
 */
export const registerAppMaker = async (payload) => {
  return axios.post(`${BASE_URL}/maker/register`, payload)
}

/**
 * 2. Register Nasabah
 * POST /auth/nasabah/register
 * Header: x-app-key (otomatis dari interceptor di api.js)
 * Body: multipart/form-data (username, password, namaNasabah, alamat, telp, foto?)
 */
export const registerNasabah = async (payload) => {
  let data = payload
  if (!(payload instanceof FormData)) {
    data = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        data.append(key, payload[key])
      }
    })
  }

  return api.post('/auth/nasabah/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 3. Login (Nasabah / Admin)
 * POST /auth/login
 * Header: x-app-key (otomatis dari interceptor di api.js)
 * Body: { username, password }
 */
export const loginUser = async (payload, maybePassword) => {
  const body =
    typeof payload === 'string'
      ? { username: payload, password: maybePassword }
      : payload

  return api.post('/auth/login', body)
}
