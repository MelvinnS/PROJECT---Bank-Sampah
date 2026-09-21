import { useEffect, useState, useCallback } from 'react'
import {
  AlertCircle,
  ChevronRight,
  Gift,
  Info,
  Leaf,
  LogOut,
  MapPin,
  PencilOff,
  Phone,
  ReceiptText,
  Recycle,
  Sparkles,
  Star,
  User,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMe } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'

// Decorative photo for the "Jaga bumi dengan langkah kecil" promo card
// (reused from the app's existing waste-category imagery for consistency).
const PROMO_PHOTO =
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80&auto=format&fit=crop'

export default function Profil() {
  const { isGuest, session, logout, isInitializing } = useAuth()
  const navigate = useNavigate()

  // Route Protection
  useEffect(() => {
    if (isGuest) {
      navigate('/login', { state: { from: '/akun' }, replace: true })
    }
  }, [isGuest, navigate])

  // Profile State
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Fetch Profile Data
  const fetchProfile = useCallback(async () => {
    if (isInitializing || isGuest) return

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await getMe()
      const data = res.data?.data ?? res.data
      setProfileData(data)
    } catch (err) {
      console.error('[getMe error]:', err.response || err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat informasi profil.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }, [isInitializing, isGuest])

  useEffect(() => {
    if (!isInitializing && !isGuest) {
      fetchProfile()
    }
  }, [isInitializing, isGuest, fetchProfile])

  // Extract Profile Fields
  const nasabah = profileData?.nasabah || profileData || {}
  const user = profileData?.user || profileData || {}

  const namaNasabah =
    nasabah.namaNasabah ||
    nasabah.nama ||
    session.user?.namaNasabah ||
    session.user?.nama ||
    'Nasabah'
  const username = user.username || nasabah.username || session.user?.username || '-'
  const alamat = nasabah.alamat || session.user?.alamat || '-'
  const telp = nasabah.telp || nasabah.noHp || session.user?.telp || session.user?.noHp || '-'
  const saldoPoin = Number(
    nasabah.saldoPoin ?? profileData?.saldoPoin ?? session.user?.saldoPoin ?? 0
  )
  const rawFoto = nasabah.foto || user.foto || profileData?.foto || session.user?.foto || session.user?.nasabah?.foto
  const fotoUrl = resolveFotoUrl(rawFoto)

  // Ringkasan setoran — dibaca secara defensif dari data profil yang sama
  // (tidak ada request tambahan), dengan fallback 0 bila field belum tersedia.
  const totalSetoranKg = Number(
    nasabah.totalSampahDisetorKg ?? nasabah.totalSetoranKg ?? profileData?.totalSampahDisetorKg ?? 0
  )
  const estimasiNilaiSampah = Number(
    nasabah.estimasiNilaiSampah ?? profileData?.estimasiNilaiSampah ?? 0
  )
  const jumlahJenisSampah = Number(
    nasabah.jumlahJenisSampah ?? profileData?.jumlahJenisSampah ?? 0
  )

  const avatarInitial = namaNasabah ? namaNasabah.trim().charAt(0).toUpperCase() : 'N'

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (isGuest) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 pb-2 max-w-6xl mx-auto">
      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchProfile}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="animate-pulse rounded-3xl bg-white p-6 shadow-card border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="h-20 w-20 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2.5 w-full">
            <div className="h-5 w-44 bg-gray-200 rounded-md" />
            <div className="h-4 w-32 bg-gray-200 rounded-md" />
            <div className="h-4 w-60 bg-gray-200 rounded-md pt-2" />
          </div>
        </div>
      )}

      {/* Main Grid: Left profile details, Right summary sidebar */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Column (8 cols on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Identity Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-card border border-[#153d23]/10">
                {/* Decorative arc */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full border-[24px] border-[#153d23]/5" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                    {/* Avatar */}
                    <div className="relative h-20 w-20 shrink-0">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#153d23]/10 to-[#153d23]/20 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {fotoUrl ? (
                          <>
                            <img
                              src={fotoUrl}
                              alt={namaNasabah}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                if (e.currentTarget.nextSibling) {
                                  e.currentTarget.nextSibling.style.display = 'flex'
                                }
                              }}
                            />
                            <div className="h-full w-full flex items-center justify-center" style={{ display: 'none' }}>
                              <span className="font-display text-2xl font-extrabold text-[#153d23] select-none">
                                {avatarInitial}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="font-display text-2xl font-extrabold text-[#153d23] select-none">
                            {avatarInitial}
                          </span>
                        )}
                      </div>
                      {/* Badge */}
                      <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#153d23] text-white border-2 border-white shadow-xs">
                        <Leaf size={11} />
                      </span>
                    </div>

                    {/* Name & Contact */}
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h2 className="font-display text-xl sm:text-2xl font-black text-[#0f2e1b] tracking-tight">
                          {namaNasabah}
                        </h2>
                        <PencilOff size={16} className="text-gray-300" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">@{username}</p>

                      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-[#153d23]" />
                          {telp}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#153d23]" />
                          {alamat}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Saldo Poin Highlight — compact solid badge */}
                  <div className="shrink-0 rounded-2xl bg-gradient-to-br from-[#153d23] to-[#0f2e1b] px-4 py-3 shadow-sm min-w-[170px]">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200/90">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      Saldo Poin Anda
                    </p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-display text-2xl font-black text-white tracking-tight">
                        {saldoPoin.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs font-bold text-emerald-200">Poin</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Pribadi */}
              <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
                <h3 className="font-display text-base font-bold text-ink mb-4 flex items-center gap-2">
                  <User size={17} className="text-[#153d23]" />
                  Informasi Pribadi
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-2xl bg-sand/30 p-4 border border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">Nama Lengkap</span>
                    <p className="mt-1 font-bold text-ink text-sm sm:text-base">{namaNasabah}</p>
                  </div>

                  <div className="rounded-2xl bg-sand/30 p-4 border border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">Username Login</span>
                    <p className="mt-1 font-bold text-ink text-sm sm:text-base">{username}</p>
                  </div>

                  <div className="rounded-2xl bg-sand/30 p-4 border border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">Nomor WhatsApp / Telepon</span>
                    <p className="mt-1 font-bold text-ink text-sm sm:text-base">{telp}</p>
                  </div>

                  <div className="rounded-2xl bg-sand/30 p-4 border border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">Alamat Tempat Tinggal</span>
                    <p className="mt-1 font-bold text-ink text-sm sm:text-base">{alamat}</p>
                  </div>
                </div>

                {/* Read-Only Notice */}
                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/60">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Info size={13} />
                  </span>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Perubahan data profil (nama, alamat, telepon) saat ini dapat dilakukan melalui Administrator Bank Sampah.
                  </p>
                </div>
              </div>

              {/* Aktivitas & Layanan */}
              <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
                <h3 className="font-display text-base font-bold text-ink mb-3 flex items-center gap-2">
                  <ReceiptText size={17} className="text-[#153d23]" />
                  Aktivitas &amp; Layanan
                </h3>

                <div className="divide-y divide-gray-100">
                  <Link
                    to="/riwayat"
                    className="flex items-center justify-between py-3.5 hover:bg-sand/30 px-2 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#153d23]/10 text-[#153d23] group-hover:scale-105 transition-transform">
                        <ReceiptText size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink group-hover:text-[#153d23] transition-colors">
                          Riwayat Setoran Sampah
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Lihat status penimbangan dan poin yang masuk</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#153d23] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>

                  <Link
                    to="/hadiah"
                    className="flex items-center justify-between py-3.5 hover:bg-sand/30 px-2 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#153d23]/10 text-[#153d23] group-hover:scale-105 transition-transform">
                        <Gift size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink group-hover:text-[#153d23] transition-colors">
                          Katalog Penukaran Poin
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Tukar saldo poin dengan berbagai hadiah menarik</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#153d23] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols on desktop): Sticky Summary Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-5">
              {/* Saldo Poin — solid dark green card */}
              <Link
                to="/riwayat"
                className="flex items-center justify-between gap-3 rounded-3xl bg-gradient-to-br from-[#153d23] via-[#12361f] to-[#0f2e1b] px-5 py-5 shadow-card hover:opacity-95 transition-all"
              >
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200/90">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    Saldo Poin Anda
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-black text-white tracking-tight">
                      {saldoPoin.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs font-bold text-emerald-200">Poin</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-emerald-200 shrink-0" />
              </Link>

              {/* Quick Stats Row */}
              <div className="rounded-3xl bg-white shadow-card border border-gray-100 px-4 py-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Total Setoran</p>
                  <p className="mt-1 text-sm font-bold text-ink">{totalSetoranKg} Kg</p>
                </div>
                <div className="border-l border-gray-100">
                  <p className="text-[10px] text-gray-400 font-medium">Estimasi Nilai Sampah</p>
                  <p className="mt-1 text-sm font-bold text-ink">
                    Rp {estimasiNilaiSampah.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="border-l border-gray-100">
                  <p className="text-[10px] text-gray-400 font-medium">Jumlah Jenis Sampah</p>
                  <p className="mt-1 text-sm font-bold text-ink">{jumlahJenisSampah} Jenis</p>
                </div>
              </div>

              {/* Promo Card */}
              <div className="relative overflow-hidden rounded-3xl bg-[#153d23]/5 border border-[#153d23]/15 p-5">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#153d23]/10 text-[#153d23] mb-2.5">
                      <Recycle size={16} />
                    </span>
                    <h3 className="font-display text-base font-bold text-ink leading-snug">
                      Jaga bumi dengan langkah kecil
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      Setiap langkah kecilmu, meski terlihat sederhana, bisa membawa dampak besar untuk lingkungan sekitar.
                    </p>
                    <Link
                      to="/kategori-sampah"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#153d23] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f2e1b] transition-colors"
                    >
                      Lihat lebih lanjut <ChevronRight size={13} />
                    </Link>
                  </div>
                  <div className="hidden xs:block w-24 shrink-0 rounded-2xl overflow-hidden self-stretch">
                    <img
                      src={PROMO_PHOTO}
                      alt="Jaga bumi dengan langkah kecil"
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Informasi Akun */}
              <div className="rounded-3xl bg-white p-5 shadow-card border border-gray-100">
                <h3 className="font-display text-sm font-bold text-ink mb-3.5 flex items-center gap-2">
                  <Sparkles size={15} className="text-[#153d23]" />
                  Informasi Akun
                </h3>

                <div className="space-y-2.5 text-sm pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs sm:text-sm">Total Setoran</span>
                    <span className="font-bold text-ink">{totalSetoranKg} Kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs sm:text-sm">Estimasi Nilai Sampah</span>
                    <span className="font-bold text-ink">
                      Rp {estimasiNilaiSampah.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs sm:text-sm">Jumlah Jenis Sampah</span>
                    <span className="font-bold text-ink">{jumlahJenisSampah} Jenis</span>
                  </div>
                </div>

                {/* Read-Only Notice */}
                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50/70 p-3 border border-amber-200/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Info size={11} />
                  </span>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Perubahan data profil (nama, alamat, telepon) saat ini dapat dilakukan melalui Administrator Bank Sampah.
                  </p>
                </div>
              </div>

              {/* Logout Action Button */}
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-ink hover:bg-gray-50 active:scale-[0.99] transition-all cursor-pointer shadow-card"
              >
                <LogOut size={16} className="text-gray-500" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 pt-2 text-[11px] text-gray-400">
            <span>© {new Date().getFullYear()} Bank Sampah Digital. Bersama untuk lingkungan yang lebih baik.</span>
            <span className="font-semibold">Versi 1.0.0</span>
          </div>
        </>
      )}

      {/* Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-center animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs border border-red-100">
              <LogOut size={26} strokeWidth={2} />
            </div>

            <h3 className="font-display text-lg font-bold text-ink">
              Konfirmasi Keluar
            </h3>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun ini? Sesi Anda akan diakhiri.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}