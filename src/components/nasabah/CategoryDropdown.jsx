import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { resolveFotoUrl } from '../../services/api'
import WasteIcon from './WasteIcon'

/**
 * Custom iOS-style dropdown for kategori sampah.
 * Props:
 *   options       — Array of { id, nama, harga, poin, jenis, foto }
 *   value         — currently selected id (string)
 *   onChange      — (id: string) => void
 *   placeholder   — string shown when nothing selected
 *   loading       — bool
 *   disabled      — bool
 */
export default function CategoryDropdown({
  options = [],
  value,
  onChange,
  placeholder = '— Pilih Kategori —',
  loading = false,
  disabled = false,
}) {
  const [open, setOpen]     = useState(false)
  const containerRef        = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selected = options.find((o) => String(o.id) === String(value))

  const handleSelect = (id) => {
    onChange(id)
    setOpen(false)
  }

  const isDisabled = disabled || loading || options.length === 0

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm transition-all duration-150 ${
          isDisabled
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : open
            ? 'border-brand-500 bg-white ring-2 ring-brand-100 shadow-sm cursor-pointer'
            : 'border-gray-200 bg-white text-ink hover:border-brand-300 cursor-pointer shadow-xs'
        }`}
      >
        <span className={`truncate ${selected ? 'text-ink font-medium' : 'text-gray-400'}`}>
          {loading
            ? 'Memuat kategori...'
            : selected
            ? selected.nama
            : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Floating Panel */}
      <div
        className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden transition-all duration-200 origin-top ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ maxHeight: '280px', overflowY: 'auto' }}
      >
        {options.length === 0 ? (
          <div className="px-4 py-3 text-xs text-gray-400 text-center">
            Tidak ada kategori tersedia
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {options.map((opt) => {
              const isSelected = String(opt.id) === String(value)
              const fotoUrl = resolveFotoUrl(opt.foto)
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(String(opt.id))}
                    className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-700 font-medium'
                        : 'text-ink hover:bg-brand-50/60 hover:text-brand-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/70 flex items-center justify-center">
                        {fotoUrl ? (
                          <>
                            <img
                              src={fotoUrl}
                              alt={opt.nama}
                              className="absolute inset-0 h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                if (e.currentTarget.nextSibling) {
                                  e.currentTarget.nextSibling.style.display = 'flex'
                                }
                              }}
                            />
                            <div className="h-full w-full flex items-center justify-center" style={{ display: 'none' }}>
                              <WasteIcon jenis={opt.jenis} className="h-full w-full" />
                            </div>
                          </>
                        ) : (
                          <WasteIcon jenis={opt.jenis} className="h-full w-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-xs sm:text-sm">{opt.nama}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Rp {opt.harga.toLocaleString('id-ID')}/kg · {opt.poin} Poin/kg
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} className="shrink-0 text-brand-600 ml-2" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
