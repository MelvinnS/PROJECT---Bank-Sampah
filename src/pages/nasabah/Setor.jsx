import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Info,
  Plus,
  Recycle,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ajukanSetor, getKategoriSampah } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'
import CategoryDropdown from '../../components/nasabah/CategoryDropdown'
import WasteIcon from '../../components/nasabah/WasteIcon'

// Static, presentational-only descriptions shown under each waste category's
// thumbnail in "Daftar Sampah" — keyed by `jenis`, not tied to fetch/logic.
const JENIS_DESKRIPSI = {
  plastik: 'Botol, cup, kemasan plastik',
  kertas: 'Kardus, koran, kertas bekas',
  logam: 'Kaleng, besi, aluminium',
  kaca: 'Botol kaca, toples bening',
}

// Decorative leaf branch photo for the page header (Unsplash, "plant branch
// on a white background" by Mockup Graphics).
const HEADER_LEAF_PHOTO =
  'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=300&q=80&auto=format&fit=crop'

// Decorative photo for the "Tahukah Kamu?" sidebar card (reused from Beranda
// for visual consistency across the app).
const TAHUKAH_KAMU_PHOTO =
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80'

export default function Setor() {
  const { isGuest, isInitializing } = useAuth()
  const navigate = useNavigate()

  // Guest Protection
  useEffect(() => {
    if (isGuest) {
      navigate('/login', { state: { from: '/setor' }, replace: true })
    }
  }, [isGuest, navigate])

  // State: Categories from API
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errorCategoryMsg, setErrorCategoryMsg] = useState('')

  // State: Form
  const getTodayString = () => new Date().toISOString().split('T')[0]
  const [tanggal, setTanggal] = useState(getTodayString())
  const [catatan, setCatatan] = useState('')
  const [items, setItems] = useState([
    { id: 1, kategoriSampahId: '', beratKg: '' },
  ])

  // State: UI & Feedback
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Fetch Categories from API
  const fetchCategories = useCallback(async () => {
    if (isInitializing) return

    setLoadingCategories(true)
    setErrorCategoryMsg('')

    try {
      const res = await getKategoriSampah()
      const dataArray = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : []

      if (dataArray.length === 0) {
        setErrorCategoryMsg('Tidak ada data kategori sampah yang ditemukan di server.')
      }

      setCategories(dataArray)
    } catch (err) {
      console.error('[getKategoriSampah error]:', err.response || err)
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal terhubung ke server.'
      setErrorCategoryMsg(`Gagal memuat kategori sampah: ${serverMsg}`)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }, [isInitializing])

  useEffect(() => {
    if (!isInitializing) {
      fetchCategories()
    }
  }, [isInitializing, fetchCategories])

  // Category Options formatted for custom dropdown
  const categoryOptions = useMemo(() => {
    return categories.map((c) => {
      const id = String(c.id ?? c.kategoriSampahId ?? c.id_kategori_sampah ?? '')
      return {
        id,
        nama: c.namaKategori ?? c.nama ?? 'Kategori',
        harga: Number(c.hargaPerKg ?? c.harga_per_kg ?? 0),
        poin: Number(c.poinPerKg ?? c.poin_per_kg ?? 0),
        jenis: c.jenis,
        foto: c.foto,
      }
    })
  }, [categories])

  // Category map for fast computation
  const categoryMap = useMemo(() => {
    const map = new Map()
    categoryOptions.forEach((c) => {
      if (c.id) {
        map.set(c.id, c)
      }
    })
    return map
  }, [categoryOptions])

  // Real-time Calculations
  const summary = useMemo(() => {
    let totalPoin = 0
    let totalBerat = 0
    let totalEstimasiRupiah = 0
    let activeCategoriesCount = 0

    items.forEach((item) => {
      const berat = parseFloat(item.beratKg)
      if (item.kategoriSampahId) {
        activeCategoriesCount++
      }
      if (!isNaN(berat) && berat > 0 && item.kategoriSampahId) {
        const cat = categoryMap.get(String(item.kategoriSampahId))
        if (cat) {
          totalBerat += berat
          totalPoin += berat * cat.poin
          totalEstimasiRupiah += berat * cat.harga
        }
      }
    })

    return {
      totalPoin: Math.round(totalPoin * 10) / 10,
      totalBerat: Math.round(totalBerat * 100) / 100,
      totalEstimasiRupiah: Math.round(totalEstimasiRupiah),
      jenisCount: activeCategoriesCount || items.length,
    }
  }, [items, categoryMap])

  // Item Handlers
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), kategoriSampahId: '', beratKg: '' },
    ])
  }

  const handleRemoveItem = (idToRemove) => {
    if (items.length <= 1) {
      setItems([{ id: Date.now(), kategoriSampahId: '', beratKg: '' }])
      return
    }
    setItems((prev) => prev.filter((item) => item.id !== idToRemove))
  }

  const handleItemChange = (id, field, value) => {
    setErrorMsg('')
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!tanggal) {
      setErrorMsg('Harap tentukan tanggal setoran.')
      return
    }

    if (!items || items.length === 0) {
      setErrorMsg('Minimal harus menyertakan 1 item sampah.')
      return
    }

    const cleanedItems = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.kategoriSampahId) {
        setErrorMsg(`Harap pilih kategori sampah untuk baris #${i + 1}.`)
        return
      }
      const parsedWeight = parseFloat(item.beratKg)
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        setErrorMsg(`Berat sampah pada baris #${i + 1} harus lebih dari 0 kg.`)
        return
      }

      cleanedItems.push({
        kategoriSampahId: String(item.kategoriSampahId),
        beratKg: parsedWeight,
      })
    }

    setSubmitting(true)
    try {
      const payload = {
        tanggal,
        catatan: catatan.trim() || undefined,
        items: cleanedItems,
      }

      await ajukanSetor(payload)
      setSuccessMsg('Pengajuan setoran sampah berhasil dibuat! Mengalihkan ke Riwayat...')
      setTimeout(() => {
        navigate('/riwayat')
      }, 1200)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal mengajukan setoran sampah. Silakan coba lagi.'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (isGuest) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/70 px-2.5 py-0.5 text-xs font-bold text-brand-800 mb-2 border border-brand-200/50">
            <Recycle size={13} className="text-brand-600" />
            Setor Sampah Nasabah
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Ajukan Setoran Sampah
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Timbang sampah daur ulang Anda dan kumpulkan poin reward.
          </p>
        </div>

        {/* Decorative leaf branch + handwritten note */}
        <div className="hidden sm:flex shrink-0 items-start gap-2 pt-1">
          <p className="font-handwriting text-lg leading-tight text-brand-700 -rotate-3 mt-3 text-right">
            Langkah kecil<br />untuk perubahan<br />besar
          </p>
         
        </div>
      </div>

      {/* Category Load Error Banner */}
      {errorCategoryMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 shadow-xs animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span className="font-medium">{errorCategoryMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchCategories}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Muat Ulang</span>
          </button>
        </div>
      )}

      {/* Form Error Message */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200/80 p-3.5 text-xs text-red-700 animate-fadeIn shadow-xs">
          <AlertCircle size={17} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-3.5 text-xs text-emerald-800 animate-fadeIn shadow-xs">
          <CheckCircle2 size={17} className="shrink-0 mt-0.5 text-emerald-600" />
          <div className="flex-1 font-medium">{successMsg}</div>
        </div>
      )}

      {/* Main Grid: Form Left, Estimation Right */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols on desktop): Form Inputs */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
            {/* Step / Section Title */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                1
              </span>
              <h2 className="font-display text-base font-bold text-ink">
                Data Setoran
              </h2>
            </div>

            {/* Tanggal Setor */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="tanggal-setor">
                Tanggal Setor <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="tanggal-setor"
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer font-medium"
                />
              </div>
            </div>

            {/* Section Daftar Sampah */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  2
                </span>
                <h2 className="font-display text-base font-bold text-ink">
                  Daftar Sampah
                </h2>
              </div>

              {/* Table Column Labels */}
              <div className="hidden sm:grid grid-cols-12 gap-3 mb-1.5 text-[11px] font-bold text-gray-500 px-1">
                <div className="col-span-6">
                  Jenis Sampah <span className="text-brand-600">*</span>
                </div>
                <div className="col-span-4">
                  Berat (Kg) <span className="text-brand-600">*</span>
                </div>
                <div className="col-span-2 text-right">Aksi</div>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {items.map((item, index) => {
                  const selectedCat = categoryMap.get(String(item.kategoriSampahId))
                  const itemBerat = parseFloat(item.beratKg)
                  const itemPoin =
                    !isNaN(itemBerat) && selectedCat ? itemBerat * selectedCat.poin : 0
                  const deskripsi = selectedCat
                    ? JENIS_DESKRIPSI[String(selectedCat.jenis).toLowerCase()] ?? 'Sampah daur ulang'
                    : 'Pilih jenis sampah di sebelah kanan'

                  return (
                    <div
                      key={item.id}
                      className="relative rounded-2xl border border-gray-100 bg-sand/20 p-3 sm:p-3.5 transition-all hover:border-brand-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Thumbnail + name/description */}
                        <div className="flex items-center gap-3 sm:w-[38%] min-w-0">
                          <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/70 flex items-center justify-center">
                            {selectedCat ? (
                              resolveFotoUrl(selectedCat.foto) ? (
                                <>
                                  <img
                                    src={resolveFotoUrl(selectedCat.foto)}
                                    alt={selectedCat.nama}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      if (e.currentTarget.nextSibling) {
                                        e.currentTarget.nextSibling.style.display = 'flex'
                                      }
                                    }}
                                  />
                                  <div className="h-full w-full flex items-center justify-center" style={{ display: 'none' }}>
                                    <WasteIcon jenis={selectedCat.jenis} className="h-full w-full" />
                                  </div>
                                </>
                              ) : (
                                <WasteIcon jenis={selectedCat.jenis} className="h-full w-full" />
                              )
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-gray-300">
                                <Recycle size={18} />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-bold truncate ${selectedCat ? 'text-ink' : 'text-gray-400'}`}>
                              {selectedCat ? selectedCat.nama : 'Belum dipilih'}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{deskripsi}</p>
                          </div>
                        </div>

                        {/* Dropdown */}
                        <div className="flex-1 min-w-0">
                          <CategoryDropdown
                            options={categoryOptions}
                            value={item.kategoriSampahId}
                            onChange={(val) =>
                              handleItemChange(item.id, 'kategoriSampahId', val)
                            }
                            placeholder="Pilih Jenis"
                            loading={loadingCategories}
                          />
                        </div>

                        {/* Input Berat */}
                        <div className="flex items-center gap-2 sm:w-[150px] shrink-0">
                          <div className="relative flex-1">
                            <input
                              type="number"
                              required
                              step="0.1"
                              min="0.1"
                              placeholder="0.0"
                              value={item.beratKg}
                              onChange={(e) =>
                                handleItemChange(item.id, 'beratKg', e.target.value)
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm text-ink font-semibold shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs font-medium text-gray-400 pointer-events-none">
                              kg
                            </span>
                          </div>

                          {/* Delete Button (if more than 1 item) */}
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                              title="Hapus baris"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Estimation sub-info if selected */}
                      {selectedCat && !isNaN(itemBerat) && itemBerat > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200/50 flex items-center justify-between text-[11px] text-gray-500 px-1">
                          <span>
                            Rp {(itemBerat * selectedCat.harga).toLocaleString('id-ID')}
                          </span>
                          <span className="font-semibold text-brand-700 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-brand-100">
                            <Star size={10} className="fill-amber-400 text-amber-500" />
                            +{Math.round(itemPoin * 10) / 10} Poin
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Add More Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-3.5 w-full py-2.5 rounded-2xl border border-dashed border-brand-300 bg-brand-50/40 text-xs font-bold text-brand-700 hover:bg-brand-50 hover:border-brand-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>+ Tambah Kategori Sampah Lainnya</span>
              </button>
            </div>

            {/* Catatan Tambahan */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  3
                </span>
                <h2 className="font-display text-base font-bold text-ink">
                  Catatan Tambahan <span className="text-xs font-normal text-gray-400">(Opsional)</span>
                </h2>
              </div>
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={200}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Sampah sudah dipilah dan dimasukkan ke dalam 2 kardus rapi."
                  className="w-full rounded-2xl border border-gray-200 bg-sand/30 p-3 pb-6 text-xs sm:text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                />
                <span className="absolute bottom-2.5 right-3.5 text-[11px] text-gray-400 font-medium">
                  {catatan.length}/200
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on desktop): Sticky Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col gap-5">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
            {/* Card Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Sparkles size={15} />
              </span>
              <div>
                <h2 className="font-display text-sm font-bold text-ink">
                  Estimasi Total Poin
                </h2>
                <p className="text-[10px] text-gray-400">Dihitung otomatis secara real-time</p>
              </div>
            </div>

            {/* Total Points Highlight */}
            <div className="my-4 rounded-2xl bg-brand-50/80 p-4 text-center border border-brand-100/80">
              <p className="text-[11px] font-semibold text-brand-800">Total Poin yang Didapat</p>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <Star size={20} className="fill-amber-400 text-amber-500 shrink-0" />
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">
                  {summary.totalPoin}
                </span>
                <span className="text-xs font-bold text-brand-700 self-end mb-1">Poin</span>
              </div>
            </div>

            {/* Breakdown Rincian */}
            <div className="space-y-2.5 text-xs text-gray-600 pb-4 border-b border-gray-100">
              <p className="font-bold text-ink text-xs mb-1">Rincian</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Berat</span>
                <span className="font-bold text-ink">{summary.totalBerat} Kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Estimasi Nilai Sampah</span>
                <span className="font-bold text-ink">
                  Rp {summary.totalEstimasiRupiah.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Jumlah Jenis Sampah</span>
                <span className="font-bold text-ink">{summary.jenisCount} Jenis</span>
              </div>
            </div>

            {/* Info Notice */}
            <div className="my-4 flex items-start gap-2 rounded-2xl bg-amber-50/70 p-3 text-[11px] text-amber-800 border border-amber-200/50 leading-relaxed">
              <Info size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span>
                Berat final dan perolehan poin akan diverifikasi oleh petugas saat sampah diserahkan.
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting || loadingCategories || Boolean(errorCategoryMsg)}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirim Pengajuan...</span>
                </div>
              ) : (
                <>
                  <Recycle size={16} />
                  <span>Ajukan Setoran</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Tahukah Kamu? */}
          <div className="flex overflow-hidden rounded-3xl bg-white shadow-card border border-gray-100">
            <div className="relative w-20 shrink-0 overflow-hidden bg-emerald-100">
              <img
                src={TAHUKAH_KAMU_PHOTO}
                alt="Daur ulang sampah"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="flex-1 p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">💡</span>
                <p className="text-xs font-bold text-ink">Tahukah Kamu?</p>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Memisahkan sampah berdasarkan jenisnya dapat membantu proses daur ulang menjadi lebih efektif.
              </p>
              <button
                type="button"
                onClick={() => navigate('/kategori-sampah')}
                className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Pelajari lebih lanjut <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
