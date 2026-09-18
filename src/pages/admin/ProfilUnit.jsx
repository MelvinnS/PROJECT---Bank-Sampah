import { useEffect, useState, useCallback } from 'react'
import {
  Building2,
  User,
  Phone,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Info,
  Lock,
  Calendar,
  Sparkles,
  MapPin,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAdminProfile } from '../../services/adminService'

export default function ProfilUnit() {
  const { session, logout } = useAuth()

  // ── States ──
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // ── Fetch Profile ──
  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminProfile()
      console.log('[ProfilUnit] GET /auth/me response:', res.data)
      const data = res.data?.data ?? res.data ?? null
      setProfileData(data)
    } catch (err) {
      console.error('[ProfilUnit] Error fetch profile:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat profil unit bank sampah.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Extract Admin Unit Details
  const adminBank = profileData?.adminBank || profileData?.user?.adminBank || profileData || {}
  const user = profileData?.user || profileData || {}

  const namaUnit =
    adminBank.namaUnit ||
    adminBank.nama ||
    session?.namaUnit ||
    'Bank Sampah Digital'
  const namaPengelola =
    adminBank.namaPengelola ||
    user.nama ||
    session?.namaPengelola ||
    session?.username ||
    'Administrator'
  const noTelepon =
    adminBank.noHp ||
    adminBank.telp ||
    adminBank.noTelepon ||
    user.noHp ||
    '-'
  const username =
    user.username ||
    adminBank.username ||
    session?.username ||
    'admin'
  const email = user.email || adminBank.email || '-'

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 mb-2 border border-brand-100">
            <Building2 size={13} className="text-brand-600" />
            Pengaturan Unit
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Profil Unit Bank Sampah
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Informasi identitas unit dan pengelola operasional Bank Sampah.
          </p>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={fetchProfile}
          title="Muat ulang data profil"
          className="self-start sm:self-auto flex h-10 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3.5 text-xs font-bold text-gray-600 hover:border-brand-200 hover:text-brand-700 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-brand-600' : ''} />
          <span>Segarkan</span>
        </button>
      </div>

      {/* ── Error Alert ── */}
      {errorMsg && !loading && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-700 shadow-xs animate-fadeIn">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Gagal memuat profil</p>
            <p className="text-xs mt-0.5 opacity-80">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={fetchProfile}
            className="text-xs font-bold text-red-600 underline underline-offset-2 hover:text-red-800 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* ── Main Centered 2-Column Card ── */}
      <div className="rounded-3xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
            <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="h-28 w-28 rounded-3xl bg-gray-200" />
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-7 w-36 bg-gray-200 rounded-full" />
            </div>
            <div className="md:col-span-7 space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded-2xl" />
              <div className="h-12 w-full bg-gray-200 rounded-2xl" />
              <div className="h-12 w-full bg-gray-200 rounded-2xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* ── Left Column: Identity & Badges (5 cols) ── */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col items-center text-center justify-between bg-gradient-to-b from-brand-50/40 via-white to-white">
              <div className="flex flex-col items-center w-full">
                {/* Large Unit Avatar Icon */}
                <div className="relative mb-4">
                  <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 border-4 border-white">
                    <Building2 size={48} strokeWidth={1.75} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                    <ShieldCheck size={16} />
                  </div>
                </div>

                {/* Nama Unit & Pengelola */}
                <h2 className="font-display text-xl font-bold text-ink leading-snug">
                  {namaUnit}
                </h2>
                <p className="text-sm font-semibold text-brand-700 mt-1">
                  {namaPengelola}
                </p>

                {/* Badge Role */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200/80 px-3.5 py-1 text-xs font-bold text-brand-800">
                  <ShieldCheck size={14} className="text-brand-600" />
                  <span>Admin Bank Sampah</span>
                </div>

                {/* Quick Info List */}
                <div className="w-full mt-6 space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-400">Username:</span>
                    <span className="font-mono font-bold text-ink">@{username}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-400">Hak Akses:</span>
                    <span className="font-bold text-emerald-700">Administrator Penuh</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-400">Status Sistem:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif / Terhubung
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="mt-6 w-full rounded-2xl bg-sand/30 border border-gray-100 p-3 text-[11px] text-gray-400 leading-relaxed">
                Unit resmi terdaftar dalam jaringan Bank Sampah Digital.
              </div>
            </div>

            {/* ── Right Column: Profile Form (7 cols) ── */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">
                      Detail Informasi Unit
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Data operasional unit bank sampah
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-xl">
                    Read-Only
                  </span>
                </div>

                {/* Form Fields (Read-Only) */}
                <div className="mt-5 space-y-4">
                  {/* Nama Unit */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nama Unit Bank Sampah
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                        <Building2 size={16} />
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={namaUnit}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-3 text-sm font-semibold text-ink focus:outline-none cursor-default select-all"
                      />
                    </div>
                  </div>

                  {/* Nama Pengelola */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nama Pengelola / Penanggung Jawab
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={namaPengelola}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-3 text-sm font-semibold text-ink focus:outline-none cursor-default select-all"
                      />
                    </div>
                  </div>

                  {/* No Telepon */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nomor Telepon / Kontak Unit
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={noTelepon}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-3 text-sm font-semibold text-ink focus:outline-none cursor-default select-all"
                      />
                    </div>
                  </div>

                  {/* Username Akun */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Username Login Admin
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                        <Lock size={16} />
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={username}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-3 text-sm font-mono font-semibold text-ink focus:outline-none cursor-default select-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Read-Only Notice Box & Disabled Save Button */}
              <div className="mt-8 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 p-3.5 text-xs text-amber-800">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Catatan:</strong> Fitur edit profil unit belum tersedia di API backend. Informasi di atas disinkronisasi langsung dari data sesi akun administrator.
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  title="Fitur edit belum tersedia di API"
                  className="w-full rounded-2xl bg-gray-200 py-3 text-sm font-bold text-gray-400 cursor-not-allowed transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
