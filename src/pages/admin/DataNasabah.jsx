import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  UploadCloud,
  Eye,
  EyeOff,
  Inbox,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Calendar,
  Lock,
} from 'lucide-react'
import {
  getAdminNasabahList,
  getAdminNasabahDetail,
  createAdminNasabah,
  updateAdminNasabah,
  deleteAdminNasabah,
} from '../../services/adminService'
import { resolveFotoUrl } from '../../services/api'

export default function DataNasabah() {
  // Data & Table States
  const [nasabahList, setNasabahList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modals States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNasabah, setSelectedNasabah] = useState(null)

  // Form States (Add)
  const [addForm, setAddForm] = useState({
    namaNasabah: '',
    alamat: '',
    telp: '',
    username: '',
    password: '',
    foto: null,
    fotoPreview: null,
  })
  const [showAddPassword, setShowAddPassword] = useState(false)
  const [submittingAdd, setSubmittingAdd] = useState(false)
  const [addModalError, setAddModalError] = useState('')

  // Form States (Edit)
  const [editForm, setEditForm] = useState({
    id: '',
    namaNasabah: '',
    telp: '',
    alamat: '',
    tanggalLahir: '',
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

  // Fetch Nasabah List
  const fetchNasabah = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminNasabahList()
      console.log('[DataNasabah] GET /admin/nasabah response:', res.data)
      const data = res.data?.data ?? res.data ?? []
      setNasabahList(Array.isArray(data) ? data : [])
      setCurrentPage(1)
    } catch (err) {
      console.error('[DataNasabah] Error fetch data:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat data nasabah dari server.'
      setErrorMsg(msg)
      setNasabahList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNasabah()
  }, [fetchNasabah])

  // Show Temporary Toast Helper
  const triggerSuccess = (msg) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast('')
    }, 4000)
  }

  // Client Search Filter
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return nasabahList
    const q = searchQuery.toLowerCase().trim()
    return nasabahList.filter((item) => {
      const nama = String(item.namaNasabah || item.nama || '').toLowerCase()
      const username = String(item.user?.username || item.username || '').toLowerCase()
      const telp = String(item.telp || item.noHp || '').toLowerCase()
      const alamat = String(item.alamat || '').toLowerCase()
      return (
        nama.includes(q) ||
        username.includes(q) ||
        telp.includes(q) ||
        alamat.includes(q)
      )
    })
  }, [nasabahList, searchQuery])

  // Pagination Calculation
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredList.slice(start, start + itemsPerPage)
  }, [filteredList, currentPage, itemsPerPage])

  // ── Open Add Modal Handler ──
  const handleOpenAdd = () => {
    setAddForm({
      namaNasabah: '',
      alamat: '',
      telp: '',
      username: '',
      password: '',
      foto: null,
      fotoPreview: null,
    })
    setAddModalError('')
    setShowAddPassword(false)
    setShowAddModal(true)
  }

  // ── Handle Add Foto Upload ──
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

  // ── Submit Add Nasabah ──
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setAddModalError('')

    const { namaNasabah, alamat, telp, username, password, foto } = addForm
    if (!namaNasabah.trim() || !alamat.trim() || !telp.trim() || !username.trim() || !password) {
      setAddModalError('Semua kolom bertanda bintang (*) wajib diisi.')
      return
    }

    if (password.length < 6) {
      setAddModalError('Password minimal 6 karakter.')
      return
    }

    setSubmittingAdd(true)
    try {
      const formData = new FormData()
      formData.append('namaNasabah', namaNasabah.trim())
      formData.append('alamat', alamat.trim())
      formData.append('telp', telp.trim())
      formData.append('username', username.trim())
      formData.append('password', password)
      if (foto) {
        formData.append('foto', foto)
      }

      await createAdminNasabah(formData)
      setShowAddModal(false)
      triggerSuccess(`Nasabah "${namaNasabah.trim()}" berhasil ditambahkan!`)
      fetchNasabah()
    } catch (err) {
      console.error('[DataNasabah] Error create nasabah:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menambahkan data nasabah.'
      setAddModalError(msg)
    } finally {
      setSubmittingAdd(false)
    }
  }

  // ── Open Edit Modal Handler ──
  const handleOpenEdit = async (nasabah) => {
    const nId = nasabah.id || nasabah.nasabahId || nasabah._id
    setSelectedNasabah(nasabah)
    setEditModalError('')
    setEditForm({
      id: String(nId),
      namaNasabah: nasabah.namaNasabah || nasabah.nama || '',
      telp: nasabah.telp || nasabah.noHp || '',
      alamat: nasabah.alamat || '',
      tanggalLahir: nasabah.tanggalLahir ? String(nasabah.tanggalLahir).slice(0, 10) : '',
      foto: null,
      fotoPreview: null,
      existingFotoUrl: nasabah.foto || null,
    })
    setShowEditModal(true)
    setLoadingEditDetail(true)

    // Fetch fresh detail
    try {
      const res = await getAdminNasabahDetail(nId)
      const data = res.data?.data ?? res.data
      if (data) {
        const item = data.nasabah || data
        setEditForm((prev) => ({
          ...prev,
          namaNasabah: item.namaNasabah || item.nama || prev.namaNasabah,
          telp: item.telp || item.noHp || prev.telp,
          alamat: item.alamat || prev.alamat,
          tanggalLahir: item.tanggalLahir ? String(item.tanggalLahir).slice(0, 10) : prev.tanggalLahir,
          existingFotoUrl: item.foto || prev.existingFotoUrl,
        }))
      }
    } catch (err) {
      console.warn('[DataNasabah] Warning fetch detail on edit:', err)
    } finally {
      setLoadingEditDetail(false)
    }
  }

  // ── Handle Edit Foto Upload ──
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

  // ── Submit Edit Nasabah ──
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditModalError('')

    const { id, namaNasabah, telp, alamat, tanggalLahir, foto } = editForm
    if (!namaNasabah.trim() || !telp.trim() || !alamat.trim()) {
      setEditModalError('Nama lengkap, nomor telepon, dan alamat wajib diisi.')
      return
    }

    setSubmittingEdit(true)
    try {
      const formData = new FormData()
      formData.append('namaNasabah', namaNasabah.trim())
      formData.append('telp', telp.trim())
      formData.append('alamat', alamat.trim())
      if (tanggalLahir) {
        formData.append('tanggalLahir', tanggalLahir)
      }
      if (foto) {
        formData.append('foto', foto)
      }

      await updateAdminNasabah(id, formData)
      setShowEditModal(false)
      triggerSuccess(`Data nasabah "${namaNasabah.trim()}" berhasil diperbarui!`)
      fetchNasabah()
    } catch (err) {
      console.error('[DataNasabah] Error update nasabah:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memperbarui data nasabah.'
      setEditModalError(msg)
    } finally {
      setSubmittingEdit(false)
    }
  }

  // ── Open Delete Modal Handler ──
  const handleOpenDelete = (nasabah) => {
    setSelectedNasabah(nasabah)
    setDeleteModalError('')
    setShowDeleteModal(true)
  }

  // ── Submit Delete Nasabah ──
  const handleDeleteSubmit = async () => {
    if (!selectedNasabah) return
    const nId = selectedNasabah.id || selectedNasabah.nasabahId || selectedNasabah._id
    const nama = selectedNasabah.namaNasabah || selectedNasabah.nama || 'Nasabah'

    setSubmittingDelete(true)
    setDeleteModalError('')
    try {
      await deleteAdminNasabah(nId)
      setShowDeleteModal(false)
      triggerSuccess(`Nasabah "${nama}" berhasil dihapus.`)
      fetchNasabah()
    } catch (err) {
      console.error('[DataNasabah] Error delete nasabah:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menghapus nasabah. Pastikan data tidak terikat dengan transaksi aktif.'
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
            <Users size={13} className="text-brand-600" />
            Manajemen Nasabah
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Data Nasabah
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Kelola data anggota dan nasabah bank sampah.
          </p>
        </div>

        {/* Top Right Action: Add Nasabah */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchNasabah}
            title="Muat ulang tabel"
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
            <span>+ Tambah Nasabah</span>
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      {successToast && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span className="font-bold">{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
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
            onClick={fetchNasabah}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {/* ── Table Card Container ── */}
      <div className="rounded-3xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {/* Search Bar Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-sand/20">
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, username, atau nomor telepon..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          <span className="hidden sm:inline text-xs font-semibold text-gray-400">
            Total: <span className="font-bold text-ink">{filteredList.length}</span> Nasabah
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-sand/40 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-12">No</th>
                <th className="py-3.5 px-3 w-14 text-center">Foto</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4">No. Telepon</th>
                <th className="py-3.5 px-4 text-right">Saldo Poin</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading &&
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4 text-center">
                      <div className="h-3 w-4 bg-gray-200 rounded mx-auto" />
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="h-9 w-9 bg-gray-200 rounded-full mx-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-40 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-28 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-3.5 w-16 bg-gray-200 rounded ml-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-7 w-16 bg-gray-200 rounded-lg mx-auto" />
                    </td>
                  </tr>
                ))}

              {!loading && paginatedData.length > 0 &&
                paginatedData.map((item, index) => {
                  const itemId = item.id || item.nasabahId || item._id
                  const nama = item.namaNasabah || item.nama || 'Nasabah'
                  const username = item.user?.username || item.username || ''
                  const alamat = item.alamat || '-'
                  const telp = item.telp || item.noHp || '-'
                  const saldoPoin = Number(item.saldoPoin ?? item.poin ?? 0)
                  const fotoUrl = resolveFotoUrl(item.foto || item.user?.foto)
                  const initial = nama ? nama.trim().charAt(0).toUpperCase() : 'N'
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1

                  return (
                    <tr
                      key={itemId || index}
                      className="hover:bg-sand/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-400">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 border border-gray-100 flex items-center justify-center overflow-hidden mx-auto shadow-2xs">
                          {fotoUrl ? (
                            <img
                              src={fotoUrl}
                              alt={nama}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <span className="font-display text-xs font-bold text-brand-800">
                              {initial}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-ink group-hover:text-brand-700 transition-colors">
                          {nama}
                        </p>
                        {username && (
                          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                            @{username}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 max-w-[200px] truncate">
                        {alamat}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap font-medium">
                        {telp}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-ink whitespace-nowrap">
                        {saldoPoin.toLocaleString('id-ID')}{' '}
                        <span className="text-[11px] font-semibold text-brand-700">Poin</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Action Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-700 hover:bg-brand-50 transition-colors cursor-pointer"
                            title="Edit data nasabah"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete Action Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus nasabah"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && paginatedData.length === 0 && !errorMsg && (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center text-gray-400">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-3">
              <Inbox size={26} />
            </span>
            <p className="font-bold text-sm text-ink">
              Tidak Ada Data Nasabah
            </p>
            <p className="text-xs text-gray-400 max-w-sm mt-0.5">
              {searchQuery
                ? 'Tidak ditemukan nasabah yang cocok dengan kata kunci pencarian.'
                : 'Belum ada nasabah terdaftar di database.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Tambah Nasabah Pertama</span>
              </button>
            )}
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && filteredList.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-sand/10">
            <div>
              Menampilkan{' '}
              <span className="font-bold text-ink">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              -{' '}
              <span className="font-bold text-ink">
                {Math.min(currentPage * itemsPerPage, filteredList.length)}
              </span>{' '}
              dari <span className="font-bold text-ink">{filteredList.length}</span> data
            </div>

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

      {/* ========================================================================= */}
      {/* ── MODAL 1: TAMBAH NASABAH (Image 4) ─────────────────────────────────── */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sand/30">
              <h2 className="font-display text-base font-bold text-ink">
                Tambah Nasabah
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Error Message inside modal */}
              {addModalError && (
                <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 animate-fadeIn">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                  <div className="flex-1 font-medium">{addModalError}</div>
                </div>
              )}

              {/* Upload Foto Profil (Box style as in Image 4) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Foto Profil <span className="text-xs font-normal text-gray-400">(Opsional)</span>
                </label>
                <div className="relative">
                  <label
                    htmlFor="add-foto-input"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-brand-300 rounded-2xl p-4 bg-sand/20 hover:bg-brand-50/30 transition-all cursor-pointer group"
                  >
                    {addForm.fotoPreview ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={addForm.fotoPreview}
                          alt="Preview"
                          className="h-16 w-16 rounded-full object-cover border border-brand-200"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-brand-700">Foto terpilih</p>
                          <p className="text-[11px] text-gray-400">Klik untuk mengganti foto</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={24} className="text-brand-600 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-brand-700">Upload foto</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG (maks. 2MB)</p>
                      </>
                    )}
                  </label>
                  <input
                    id="add-foto-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAddFotoChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="add-nama">
                  Nama Lengkap <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <User size={15} />
                  </span>
                  <input
                    id="add-nama"
                    type="text"
                    required
                    value={addForm.namaNasabah}
                    onChange={(e) => setAddForm((p) => ({ ...p, namaNasabah: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="add-alamat">
                  Alamat <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <MapPin size={15} />
                  </span>
                  <input
                    id="add-alamat"
                    type="text"
                    required
                    value={addForm.alamat}
                    onChange={(e) => setAddForm((p) => ({ ...p, alamat: e.target.value }))}
                    placeholder="Masukkan alamat"
                    className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              </div>

              {/* No. Telepon & Username Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="add-telp">
                    No. Telepon <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Phone size={15} />
                    </span>
                    <input
                      id="add-telp"
                      type="tel"
                      required
                      value={addForm.telp}
                      onChange={(e) => setAddForm((p) => ({ ...p, telp: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="add-username">
                    Username <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <User size={15} />
                    </span>
                    <input
                      id="add-username"
                      type="text"
                      required
                      value={addForm.username}
                      onChange={(e) => setAddForm((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Masukkan username"
                      className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="add-password">
                  Password <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <Lock size={15} />
                  </span>
                  <input
                    id="add-password"
                    type={showAddPassword ? 'text' : 'password'}
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Masukkan password (min. 6 karakter)"
                    className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-10 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showAddPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={submittingAdd}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="flex-1 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submittingAdd ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── MODAL 2: EDIT NASABAH ──────────────────────────────────────────────── */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sand/30">
              <h2 className="font-display text-base font-bold text-ink">
                Edit Data Nasabah
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Error Message inside modal */}
              {editModalError && (
                <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 animate-fadeIn">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                  <div className="flex-1 font-medium">{editModalError}</div>
                </div>
              )}

              {/* Upload / Ganti Foto */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Foto Profil <span className="text-xs font-normal text-gray-400">(Opsional ganti foto)</span>
                </label>
                <div className="relative">
                  <label
                    htmlFor="edit-foto-input"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-brand-300 rounded-2xl p-3.5 bg-sand/20 hover:bg-brand-50/30 transition-all cursor-pointer group"
                  >
                    {editForm.fotoPreview || editForm.existingFotoUrl ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={editForm.fotoPreview || editForm.existingFotoUrl}
                          alt="Preview"
                          className="h-14 w-14 rounded-full object-cover border border-brand-200"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-brand-700">Foto profil</p>
                          <p className="text-[11px] text-gray-400">Klik untuk memilih foto baru</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={22} className="text-brand-600 mb-1 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-brand-700">Ganti Foto Profil</p>
                        <p className="text-[11px] text-gray-400">JPG, PNG (maks. 2MB)</p>
                      </>
                    )}
                  </label>
                  <input
                    id="edit-foto-input"
                    type="file"
                    accept="image/*"
                    onChange={handleEditFotoChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="edit-nama">
                  Nama Lengkap <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <User size={15} />
                  </span>
                  <input
                    id="edit-nama"
                    type="text"
                    required
                    value={editForm.namaNasabah}
                    onChange={(e) => setEditForm((p) => ({ ...p, namaNasabah: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              </div>

              {/* No. Telepon & Tanggal Lahir Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="edit-telp">
                    No. Telepon <span className="text-brand-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Phone size={15} />
                    </span>
                    <input
                      id="edit-telp"
                      type="tel"
                      required
                      value={editForm.telp}
                      onChange={(e) => setEditForm((p) => ({ ...p, telp: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="edit-tgl-lahir">
                    Tanggal Lahir <span className="text-xs font-normal text-gray-400">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Calendar size={15} />
                    </span>
                    <input
                      id="edit-tgl-lahir"
                      type="date"
                      value={editForm.tanggalLahir}
                      onChange={(e) => setEditForm((p) => ({ ...p, tanggalLahir: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1" htmlFor="edit-alamat">
                  Alamat Lengkap <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <MapPin size={15} />
                  </span>
                  <input
                    id="edit-alamat"
                    type="text"
                    required
                    value={editForm.alamat}
                    onChange={(e) => setEditForm((p) => ({ ...p, alamat: e.target.value }))}
                    placeholder="Masukkan alamat lengkap"
                    className="w-full rounded-2xl border border-gray-200 bg-sand/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={submittingEdit}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="flex-1 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submittingEdit ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ── MODAL 3: KONFIRMASI HAPUS NASABAH ─────────────────────────────────── */}
      {/* ========================================================================= */}
      {showDeleteModal && selectedNasabah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 text-center animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs border border-red-100">
              <Trash2 size={26} strokeWidth={2} />
            </div>

            <h3 className="font-display text-lg font-bold text-ink">
              Hapus Data Nasabah
            </h3>
            <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
              Hapus nasabah{' '}
              <strong className="text-ink">
                "{selectedNasabah.namaNasabah || selectedNasabah.nama}"
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            {/* Error Message inside delete modal */}
            {deleteModalError && (
              <div className="mt-3 flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 text-left animate-fadeIn">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium">{deleteModalError}</div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={submittingDelete}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submittingDelete}
                onClick={handleDeleteSubmit}
                className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {submittingDelete ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
