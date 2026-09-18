import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Gift,
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
  Package,
} from 'lucide-react'
import {
  getAdminHadiahList,
  getAdminHadiahDetail,
  createAdminHadiah,
  updateAdminHadiah,
  deleteAdminHadiah,
} from '../../services/adminService'
import { resolveFotoUrl } from '../../services/api'

// Stock badge color logic
const getStokBadge = (stok) => {
  const s = Number(stok ?? 0)
  if (s === 0) return { bg: 'bg-red-50 text-red-700 border-red-200', label: `Stok: ${s}` }
  if (s < 5) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: `Stok: ${s}` }
  return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: `Stok: ${s}` }
}

const ITEMS_PER_PAGE = 8

// ── Reusable Modal Shell Component (Defined OUTSIDE parent to prevent remounting & focus loss) ──
function ModalShell({
  show,
  title,
  onClose,
  onSubmit,
  submitting,
  children,
  submitLabel = 'Simpan',
  submitDisabled = false,
}) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-display font-bold text-base text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
            {children}
          </div>
          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || submitDisabled}
              className="flex-1 rounded-2xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Reusable Hadiah Form Fields (Defined OUTSIDE parent) ──
function HadiahFormFields({ form, setForm, onFotoChange, modalError, isEdit = false }) {
  const previewSrc = isEdit
    ? form.fotoPreview || resolveFotoUrl(form.existingFotoUrl)
    : form.fotoPreview

  return (
    <>
      {modalError && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 animate-fadeIn">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{modalError}</div>
        </div>
      )}

      {/* Upload Foto */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">
          Foto Hadiah{' '}
          <span className="text-xs font-normal text-gray-400">
            {isEdit ? '(Opsional, ganti foto)' : '(Opsional)'}
          </span>
        </label>
        <label
          htmlFor={isEdit ? 'edit-hadiah-foto' : 'add-hadiah-foto'}
          className="group relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-400 bg-gray-50/60 hover:bg-brand-50/30 transition-all cursor-pointer overflow-hidden"
          style={{ minHeight: '160px' }}
        >
          {previewSrc ? (
            <div className="w-full h-40 relative">
              <img
                src={previewSrc}
                alt="Preview foto hadiah"
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
                <p className="text-sm font-bold text-brand-700">Upload foto hadiah</p>
                <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG — maksimal 2MB</p>
              </div>
            </div>
          )}
        </label>
        <input
          id={isEdit ? 'edit-hadiah-foto' : 'add-hadiah-foto'}
          type="file"
          accept="image/*"
          onChange={onFotoChange}
          className="hidden"
        />
      </div>

      {/* Nama Hadiah */}
      <div>
        <label
          className="block text-xs font-bold text-gray-700 mb-1.5"
          htmlFor={isEdit ? 'edit-nama-hadiah' : 'add-nama-hadiah'}
        >
          Nama Hadiah <span className="text-brand-600">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <Gift size={15} />
          </span>
          <input
            id={isEdit ? 'edit-nama-hadiah' : 'add-nama-hadiah'}
            type="text"
            required
            value={form.namaHadiah}
            onChange={(e) => setForm((p) => ({ ...p, namaHadiah: e.target.value }))}
            placeholder="Contoh: Voucher Belanja Rp50.000"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
      </div>

      {/* Poin & Stok Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs font-bold text-gray-700 mb-1.5"
            htmlFor={isEdit ? 'edit-poin' : 'add-poin'}
          >
            Poin Dibutuhkan <span className="text-brand-600">*</span>
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
              value={form.poinDibutuhkan}
              onChange={(e) => setForm((p) => ({ ...p, poinDibutuhkan: e.target.value }))}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-sm text-ink font-semibold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>
        <div>
          <label
            className="block text-xs font-bold text-gray-700 mb-1.5"
            htmlFor={isEdit ? 'edit-stok' : 'add-stok'}
          >
            Stok <span className="text-brand-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Package size={14} />
            </span>
            <input
              id={isEdit ? 'edit-stok' : 'add-stok'}
              type="number"
              required
              min="0"
              value={form.stok}
              onChange={(e) => setForm((p) => ({ ...p, stok: e.target.value }))}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-3 text-sm text-ink font-semibold focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function HadiahAdmin() {
  // ── State ──
  const [hadiahList, setHadiahList] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({
    namaHadiah: '',
    poinDibutuhkan: '',
    stok: '',
    foto: null,
    fotoPreview: null,
  })
  const [addModalError, setAddModalError] = useState('')
  const [submittingAdd, setSubmittingAdd] = useState(false)

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    id: '',
    namaHadiah: '',
    poinDibutuhkan: '',
    stok: '',
    foto: null,
    fotoPreview: null,
    existingFotoUrl: null,
  })
  const [editModalError, setEditModalError] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)
  const [loadingEditDetail, setLoadingEditDetail] = useState(false)

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedHadiah, setSelectedHadiah] = useState(null)
  const [deleteModalError, setDeleteModalError] = useState('')
  const [submittingDelete, setSubmittingDelete] = useState(false)

  // ── Fetch ──
  const fetchHadiah = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminHadiahList()
      console.log('[Hadiah Admin] GET /hadiah response:', res.data)
      const data = res.data?.data ?? res.data ?? []
      setHadiahList(Array.isArray(data) ? data : [])
      setCurrentPage(1)
    } catch (err) {
      console.error('[Hadiah Admin] Error fetch data:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat data hadiah.'
      setErrorMsg(msg)
      setHadiahList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHadiah()
  }, [fetchHadiah])

  const triggerSuccess = (msg) => {
    setSuccessToast(msg)
    setTimeout(() => setSuccessToast(''), 4000)
  }

  // ── Filter & Pagination ──
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return hadiahList
    const q = searchQuery.toLowerCase().trim()
    return hadiahList.filter((item) =>
      String(item.namaHadiah || item.nama || '').toLowerCase().includes(q)
    )
  }, [hadiahList, searchQuery])

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredList.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredList, currentPage])

  // ── Add Handlers ──
  const handleOpenAdd = () => {
    setAddForm({ namaHadiah: '', poinDibutuhkan: '', stok: '', foto: null, fotoPreview: null })
    setAddModalError('')
    setShowAddModal(true)
  }

  const handleAddFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setAddModalError('Ukuran foto maksimal 2MB')
      return
    }
    setAddModalError('')
    setAddForm((p) => ({ ...p, foto: file, fotoPreview: URL.createObjectURL(file) }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setAddModalError('')
    const { namaHadiah, poinDibutuhkan, stok, foto } = addForm
    if (!namaHadiah.trim()) {
      setAddModalError('Nama hadiah wajib diisi.')
      return
    }
    const poinNum = Number(poinDibutuhkan)
    const stokNum = Number(stok)
    if (isNaN(poinNum) || poinNum < 0) {
      setAddModalError('Poin harus berupa angka valid.')
      return
    }
    if (isNaN(stokNum) || stokNum < 0) {
      setAddModalError('Stok harus berupa angka valid.')
      return
    }

    setSubmittingAdd(true)
    try {
      const formData = new FormData()
      formData.append('namaHadiah', namaHadiah.trim())
      formData.append('poinDibutuhkan', poinNum)
      formData.append('stok', stokNum)
      if (foto) formData.append('foto', foto)

      console.log('[Hadiah] Mengirim create hadiah payload formData')
      await createAdminHadiah(formData)
      triggerSuccess(`Hadiah "${namaHadiah.trim()}" berhasil ditambahkan!`)
      await fetchHadiah()
      setShowAddModal(false)
    } catch (err) {
      console.error('[Hadiah] Error create:', err)
      setAddModalError(err.response?.data?.message || err.message || 'Gagal menambahkan hadiah.')
    } finally {
      setSubmittingAdd(false)
    }
  }

  // ── Edit Handlers ──
  const handleOpenEdit = async (item) => {
    const id = item.id || item.hadiahId || item._id
    setSelectedHadiah(item)
    setEditModalError('')
    setEditForm({
      id: String(id),
      namaHadiah: item.namaHadiah || item.nama || '',
      poinDibutuhkan: item.poinDibutuhkan ?? '',
      stok: item.stok ?? '',
      foto: null,
      fotoPreview: null,
      existingFotoUrl: item.foto || item.gambar || item.imageUrl || null,
    })
    setShowEditModal(true)
    setLoadingEditDetail(true)
    try {
      const res = await getAdminHadiahDetail(id)
      const data = res.data?.data ?? res.data
      if (data) {
        const d = data.hadiah || data
        setEditForm((prev) => ({
          ...prev,
          namaHadiah: d.namaHadiah || d.nama || prev.namaHadiah,
          poinDibutuhkan: d.poinDibutuhkan ?? prev.poinDibutuhkan,
          stok: d.stok ?? prev.stok,
          existingFotoUrl: d.foto || d.gambar || d.imageUrl || prev.existingFotoUrl,
        }))
      }
    } catch (err) {
      console.warn('[Hadiah] Warning fetch detail:', err)
    } finally {
      setLoadingEditDetail(false)
    }
  }

  const handleEditFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setEditModalError('Ukuran foto maksimal 2MB')
      return
    }
    setEditModalError('')
    setEditForm((p) => ({ ...p, foto: file, fotoPreview: URL.createObjectURL(file) }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditModalError('')
    const { id, namaHadiah, poinDibutuhkan, stok, foto } = editForm
    if (!namaHadiah.trim()) {
      setEditModalError('Nama hadiah wajib diisi.')
      return
    }
    const poinNum = Number(poinDibutuhkan)
    const stokNum = Number(stok)
    if (isNaN(poinNum) || poinNum < 0) {
      setEditModalError('Poin harus berupa angka valid.')
      return
    }
    if (isNaN(stokNum) || stokNum < 0) {
      setEditModalError('Stok harus berupa angka valid.')
      return
    }

    setSubmittingEdit(true)
    try {
      const formData = new FormData()
      formData.append('namaHadiah', namaHadiah.trim())
      formData.append('poinDibutuhkan', poinNum)
      formData.append('stok', stokNum)
      if (foto) formData.append('foto', foto)

      await updateAdminHadiah(id, formData)
      triggerSuccess(`Hadiah "${namaHadiah.trim()}" berhasil diperbarui!`)
      await fetchHadiah()
      setShowEditModal(false)
    } catch (err) {
      console.error('[Hadiah] Error update:', err)
      setEditModalError(err.response?.data?.message || err.message || 'Gagal memperbarui hadiah.')
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ── Delete Handlers ──
  const handleOpenDelete = (item) => {
    setSelectedHadiah(item)
    setDeleteModalError('')
    setShowDeleteModal(true)
  }

  const handleDeleteSubmit = async () => {
    if (!selectedHadiah) return
    const id = selectedHadiah.id || selectedHadiah.hadiahId || selectedHadiah._id
    const nama = selectedHadiah.namaHadiah || selectedHadiah.nama || 'Hadiah'
    setSubmittingDelete(true)
    setDeleteModalError('')
    try {
      await deleteAdminHadiah(id)
      setShowDeleteModal(false)
      triggerSuccess(`Hadiah "${nama}" berhasil dihapus.`)
      fetchHadiah()
    } catch (err) {
      console.error('[Hadiah] Error delete:', err)
      setDeleteModalError(err.response?.data?.message || err.message || 'Gagal menghapus hadiah.')
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
            <Gift size={13} className="text-brand-600" />
            Manajemen Hadiah
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">Data Hadiah</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Kelola hadiah yang dapat ditukar dengan poin.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchHadiah}
            title="Muat ulang data"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-brand-700 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : ''} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Tambah Hadiah
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

      {/* ── Global Error ── */}
      {errorMsg && !loading && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-700 shadow-xs">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Gagal memuat data</p>
            <p className="text-xs mt-0.5 opacity-80">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={fetchHadiah}
            className="text-xs font-bold text-red-600 underline underline-offset-2 hover:text-red-800 cursor-pointer"
          >
            Coba lagi
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
              placeholder="Cari hadiah..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <span className="hidden sm:inline text-xs text-gray-400 font-medium whitespace-nowrap">
            Total:{' '}
            <span className="font-bold text-brand-700 text-sm">{filteredList.length}</span> Hadiah
          </span>
        </div>

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  <div className="h-5 w-14 bg-gray-200 rounded-full mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filteredList.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Inbox size={28} className="text-gray-300" />
            </div>
            <div>
              <p className="font-bold text-gray-700 text-base">
                {searchQuery ? 'Hadiah tidak ditemukan' : 'Belum ada hadiah'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery ? 'Coba gunakan kata kunci lain.' : 'Tambahkan hadiah pertama Anda.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition-colors cursor-pointer"
              >
                <Plus size={15} />
                Tambah Hadiah
              </button>
            )}
          </div>
        )}

        {/* ── Photo Grid ── */}
        {!loading && paginatedData.length > 0 && (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedData.map((item, index) => {
              const itemId = item.id || item.hadiahId || item._id
              const nama = item.namaHadiah || item.nama || 'Hadiah'
              const poin = Number(item.poinDibutuhkan ?? 0)
              const stok = Number(item.stok ?? 0)
              const resolvedUrl = resolveFotoUrl(item.foto || item.gambar || item.imageUrl)
              const fotoUrl = resolvedUrl ? `${resolvedUrl}?t=${Date.now()}` : null
              const stokBadge = getStokBadge(stok)

              return (
                <div
                  key={itemId || index}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {/* Photo area */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={nama}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Gift size={48} className="text-gray-300" />
                      </div>
                    )}

                    {/* Overlay buttons */}
                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit hadiah"
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-brand-700 shadow transition-colors cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(item)}
                        title="Hapus hadiah"
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-600 shadow transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-3.5 space-y-1.5">
                    <p className="font-bold text-sm text-ink leading-tight line-clamp-2">{nama}</p>

                    {/* Poin */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-600">
                      <Star size={12} className="fill-amber-400 text-amber-500 shrink-0" />
                      <span className="font-semibold">{poin.toLocaleString('id-ID')} Poin</span>
                    </div>

                    {/* Stok badge */}
                    <div className="pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${stokBadge.bg}`}
                      >
                        <Package size={10} />
                        {stokBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && filteredList.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/60">
            <span className="text-xs text-gray-400">
              Menampilkan{' '}
              <span className="font-semibold text-gray-600">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length)}
              </span>{' '}
              dari <span className="font-semibold text-gray-600">{filteredList.length}</span> data
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-1 text-xs text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`h-8 min-w-[2rem] px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        currentPage === p
                          ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-brand-300 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Modal ── */}
      <ModalShell
        show={showAddModal}
        title="Tambah Hadiah"
        onClose={() => !submittingAdd && setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        submitting={submittingAdd}
        submitLabel="Tambah Hadiah"
      >
        <HadiahFormFields
          form={addForm}
          setForm={setAddForm}
          onFotoChange={handleAddFotoChange}
          modalError={addModalError}
          isEdit={false}
        />
      </ModalShell>

      {/* ── Edit Modal ── */}
      <ModalShell
        show={showEditModal}
        title="Edit Hadiah"
        onClose={() => !submittingEdit && setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        submitting={submittingEdit}
        submitLabel="Simpan Perubahan"
        submitDisabled={loadingEditDetail}
      >
        {loadingEditDetail ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={20} className="animate-spin text-brand-500" />
          </div>
        ) : (
          <HadiahFormFields
            form={editForm}
            setForm={setEditForm}
            onFotoChange={handleEditFotoChange}
            modalError={editModalError}
            isEdit={true}
          />
        )}
      </ModalShell>

      {/* ── Delete Confirm Modal ── */}
      {showDeleteModal && selectedHadiah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-base text-ink">Hapus Hadiah</h3>
              <button
                type="button"
                onClick={() => !submittingDelete && setShowDeleteModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {deleteModalError && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                  <div className="font-medium">{deleteModalError}</div>
                </div>
              )}
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">
                    Hapus hadiah{' '}
                    <span className="text-brand-700">
                      &ldquo;{selectedHadiah.namaHadiah || selectedHadiah.nama}&rdquo;
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={submittingDelete}
                className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={submittingDelete}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submittingDelete ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Menghapus...
                  </>
                ) : (
                  'Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
