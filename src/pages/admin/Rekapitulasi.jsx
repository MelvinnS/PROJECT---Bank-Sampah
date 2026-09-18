import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  BarChart3,
  Calendar,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Scale,
  Coins,
  Star,
  Gift,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Inbox,
  Sparkles,
  Info,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import { getAdminRekapitulasiBulanan } from '../../services/adminService'

// Colors for waste categories
const CATEGORY_COLORS = {
  plastik: '#3b82f6', // blue-500
  kertas: '#f59e0b',  // amber-500
  logam: '#64748b',   // slate-500
  kaca: '#06b6d4',    // cyan-500
  lainnya: '#10b981', // emerald-500
}

const CATEGORY_LABELS = {
  plastik: 'Plastik',
  kertas: 'Kertas / Kardus',
  logam: 'Logam',
  kaca: 'Kaca',
  lainnya: 'Lainnya',
}

// Custom Tooltip for Charts
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-2xl border border-gray-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[170px] animate-fadeIn">
        <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.fill || CATEGORY_COLORS[data.jenisKey] || '#10b981' }}
          />
          <span className="font-bold text-ink text-sm">{data.name || data.jenisLabel}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span>Tonase:</span>
          <span className="font-bold text-ink">{Number(data.tonaseKg || 0).toLocaleString('id-ID')} kg</span>
        </div>
        <div className="flex items-center justify-between text-brand-700">
          <span>Estimasi Nilai:</span>
          <span className="font-bold">Rp {Number(data.rupiah || 0).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex items-center justify-between text-amber-600">
          <span>Poin Diterbitkan:</span>
          <span className="font-bold">{Number(data.poin || 0).toLocaleString('id-ID')} Poin</span>
        </div>
      </div>
    )
  }
  return null
}

export default function Rekapitulasi() {
  // ── Month Filter State ──
  const [selectedBulan, setSelectedBulan] = useState(() =>
    new Date().toISOString().slice(0, 7)
  )

  // ── Data & UI State ──
  const [rekapData, setRekapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeChartType, setActiveChartType] = useState('pie') // 'pie' | 'bar'

  // Generate Month Options (Last 12 months)
  const monthOptions = useMemo(() => {
    const opts = []
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

  // ── Fetch Rekapitulasi ──
  const fetchRekap = useCallback(async () => {
    if (!selectedBulan) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminRekapitulasiBulanan(selectedBulan)
      console.log(`[Rekapitulasi] GET /rekapitulasi/bulanan?bulan=${selectedBulan} response:`, res.data)
      const data = res.data?.data ?? res.data ?? null
      setRekapData(data)
    } catch (err) {
      console.error('[Rekapitulasi] Error fetch data:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat data rekapitulasi bulanan.'
      setErrorMsg(msg)
      setRekapData(null)
    } finally {
      setLoading(false)
    }
  }, [selectedBulan])

  useEffect(() => {
    fetchRekap()
  }, [fetchRekap])

  // ── Process & Normalize Data ──
  const normalizedData = useMemo(() => {
    if (!rekapData) {
      return {
        totalKg: 0,
        totalRupiah: 0,
        totalPoin: 0,
        breakdownList: [],
        penukaran: { totalTransaksi: 0, totalPoinTerpakai: 0 },
        isEmpty: true,
      }
    }

    // 1. Tonase & General Stats
    const totalKg = Number(
      rekapData.rekapitulasiTonase?.totalKg ??
      rekapData.rekapitulasiTonase?.totalBeratKg ??
      rekapData.totalTonaseKg ??
      rekapData.totalKg ??
      0
    )

    const totalRupiah = Number(
      rekapData.totalEstimasiPembayaranRupiah ??
      rekapData.totalPembayaranRupiah ??
      rekapData.estimasiPembayaranRupiah ??
      rekapData.totalRupiah ??
      0
    )

    const totalPoin = Number(
      rekapData.totalPoinDiterbitkan ??
      rekapData.totalPoin ??
      rekapData.poinDiterbitkan ??
      0
    )

    // 2. Breakdown Jenis Sampah
    let rawBreakdown = rekapData.breakdownJenisSampah ?? []
    let breakdownList = []

    if (Array.isArray(rawBreakdown)) {
      breakdownList = rawBreakdown.map((item) => {
        const key = String(item.jenis || item.namaJenis || item.kategori || 'lainnya').toLowerCase()
        return {
          jenisKey: key,
          name: item.nama || CATEGORY_LABELS[key] || item.jenis || 'Lainnya',
          jenisLabel: CATEGORY_LABELS[key] || item.nama || key,
          tonaseKg: Number(item.tonaseKg ?? item.totalKg ?? item.beratKg ?? 0),
          rupiah: Number(item.rupiah ?? item.totalRupiah ?? item.estimasiRupiah ?? 0),
          poin: Number(item.poin ?? item.totalPoin ?? 0),
          fill: CATEGORY_COLORS[key] || '#10b981',
        }
      })
    } else if (typeof rawBreakdown === 'object' && rawBreakdown !== null) {
      breakdownList = Object.keys(rawBreakdown).map((key) => {
        const item = rawBreakdown[key] || {}
        const k = key.toLowerCase()
        return {
          jenisKey: k,
          name: CATEGORY_LABELS[k] || key,
          jenisLabel: CATEGORY_LABELS[k] || key,
          tonaseKg: Number(item.tonaseKg ?? item.totalKg ?? item.beratKg ?? 0),
          rupiah: Number(item.rupiah ?? item.totalRupiah ?? item.estimasiRupiah ?? 0),
          poin: Number(item.poin ?? item.totalPoin ?? 0),
          fill: CATEGORY_COLORS[k] || '#10b981',
        }
      })
    }

    // 3. Penukaran Poin
    const rawPenukaran = rekapData.rekapitulasiPenukaranPoin || {}
    const penukaran = {
      totalTransaksi: Number(
        rawPenukaran.totalTransaksi ??
        rawPenukaran.jumlahTransaksi ??
        rekapData.totalPenukaranHadiah ??
        0
      ),
      totalPoinTerpakai: Number(
        rawPenukaran.totalPoinTerpakai ??
        rawPenukaran.totalPoin ??
        rawPenukaran.poinTerpakai ??
        0
      ),
    }

    const isEmpty = totalKg === 0 && totalRupiah === 0 && totalPoin === 0 && penukaran.totalTransaksi === 0

    return {
      totalKg,
      totalRupiah,
      totalPoin,
      breakdownList,
      penukaran,
      isEmpty,
    }
  }, [rekapData])

  const selectedMonthLabel =
    monthOptions.find((o) => o.value === selectedBulan)?.label || selectedBulan

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Page Header & Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 mb-2 border border-brand-100">
            <BarChart3 size={13} className="text-brand-600" />
            Laporan & Analitik
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Rekapitulasi Bulanan
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Ringkasan analitik perolehan sampah, estimasi nilai, dan penukaran poin.
          </p>
        </div>

        {/* Right Action Toolbar: Month Selector & Refresh */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Month Dropdown */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Calendar size={14} />
            </div>
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="appearance-none rounded-2xl border border-gray-200 bg-white pl-9 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
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

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchRekap}
            title="Muat ulang rekapitulasi"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-brand-700 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : ''} />
          </button>
        </div>
      </div>

      {/* ── Error Alert ── */}
      {errorMsg && !loading && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-700 shadow-xs animate-fadeIn">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Gagal memuat rekapitulasi</p>
            <p className="text-xs mt-0.5 opacity-80">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={fetchRekap}
            className="text-xs font-bold text-red-600 underline underline-offset-2 hover:text-red-800 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* ── Top 3 Large Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Tonase */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-brand-700 to-brand-800 p-6 text-white shadow-card">
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Total Tonase Sampah
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Scale size={20} className="text-emerald-100" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-9 w-32 bg-white/20 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold tracking-tight">
                  {normalizedData.totalKg.toLocaleString('id-ID')}
                </span>
                <span className="text-sm font-semibold text-emerald-200">kg</span>
              </div>
            )}
            <p className="mt-1.5 text-xs text-emerald-100/80 font-medium">
              Periode {selectedMonthLabel}
            </p>
          </div>
        </div>

        {/* Card 2: Total Estimasi Pembayaran */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Estimasi Pembayaran
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 text-brand-600">
              <Coins size={20} />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-9 w-40 bg-gray-200 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  Rp {normalizedData.totalRupiah.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <p className="mt-1.5 text-xs text-gray-400 font-medium">
              Nilai rupiah setoran sampah
            </p>
          </div>
        </div>

        {/* Card 3: Total Poin Diterbitkan */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Poin Diterbitkan
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600">
              <Star size={20} className="fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-ink tracking-tight">
                  {normalizedData.totalPoin.toLocaleString('id-ID')}
                </span>
                <span className="text-sm font-semibold text-amber-600">Poin</span>
              </div>
            )}
            <p className="mt-1.5 text-xs text-gray-400 font-medium">
              Akumulasi poin kepada nasabah
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Analytics Grid: Chart Breakdown & Penukaran Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Waste Breakdown Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-white shadow-card border border-gray-100 p-6 flex flex-col justify-between">
          {/* Chart Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Breakdown per Jenis Sampah
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Proporsi berat (kg), nilai rupiah, dan poin per kategori
              </p>
            </div>

            {/* Toggle Chart Type */}
            <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveChartType('pie')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartType === 'pie'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-gray-500 hover:text-ink'
                }`}
              >
                Donut Chart
              </button>
              <button
                type="button"
                onClick={() => setActiveChartType('bar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartType === 'bar'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-gray-500 hover:text-ink'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {/* Chart Content */}
          <div className="py-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="h-44 w-44 rounded-full border-4 border-gray-200 border-t-brand-500 animate-spin" />
              </div>
            ) : normalizedData.breakdownList.length === 0 || normalizedData.isEmpty ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 mb-2">
                  <Inbox size={24} />
                </div>
                <p className="text-sm font-bold text-gray-600">Belum Ada Data Rekapitulasi</p>
                <p className="text-xs text-gray-400 mt-0.5 max-w-xs">
                  Tidak ada setoran sampah yang tercatat pada bulan {selectedMonthLabel}.
                </p>
              </div>
            ) : activeChartType === 'pie' ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={normalizedData.breakdownList}
                      dataKey="tonaseKg"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {normalizedData.breakdownList.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val, entry) => (
                        <span className="text-xs font-semibold text-gray-700 mr-2">
                          {val} ({entry.payload.tonaseKg} kg)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={normalizedData.breakdownList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tonaseKg" name="Tonase (kg)" radius={[8, 8, 0, 0]}>
                      {normalizedData.breakdownList.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Breakdown Pills List Footer */}
          {!loading && normalizedData.breakdownList.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-gray-100">
              {normalizedData.breakdownList.map((item) => (
                <div key={item.jenisKey} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="font-bold text-ink truncate">{item.name}</span>
                  </div>
                  <p className="mt-1 font-bold text-brand-800 text-sm">
                    {item.tonaseKg.toLocaleString('id-ID')} <span className="text-[11px] font-normal text-gray-400">kg</span>
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Rp {item.rupiah.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Rekapitulasi Penukaran Poin */}
        <div className="rounded-3xl bg-white shadow-card border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Gift size={16} />
                </div>
                <h2 className="font-display text-base font-bold text-ink">Penukaran Hadiah</h2>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Reward
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Ringkasan pemanfaatan saldo reward nasabah sepanjang periode ini.
            </p>

            {/* Stat Box 1: Total Transaksi Penukaran */}
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-purple-50/60 to-purple-100/30 border border-purple-100 p-4">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Total Transaksi Penukaran
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                {loading ? (
                  <div className="h-8 w-20 bg-purple-200/60 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-purple-900">
                      {normalizedData.penukaran.totalTransaksi.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs font-semibold text-purple-700">Klaim Hadiah</span>
                  </>
                )}
              </div>
            </div>

            {/* Stat Box 2: Total Poin Terpakai */}
            <div className="mt-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 p-4">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Total Poin Ditukarkan
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                {loading ? (
                  <div className="h-8 w-24 bg-amber-200/60 rounded animate-pulse" />
                ) : (
                  <>
                    <Star size={18} className="fill-amber-400 text-amber-500 shrink-0 self-center" />
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-900">
                      {normalizedData.penukaran.totalPoinTerpakai.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs font-semibold text-amber-700">Poin</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="mt-6 rounded-2xl bg-sand/30 border border-gray-100 p-3.5 flex items-start gap-2.5 text-xs text-gray-500">
            <Info size={16} className="text-brand-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Data rekapitulasi dihitung otomatis dari transaksi setoran sampah dan penukaran hadiah yang telah berstatus <strong>Selesai</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
