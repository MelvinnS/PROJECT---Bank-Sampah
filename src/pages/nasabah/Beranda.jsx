import { useEffect, useState, useCallback } from 'react'
import {
  ChevronRight,
  Leaf,
  Recycle,
  Star,
  Gift,
  ClipboardList,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import TransaksiItem from '../../components/nasabah/TransaksiItem'
import { getDashboardSummary, getKategoriSampah } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'

// Local Assets for the Hero Card Deck
import sampahBotolImg from '../../assets/images/sampahbotol.jpg'
import sampahKalengImg from '../../assets/images/sampahkaleng.jpg'
import sampahKardusImg from '../../assets/images/sampahkardus.jpg'
import hadiahBerasImg from '../../assets/images/hadiahberas.jpg'
import hadiahMinyakImg from '../../assets/images/hadiahminyak.jpg'
import hadiahPulsaImg from '../../assets/images/hadiahpulsa.jpg'

export default function Beranda() {
  const { isGuest, session } = useAuth()
  const navigate = useNavigate()
  const [kategori, setKategori] = useState([])
  const [summary, setSummary] = useState({
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

          const calculatedTotalBerat = setorList.reduce(
            (acc, item) => acc + Number(item.totalBeratKg ?? item.beratKg ?? 0),
            0
          )

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

  // Card Deck Items for the Hero section matching reference layout
  const HERO_DECK = [
    {
      title: 'Plastik',
      badge: 'PET / Cup',
      image: sampahBotolImg,
      rotation: '-rotate-[13deg]',
      translate: 'translate-y-2',
      bgTag: 'bg-blue-600',
    },
    {
      title: 'Kardus',
      badge: 'Karton Box',
      image: sampahKardusImg,
      rotation: '-rotate-[7deg]',
      translate: '-translate-y-1',
      bgTag: 'bg-[#153d23]',
    },
    {
      title: 'Logam',
      badge: 'Kaleng & Besi',
      image: sampahKalengImg,
      rotation: '-rotate-[2deg]',
      translate: '-translate-y-3',
      bgTag: 'bg-amber-600',
    },
    {
      title: 'Kaca',
      badge: 'Botol Bening',
      image: sampahBotolImg,
      rotation: 'rotate-[4deg]',
      translate: '-translate-y-2',
      bgTag: 'bg-[#1b4332]',
    },
    {
      title: 'Minyak',
      badge: 'Reward',
      image: hadiahMinyakImg,
      rotation: 'rotate-[9deg]',
      translate: '-translate-y-1',
      bgTag: 'bg-[#0f2e1b]',
    },
    {
      title: 'Beras',
      badge: 'Reward Poin',
      image: hadiahBerasImg,
      rotation: 'rotate-[15deg]',
      translate: 'translate-y-2',
      bgTag: 'bg-emerald-800',
    },
  ]

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-6xl mx-auto">
      
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

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION: JENIS SAMPAH & POIN (Persis Desain Referensi)
      ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white border border-[#153d23]/10 shadow-card p-6 sm:p-10 lg:p-12 text-center">
        {/* Subtle Ambient Background Gradients in Deep Green */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#153d23]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 rounded-full bg-[#1b4332]/5 blur-3xl pointer-events-none" />

        {/* Small user greeting badge inside hero */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#153d23]/5 border border-[#153d23]/10 px-3.5 py-1 text-xs font-semibold text-[#153d23] mb-4">
          <Leaf size={13} className="text-[#153d23]" />
          <span>Halo, {isGuest ? 'Nasabah Tamu' : nama} 👋</span>
        </div>

        {/* Headline with Floating Badge Pills (Exact like reference image) */}
        <div className="relative max-w-2xl mx-auto">
          {/* Left Pill Tag */}
          <div className="hidden sm:inline-flex items-center gap-1 absolute -top-2.5 -left-6 lg:-left-12 rotate-[-8deg] rounded-full bg-[#1d4ed8] px-3 py-1 text-[11px] font-bold text-white shadow-md select-none animate-bounce">
            <span>@botol_kaca</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f2e1b] tracking-tight leading-[1.1]">
            Pilah Sampah, Raih Nilai Poin Maksimal.
          </h1>

          {/* Right Pill Tag */}
          <div className="hidden sm:inline-flex items-center gap-1 absolute -bottom-2 -right-4 lg:-right-10 rotate-[6deg] rounded-full bg-[#153d23] px-3 py-1 text-[11px] font-bold text-white shadow-md select-none animate-pulse">
            <span>@kardus_kertas</span>
          </div>
        </div>

        {/* ── Overlapping Fanned Card Deck (EXACT layout like reference photo) ── */}
        <div className="my-7 sm:my-10 flex items-center justify-center overflow-x-auto py-6 px-4 no-scrollbar">
          <div className="flex items-center justify-center -space-x-4 sm:-space-x-7 md:-space-x-8">
            {HERO_DECK.map((item, idx) => (
              <div
                key={idx}
                onClick={() => goToProtected('/kategori-sampah')}
                className={`group relative w-24 h-32 sm:w-32 sm:h-44 md:w-36 md:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white cursor-pointer transform ${item.rotation} ${item.translate} hover:rotate-0 hover:-translate-y-5 hover:scale-110 hover:z-30 transition-all duration-300 ease-out bg-gray-100 shrink-0`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-3 text-left">
                  <span
                    className={`inline-block w-max rounded-full ${item.bgTag} px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold text-white mb-0.5`}
                  >
                    {item.badge}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtitle Under Card Deck */}
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Kumpulkan sampah daur ulang terpilah dari rumah, timbang bersama petugas bank sampah, dan tukarkan poin akumulasi dengan berbagai pilihan hadiah kebutuhan sehari-hari.
        </p>

        {/* ── Action Buttons Underneath Hero (as requested) ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => goToProtected('/kategori-sampah')}
            className="group inline-flex items-center gap-2 rounded-full bg-[#153d23] hover:bg-[#0f2e1b] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#153d23]/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Lihat Katalog Jenis Sampah &amp; Poin</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => goToProtected('/setor')}
            className="inline-flex items-center gap-2 rounded-full border border-[#153d23]/25 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[#153d23] hover:bg-[#153d23]/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <span>Setor Sampah Sekarang</span>
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION: SALDO POIN & DAMPAK KAMU (Di Bawah Section Hero)
      ════════════════════════════════════════════════════════════ */}
      {!isGuest && (
        <section className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-5">
          {/* Card Saldo Poin — Deep Forest Green Palette */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#153d23] via-[#12361f] to-[#0f2e1b] p-6 sm:p-7 text-white shadow-card flex flex-col justify-between">
            {/* Ambient Background Circles */}
            <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-28 bg-white/20 rounded" />
                <div className="h-10 w-48 bg-white/20 rounded" />
                <div className="h-6 w-36 bg-white/20 rounded-full" />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200/90">
                    Saldo Poin Anda
                  </span>
                  <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                    <Star size={16} className="fill-amber-300" />
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-black tracking-tight tabular-nums">
                    {(summary.saldoPoinSaatIni ?? 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-sm font-semibold text-emerald-200">Poin Aktif</span>
                </div>

                {/* Badge Poin Bulan Ini */}
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                    <TrendingUp size={13} className="text-emerald-300" />
                    <span>+{(summary.totalPoinDidapat ?? 0).toLocaleString('id-ID')} poin bulan ini</span>
                  </span>
                </div>

                {/* Frosted Sub-Panel: Total Setoran & Riwayat Link */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-emerald-200/80 font-medium">Total Sampah Disetor</p>
                    <p className="text-base font-bold text-white mt-0.5">
                      {summary.totalSampahDisetorKg ?? 0} kg{' '}
                      <span className="text-xs font-normal text-emerald-200/70">
                        ({summary.totalTransaksiSetor ?? 0}x setor)
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToProtected('/riwayat')}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    <span>Riwayat</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card Dampak Kamu — Clean White Card with Deep Green Progress Bar */}
          <div className="rounded-3xl bg-white border border-[#153d23]/10 p-6 sm:p-7 shadow-card flex flex-col justify-between">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 w-36 bg-gray-200 rounded" />
                <div className="h-9 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded-full" />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-8 w-8 rounded-full bg-[#153d23]/10 flex items-center justify-center text-[#153d23]">
                      <Leaf size={16} strokeWidth={2.4} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-[#0f2e1b]">Dampak Kamu</h3>
                      <p className="text-[11px] text-gray-400">Kontribusi pelestarian lingkungan</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-display text-3xl sm:text-4xl font-black text-[#0f2e1b] tabular-nums">
                      {summary.totalSampahDisetorKg ?? 0}{' '}
                      <span className="text-base font-medium text-gray-400">kg</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Sampah berhasil dicegah menumpuk di TPA dan siap didaur ulang.
                    </p>
                  </div>
                </div>

                {/* Progress Bar in Deep Green */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#153d23] transition-all duration-700 ease-out"
                      style={{ width: `${targetPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2.5 text-[11px] text-gray-500">
                    <span>Target bulanan: 10 kg</span>
                    <span className="font-bold text-[#0f2e1b]">{targetPercent}% Tercapai</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECTION: AKSI CEPAT (Quick Actions)
      ════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0f2e1b]">Aksi Cepat</h2>
            <p className="text-xs text-gray-400">Akses cepat menu transaksi utama Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Action 1: Setor Sampah */}
          <button
            type="button"
            onClick={() => goToProtected('/setor')}
            className="group flex items-center justify-between rounded-3xl bg-white p-5 shadow-card border border-[#153d23]/10 hover:border-[#153d23]/30 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#153d23]/10 text-[#153d23] group-hover:bg-[#153d23] group-hover:text-white transition-colors duration-300">
                <Recycle size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0f2e1b] group-hover:text-[#153d23] transition-colors">
                  Setor Sampah
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Ajukan setoran baru</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-[#153d23] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-2 shrink-0" />
          </button>

          {/* Action 2: Tukar Poin */}
          <button
            type="button"
            onClick={() => goToProtected('/hadiah')}
            className="group flex items-center justify-between rounded-3xl bg-white p-5 shadow-card border border-[#153d23]/10 hover:border-[#153d23]/30 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                <Gift size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0f2e1b] group-hover:text-[#153d23] transition-colors">
                  Tukar Hadiah
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Gunakan saldo poin</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-2 shrink-0" />
          </button>

          {/* Action 3: Riwayat */}
          <button
            type="button"
            onClick={() => goToProtected('/riwayat')}
            className="group flex items-center justify-between rounded-3xl bg-white p-5 shadow-card border border-[#153d23]/10 hover:border-[#153d23]/30 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ClipboardList size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0f2e1b] group-hover:text-[#153d23] transition-colors">
                  Riwayat
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Pantau status transaksi</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-blue-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-2 shrink-0" />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ROW: TRANSAKSI TERAKHIR + EDUKASI DAUR ULANG
      ════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5">
        {/* Transaksi Terakhir */}
        {!isGuest ? (
          <div className="rounded-3xl bg-white shadow-card border border-[#153d23]/10 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#0f2e1b]">Transaksi Terakhir</h3>
                  <p className="text-[10px] text-gray-400">Aktivitas setor dan tukar terbaru</p>
                </div>
                <Link
                  to="/riwayat"
                  className="text-xs font-bold text-[#153d23] hover:text-[#0f2e1b] flex items-center gap-0.5 transition-colors"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              <div className="divide-y divide-gray-100 p-2">
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
                    title="Tukar Hadiah"
                    subtitle={summary.transaksiTerakhirTukar.hadiah}
                    date={summary.transaksiTerakhirTukar.tanggal}
                    poin={summary.transaksiTerakhirTukar.poin}
                  />
                )}
                {!loading && !summary.transaksiTerakhirSetor && !summary.transaksiTerakhirTukar && (
                  <div className="px-4 py-8 text-center text-xs text-gray-400">
                    Belum ada riwayat transaksi.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white shadow-card border border-[#153d23]/10 p-6 flex flex-col justify-center items-center text-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#153d23]/10 text-[#153d23]">
              <Recycle size={22} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-[#0f2e1b]">Mulai Setoran Pertama Anda</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Masuk ke akun nasabah Anda untuk memantau saldo poin, mengajukan setoran, dan menukarkan hadiah.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2 rounded-full bg-[#153d23] hover:bg-[#0f2e1b] px-6 py-2.5 text-xs font-bold text-white transition-colors shadow-sm"
            >
              Masuk Sekarang
            </button>
          </div>
        )}

        {/* Edukasi Card / Eco Banner in Deep Forest Green */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0f2e1b] p-6 sm:p-7 text-white shadow-card flex flex-col justify-between min-h-[190px]">
          {/* Subtle Graphic in Corner */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-bold">
              <ShieldCheck size={15} />
              <span>Daur Ulang Bertanggung Jawab</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white leading-snug">
              Pastikan Sampah Kering &amp; Terpilah
            </h3>
            <p className="mt-1.5 text-xs text-white/70 leading-relaxed font-light">
              Pemisahan botol, kaleng, dan kardus sebelum dibawa ke Bank Sampah mempercepat proses verifikasi dan menjaga kualitas daur ulang.
            </p>
          </div>

          <div className="relative z-10 mt-5 pt-3">
            <button
              type="button"
              onClick={() => goToProtected('/kategori-sampah')}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#0f2e1b] hover:bg-gray-100 px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <span>Pelajari Jenis Sampah</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

