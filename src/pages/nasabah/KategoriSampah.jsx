import { useEffect, useState } from 'react'
import { Leaf, RefreshCw, Star, AlertCircle, Search, X, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getKategoriSampah } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'
import WasteIcon from '../../components/nasabah/WasteIcon'

const JENIS_BADGE = {
  plastik: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Plastik' },
  kertas:  { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Kertas / Kardus' },
  logam:   { bg: 'bg-slate-100 text-slate-600 border-slate-300', label: 'Logam' },
  kaca:    { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: 'Kaca' },
  default: { bg: 'bg-brand-50 text-brand-700 border-brand-200', label: 'Sampah' },
}

// ── Bottom Sheet — defined OUTSIDE parent to prevent remount ──
function CategoryBottomSheet({ item, onClose, onSetor }) {
  const [touchStart, setTouchStart] = useState(null)
  const [touchDeltaY, setTouchDeltaY] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  if (!item) return null

  const nama = item.namaKategori || item.nama || 'Kategori'
  const harga = Number(item.hargaPerKg ?? item.harga ?? 0)
  const poin = Number(item.poinPerKg ?? item.poin ?? 0)
  const jenis = (item.jenis || '').toLowerCase()
  const badge = JENIS_BADGE[jenis] || JENIS_BADGE.default
  const fotoUrl = resolveFotoUrl(item.foto)

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY)
    setIsSwiping(true)
  }

  const handleTouchMove = (e) => {
    if (touchStart === null) return
    const currentY = e.touches[0].clientY
    const delta = currentY - touchStart
    if (delta > 0) {
      setTouchDeltaY(delta)
    }
  }

  const handleTouchEnd = () => {
    if (touchDeltaY > 80) {
      onClose()
    }
    setTouchStart(null)
    setTouchDeltaY(0)
    setIsSwiping(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div
        style={{
          transform: touchDeltaY > 0 ? `translateY(${touchDeltaY}px)` : undefined,
          transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative z-10 w-full max-w-xl mx-auto flex flex-col rounded-t-[28px] bg-white shadow-2xl max-h-[78vh] animate-slideUp overflow-hidden"
      >
        {/* Drag Handle Area (Touch gesture receiver) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex justify-center pt-3 pb-2.5 cursor-grab active:cursor-grabbing shrink-0 select-none touch-none bg-white"
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100/90 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors z-20 cursor-pointer shadow-2xs"
          aria-label="Tutup"
        >
          <X size={16} />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Foto Header */}
          <div className="relative w-full aspect-[16/9] max-h-56 overflow-hidden bg-gray-100 shrink-0">
            {fotoUrl ? (
              <>
                <img
                  src={fotoUrl}
                  alt={nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = 'flex'
                    }
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gray-50"
                  style={{ display: 'none' }}
                >
                  <WasteIcon jenis={jenis} />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <WasteIcon jenis={jenis} />
              </div>
            )}
          </div>

          {/* Details Body */}
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            {/* Badge jenis */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.bg}`}>
                {badge.label}
              </span>
            </div>

            {/* Nama Kategori */}
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink leading-snug">
                {nama}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Kategori sampah siap daur ulang yang diterima oleh Bank Sampah.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-3.5 text-center">
                <p className="text-[11px] text-gray-400 font-semibold mb-1">Harga per kg</p>
                <p className="font-display text-lg font-bold text-ink">
                  Rp {harga.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-50/80 border border-brand-100 p-3.5 text-center">
                <p className="text-[11px] text-brand-600 font-semibold mb-1">Poin per kg</p>
                <div className="flex items-center justify-center gap-1">
                  <Star size={15} className="fill-amber-400 text-amber-500 shrink-0" />
                  <p className="font-display text-lg font-extrabold text-brand-700">+{poin}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onSetor()
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Setor Sekarang</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KategoriSampah() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchCategories = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getKategoriSampah()
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : []
      setCategories(data)
    } catch (err) {
      console.error('Gagal memuat kategori sampah:', err)
      setErrorMsg('Gagal memuat daftar kategori sampah.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filtered = categories.filter((c) => {
    const nama = (c.namaKategori || c.nama || '').toLowerCase()
    return nama.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/70 px-2.5 py-0.5 text-xs font-bold text-brand-800 mb-2 border border-brand-200/50">
            <Leaf size={13} className="text-brand-600" />
            Informasi Sampah
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Katalog Jenis Sampah &amp; Poin
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Daftar jenis sampah yang dapat disetorkan beserta harga dan poin per kilogram.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCategories}
          title="Muat ulang"
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari jenis sampah (misal: botol, kardus)..."
          className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
        />
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchCategories}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse flex flex-col rounded-3xl bg-white p-3.5 shadow-card border border-gray-100"
            >
              <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200 mb-3" />
              <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 rounded-md mb-3" />
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Categories Grid with Real Photos */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((k) => {
            const id = k.id || k.kategoriSampahId || Math.random()
            const nama = k.namaKategori || k.nama || 'Kategori'
            const harga = Number(k.hargaPerKg ?? k.harga ?? 0)
            const poin = Number(k.poinPerKg ?? k.poin ?? 0)
            const fotoUrl = resolveFotoUrl(k.foto)

            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedItem(k)}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-3.5 shadow-card border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 mb-3">
                    {fotoUrl ? (
                      <>
                        <img
                          src={fotoUrl}
                          alt={nama}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextSibling.style.display = 'flex'
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
                  <h3 className="font-bold text-xs sm:text-sm text-ink group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">
                    {nama}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium mb-2.5">
                    Rp {harga.toLocaleString('id-ID')}/kg
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
                    <Star size={11} className="fill-amber-400 text-amber-500" />
                    +{poin} Poin/kg
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && !errorMsg && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-card border border-gray-100 text-center">
          <Leaf size={32} className="text-gray-300 mb-3" />
          <p className="font-bold text-ink text-sm">Tidak ada kategori yang cocok</p>
          <p className="text-xs text-gray-400 mt-1">Coba kata kunci pencarian lainnya.</p>
        </div>
      )}

      {/* Bottom Sheet Detail */}
      <CategoryBottomSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSetor={() => navigate('/setor')}
      />
    </div>
  )
}
