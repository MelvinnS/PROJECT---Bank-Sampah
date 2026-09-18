import { ChevronRight, Leaf, Star } from 'lucide-react'
import WasteIcon from './WasteIcon'

export default function KategoriSampahCard({ nama, hargaPerKg, poinPerKg, jenis, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card border border-gray-100/80 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <WasteIcon jenis={jenis} className="transition-transform duration-300 group-hover:scale-105" />
        
        {/* Leaf Badge on top right of the image */}
        <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-800/70 text-white backdrop-blur-[2px] shadow-xs">
          <Leaf size={12} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-xs sm:text-sm font-semibold text-ink group-hover:text-brand-700 transition-colors">
            {nama}
          </p>
          <ChevronRight size={15} className="shrink-0 text-gray-300 group-hover:text-brand-600 transition-colors" />
        </div>
        <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
          Rp {hargaPerKg.toLocaleString('id-ID')}/kg
        </p>
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-amber-700 border border-amber-100/60">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            {poinPerKg} Poin/kg
          </span>
        </div>
      </div>
    </button>
  )
}
