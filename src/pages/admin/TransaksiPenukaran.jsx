import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Gift,
  Clock,
  CheckCircle,
  Calendar,
  Inbox,
  User,
  Star,
  ChevronRight,
  Filter,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { getAdminPenukaranList } from '../../services/adminService'
import { resolveFotoUrl } from '../../services/api'

// Helper: Format Date to "16 September 2026"
function formatDateHeader(dateStr) {
  if (!dateStr) return 'Tanggal Tidak Diketahui'
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

// Helper: Format Time e.g. "14:30"
function formatTime(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Status style configuration
const STATUS_CONFIG = {
  diproses: {
    label: 'Diproses',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  menunggu: {
    label: 'Diproses',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  selesai: {
    label: 'Selesai',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
  },
}

function getStatusStyle(rawStatus) {
  const s = String(rawStatus || 'diproses').toLowerCase()
  return STATUS_CONFIG[s] || STATUS_CONFIG.diproses
}

// ── Modal Detail Transaksi (Purely read-only with redirect to Verifikasi Penukaran) ──
function DetailTransaksiModal({
  show,
  item,
  onClose,
  onGoToVerifikasi,
}) {
  if (!show || !item) return null

  const namaNasabah =
    item.nasabah?.namaNasabah ||
    item.nasabah?.nama ||
    item.namaNasabah ||
    item.user?.nama ||
    'Nasabah'
  const username = item.nasabah?.user?.username || item.nasabah?.username || item.username || ''
  const namaHadiah =
    item.hadiah?.namaHadiah || item.hadiah?.nama || item.namaHadiah || 'Hadiah'
  const poin = Number(
    item.poinTerpakai ?? item.totalPoin ?? item.poin ?? item.hadiah?.poinDibutuhkan ?? 0
  )
  const kode = item.kodeTransaksi || item.kodePenukaran || item.kode || `#TRX-${item.id}`
  const tanggal = formatDateHeader(item.tanggal || item.createdAt || item.tanggalPenukaran)
  const fotoHadiah = resolveFotoUrl(item.hadiah?.foto || item.foto)
  const rawStatus = item.status || 'diproses'
  const statusStyle = getStatusStyle(rawStatus)
  const StatusIcon = statusStyle.icon
  const isSelesai = String(rawStatus).toLowerCase() === 'selesai'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sand/40">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <ArrowLeftRight size={16} />
            </div>
            <h3 className="font-display font-bold text-base text-ink">Detail Transaksi Penukaran</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Transaction Summary Card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {fotoHadiah ? (
                    <img src={fotoHadiah} alt={namaHadiah} className="h-full w-full object-cover" />
                  ) : (
                    <Gift size={22} className="text-brand-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-ink leading-tight">{namaHadiah}</p>
                  <p className="text-xs text-brand-700 font-semibold mt-0.5">
                    {poin.toLocaleString('id-ID')} Poin
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-brand-900 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200 shrink-0 font-bold">
                {kode}
              </span>
            </div>

            <div className="pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-gray-400" />
                <span className="font-medium text-ink">{namaNasabah}</span>
                {username && <span className="text-gray-400">(@{username})</span>}
              </div>
              <span>{tanggal}</span>
            </div>
          </div>

          {/* Current Status Box */}
          <div className="rounded-2xl border border-gray-100 bg-sand/30 p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Status Saat Ini:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusStyle.bg}`}
            >
              <StatusIcon size={12} />
              {statusStyle.label}
            </span>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            {isSelesai
              ? 'Hadiah untuk transaksi ini telah diserahkan kepada nasabah.'
              : 'Untuk menyerahkan hadiah dan memverifikasi kode penukaran nasabah, lanjutkan ke halaman Verifikasi Penukaran.'}
          </p>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => onGoToVerifikasi(kode)}
              className="flex-1 rounded-2xl bg-brand-600 py-2.5 text-xs font-bold text-white hover:bg-brand-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShieldCheck size={14} />
              <span>Verifikasi Penukaran</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TransaksiPenukaran() {
  const navigate = useNavigate()

  // ── Filters State ──
  const [bulanFilter, setBulanFilter] = useState(() => new Date().toISOString().slice(0, 7))
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // ── Data & UI State ──
  const [transaksiList, setTransaksiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successToast, setSuccessToast] = useState('')

  // ── Modal State ──
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTransaksi, setSelectedTransaksi] = useState(null)

  // Generate Month Options (Last 12 months)
  const monthOptions = useMemo(() => {
    const opts = [{ value: '', label: 'Semua Bulan' }]
    const d = new Date()
    for (let i = 0; i < 12; i++) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      opts.push({
        value: `${year}-${month}`,
        label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      })
      d.setMonth(d.getMonth() - 1)
    }
    return opts
  }, [])

  // ── Fetch Data ──
  const fetchData = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (bulanFilter) params.bulan = bulanFilter

      const res = await getAdminPenukaranList(params)
      console.log('[TransaksiPenukaran] GET /penukaran-poin/admin/list response:', res.data)
      const data = res.data?.data ?? res.data ?? []
      setTransaksiList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('[TransaksiPenukaran] Error fetch list:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat daftar transaksi penukaran poin.'
      setErrorMsg(msg)
      setTransaksiList([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter, bulanFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const triggerSuccess = (msg) => {
    setSuccessToast(msg)
    setTimeout(() => setSuccessToast(''), 4000)
  }

  // ── Client Search Filter ──
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return transaksiList
    const q = searchQuery.toLowerCase().trim()
    return transaksiList.filter((item) => {
      const namaNasabah = String(
        item.nasabah?.namaNasabah || item.nasabah?.nama || item.namaNasabah || ''
      ).toLowerCase()
      const username = String(
        item.nasabah?.user?.username || item.nasabah?.username || item.username || ''
      ).toLowerCase()
      const namaHadiah = String(
        item.hadiah?.namaHadiah || item.hadiah?.nama || item.namaHadiah || ''
      ).toLowerCase()
      const kode = String(
        item.kodeTransaksi || item.kodePenukaran || item.kode || ''
      ).toLowerCase()
      return (
        namaNasabah.includes(q) ||
        username.includes(q) ||
        namaHadiah.includes(q) ||
        kode.includes(q)
      )
    })
  }, [transaksiList, searchQuery])

  // ── Small Summary Statistics (Calculated Client-side) ──
  const stats = useMemo(() => {
    const totalTransaksi = filteredList.length
    let totalPoin = 0
    let countDiproses = 0
    let countSelesai = 0

    filteredList.forEach((item) => {
      const p = Number(
        item.poinTerpakai ?? item.totalPoin ?? item.poin ?? item.hadiah?.poinDibutuhkan ?? 0
      )
      totalPoin += isNaN(p) ? 0 : p

      const s = String(item.status || 'diproses').toLowerCase()
      if (s === 'selesai') {
        countSelesai++
      } else {
        countDiproses++
      }
    })

    return { totalTransaksi, totalPoin, countDiproses, countSelesai }
  }, [filteredList])

  // ── Group Transactions by Date (Timeline Section) ──
  const groupedTransactions = useMemo(() => {
    const groups = {}
    filteredList.forEach((item) => {
      const dateRaw = item.tanggal || item.createdAt || item.tanggalPenukaran
      const dateKey = dateRaw ? dateRaw.slice(0, 10) : 'Lainnya'
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateKey,
          label: formatDateHeader(dateRaw),
          items: [],
        }
      }
      groups[dateKey].items.push(item)
    })

    // Sort dates descending
    return Object.values(groups).sort((a, b) => {
      if (a.dateKey === 'Lainnya') return 1
      if (b.dateKey === 'Lainnya') return -1
      return b.dateKey.localeCompare(a.dateKey)
    })
  }, [filteredList])

  // ── Open Detail Transaksi Modal ──
  const handleOpenDetailModal = (item) => {
    setSelectedTransaksi(item)
    setShowDetailModal(true)
  }

  // ── Redirect to Verifikasi Penukaran ──
  const handleGoToVerifikasi = (kode) => {
    setShowDetailModal(false)
    navigate('/admin/verifikasi-penukaran', { state: { kode } })
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 mb-2 border border-brand-100">
            <ArrowLeftRight size={13} className="text-brand-600" />
            Penukaran Reward
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Transaksi Penukaran Poin
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Kelola dan verifikasi status penukaran hadiah nasabah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Link
            to="/admin/verifikasi-penukaran"
            className="flex h-10 items-center gap-2 rounded-2xl bg-brand-600 px-4 text-xs font-bold text-white hover:bg-brand-700 active:scale-[0.98] transition-all shadow-sm"
          >
            <ShieldCheck size={15} />
            <span>Verifikasi Penukaran</span>
          </Link>
          <button
            type="button"
            onClick={fetchData}
            title="Muat ulang data"
            className="flex h-10 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3.5 text-xs font-bold text-gray-600 hover:border-brand-200 hover:text-brand-700 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-brand-600' : ''} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {successToast && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 shadow-xs animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* ── Global Error Alert ── */}
      {errorMsg && !loading && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-700 shadow-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Gagal memuat transaksi</p>
            <p className="text-xs mt-0.5 opacity-80">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="text-xs font-bold text-red-600 underline underline-offset-2 hover:text-red-800 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* ── Filter Toolbar ── */}
      <div className="rounded-3xl bg-white shadow-card border border-gray-100 p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nasabah, hadiah, atau kode..."
              className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2.5 text-sm text-ink placeholder-gray-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Dropdown Filters (Bulan & Status) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Bulan Filter */}
            <div className="relative min-w-[150px]">
              <select
                value={bulanFilter}
                onChange={(e) => setBulanFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-sand/20 pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-sand/20 pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mini Summary Statistics Bar ── */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-gray-50/70 border border-gray-100 p-3">
            <p className="text-[11px] font-semibold text-gray-400">Total Transaksi</p>
            <p className="text-base font-bold text-ink mt-0.5">{stats.totalTransaksi} Transaksi</p>
          </div>
          <div className="rounded-2xl bg-amber-50/50 border border-amber-100/60 p-3">
            <p className="text-[11px] font-semibold text-amber-700">Total Poin Terpakai</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={14} className="fill-amber-400 text-amber-500" />
              <p className="text-base font-bold text-amber-800">
                {stats.totalPoin.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-yellow-50/50 border border-yellow-100/60 p-3">
            <p className="text-[11px] font-semibold text-yellow-700">Status Diproses</p>
            <p className="text-base font-bold text-yellow-800 mt-0.5">
              {stats.countDiproses} Transaksi
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100/60 p-3">
            <p className="text-[11px] font-semibold text-emerald-700">Status Selesai</p>
            <p className="text-base font-bold text-emerald-800 mt-0.5">
              {stats.countSelesai} Transaksi
            </p>
          </div>
        </div>
      </div>

      {/* ── Loading Skeleton (Slim Horizontal Cards) ── */}
      {loading && (
        <div className="space-y-6">
          {[1, 2].map((_, sIdx) => (
            <div key={`skel-sec-${sIdx}`} className="space-y-3">
              <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-2.5">
                {[1, 2, 3].map((_, cIdx) => (
                  <div
                    key={`skel-card-${sIdx}-${cIdx}`}
                    className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-4 animate-pulse shadow-xs"
                  >
                    <div className="flex items-center gap-3.5 flex-1">
                      <div className="h-11 w-11 rounded-2xl bg-gray-200 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-gray-200 rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-7 w-20 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredList.length === 0 && (
        <div className="rounded-3xl bg-white shadow-card border border-gray-100 py-16 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50 border border-gray-100 text-gray-300 mb-4">
            <Inbox size={28} />
          </div>
          <h3 className="font-display font-bold text-base text-ink">
            {searchQuery ? 'Transaksi Tidak Ditemukan' : 'Belum Ada Transaksi Penukaran'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Tidak ada transaksi yang cocok dengan kata kunci pencarian Anda.'
              : 'Tidak ada data transaksi penukaran poin pada bulan atau status yang dipilih.'}
          </p>
        </div>
      )}

      {/* ── Timeline List Grouped by Date ── */}
      {!loading && groupedTransactions.length > 0 && (
        <div className="space-y-7">
          {groupedTransactions.map((group) => (
            <div key={group.dateKey} className="space-y-3">
              {/* Date Section Header */}
              <div className="flex items-center gap-2 px-1">
                <div className="h-2 w-2 rounded-full bg-brand-500" />
                <h3 className="font-display text-sm font-bold text-ink tracking-tight">
                  {group.label}
                </h3>
                <span className="text-[11px] text-gray-400 font-medium">
                  ({group.items.length} penukaran)
                </span>
                <div className="flex-1 border-b border-gray-200/60 ml-2" />
              </div>

              {/* Transaction Slim Horizontal Cards */}
              <div className="space-y-2.5">
                {group.items.map((item, idx) => {
                  const itemId = item.id || item.penukaranId || item._id || idx
                  const namaNasabah =
                    item.nasabah?.namaNasabah ||
                    item.nasabah?.nama ||
                    item.namaNasabah ||
                    item.user?.nama ||
                    'Nasabah'
                  const username =
                    item.nasabah?.user?.username ||
                    item.nasabah?.username ||
                    item.username ||
                    ''
                  const namaHadiah =
                    item.hadiah?.namaHadiah ||
                    item.hadiah?.nama ||
                    item.namaHadiah ||
                    'Hadiah'
                  const poin = Number(
                    item.poinTerpakai ??
                      item.totalPoin ??
                      item.poin ??
                      item.hadiah?.poinDibutuhkan ??
                      0
                  )
                  const kode =
                    item.kodeTransaksi ||
                    item.kodePenukaran ||
                    item.kode ||
                    `#TRX-${itemId}`
                  const timeStr = formatTime(item.tanggal || item.createdAt || item.tanggalPenukaran)
                  const rawStatus = item.status || 'diproses'
                  const statusStyle = getStatusStyle(rawStatus)
                  const StatusIcon = statusStyle.icon
                  const fotoHadiah = resolveFotoUrl(item.hadiah?.foto || item.foto)

                  return (
                    <div
                      key={itemId}
                      onClick={() => handleOpenDetailModal(item)}
                      className="group rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:border-brand-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                    >
                      {/* Left: Gift Avatar + Details */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Circular Avatar */}
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/60 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          {fotoHadiah ? (
                            <img
                              src={fotoHadiah}
                              alt={namaHadiah}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.classList.add(
                                  'flex',
                                  'items-center',
                                  'justify-center'
                                )
                              }}
                            />
                          ) : (
                            <Gift size={20} className="text-brand-600" />
                          )}
                        </div>

                        {/* Middle: Nasabah + Hadiah + Kode */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-sm text-ink group-hover:text-brand-700 transition-colors truncate">
                              {namaNasabah}
                            </p>
                            {username && (
                              <span className="text-xs text-gray-400 font-normal">
                                @{username}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-brand-800 truncate mt-0.5">
                            {namaHadiah}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-mono">
                            <span>{kode}</span>
                            {timeStr && (
                              <>
                                <span>•</span>
                                <span className="font-sans">{timeStr} WIB</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Poin Terpakai + Status Badge + Arrow */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        {/* Poin Terpakai */}
                        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-200/50">
                          <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" />
                          <span>{poin.toLocaleString('id-ID')} Poin</span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusStyle.bg}`}
                        >
                          <StatusIcon size={12} />
                          {statusStyle.label}
                        </span>

                        {/* Action Hint Arrow */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDetailModal(item)
                          }}
                          title="Lihat Detail Transaksi"
                          className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Detail Transaksi (Read-only + Redirect to Verifikasi) ── */}
      <DetailTransaksiModal
        show={showDetailModal}
        item={selectedTransaksi}
        onClose={() => setShowDetailModal(false)}
        onGoToVerifikasi={handleGoToVerifikasi}
      />
    </div>
  )
}
