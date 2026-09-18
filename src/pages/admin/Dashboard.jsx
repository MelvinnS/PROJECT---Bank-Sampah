import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Users,
  Layers,
  CheckSquare,
  Gift,
  Scale,
  Star,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Clock,
  Inbox,
  LineChart as LineChartIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { getAdminDashboardStats, getAdminSetorList } from '../../services/adminService'

export default function Dashboard() {
  const { session } = useAuth()
  const adminName =
    session.user?.namaAdmin ||
    session.user?.nama ||
    session.user?.username ||
    'Admin'

  // States
  const [stats, setStats] = useState(null)
  const [pendingList, setPendingList] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingList, setLoadingList] = useState(true)
  const [errorStats, setErrorStats] = useState('')
  const [errorList, setErrorList] = useState('')

  // Fetch Dashboard Stats from GET /dashboard/stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true)
    setErrorStats('')
    try {
      const res = await getAdminDashboardStats()
      console.log('[Admin Dashboard] GET /dashboard/stats response:', res.data)
      const data = res.data?.data ?? res.data ?? {}
      setStats(data)
    } catch (err) {
      console.error('[Admin Dashboard] Error GET /dashboard/stats:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat data statistik dashboard.'
      setErrorStats(msg)
    } finally {
      setLoadingStats(false)
    }
  }, [])

  // Fetch Pending Submissions from GET /setor-sampah/admin/list?status=menunggu_konfirmasi
  const fetchPendingList = useCallback(async () => {
    setLoadingList(true)
    setErrorList('')
    try {
      const res = await getAdminSetorList({ status: 'menunggu_konfirmasi' })
      console.log('[Admin Dashboard] GET /setor-sampah/admin/list response:', res.data)
      const data = res.data?.data ?? res.data ?? []
      const list = Array.isArray(data) ? data : []
      setPendingList(list.slice(0, 5))
    } catch (err) {
      console.error('[Admin Dashboard] Error GET /setor-sampah/admin/list:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat daftar pengajuan setoran.'
      setErrorList(msg)
    } finally {
      setLoadingList(false)
    }
  }, [])

  const loadAll = useCallback(() => {
    fetchStats()
    fetchPendingList()
  }, [fetchStats, fetchPendingList])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Date Formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Trend Data evaluation (only use real data if available from API response)
  const trendData = useMemo(() => {
    if (!stats) return null
    const rawTrend =
      stats.trenTransaksi ||
      stats.tren ||
      stats.monthlyStats ||
      stats.history
    if (Array.isArray(rawTrend) && rawTrend.length > 0) {
      return rawTrend.map((item, idx) => ({
        name: item.bulan || item.label || item.month || `Bulan ${idx + 1}`,
        total: Number(item.total || item.jumlah || item.count || 0),
      }))
    }
    return null
  }, [stats])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Header Sapaan ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Selamat Datang, {adminName} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Berikut ringkasan aktivitas Bank Sampah hari ini.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAll}
          title="Muat ulang data dashboard"
          className="self-start sm:self-auto flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-xs hover:border-brand-200 hover:text-brand-700 hover:bg-brand-50/50 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw
            size={14}
            className={loadingStats || loadingList ? 'animate-spin text-brand-600' : ''}
          />
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Error Banner (if any) */}
      {(errorStats || errorList) && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorStats || errorList}</span>
          </div>
          <button
            type="button"
            onClick={loadAll}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Row 1: 4 Card Statistik Utama ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Nasabah */}
        <div className="rounded-3xl bg-white p-5 shadow-card border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Users size={20} />
            </span>
          </div>

          <div>
            {loadingStats ? (
              <div className="space-y-2">
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {Number(stats?.totalNasabah ?? 0).toLocaleString('id-ID')}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Total Nasabah
                </p>
              </>
            )}
          </div>
        </div>

        {/* Card 2: Total Kategori Sampah */}
        <div className="rounded-3xl bg-white p-5 shadow-card border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Layers size={20} />
            </span>
          </div>

          <div>
            {loadingStats ? (
              <div className="space-y-2">
                <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {Number(stats?.totalKategoriSampah ?? 0).toLocaleString('id-ID')}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Total Kategori Sampah
                </p>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Total Transaksi Setor */}
        <div className="rounded-3xl bg-white p-5 shadow-card border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <CheckSquare size={20} />
            </span>
          </div>

          <div>
            {loadingStats ? (
              <div className="space-y-2">
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {Number(stats?.totalTransaksiSetor ?? 0).toLocaleString('id-ID')}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Total Transaksi Setor
                </p>
              </>
            )}
          </div>
        </div>

        {/* Card 4: Total Hadiah */}
        <div className="rounded-3xl bg-white p-5 shadow-card border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Gift size={20} />
            </span>
          </div>

          <div>
            {loadingStats ? (
              <div className="space-y-2">
                <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {Number(stats?.totalHadiah ?? 0).toLocaleString('id-ID')}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  Total Hadiah
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: 2 Card Statistik Tambahan ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Berat Sampah */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100 flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Scale size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500">
              Total Berat Sampah Terkumpul
            </p>
            {loadingStats ? (
              <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mt-1" />
            ) : (
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-0.5">
                {Number(
                  stats?.totalBeratSampahKg ??
                    stats?.totalBeratKg ??
                    stats?.totalBerat ??
                    0
                ).toLocaleString('id-ID')}{' '}
                <span className="text-sm font-semibold text-gray-400">Kg</span>
              </p>
            )}
          </div>
        </div>

        {/* Card Poin Tersalurkan */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100 flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Star size={24} className="fill-amber-400 text-amber-500" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500">
              Total Poin Tersalurkan
            </p>
            {loadingStats ? (
              <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mt-1" />
            ) : (
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-0.5">
                {Number(
                  stats?.totalPoinTersalurkan ??
                    stats?.totalPoin ??
                    stats?.poinTersalurkan ??
                    0
                ).toLocaleString('id-ID')}{' '}
                <span className="text-sm font-semibold text-brand-700">Poin</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: 2 Kolom (Grafik Tren + List Pengajuan Terbaru) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 cols): Grafik Tren Transaksi Setor */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100 flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Tren Transaksi Setor
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Grafik aktivitas volume setoran sampah
              </p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <LineChartIcon size={16} />
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {loadingStats ? (
              <div className="h-56 w-full bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            ) : trendData && trendData.length > 0 ? (
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '1rem',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#16a34a"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-2.5">
                  <LineChartIcon size={24} />
                </span>
                <p className="font-semibold text-xs text-gray-600">
                  Data tren berkala belum tersedia
                </p>
                <p className="text-[11px] text-gray-400 max-w-xs mt-0.5">
                  Visualisasi grafik tren akan otomatis aktif setelah server menyediakan histori transaksi bulanan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Pengajuan Setoran Terbaru yang Perlu Dikonfirmasi */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100 flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-display text-sm sm:text-base font-bold text-ink">
                Pengajuan Setoran Terbaru
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Perlu dikonfirmasi oleh petugas
              </p>
            </div>
            <Link
              to="/admin/verifikasi-setoran"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 transition-colors"
            >
              <span>Lihat semua</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col">
            {loadingList ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-gray-100 p-3.5 space-y-2"
                  >
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : pendingList.length > 0 ? (
              <div className="space-y-2.5">
                {pendingList.map((item) => {
                  const kode =
                    item.kodeSetor ||
                    item.kode ||
                    `SET-${(item.id || '').slice(0, 8)}`
                  const namaNasabah =
                    item.nasabah?.namaNasabah ||
                    item.nasabah?.nama ||
                    item.namaNasabah ||
                    'Nasabah'
                  const tgl = item.tanggal || item.createdAt
                  const berat = Number(
                    item.totalBeratKg ?? item.totalBerat ?? item.beratKg ?? 0
                  )

                  return (
                    <div
                      key={item.id || kode}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-sand/20 p-3.5 hover:border-brand-200 hover:bg-sand/40 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-ink truncate">
                            {kode}
                          </p>
                          <span className="text-[11px] text-gray-500 font-medium">
                            · {namaNasabah}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatDate(tgl)}
                          </span>
                          {berat > 0 && <span>· {berat} Kg</span>}
                        </div>
                      </div>

                      {/* Status Badge Kuning */}
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Menunggu
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-2">
                  <Inbox size={20} />
                </span>
                <p className="font-semibold text-xs text-gray-600">
                  Tidak ada setoran menunggu
                </p>
                <p className="text-[11px] text-gray-400 max-w-xs mt-0.5">
                  Semua pengajuan setoran telah diverifikasi atau belum ada pengajuan baru.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
