import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  UploadCloud,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Coins,
} from 'lucide-react'
import {
  getAdminKategoriList,
  getAdminKategoriDetail,
  createAdminKategori,
  updateAdminKategori,
  deleteAdminKategori,
} from '../../services/adminService'
import { resolveFotoUrl } from '../../services/api'
import WasteIcon from '../../components/nasabah/WasteIcon'

const JENIS_OPTIONS = [
  { value: 'plastik', label: 'Plastik' },
  { value: 'kertas', label: 'Kertas / Kardus' },
  { value: 'logam', label: 'Logam' },
  { value: 'kaca', label: 'Kaca' },
]

// Badge warna per jenis — sesuai referensi desain
const JENIS_BADGE = {
  plastik: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🔵' },
  kertas: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🟡' },
  logam: { bg: 'bg-slate-100 text-slate-600 border-slate-300', icon: '⚙️' },
  kaca: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: '🟢' },
  default: { bg: 'bg-brand-50 text-brand-700 border-brand-200', icon: '♻️' },
}

// Jenis icon mapping untuk badge (emoji style sesuai desain)
const JENIS_EMOJI = {
  plastik: '🧴',
  kertas: '📦',
  logam: '🔩',
  kaca: '🫙',
  default: '♻️',
}

// ── Reusable Category Form Fields (Defined OUTSIDE parent to prevent remounting & focus loss) ──
function CategoryFormFields({
  form,
  setForm,
  onFotoChange,
  modalError,
  isEdit = false,
}) {
  const previewSrc = isEdit
    ? form.fotoPreview || resolveFotoUrl(form.existingFotoUrl)
    : form.fotoPreview

  return (
    <>
      {/* Error inside modal */}
      {modalError && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 animate-fadeIn">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{modalError}</div>
        </div>
      )}

      {/* Upload Foto — large dashed preview box */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">
          Foto Kategori{' '}
          <span className="text-xs font-normal text-gray-400">
            {isEdit ? '(Opsional, ganti foto)' : '(Opsional)'}
          </span>
        </label>
        <label
          htmlFor={isEdit ? 'edit-kategori-foto' : 'add-kategori-foto'}
          className="group relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-400 bg-gray-50/60 hover:bg-brand-50/30 transition-all cursor-pointer overflow-hidden"
          style={{ minHeight: '160px' }}
        >
          {previewSrc ? (
            <div className="w-full h-40 relative">
              <img
                src={previewSrc}
                alt="Preview foto kategori"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full">
                  Klik untuk ganti foto
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud size={22} className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-700">Upload foto kategori</p>
                <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG — maksimal 2MB</p>
              </div>
            </div>
          )}
        </label>
        <input
          id={isEdit ? 'edit-kategori-foto' : 'add-kategori-foto'}
          type="file"
          accept="image/*"
          onChange={onFotoChange}
          className="hidden"
        />
      </div>

      {/* Nama Kategori */}
      <div>
        <label
          className="block text-xs font-bold text-gray-700 mb-1.5"
          htmlFor={isEdit ? 'edit-nama-kategori' : 'add-nama-kategori'}
        >
          Nama Kategori <span className="text-brand-600">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <Tag size={15} />
          </span>
          <input
            id={isEdit ? 'edit-nama-kategori' : 'add-nama-kategori'}
            type="text"
            required
            value={form.namaKategori}
            onChange={(e) => setForm((p) => ({ ...p, namaKategori: e.target.value }))}
            placeholder="Contoh: Botol Plastik PET"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
      </div>

      {/* Harga & Poin Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs font-bold text-gray-700 mb-1.5"
            htmlFor={isEdit ? 'edit-harga' : 'add-harga'}
          >
            Harga / Kg <span className="text-brand-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-xs font-bold text-gray-400">
              Rp
            </span>
            <input
              id={isEdit ? 'edit-harga' : 'add-harga'}
              type="number"
              required
              min="0"
              value={form.hargaPerKg}
              onChange={(e) => setForm((p) => ({ ...p, hargaPerKg: e.target.value }))}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-sm text-ink font-semibold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-xs font-bold text-gray-700 mb-1.5"
            htmlFor={isEdit ? 'edit-poin' : 'add-poin'}
          >
            Poin / Kg <span className="text-brand-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Star size={14} className="fill-amber-400 text-amber-500" />
            </span>
            <input
              id={isEdit ? 'edit-poin' : 'add-poin'}
              type="number"
              required
              min="0"
              value={form.poinPerKg}
              onChange={(e) => setForm((p) => ({ ...p, poinPerKg: e.target.value }))}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-sm text-ink font-semibold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Dropdown Jenis Sampah */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Jenis Sampah <span className="text-brand-600">*</span>
        </label>
        <div className="relative">
          <select
            value={form.jenis}
            onChange={(e) => setForm((p) => ({ ...p, jenis: e.target.value }))}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-9 py-3 text-sm font-semibold text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
          >
            {JENIS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
    </>
  )
}

export default function KategoriSampah() {
  // Table & Data State
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Form State (Add)
  const [addForm, setAddForm] = useState({
    namaKategori: '',
    hargaPerKg: '',
    poinPerKg: '',
    jenis: 'plastik',
    foto: null,
    fotoPreview: null,
  })
  const [submittingAdd, setSubmittingAdd] = useState(false)
  const [addModalError, setAddModalError] = useState('')

  // Form State (Edit)
  const [editForm, setEditForm] = useState({
    id: '',
    namaKategori: '',
    hargaPerKg: '',
    poinPerKg: '',
    jenis: 'plastik',
    foto: null,
    fotoPreview: null,
    existingFotoUrl: null,
  })
  const [loadingEditDetail, setLoadingEditDetail] = useState(false)
  const [submittingEdit, setSubmittingEdit] = useState(false)
  const [editModalError, setEditModalError] = useState('')

  // Delete State
  const [submittingDelete, setSubmittingDelete] = useState(false)
  const [deleteModalError, setDeleteModalError] = useState('')

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminKategoriList()
      console.log('[KategoriSampah Admin] GET /kategori-sampah response:', res.data)
      const data = res.data?.data ?? res.data ?? []
      setCategories(Array.isArray(data) ? data : [])
      setCurrentPage(1)
    } catch (err) {
      console.error('[KategoriSampah Admin] Error fetch data:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat data kategori sampah.'
      setErrorMsg(msg)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const triggerSuccess = (msg) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast('')
    }, 4000)
  }

  // Client Search Filter
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase().trim()
    return categories.filter((item) => {
      const nama = String(item.namaKategori || item.nama || '').toLowerCase()
      const jenis = String(item.jenis || '').toLowerCase()
      return nama.includes(q) || jenis.includes(q)
    })
  }, [categories, searchQuery])

  // Pagination Calculation
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredList.slice(start, start + itemsPerPage)
  }, [filteredList, currentPage, itemsPerPage])

  // ── Open Add Modal ──
  const handleOpenAdd = () => {
    setAddForm({
      namaKategori: '',
      hargaPerKg: '',
      poinPerKg: '',
      jenis: 'plastik',
      foto: null,
      fotoPreview: null,
    })
    setAddModalError('')
    setShowAddModal(true)
  }

  // ── Add Foto Change ──
  const handleAddFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAddModalError('Ukuran file foto maksimal 2MB')
        return
      }
      setAddModalError('')
      setAddForm((prev) => ({
        ...prev,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      }))
    }
  }

  // ── Submit Add Kategori ──
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setAddModalError('')

    const { namaKategori, hargaPerKg, poinPerKg, jenis, foto } = addForm
    if (!namaKategori.trim()) {
      setAddModalError('Nama kategori wajib diisi.')
      return
    }

    const hargaNum = Number(hargaPerKg)
    const poinNum = Number(poinPerKg)
    if (isNaN(hargaNum) || hargaNum < 0) {
      setAddModalError('Harga per kg harus berupa angka valid minimal 0.')
      return
    }
    if (isNaN(poinNum) || poinNum < 0) {
      setAddModalError('Poin per kg harus berupa angka valid minimal 0.')
      return
    }

    setSubmittingAdd(true)
    try {
      const formData = new FormData()
      formData.append('namaKategori', namaKategori.trim())
      formData.append('hargaPerKg', hargaNum)
      formData.append('poinPerKg', poinNum)
      formData.append('jenis', String(jenis).toLowerCase().trim())
      if (foto) {
        formData.append('foto', foto)
      }

      console.log('[KategoriSampah] Mengirim create kategori payload formData')
      await createAdminKategori(formData)
      triggerSuccess(`Kategori "${namaKategori.trim()}" berhasil ditambahkan!`)
      await fetchCategories()
      setShowAddModal(false)
    } catch (err) {
      console.error('[KategoriSampah] Error create kategori:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menambahkan kategori sampah.'
      setAddModalError(msg)
    } finally {
      setSubmittingAdd(false)
    }
  }

  // ── Open Edit Modal ──
  const handleOpenEdit = async (cat) => {
    const catId = cat.id || cat.kategoriSampahId || cat._id
    setSelectedCategory(cat)
    setEditModalError('')
    setEditForm({
      id: String(catId),
      namaKategori: cat.namaKategori || cat.nama || '',
      hargaPerKg: cat.hargaPerKg ?? cat.harga ?? '',
      poinPerKg: cat.poinPerKg ?? cat.poin ?? '',
      jenis: String(cat.jenis || 'plastik').toLowerCase(),
      foto: null,
      fotoPreview: null,
      existingFotoUrl: cat.foto || cat.gambar || cat.imageUrl || null,
    })
    setShowEditModal(true)
    setLoadingEditDetail(true)

    try {
      const res = await getAdminKategoriDetail(catId)
      const data = res.data?.data ?? res.data
      if (data) {
        const item = data.kategoriSampah || data
        setEditForm((prev) => ({
          ...prev,
          namaKategori: item.namaKategori || item.nama || prev.namaKategori,
          hargaPerKg: item.hargaPerKg ?? item.harga ?? prev.hargaPerKg,
          poinPerKg: item.poinPerKg ?? item.poin ?? prev.poinPerKg,
          jenis: String(item.jenis || prev.jenis).toLowerCase(),
          existingFotoUrl: item.foto || item.gambar || item.imageUrl || prev.existingFotoUrl,
        }))
      }
    } catch (err) {
      console.warn('[KategoriSampah] Warning fetch detail edit:', err)
    } finally {
      setLoadingEditDetail(false)
    }
  }

  // ── Edit Foto Change ──
  const handleEditFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setEditModalError('Ukuran file foto maksimal 2MB')
        return
      }
      setEditModalError('')
      setEditForm((prev) => ({
        ...prev,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      }))
    }
  }

  // ── Submit Edit Kategori ──
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditModalError('')

    const { id, namaKategori, hargaPerKg, poinPerKg, jenis, foto } = editForm
    if (!namaKategori.trim()) {
      setEditModalError('Nama kategori wajib diisi.')
      return
    }

    const hargaNum = Number(hargaPerKg)
    const poinNum = Number(poinPerKg)
    if (isNaN(hargaNum) || hargaNum < 0) {
      setEditModalError('Harga per kg harus berupa angka valid minimal 0.')
      return
    }
    if (isNaN(poinNum) || poinNum < 0) {
      setEditModalError('Poin per kg harus berupa angka valid minimal 0.')
      return
    }

    setSubmittingEdit(true)
    try {
      const formData = new FormData()
      formData.append('namaKategori', namaKategori.trim())
      formData.append('hargaPerKg', hargaNum)
      formData.append('poinPerKg', poinNum)
      formData.append('jenis', String(jenis).toLowerCase().trim())
      if (foto) {
        formData.append('foto', foto)
      }

      await updateAdminKategori(id, formData)
      triggerSuccess(`Kategori "${namaKategori.trim()}" berhasil diperbarui!`)
      await fetchCategories()
      setShowEditModal(false)
    } catch (err) {
      console.error('[KategoriSampah] Error update kategori:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memperbarui data kategori sampah.'
      setEditModalError(msg)
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ── Open Delete Modal ──
  const handleOpenDelete = (cat) => {
    setSelectedCategory(cat)
    setDeleteModalError('')
    setShowDeleteModal(true)
  }

  // ── Submit Delete Kategori ──
  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return
    const catId = selectedCategory.id || selectedCategory.kategoriSampahId || selectedCategory._id
    const nama = selectedCategory.namaKategori || selectedCategory.nama || 'Kategori'

    setSubmittingDelete(true)
    setDeleteModalError('')
    try {
      await deleteAdminKategori(catId)
      setShowDeleteModal(false)
      triggerSuccess(`Kategori "${nama}" berhasil dihapus.`)
      fetchCategories()
    } catch (err) {
      console.error('[KategoriSampah] Error delete kategori:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menghapus kategori. Kategori ini mungkin masih digunakan dalam transaksi setoran.'
      setDeleteModalError(msg)
    } finally {
      setSubmittingDelete(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 mb-2 border border-brand-100">
            <Layers size={13} className="text-brand-600" />
            Manajemen Sampah
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Data Kategori Sampah
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Kelola kategori sampah yang tersedia.
          </p>
        </div>

        {/* Top Right: Refresh + Tambah */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchCategories}
            title="Muat ulang data"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-brand-700 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : ''} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span> Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span className="font-bold">{successToast}</span>
          </div>
          <button type="button" onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchCategories}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {/* ── Grid Container ── */}
      <div className="rounded-3xl bg-white shadow-card border border-gray-100 overflow-hidden">

        {/* Search + Total Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/60">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari kategori sampah..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <span className="hidden sm:inline text-xs text-gray-400 font-medium whitespace-nowrap">
            Total:{' '}
            <span className="font-bold text-brand-700 text-sm">{filteredList.length}</span>{' '}
            Kategori
          </span>
        </div>

        {/* ── Loading Skeleton Grid ── */}
        {loading && (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  <div className="h-3 w-2/5 bg-gray-200 rounded" />
                  <div className="h-5 w-14 bg-gray-200 rounded-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Photo Grid ── */}
        {!loading && paginatedData.length > 0 && (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedData.map((item, index) => {
              const itemId = item.id || item.kategoriSampahId || item._id
              const nama = item.namaKategori || item.nama || 'Kategori'
              const harga = Number(item.hargaPerKg ?? item.harga ?? 0)
              const poin = Number(item.poinPerKg ?? item.poin ?? 0)
              const jenisKey = String(item.jenis || 'default').toLowerCase()
              const rawFotoUrl = resolveFotoUrl(item.foto || item.gambar || item.imageUrl)
              const fotoUrl = rawFotoUrl ? `${rawFotoUrl}?t=${Date.now()}` : null
              const badgeStyle = JENIS_BADGE[jenisKey] || JENIS_BADGE.default
              const jenisLabel = JENIS_OPTIONS.find((o) => o.value === jenisKey)?.label || jenisKey

              return (
                <div
                  key={itemId || index}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {/* Photo area with overlay buttons */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={nama}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.classList.add('flex', 'items-center', 'justify-center')
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <WasteIcon jenis={jenisKey} className="h-20 w-20 opacity-60" />
                      </div>
                    )}

                    {/* Edit & Delete overlay buttons — top right */}
                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit kategori"
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-brand-700 shadow transition-colors cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(item)}
                        title="Hapus kategori"
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-600 shadow transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-3.5 space-y-1.5">
                    <p className="font-bold text-sm text-ink leading-tight line-clamp-2">
                      {nama}
                    </p>

                    {/* Harga */}
                    <div className="flex items-center gap-1.5 text-xs text-brand-700">
                      <Coins size={13} className="text-brand-500 shrink-0" />
                      <span className="font-semibold">
                        Rp {harga.toLocaleString('id-ID')}/kg
                      </span>
                    </div>

                    {/* Poin */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-600">
                      <Star size={12} className="fill-amber-400 text-amber-500 shrink-0" />
                      <span className="font-semibold">{poin} Poin/kg</span>
                    </div>

                    {/* Jenis Badge */}
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${badgeStyle.bg}`}
                      >
                        <span>{JENIS_EMOJI[jenisKey] || '♻️'}</span>
                        <span>{jenisLabel}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && paginatedData.length === 0 && !errorMsg && (
          <div className="py-20 px-4 text-center flex flex-col items-center justify-center text-gray-400">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-3">
              <Inbox size={26} />
            </span>
            <p className="font-bold text-sm text-ink">Tidak Ada Kategori Sampah</p>
            <p className="text-xs text-gray-400 max-w-sm mt-0.5">
              {searchQuery
                ? 'Tidak ditemukan kategori yang cocok dengan kata kunci pencarian.'
                : 'Belum ada kategori sampah terdaftar di database.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Kategori Pertama</span>
              </button>
            )}
          </div>
        )}

        {/* ── Pagination Footer ── */}
        {!loading && filteredList.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-gray-50/40">
            <span>
              Menampilkan{' '}
              <strong className="text-ink">{(currentPage - 1) * itemsPerPage + 1}</strong>
              {' - '}
              <strong className="text-ink">
                {Math.min(currentPage * itemsPerPage, filteredList.length)}
              </strong>{' '}
              dari{' '}
              <strong className="text-ink">{filteredList.length}</strong> data
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* ── MODAL 1: TAMBAH KATEGORI ──────────────────────────────────────── */}
      {/* ================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Tambah Kategori Sampah</h2>
                <p className="text-xs text-gray-400 mt-0.5">Isi form berikut untuk menambah kategori baru</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="h-9 w-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <CategoryFormFields
                form={addForm}
                setForm={setAddForm}
                onFotoChange={handleAddFotoChange}
                modalError={addModalError}
                isEdit={false}
              />

              {/* Divider */}
              <div className="border-t border-gray-100 pt-2">
                {/* Cancel + Submit full-width buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={submittingAdd}
                    className="w-full rounded-2xl bg-brand-600 py-3 text-sm font-bold text-white shadow hover:bg-brand-700 active:scale-[0.98] disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submittingAdd ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Tambah Kategori</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={submittingAdd}
                    onClick={() => setShowAddModal(false)}
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* ── MODAL 2: EDIT KATEGORI ────────────────────────────────────────── */}
      {/* ================================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Edit Kategori Sampah</h2>
                <p className="text-xs text-gray-400 mt-0.5">Perbarui informasi kategori</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="h-9 w-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Loading detail spinner */}
            {loadingEditDetail && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-500">Memuat data...</p>
                </div>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <CategoryFormFields
                form={editForm}
                setForm={setEditForm}
                onFotoChange={handleEditFotoChange}
                modalError={editModalError}
                isEdit={true}
              />

              {/* Divider */}
              <div className="border-t border-gray-100 pt-2">
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={submittingEdit}
                    className="w-full rounded-2xl bg-brand-600 py-3 text-sm font-bold text-white shadow hover:bg-brand-700 active:scale-[0.98] disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submittingEdit ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan</span>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={submittingEdit}
                    onClick={() => setShowEditModal(false)}
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* ── MODAL 3: KONFIRMASI HAPUS ─────────────────────────────────────── */}
      {/* ================================================================== */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-gray-100 text-center animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs border border-red-100">
              <Trash2 size={28} strokeWidth={2} />
            </div>

            <h3 className="font-display text-lg font-bold text-ink">Hapus Kategori</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Yakin ingin menghapus kategori{' '}
              <strong className="text-ink">
                "{selectedCategory.namaKategori || selectedCategory.nama}"
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            {/* Error Message */}
            {deleteModalError && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 text-left animate-fadeIn">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium">{deleteModalError}</div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                disabled={submittingDelete}
                onClick={handleDeleteSubmit}
                className="w-full rounded-2xl bg-red-600 py-3 text-sm font-bold text-white shadow hover:bg-red-700 active:scale-[0.98] disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submittingDelete ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Kategori</span>
                )}
              </button>
              <button
                type="button"
                disabled={submittingDelete}
                onClick={() => setShowDeleteModal(false)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
