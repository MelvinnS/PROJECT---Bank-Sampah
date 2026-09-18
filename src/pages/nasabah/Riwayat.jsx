import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Inbox,
  Leaf,
  Plus,
  Printer,
  ReceiptText,
  Recycle,
  RefreshCw,
  Scale,
  Star,
  X,
  Gift,
  Clock,
  CheckCircle,
  Info,
  Copy,
  Check,
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMySetor, getMyPenukaran, getNotaPenukaran } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'
import StatusBadge from '../../components/nasabah/StatusBadge'

// ── Status options for Setor Sampah filter ──
const STATUS_OPTIONS_SETOR = [
  { value: '',                    label: 'Semua Status'        },
  { value: 'MENUNGGU_KONFIRMASI', label: 'Menunggu Konfirmasi' },
  { value: 'DIVERIFIKASI',        label: 'Diverifikasi'        },
  { value: 'SELESAI',             label: 'Selesai'             },
  { value: 'DITOLAK',             label: 'Ditolak'             },
]

// ── Status options for Penukaran Hadiah filter ──
const STATUS_OPTIONS_PENUKARAN = [
  { value: '',         label: 'Semua Status' },
  { value: 'diproses', label: 'Diproses'     },
  { value: 'selesai',  label: 'Selesai'      },
]

// ── Helper: Format Date ──
function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

// ── Modal Bukti Pengambilan Hadiah (Defined OUTSIDE parent) ──
function BuktiPengambilanModal({ item, onClose }) {
  const [notaData, setNotaData] = useState(null)
  const [loadingNota, setLoadingNota] = useState(false)
  const [copied, setCopied] = useState(false)

  const id = item?.id || item?.penukaranId

  useEffect(() => {
    if (!id) return
    let active = true
    setLoadingNota(true)

    getNotaPenukaran(id)
      .then((res) => {
        if (active) {
          const data = res.data?.data ?? res.data
          if (data) setNotaData(data)
        }
      })
      .catch((err) => {
        console.warn('[getNotaPenukaran error, fallback to item]:', err)
      })
      .finally(() => {
        if (active) setLoadingNota(false)
      })

    return () => {
      active = false
    }
  }, [id])

  if (!item) return null

  // Combine fresh data or fallback
  const d = notaData || item
  const kode = d.kodePenukaran || d.kodeTransaksi || d.kode || `#TKR-${id}`
  const namaHadiah = d.hadiah?.namaHadiah || d.hadiah?.nama || d.namaHadiah || d.hadiah || 'Hadiah'
  const poin = Number(d.poinTerpakai ?? d.totalPoin ?? d.poin ?? d.hadiah?.poinDibutuhkan ?? 0)
  const tanggal = d.tanggal || d.tanggalPenukaran || d.createdAt
  const rawStatus = String(d.status || 'diproses').toLowerCase()
  const isSelesai = rawStatus === 'selesai'
  const fotoHadiah = resolveFotoUrl(d.hadiah?.foto || d.foto)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(kode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sand/40">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-xs">
              <Gift size={15} />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink">Bukti Pengambilan Hadiah</h2>
              <p className="text-[11px] text-gray-500">Bank Sampah Digital</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Kode Penukaran - Besar & Mencolok */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-5 border-2 border-dashed border-brand-300 text-center relative overflow-hidden">
            <p className="text-[11px] font-bold text-brand-700 tracking-wider uppercase mb-1">
              Kode Penukaran Hadiah
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="font-mono text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-wider select-all">
                {kode}
              </p>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Salin Kode"
                className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-brand-700 hover:text-brand-900 border border-brand-200 shadow-2xs transition-all cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </div>
            {copied && (
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700">
                Kode berhasil disalin!
              </span>
            )}
          </div>

          {/* Instruksi Pengambilan Hadiah */}
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 p-4 text-xs text-amber-900">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Petunjuk Pengambilan:</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed font-medium">
                Tunjukkan kode ini ke petugas Bank Sampah saat mengambil hadiah fisik di lokasi penukaran.
              </p>
            </div>
          </div>

          {/* Rincian Hadiah & Transaksi */}
          <div className="rounded-2xl border border-gray-100 bg-sand/30 p-4 space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {fotoHadiah ? (
                  <img src={fotoHadiah} alt={namaHadiah} className="h-full w-full object-cover" />
                ) : (
                  <Gift size={24} className="text-brand-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-ink truncate">{namaHadiah}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={13} className="fill-amber-400 text-amber-500" />
                  <span className="text-xs font-bold text-brand-800">
                    {poin.toLocaleString('id-ID')} Poin
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200/60 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-gray-400 font-medium">Tanggal Pengajuan</span>
                <p className="font-semibold text-ink mt-0.5">{formatDate(tanggal)}</p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-medium">Status Penukaran</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      isSelesai
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isSelesai ? <CheckCircle size={11} /> : <Clock size={11} />}
                    {isSelesai ? 'Selesai' : 'Diproses'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-sand/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Printer size={14} />
            <span>Cetak / Download Bukti</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Riwayat() {
  const { isGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Route Protection
  useEffect(() => {
    if (isGuest) navigate('/login', { state: { from: '/riwayat' }, replace: true })
  }, [isGuest, navigate])

  // Active Tab: 'setor' | 'penukaran'
  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab || location.state?.tab || 'setor'
  })

  // Month filter options (last 12 months)
  const currentMonthStr = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }, [])

  const monthOptions = useMemo(() => {
    const opts = []
    const d = new Date()
    for (let i = 0; i < 12; i++) {
      const year  = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      opts.push({
        value: `${year}-${month}`,
        label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      })
      d.setMonth(d.getMonth() - 1)
    }
    return opts
  }, [])

  // ── States: Tab Setor Sampah ──
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr)
  const [selectedStatusSetor, setSelectedStatusSetor] = useState('')
  const [setorList, setSetorList] = useState([])
  const [loadingSetor, setLoadingSetor] = useState(true)
  const [errorMsgSetor, setErrorMsgSetor] = useState('')
  const [selectedSetorDetail, setSelectedSetorDetail] = useState(null)

  // ── States: Tab Penukaran Hadiah ──
  const [selectedStatusPenukaran, setSelectedStatusPenukaran] = useState('')
  const [penukaranList, setPenukaranList] = useState([])
  const [loadingPenukaran, setLoadingPenukaran] = useState(true)
  const [errorMsgPenukaran, setErrorMsgPenukaran] = useState('')
  const [selectedPenukaranDetail, setSelectedPenukaranDetail] = useState(null)

  // ── Fetch Setor Data ──
  const fetchSetorData = useCallback(async (bulan) => {
    setLoadingSetor(true)
    setErrorMsgSetor('')
    try {
      const res = await getMySetor(bulan || undefined)
      const data = res.data?.data ?? res.data
      setSetorList(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat riwayat transaksi setoran.'
      setErrorMsgSetor(msg)
      setSetorList([])
    } finally {
      setLoadingSetor(false)
    }
  }, [])

  // ── Fetch Penukaran Data ──
  const fetchPenukaranData = useCallback(async () => {
    setLoadingPenukaran(true)
    setErrorMsgPenukaran('')
    try {
      const res = await getMyPenukaran()
      const data = res.data?.data ?? res.data
      setPenukaranList(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat riwayat penukaran hadiah.'
      setErrorMsgPenukaran(msg)
      setPenukaranList([])
    } finally {
      setLoadingPenukaran(false)
    }
  }, [])

  // Effects
  useEffect(() => {
    if (!isGuest) {
      fetchSetorData(selectedMonth)
    }
  }, [selectedMonth, isGuest, fetchSetorData])

  useEffect(() => {
    if (!isGuest && activeTab === 'penukaran') {
      fetchPenukaranData()
    }
  }, [activeTab, isGuest, fetchPenukaranData])

  // Filtered Setor List
  const filteredSetorList = useMemo(() => {
    if (!selectedStatusSetor) return setorList
    return setorList.filter(
      (item) => (item.status || 'MENUNGGU_KONFIRMASI') === selectedStatusSetor
    )
  }, [setorList, selectedStatusSetor])

  // Filtered Penukaran List
  const filteredPenukaranList = useMemo(() => {
    if (!selectedStatusPenukaran) return penukaranList
    return penukaranList.filter((item) => {
      const s = String(item.status || 'diproses').toLowerCase()
      return s === selectedStatusPenukaran.toLowerCase()
    })
  }, [penukaranList, selectedStatusPenukaran])

  if (isGuest) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/70 px-2.5 py-0.5 text-xs font-bold text-brand-800 mb-2 border border-brand-200/50">
            <ReceiptText size={13} className="text-brand-600" />
            Riwayat Aktivitas
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Riwayat Transaksi Nasabah</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Pantau status setoran sampah dan riwayat penukaran poin hadiah Anda.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {activeTab === 'setor' ? (
            <Link
              to="/setor"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.98] transition-all"
            >
              <Plus size={16} strokeWidth={2.5} />
              Setor Baru
            </Link>
          ) : (
            <Link
              to="/hadiah"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.98] transition-all"
            >
              <Gift size={16} />
              Tukar Hadiah
            </Link>
          )}
        </div>
      </div>

      {/* ── 2 Main Tabs Navigation ── */}
      <div className="flex rounded-2xl bg-gray-100/90 p-1.5 border border-gray-200/60 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('setor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'setor'
              ? 'bg-white text-brand-800 shadow-sm'
              : 'text-gray-600 hover:text-ink'
          }`}
        >
          <Recycle size={15} />
          <span>Riwayat Setor Sampah</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('penukaran')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'penukaran'
              ? 'bg-white text-brand-800 shadow-sm'
              : 'text-gray-600 hover:text-ink'
          }`}
        >
          <Gift size={15} />
          <span>Riwayat Penukaran Hadiah</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: RIWAYAT SETOR SAMPAH ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'setor' && (
        <div className="space-y-6">
          {/* Filter Toolbar Setor */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Month filter */}
            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-8 py-2.5 text-sm font-semibold text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                <option value="">Semua Periode</option>
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                    {opt.value === currentMonthStr ? ' (Bulan Ini)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 5.25L7 8.75L10.5 5.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Status filter */}
            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedStatusSetor}
                onChange={(e) => setSelectedStatusSetor(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-8 py-2.5 text-sm font-semibold text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                {STATUS_OPTIONS_SETOR.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 5.25L7 8.75L10.5 5.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchSetorData(selectedMonth)}
              title="Refresh data"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-brand-700 hover:bg-brand-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                size={15}
                className={loadingSetor ? 'animate-spin text-brand-600' : ''}
              />
            </button>
          </div>

          {/* Error Message */}
          {errorMsgSetor && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
              <div className="flex-1 font-medium">{errorMsgSetor}</div>
              <button
                onClick={() => fetchSetorData(selectedMonth)}
                className="font-bold underline text-red-800"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* List Setor */}
          <div className="flex flex-col gap-3">
            {/* Loading Skeleton */}
            {loadingSetor &&
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-4 shadow-card border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-32 bg-gray-200 rounded-md" />
                      <div className="h-3 w-24 bg-gray-200 rounded-md" />
                    </div>
                    <div className="h-6 w-28 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}

            {/* Empty State */}
            {!loadingSetor && filteredSetorList.length === 0 && !errorMsgSetor && (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-card border border-gray-100 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4">
                  <Inbox size={30} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">Belum Ada Transaksi Setor</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm">
                  {selectedMonth
                    ? 'Tidak ada riwayat setoran sampah pada periode ini.'
                    : 'Anda belum pernah melakukan setoran sampah.'}
                </p>
                <Link
                  to="/setor"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition-all"
                >
                  <Recycle size={16} />
                  Ajukan Setoran Sekarang
                </Link>
              </div>
            )}

            {/* Setor Cards */}
            {!loadingSetor &&
              filteredSetorList.map((item) => {
                const kode = item.kodeSetor || item.kode || `SS-${(item.id || '').slice(0, 8)}`
                const tgl = item.tanggal || item.createdAt
                const beratTotal = Number(item.totalBeratKg ?? item.totalBerat ?? 0)
                const poinTotal = Number(item.totalPoin ?? item.poin ?? 0)
                const status = item.status || 'MENUNGGU_KONFIRMASI'

                const details = item.detailSetors ?? item.items ?? []
                const kategoriRingkas = details
                  .slice(0, 2)
                  .map((d) => d.kategoriSampah?.namaKategori || d.namaKategori || d.kategori || '')
                  .filter(Boolean)
                  .join(', ')

                return (
                  <div
                    key={item.id || kode}
                    onClick={() => setSelectedSetorDetail(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedSetorDetail(item)}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card border border-gray-100/90 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    {/* Ikon kiri */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 group-hover:scale-105 transition-transform">
                      <Recycle size={18} />
                    </span>

                    {/* Info tengah */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-ink truncate group-hover:text-brand-700 transition-colors">
                        {kode}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(tgl)}</p>
                      {kategoriRingkas && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {kategoriRingkas}
                          {details.length > 2 ? ` +${details.length - 2} lainnya` : ''}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Scale size={12} className="text-brand-600" />
                        <span className="text-[11px] text-gray-500">{beratTotal} Kg</span>
                      </div>
                    </div>

                    {/* Badge + Poin kanan */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <StatusBadge status={status} />
                      <div className="flex items-center gap-1 font-bold text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                        <Star size={11} className="fill-amber-400 text-amber-500" />
                        +{poinTotal} Poin
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: RIWAYAT PENUKARAN HADIAH ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'penukaran' && (
        <div className="space-y-6">
          {/* Filter Toolbar Penukaran */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Status filter */}
            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedStatusPenukaran}
                onChange={(e) => setSelectedStatusPenukaran(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-8 py-2.5 text-sm font-semibold text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                {STATUS_OPTIONS_PENUKARAN.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 5.25L7 8.75L10.5 5.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchPenukaranData}
              title="Refresh data"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-brand-700 hover:bg-brand-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                size={15}
                className={loadingPenukaran ? 'animate-spin text-brand-600' : ''}
              />
            </button>
          </div>

          {/* Error Message */}
          {errorMsgPenukaran && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
              <div className="flex-1 font-medium">{errorMsgPenukaran}</div>
              <button
                onClick={fetchPenukaranData}
                className="font-bold underline text-red-800"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* List Penukaran */}
          <div className="flex flex-col gap-3">
            {/* Loading Skeleton */}
            {loadingPenukaran &&
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-white p-4 shadow-card border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-32 bg-gray-200 rounded-md" />
                      <div className="h-3 w-24 bg-gray-200 rounded-md" />
                    </div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}

            {/* Empty State */}
            {!loadingPenukaran && filteredPenukaranList.length === 0 && !errorMsgPenukaran && (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-card border border-gray-100 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4">
                  <Gift size={30} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Belum Ada Penukaran Hadiah
                </h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm">
                  Tukarkan poin yang Anda kumpulkan dengan berbagai voucher dan merchandise menarik.
                </p>
                <Link
                  to="/hadiah"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition-all"
                >
                  <Gift size={16} />
                  Katalog Hadiah
                </Link>
              </div>
            )}

            {/* Penukaran Cards */}
            {!loadingPenukaran &&
              filteredPenukaranList.map((item, idx) => {
                const itemId = item.id || item.penukaranId || idx
                const kode = item.kodePenukaran || item.kodeTransaksi || item.kode || `#TKR-${itemId}`
                const namaHadiah =
                  item.hadiah?.namaHadiah || item.hadiah?.nama || item.namaHadiah || item.hadiah || 'Hadiah'
                const tgl = item.tanggal || item.tanggalPenukaran || item.createdAt
                const poin = Number(
                  item.poinTerpakai ?? item.totalPoin ?? item.poin ?? item.hadiah?.poinDibutuhkan ?? 0
                )
                const rawStatus = String(item.status || 'diproses').toLowerCase()
                const isSelesai = rawStatus === 'selesai'
                const fotoHadiah = resolveFotoUrl(item.hadiah?.foto || item.foto)

                return (
                  <div
                    key={itemId}
                    onClick={() => setSelectedPenukaranDetail(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedPenukaranDetail(item)}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card border border-gray-100/90 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    {/* Ikon / Avatar Hadiah */}
                    <div className="h-11 w-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
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
                        <Gift size={20} />
                      </div>
                    </div>

                    {/* Info Tengah */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-ink truncate group-hover:text-brand-700 transition-colors">
                        {namaHadiah}
                      </p>
                      <p className="font-mono text-[11px] text-gray-400 mt-0.5">{kode}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(tgl)}</p>
                    </div>

                    {/* Right: Badge Status & Poin Terpakai */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                          isSelesai
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isSelesai ? <CheckCircle size={11} /> : <Clock size={11} />}
                        {isSelesai ? 'Selesai' : 'Diproses'}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-xs text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/50">
                        <Star size={11} className="fill-amber-400 text-amber-500" />
                        -{poin} Poin
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ── Detail Modal: Setor Sampah ── */}
      {selectedSetorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sand/40">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
                  <ReceiptText size={15} />
                </span>
                <h2 className="font-display text-base font-bold text-ink">Detail Setoran Sampah</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSetorDetail(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Header Info */}
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-50 to-brand-100/40 p-4 border border-brand-100">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Kode Setoran
                  </p>
                  <p className="font-bold text-sm text-ink">
                    {selectedSetorDetail.kodeSetor ||
                      selectedSetorDetail.kode ||
                      `#${selectedSetorDetail.id}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tanggal:{' '}
                    {formatDate(selectedSetorDetail.tanggal || selectedSetorDetail.createdAt)}
                  </p>
                </div>
                <StatusBadge status={selectedSetorDetail.status || 'MENUNGGU_KONFIRMASI'} />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-sand/30 p-3.5 text-center">
                  <p className="text-[11px] font-bold text-gray-500">Total Berat</p>
                  <p className="mt-1 font-display text-lg font-bold text-ink">
                    {Number(
                      selectedSetorDetail.totalBeratKg ?? selectedSetorDetail.totalBerat ?? 0
                    )}{' '}
                    <span className="text-xs font-normal text-gray-500">Kg</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-200/70 bg-gradient-to-br from-[#ebf7ee] to-[#dcf1e3] p-3.5 text-center">
                  <p className="text-[11px] font-bold text-brand-800">Total Poin</p>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <Star size={15} className="fill-amber-400 text-amber-500" />
                    <span className="font-display text-lg font-extrabold text-brand-900">
                      {Number(selectedSetorDetail.totalPoin ?? selectedSetorDetail.poin ?? 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rincian Items */}
              <div>
                <h4 className="text-xs font-bold text-ink mb-2.5 flex items-center gap-1.5">
                  <Leaf size={14} className="text-brand-600" />
                  Rincian Sampah yang Disetor:
                </h4>
                <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xs">
                  {(() => {
                    const details =
                      selectedSetorDetail.detailSetors ?? selectedSetorDetail.items ?? []
                    if (!Array.isArray(details) || details.length === 0) {
                      return (
                        <div className="p-4 text-center text-xs text-gray-400">
                          Rincian per item belum tersedia.
                        </div>
                      )
                    }
                    return details.map((it, idx) => {
                      const namaKategori =
                        it.kategoriSampah?.namaKategori ||
                        it.namaKategori ||
                        it.kategori ||
                        `Item #${idx + 1}`
                      const jenis = it.kategoriSampah?.jenis || it.jenis || ''
                      const berat = Number(it.beratKg ?? it.berat ?? 0)
                      const poinPerKg = Number(
                        it.poinPerKg ?? it.kategoriSampah?.poinPerKg ?? 0
                      )
                      const hargaPerKg = Number(
                        it.hargaPerKg ?? it.kategoriSampah?.hargaPerKg ?? 0
                      )
                      const subtotal = Number(
                        it.subtotalPoin ?? it.poin ?? berat * poinPerKg
                      )

                      return (
                        <div
                          key={it.id || idx}
                          className="flex items-center justify-between p-3.5 text-xs hover:bg-sand/20 transition-colors"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-bold text-ink truncate">{namaKategori}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {berat} Kg
                              {jenis ? ` · ${jenis}` : ''}
                              {poinPerKg > 0 ? ` · ${poinPerKg} Poin/kg` : ''}
                              {hargaPerKg > 0
                                ? ` · Rp ${(berat * hargaPerKg).toLocaleString('id-ID')}`
                                : ''}
                            </p>
                          </div>
                          <span className="shrink-0 font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                            +{subtotal} Poin
                          </span>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              {/* Catatan Nasabah */}
              {selectedSetorDetail.catatan && (
                <div className="rounded-2xl border border-gray-100 bg-sand/40 p-3.5 text-xs">
                  <p className="font-bold text-gray-700 mb-1">Catatan Anda:</p>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedSetorDetail.catatan}
                  </p>
                </div>
              )}

              {/* Catatan Petugas */}
              {selectedSetorDetail.catatanPetugas && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
                  <p className="font-bold mb-1">Catatan Petugas Bank Sampah:</p>
                  <p className="leading-relaxed">{selectedSetorDetail.catatanPetugas}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-sand/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all cursor-pointer"
              >
                <Printer size={14} />
                Cetak / Download Struk
              </button>
              <button
                type="button"
                onClick={() => setSelectedSetorDetail(null)}
                className="rounded-full bg-brand-600 px-6 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal: Bukti Pengambilan Hadiah (Task 4) ── */}
      <BuktiPengambilanModal
        item={selectedPenukaranDetail}
        onClose={() => setSelectedPenukaranDetail(null)}
      />
    </div>
  )
}
