import { ChevronRight, Star } from 'lucide-react'

export default function SaldoPoinCard({ poin, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-left text-white shadow-card transition-transform active:scale-[0.99]"
    >
      <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-white/5" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <Star size={20} className="fill-yellow-300 text-yellow-300" />
          </span>
          <div>
            <p className="text-sm text-brand-100">Saldo Poin</p>
            <p className="font-display text-2xl font-semibold tabular-nums">
              {(poin ?? 0).toLocaleString('id-ID')} <span className="text-base font-medium">Poin</span>
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-brand-100 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}
