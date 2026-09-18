import { useState } from 'react'
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  MapPin,
  Phone,
  User,
  XCircle,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginUser, registerNasabah } from '../../services/authService'
import BackgroundFoliage from '../../components/nasabah/BackgroundFoliage'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, login } = useAuth()

  // Tab State: 'login' | 'register' (Register hanya untuk Nasabah)
  const [tab, setTab] = useState(location.state?.tab || 'login')

  // Redirection target fallback
  const from = location.state?.from || '/'

  // Login Form States
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false,
  })
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register Form States (Khusus Nasabah)
  const [registerForm, setRegisterForm] = useState({
    namaNasabah: '',
    alamat: '',
    telp: '',
    username: '',
    password: '',
    foto: null,
    fotoPreview: null,
  })
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)

  // UI States
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Handle Foto Upload Preview
  const handleFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Ukuran foto maksimal 2MB')
        return
      }
      setRegisterForm((prev) => ({
        ...prev,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      }))
    }
  }

  // Handle Tab Switch
  const switchTab = (newTab) => {
    setErrorMsg('')
    setSuccessMsg('')
    setTab(newTab)
  }

  // Helper to extract session data and log user in
  const processLoginResponse = (res, fallbackUsername) => {
    console.log('[Login processLoginResponse raw res]:', res)
    console.log('[Login processLoginResponse res.data]:', res.data)
    const data = res.data?.data || res.data
    const token = data?.token
    const rawRole = data?.role || data?.user?.role || (data?.adminBank ? 'ADMIN' : 'NASABAH')
    const role = String(rawRole).toUpperCase()
    const user = data?.nasabah || data?.adminBank || data?.user || {
      namaNasabah: data?.namaNasabah || data?.namaAdmin || data?.nama || fallbackUsername,
      nama: data?.nama || data?.namaNasabah || data?.namaAdmin || fallbackUsername,
      username: fallbackUsername,
    }

    console.log('[Login processLoginResponse parsed token]:', token)
    console.log('[Login processLoginResponse parsed role]:', role)
    console.log('[Login processLoginResponse parsed user]:', user)

    if (!token) {
      console.error('[Login processLoginResponse] ERROR: Token kosong/tidak ditemukan!')
      throw new Error('Token tidak ditemukan dalam respons server.')
    }

    login({ token, role, user })
    return role
  }

  // Handle Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!loginForm.username.trim() || !loginForm.password) {
      setErrorMsg('Harap isi username dan password.')
      return
    }

    setLoading(true)
    try {
      console.log('[Login handleLoginSubmit] Mengirim request login untuk:', loginForm.username.trim())
      const res = await loginUser({
        username: loginForm.username.trim(),
        password: loginForm.password,
      })

      const userRole = processLoginResponse(res, loginForm.username.trim())
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Username atau password salah.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  // Handle Submit Register Nasabah
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const namaNasabah = registerForm.namaNasabah.trim()
    const alamat = registerForm.alamat.trim()
    const telp = registerForm.telp.trim()
    const username = registerForm.username.trim()
    const password = registerForm.password

    if (!namaNasabah || !alamat || !telp || !username || !password) {
      setErrorMsg('Semua kolom bertanda wajib harus diisi.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    try {
      // 1. Panggil POST /auth/nasabah/register
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('namaNasabah', namaNasabah)
      formData.append('alamat', alamat)
      formData.append('telp', telp)
      if (registerForm.foto) {
        formData.append('foto', registerForm.foto)
      }

      await registerNasabah(formData)

      // Reset register form & siapkan form login
      setRegisterForm({
        namaNasabah: '',
        alamat: '',
        telp: '',
        username: '',
        password: '',
        foto: null,
        fotoPreview: null,
      })

      setLoginForm((prev) => ({
        ...prev,
        username: username,
        password: '',
      }))

      setSuccessMsg('Pendaftaran akun nasabah berhasil! Silakan masuk menggunakan username dan kata sandi Anda.')
      setTab('login')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Pendaftaran gagal. Periksa data atau coba lagi.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-sand px-4 py-8 sm:py-12 selection:bg-brand-100 selection:text-brand-900 overflow-hidden">
      {/* Background Decorative Ambient Leaves */}
      <BackgroundFoliage />

      {/* Decorative Gradient Blooms */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-brand-100/50 via-brand-50/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-200/30 blur-2xl" />

      {/* Top Header Links */}
      <div className="w-full max-w-md mb-4 flex items-center justify-start z-10 text-xs sm:text-sm font-semibold">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-gray-500 hover:text-brand-700 transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs border border-gray-100 group-hover:border-brand-200 transition-colors">
            <ArrowLeft size={16} />
          </span>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Main Form Card Container */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-card border border-[#e2efe5]">
        {/* Header: Logo & Title */}
        <div className="text-center">
          {/* Logo Badge */}
          <Link to="/" className="inline-flex items-center justify-center gap-2.5 mb-3 group">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Leaf size={22} strokeWidth={2.25} />
            </span>
            <div className="text-left leading-tight">
              <p className="text-base font-bold text-ink">Bank Sampah</p>
              <p className="-mt-0.5 text-base font-bold text-brand-600">Digital</p>
            </div>
          </Link>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            {tab === 'login' ? 'Selamat Datang Kembali 👋' : 'Daftar Akun Nasabah 🌱'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {tab === 'login'
              ? 'Masuk untuk mengelola akun Anda.'
              : 'Mulai langkah kecil untuk bumi yang lebih bersih dan kumpulkan poin.'}
          </p>
        </div>

        {/* Tab Switcher: Login vs Daftar Nasabah */}
        <div className="mt-6 flex rounded-2xl bg-brand-50/70 p-1.5 border border-brand-100/60">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
              tab === 'login'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-500 hover:text-ink hover:bg-white/40'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
              tab === 'register'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-500 hover:text-ink hover:bg-white/40'
            }`}
          >
            Daftar Nasabah
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200/80 p-3 text-xs text-red-700 animate-fadeIn">
            <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-3 text-xs text-emerald-800 animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* ===================== FORM LOGIN ===================== */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5" htmlFor="login-username">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <User size={17} />
                </span>
                <input
                  id="login-username"
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                  placeholder="Masukkan username"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock size={17} />
                </span>
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Masukkan password"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm((p) => ({ ...p, rememberMe: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Ingat saya
              </label>
              <button
                type="button"
                onClick={() =>
                  setErrorMsg('Silakan hubungi administrator bank sampah untuk mereset kata sandi.')
                }
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                'Masuk Sekarang'
              )}
            </button>

            {/* Switch to Register tab */}
            <div className="pt-2 text-center text-xs text-gray-500">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => switchTab('register')}
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors cursor-pointer"
              >
                Daftar sekarang
              </button>
            </div>
          </form>
        )}

        {/* ===================== FORM DAFTAR NASABAH ===================== */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-3.5">
            {/* Foto Profil (Opsional) */}
            <div className="flex flex-col items-center justify-center pb-1">
              <div className="relative group cursor-pointer">
                <div className="h-20 w-20 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center overflow-hidden shadow-xs">
                  {registerForm.fotoPreview ? (
                    <img
                      src={registerForm.fotoPreview}
                      alt="Preview Foto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-brand-400" />
                  )}
                </div>
                <label
                  htmlFor="register-foto"
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-brand-700 transition-all group-hover:scale-105"
                >
                  <Camera size={14} />
                </label>
                <input
                  id="register-foto"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-gray-400 font-medium">
                Upload Foto (Opsional, maks 2MB)
              </p>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1" htmlFor="reg-nama">
                Nama Lengkap <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <User size={16} />
                </span>
                <input
                  id="reg-nama"
                  type="text"
                  required
                  value={registerForm.namaNasabah}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, namaNasabah: e.target.value }))}
                  placeholder="Contoh: Budi Pratama"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1" htmlFor="reg-alamat">
                Alamat Lengkap <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <MapPin size={16} />
                </span>
                <input
                  id="reg-alamat"
                  type="text"
                  required
                  value={registerForm.alamat}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, alamat: e.target.value }))}
                  placeholder="Contoh: Jl. Melati No. 12, RT 02/05"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            {/* No. Telepon */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1" htmlFor="reg-telp">
                No. Telepon / WhatsApp <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Phone size={16} />
                </span>
                <input
                  id="reg-telp"
                  type="tel"
                  required
                  value={registerForm.telp}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, telp: e.target.value }))}
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1" htmlFor="reg-username">
                Username <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <User size={16} />
                </span>
                <input
                  id="reg-username"
                  type="text"
                  required
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))}
                  placeholder="Pilih username unik"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1" htmlFor="reg-password">
                Password <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  id="reg-password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl2 border border-gray-200 bg-white pl-10 pr-10 py-2 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </div>
              ) : (
                'Daftar Sekarang'
              )}
            </button>

            {/* Switch to Login tab */}
            <div className="pt-2 text-center text-xs text-gray-500">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors cursor-pointer"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
