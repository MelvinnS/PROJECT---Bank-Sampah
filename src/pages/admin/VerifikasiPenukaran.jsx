import { useState, useEffect, useCallback } from 'react'
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckCircle,
  Gift,
  User,
  Star,
  RefreshCw,
  ArrowLeft,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  getAdminPenukaranList,
  updateAdminPenukaranStatus,
} from '../../services/adminService'
import { resolveFotoUrl } from '../../services/api'

// Helper: Format Date to "16 September 2026"
function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function VerifikasiPenukaran() {
  const location = useLocation()
  const [kodeInput, setKodeInput] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [foundItem, setFoundItem] = useState(null)
  const [searchError, setSearchError] = useState('')

  // Action status
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [successToast, setSuccessToast] = useState('')

  // ── Handle Search Kode ──
  const handleSearchWithQuery = useCallback(async (queryParam) => {
    const query = (queryParam ?? kodeInput).trim()
    if (!query) {
      setSearchError('Silakan masukkan kode penukaran terlebih dahulu.')
      setFoundItem(null)
      return
    }

    setSearching(true)
    setSearchError('')
    setActionError('')
    setSuccessToast('')
    setSearchAttempted(true)

    try {
      // Fetch list from admin API (without month/status constraint to find across all records)
      const res = await getAdminPenukaranList({})
      const data = res.data?.data ?? res.data ?? []
      const list = Array.isArray(data) ? data : []

      const cleanQuery = query.toLowerCase()

      // Find match
      const matched = list.find((item) => {
        const k = String(
          item.kodePenukaran || item.kodeTransaksi || item.kode || item.id || ''
        ).toLowerCase()
        return k === cleanQuery || k.includes(cleanQuery)
      })

      if (matched) {
        setFoundItem(matched)
        setSearchError('')
      } else {
        setFoundItem(null)
        setSearchError(
          `Kode penukaran "${query}" tidak ditemukan. Pastikan kode yang dimasukkan sudah sesuai.`
        )
      }
    } catch (err) {
      console.error('[VerifikasiPenukaran] Search error:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal mencari data penukaran poin.'
      setSearchError(msg)
      setFoundItem(null)
    } finally {
      setSearching(false)
    }
  }, [kodeInput])

  // ── Auto Search on mount if kode passed via location.state ──
  useEffect(() => {
    if (location.state?.kode) {
      setKodeInput(location.state.kode)
      handleSearchWithQuery(location.state.kode)
    }
  }, [location.state, handleSearchWithQuery])

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    handleSearchWithQuery(kodeInput)
  }

  // ── Handle Tandai Selesai ──
  const handleTandaiSelesai = async () => {
    if (!foundItem) return
    const id = foundItem.id || foundItem.penukaranId || foundItem._id
    setSubmitting(true)
    setActionError('')

    try {
      console.log(`[VerifikasiPenukaran] Updating status to 'selesai' for ID: ${id}`)
      await updateAdminPenukaranStatus(id, { status: 'selesai' })

      const namaNasabah =
        foundItem.nasabah?.namaNasabah ||
        foundItem.nasabah?.nama ||
        foundItem.namaNasabah ||
        'Nasabah'
      const namaHadiah =
        foundItem.hadiah?.namaHadiah ||
        foundItem.hadiah?.nama ||
        foundItem.namaHadiah ||
        'Hadiah'

      setSuccessToast(
        `Sukses! Penukaran "${namaHadiah}" untuk ${namaNasabah} berhasil ditandai selesai.`
      )

      // Reset form search for next verification
      setFoundItem(null)
      setKodeInput('')
      setSearchAttempted(false)
    } catch (err) {
      console.error('[VerifikasiPenukaran] Error marking selesai:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memperbarui status penukaran.'
      setActionError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const rawStatus = String(foundItem?.status || 'diproses').toLowerCase()
  const isSelesai = rawStatus === 'selesai'
  const isDiproses = !isSelesai

  const namaNasabah =
    foundItem?.nasabah?.namaNasabah ||
    foundItem?.nasabah?.nama ||
    foundItem?.namaNasabah ||
    foundItem?.user?.nama ||
    'Nasabah'
  const username =
    foundItem?.nasabah?.user?.username ||
    foundItem?.nasabah?.username ||
    foundItem?.username ||
    ''
  const namaHadiah =
    foundItem?.hadiah?.namaHadiah ||
    foundItem?.hadiah?.nama ||
    foundItem?.namaHadiah ||
    'Hadiah'
  const poin = Number(
    foundItem?.poinTerpakai ??
      foundItem?.totalPoin ??
      foundItem?.poin ??
      foundItem?.hadiah?.poinDibutuhkan ??
      0
  )
  const kode =
    foundItem?.kodePenukaran ||
    foundItem?.kodeTransaksi ||
    foundItem?.kode ||
    `#TRX-${foundItem?.id}`
  const tanggal = formatDate(
    foundItem?.tanggal || foundItem?.createdAt || foundItem?.tanggalPenukaran
  )
  const fotoHadiah = resolveFotoUrl(foundItem?.hadiah?.foto || foundItem?.foto)

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/admin/transaksi-penukaran"
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-brand-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Kembali ke Transaksi Penukaran
            </Link>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 mb-1 border border-brand-100">
            <ShieldCheck size={13} className="text-brand-600" />
            Validasi Petugas
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Verifikasi Penukaran Hadiah
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Cari kode bukti penukaran nasabah dan serahkan hadiah yang sesuai.
          </p>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {successToast && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-800 shadow-xs animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="font-bold flex-1">{successToast}</span>
          <button
            type="button"
            onClick={() => setSuccessToast('')}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── Search Form Card ── */}
      <div className="rounded-3xl bg-white shadow-card border border-gray-100 p-5 sm:p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Masukkan Kode Penukaran / Bukti Nasabah
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={kodeInput}
                onChange={(e) => {
                  setKodeInput(e.target.value)
                  if (searchError) setSearchError('')
                }}
                placeholder="Contoh: TKR-20260918-001..."
                className="w-full rounded-2xl border border-gray-200 bg-sand/30 pl-11 pr-4 py-3 text-sm font-mono font-semibold text-ink placeholder-gray-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shrink-0"
            >
              {searching ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Cari Penukaran</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-gray-400">
            Petunjuk: Nasabah memperlihatkan kode penukaran dari halaman Bukti Pengambilan di aplikasi mereka.
          </p>
        </form>

        {/* Search Error Alert */}
        {searchError && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 animate-fadeIn">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{searchError}</div>
          </div>
        )}
      </div>

      {/* ── Detail Card if Found ── */}
      {foundItem && (
        <div className="rounded-3xl bg-white shadow-card border border-gray-100 overflow-hidden animate-scaleUp">
          {/* Header Card */}
          <div className="px-6 py-4 border-b border-gray-100 bg-sand/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-xs">
                <Gift size={15} />
              </span>
              <h2 className="font-display text-base font-bold text-ink">
                Detail Transaksi Ditemukan
              </h2>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${
                isSelesai
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isSelesai ? <CheckCircle size={12} /> : <Clock size={12} />}
              {isSelesai ? 'Status: Selesai' : 'Status: Diproses (Menunggu Pengambilan)'}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Kode Highlight Box */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-4 border border-brand-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                  Kode Penukaran
                </p>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-brand-900 tracking-wider mt-0.5">
                  {kode}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] text-gray-500 font-medium">Tanggal Pengajuan</p>
                <p className="text-xs font-bold text-ink mt-0.5 flex items-center sm:justify-end gap-1">
                  <Calendar size={13} className="text-brand-600" />
                  {tanggal}
                </p>
              </div>
            </div>

            {/* Grid Detail Nasabah & Hadiah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nasabah Card */}
              <div className="rounded-2xl border border-gray-100 bg-sand/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <User size={13} className="text-brand-600" />
                  <span>Data Nasabah</span>
                </div>
                <div>
                  <p className="font-bold text-base text-ink">{namaNasabah}</p>
                  {username && <p className="text-xs text-gray-500">@{username}</p>}
                </div>
              </div>

              {/* Hadiah Card */}
              <div className="rounded-2xl border border-gray-100 bg-sand/30 p-4 flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {fotoHadiah ? (
                    <img
                      src={fotoHadiah}
                      alt={namaHadiah}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="flex items-center justify-center w-full h-full text-brand-600"
                    style={{ display: fotoHadiah ? 'none' : 'flex' }}
                  >
                    <Gift size={24} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Hadiah yang Ditukar
                  </p>
                  <p className="font-bold text-sm text-ink truncate mt-0.5">{namaHadiah}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-700 mt-1">
                    <Star size={13} className="fill-amber-400 text-amber-500" />
                    <span>{poin.toLocaleString('id-ID')} Poin Terpakai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Alert if Error */}
            {actionError && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 animate-fadeIn">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{actionError}</div>
              </div>
            )}

            {/* Verification Status & Action Button */}
            <div className="pt-2 border-t border-gray-100">
              {isDiproses ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
                  <div>
                    <p className="font-bold text-sm text-brand-900">
                      Konfirmasi Penyerahan Hadiah
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Pastikan hadiah fisik telah diserahkan langsung ke nasabah sebelum menandai selesai.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTandaiSelesai}
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shrink-0"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Tandai Selesai &amp; Serahkan</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-800">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs sm:text-sm">
                      Transaksi ini sudah selesai diproses
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Hadiah telah diserahkan ke nasabah. Tidak diperlukan tindakan lebih lanjut.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
