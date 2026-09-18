import { useEffect, useState, useCallback } from 'react'
import { ChevronRight, Leaf, Recycle, Star, Gift, ClipboardList, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import TransaksiItem from '../../components/nasabah/TransaksiItem'
import WasteIcon from '../../components/nasabah/WasteIcon'
import { getDashboardSummary, getKategoriSampah } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'

// Decorative plant SVG illustration in top-right greeting
function PlantIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="#217239" opacity="0.18" />
      {/* Pot */}
      <path d="M44 95 Q44 108 60 108 Q76 108 76 95 L72 80 H48 Z" fill="#6b8f71" />
      <rect x="42" y="78" width="36" height="6" rx="3" fill="#4d7a55" />
      {/* Main stem */}
      <path d="M60 78 Q58 60 56 44" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M56 44 Q38 30 30 14 Q48 18 56 44Z" fill="#52b788" />
      <path d="M56 44 Q74 28 84 12 Q68 20 56 44Z" fill="#40916c" />
      <path d="M57 58 Q40 50 32 38 Q50 42 57 58Z" fill="#74c69d" />
      <path d="M57 58 Q74 48 82 36 Q66 44 57 58Z" fill="#52b788" />
      <path d="M58 70 Q46 64 40 54 Q54 58 58 70Z" fill="#95d5b2" />
      <path d="M58 70 Q70 62 76 52 Q64 58 58 70Z" fill="#74c69d" />
    </svg>
  )
}

// CTA plant illustration
function PlantCtaIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="122" rx="22" ry="5" fill="#217239" opacity="0.15" />
      <path d="M38 100 Q38 118 50 118 Q62 118 62 100 L58 86 H42 Z" fill="#52b788" />
      <rect x="36" y="84" width="28" height="5" rx="2.5" fill="#40916c" />
      <path d="M50 84 Q48 66 46 50" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 50 Q30 36 22 20 Q40 24 46 50Z" fill="#74c69d" />
      <path d="M46 50 Q62 34 70 18 Q54 26 46 50Z" fill="#52b788" />
      <path d="M47 64 Q33 56 26 44 Q42 48 47 64Z" fill="#95d5b2" />
      <path d="M47 64 Q61 54 68 42 Q54 50 47 64Z" fill="#74c69d" />
      <path d="M48 76 Q38 70 32 60 Q44 64 48 76Z" fill="#b7e4c7" />
      <path d="M48 76 Q58 68 64 58 Q54 64 48 76Z" fill="#95d5b2" />
    </svg>
  )
}

export default function Beranda() {
  const { isGuest, session } = useAuth()
  const navigate = useNavigate()
  const [kategori, setKategori] = useState([])
  const [summary, setSummary]   = useState({
    saldoPoinSaatIni: 0,
    totalSampahDisetorKg: 0,
    totalPoinDidapat: 0,
    totalTransaksiSetor: 0,
    transaksiTerakhirSetor: null,
    transaksiTerakhirTukar: null,
  })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      // 1. Fetch Kategori Sampah
      const katRes = await getKategoriSampah()
      const katData = Array.isArray(katRes.data?.data)
        ? katRes.data.data
        : Array.isArray(katRes.data)
        ? katRes.data
        : []
      setKategori(katData)

      // 2. Fetch Dashboard Summary if not guest
      if (!isGuest) {
        const sumRes = await getDashboardSummary()
        const data = sumRes.data?.data ?? sumRes.data

        if (data) {
          const setorList = Array.isArray(data.setorTerakhir) ? data.setorTerakhir : []
          const tukarList = Array.isArray(data.penukaranTerakhir) ? data.penukaranTerakhir : []

          // Hitung total berat sampah yang disetor dari array setorTerakhir
          const calculatedTotalBerat = setorList.reduce(
            (acc, item) => acc + Number(item.totalBeratKg ?? item.beratKg ?? 0),
            0
          )

          // Transaksi terakhir setor
          let latestSetor = null
          if (setorList.length > 0) {
            const s = setorList[0]
            latestSetor = {
              kodeSetor: s.kodeSetor ?? '',
              tanggal: s.tanggal ?? '',
              beratKg: Number(s.totalBeratKg ?? s.beratKg ?? 0),
              poin: Number(s.totalPoin ?? s.poin ?? 0),
              status: s.status ?? '',
            }
          }

          // Transaksi terakhir tukar
          let latestTukar = null
          if (tukarList.length > 0) {
            const t = tukarList[0]
            latestTukar = {
              kodePenukaran: t.kodePenukaran ?? t.kode ?? '',
              tanggal: t.tanggal ?? '',
              hadiah: t.hadiah?.namaHadiah ?? t.namaHadiah ?? t.hadiah ?? 'Hadiah',
              poin: Number(t.totalPoin ?? t.poin ?? 0),
              status: t.status ?? '',
            }
          }

          setSummary({
            saldoPoinSaatIni: Number(data.saldoPoin ?? data.saldoPoinSaatIni ?? 0),
            totalSampahDisetorKg:
              data.totalSampahDisetorKg !== undefined
                ? Number(data.totalSampahDisetorKg ?? 0)
                : Math.round(calculatedTotalBerat * 10) / 10,
            totalPoinDidapat: Number(data.totalPoinDiperoleh ?? data.totalPoinDidapat ?? 0),
            totalTransaksiSetor: Number(data.totalPengajuanSetor ?? data.totalTransaksiSetor ?? 0),
            transaksiTerakhirSetor: latestSetor,
            transaksiTerakhirTukar: latestTukar,
          })
        }
      }
    } catch (err) {
      console.error('[Beranda loadData error]:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat data beranda. Periksa koneksi Anda.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }, [isGuest])

  useEffect(() => {
    loadData()
  }, [loadData])

  const goToProtected = (path) => {
    if (isGuest) navigate('/login', { state: { from: path } })
    else navigate(path)
  }

  const nama = session.user?.namaNasabah || session.user?.nama || 'Nasabah'

  const TARGET_KG = 10
  const targetPercent = Math.min(
    100,
    Math.round(((summary.totalSampahDisetorKg ?? 0) / TARGET_KG) * 100)
  )

  return (
    <div className="flex flex-col gap-7 sm:gap-8 pb-8">
      {/* ── Sapaan ── */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="font-display text-2xl font-bold text-ink leading-tight">
            Halo, {isGuest ? 'Tamu' : nama} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed max-w-lg">
            {isGuest
              ? 'Masuk untuk mulai mengelola setoran sampah Anda.'
              : 'Terima kasih sudah ikut menjaga lingkungan melalui Bank Sampah Digital. Yuk, lanjutkan kontribusimu!'}
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 opacity-90 -mt-2">
          <PlantIllustration className="w-full h-full" />
        </div>
      </div>

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1 font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Coba lagi</span>
          </button>
        </div>
      )}

      {/* ── Row 1: Saldo Poin + Dampak Kamu ── */}
      {!isGuest && (
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5">
          {/* Card Saldo Poin — solid dark green */}
          <div className="relative overflow-hidden rounded-2xl bg-[#163421] p-5 sm:p-6 text-white shadow-card">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-28 bg-white/20 rounded" />
                <div className="h-10 w-44 bg-white/20 rounded" />
                <div className="h-6 w-36 bg-white/20 rounded-full" />
              </div>
            ) : (
              <div className="relative flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-5">
                {/* Left: Saldo Poin */}
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-xs font-semibold text-brand-200 mb-1.5">Saldo Poin</p>
                  <div className="flex items-baseline gap-2">
                    <Star size={22} className="fill-amber-300 text-amber-300 shrink-0 mb-0.5" />
                    <span className="font-display text-4xl font-bold tabular-nums">
                      {(summary.saldoPoinSaatIni ?? 0).toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm font-medium text-brand-200">Poin</span>
                  </div>

                  {/* +X poin bulan ini badge */}
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-emerald-100">
                      +{(summary.totalPoinDidapat ?? 0).toLocaleString('id-ID')} poin bulan ini
                    </span>
                  </div>

                  {/* Link Lihat Riwayat */}
                  <button
                    onClick={() => goToProtected('/riwayat')}
                    className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-200 hover:text-white transition-colors cursor-pointer"
                  >
                    Lihat Riwayat <ChevronRight size={13} />
                  </button>
                </div>

                {/* Right: Total Setoran — distinct lighter panel */}
                <div className="relative shrink-0 sm:w-[168px] rounded-xl bg-white/10 border border-white/10 px-4 py-4 flex flex-col justify-center overflow-hidden">
                  <span className="pointer-events-none absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Recycle size={16} className="text-emerald-200/70 -translate-x-1 -translate-y-1" />
                  </span>
                  <p className="text-[11px] font-medium text-emerald-200/80 mb-1.5">
                    Total Setoran
                  </p>
                  <p className="font-display text-2xl font-bold tabular-nums text-white">
                    {summary.totalSampahDisetorKg ?? 0}{' '}
                    <span className="text-sm font-normal text-emerald-200/90">kg</span>
                  </p>
                  <p className="text-[11px] text-emerald-300/80 mt-1">
                    dari {summary.totalTransaksiSetor ?? 0} transaksi
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card Dampak Kamu — white */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-9 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded-full" />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Leaf size={15} strokeWidth={2.5} />
                    </span>
                    <p className="text-sm font-bold text-ink">Dampak Kamu</p>
                  </div>

                  <div>
                    <p className="font-display text-3xl font-bold text-ink tabular-nums">
                      {summary.totalSampahDisetorKg ?? 0} <span className="text-base font-normal text-gray-400">kg</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">sampah berhasil dikumpulkan bulan ini</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${targetPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2.5 text-[11px] text-gray-400">
                    <span>Target bulan ini</span>
                    <span className="font-semibold text-ink">
                      {summary.totalSampahDisetorKg ?? 0} / {TARGET_KG} kg
                      <span className="ml-1.5 font-medium text-gray-400">{targetPercent}%</span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Section: Aksi Cepat ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Aksi Cepat</h2>
            <p className="text-xs text-gray-400">Lakukan aksi kecil, beri dampak besar!</p>
          </div>
          <button
            onClick={() => goToProtected('/setor')}
            className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Lihat Semua <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Setor Sampah */}
          <button
            onClick={() => goToProtected('/setor')}
            className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-card border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <Recycle size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink line-clamp-1">Setor Sampah</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Ajukan setoran baru</p>
              </div>
            </div>
            <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all ml-2" />
          </button>

          {/* Tukar Poin */}
          <button
            onClick={() => goToProtected('/hadiah')}
            className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-card border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                <Gift size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink line-clamp-1">Tukar Poin</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Gunakan saldo poin</p>
              </div>
            </div>
            <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all ml-2" />
          </button>

          {/* Riwayat */}
          <button
            onClick={() => goToProtected('/riwayat')}
            className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-card border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 group-hover:bg-sky-100 transition-colors">
                <ClipboardList size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink line-clamp-1">Riwayat</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Lihat aktivitas</p>
              </div>
            </div>
            <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all ml-2" />
          </button>
        </div>
      </section>

      {/* ── Section: Jenis Sampah & Poin ── */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Jenis Sampah & Poin</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pilih kategori untuk melihat detail harga dan poin.</p>
          </div>
          <Link
            to="/kategori-sampah"
            className="group flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Lihat Semua
            <ChevronRight size={14} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col rounded-2xl bg-white p-4 shadow-card border border-gray-100"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-gray-200 mb-3" />
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {kategori.slice(0, 4).map((k, idx) => {
              const id = k.id ?? k.kategoriSampahId ?? idx
              const fotoUrl = resolveFotoUrl(k.foto)
              return (
                <button
                  key={id}
                  onClick={() => goToProtected('/kategori-sampah')}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Foto */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    {fotoUrl ? (
                      <>
                        <img
                          src={fotoUrl}
                          alt={k.namaKategori}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'flex'
                            }
                          }}
                        />
                        <div className="absolute inset-0" style={{ display: 'none' }}>
                          <WasteIcon jenis={k.jenis} />
                        </div>
                      </>
                    ) : (
                      <WasteIcon jenis={k.jenis} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-ink group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {k.namaKategori}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">
                        Rp {(k.hargaPerKg).toLocaleString('id-ID')}/kg
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <Star size={11} className="fill-amber-400 text-amber-500" />
                        +{k.poinPerKg} Poin/kg
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Section: Tahukah Kamu? ── */}
      <div className="flex items-stretch overflow-hidden rounded-2xl bg-white shadow-card border border-gray-100">
        <div className="relative w-32 sm:w-44 shrink-0 overflow-hidden bg-emerald-100">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80"
            alt="Daur ulang sampah"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">💡</span>
            <p className="text-sm font-bold text-ink">Tahukah Kamu?</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Memisahkan sampah berdasarkan jenisnya dapat membantu proses daur ulang menjadi lebih efektif.
          </p>
          <button
            onClick={() => goToProtected('/kategori-sampah')}
            className="mt-3 self-start text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            Pelajari lebih lanjut <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Row: Transaksi Terakhir + CTA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5">
        {/* Transaksi Terakhir */}
        {!isGuest && (
          <div className="rounded-2xl bg-white shadow-card border border-gray-100 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <h3 className="font-display text-sm font-bold text-ink">Transaksi Terakhir</h3>
                <Link
                  to="/riwayat"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 transition-colors"
                >
                  Lihat Semua <ChevronRight size={13} />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading && (
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
                  </div>
                )}
                {!loading && summary.transaksiTerakhirSetor && (
                  <TransaksiItem
                    type="setor"
                    title="Setor Sampah"
                    subtitle={summary.transaksiTerakhirSetor.kodeSetor}
                    date={summary.transaksiTerakhirSetor.tanggal}
                    poin={summary.transaksiTerakhirSetor.poin}
                  />
                )}
                {!loading && summary.transaksiTerakhirTukar && (
                  <TransaksiItem
                    type="tukar"
                    title="Tukar Poin"
                    subtitle={summary.transaksiTerakhirTukar.hadiah}
                    date={summary.transaksiTerakhirTukar.tanggal}
                    poin={summary.transaksiTerakhirTukar.poin}
                  />
                )}
                {!loading && !summary.transaksiTerakhirSetor && !summary.transaksiTerakhirTukar && (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    Belum ada transaksi
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA Card — light green with plant illustration */}
        <div className="relative overflow-hidden rounded-2xl bg-emerald-50/70 border border-emerald-100 p-5 sm:p-6 flex flex-col justify-between min-h-[170px]">
          <div className="absolute -bottom-2 -right-2 w-28 h-36 opacity-75 pointer-events-none">
            <PlantCtaIllustration className="w-full h-full" />
          </div>

          <div className="relative z-10 max-w-[70%]">
            <p className="text-xs font-bold text-emerald-700 mb-1">🌿 Untuk lingkungan</p>
            <h3 className="font-display text-base font-bold text-ink leading-snug">
              Jangan lupa, setor sampahmu hari ini!
            </h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              Bersama kita wujudkan lingkungan yang lebih bersih.
            </p>
          </div>

          <button
            onClick={() => goToProtected('/setor')}
            className="relative z-10 mt-4 self-start rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            Setor Sekarang <ChevronRight size={14} />
          </button>
        </div>

        {/* Guest CTA */}
        {isGuest && (
          <div className="rounded-2xl bg-white shadow-card border border-emerald-100 p-5 flex flex-col justify-center items-center text-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Recycle size={22} />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-ink">Mulai Setoran Anda</h3>
              <p className="text-xs text-gray-400 mt-0.5">Masuk untuk lihat riwayat & tukar poin</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="rounded-full bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors"
            >
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
