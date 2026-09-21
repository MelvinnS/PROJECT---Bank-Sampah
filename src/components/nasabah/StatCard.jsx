import { Recycle } from 'lucide-react'

export default function StatCard({ totalKg, totalPoin, totalTransaksi }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card border border-[#153d23]/10">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#153d23]/10 text-[#153d23]">
        <Recycle size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">Total Sampah Disetor</p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="font-display text-lg font-bold text-ink">{totalKg ?? 0} kg</p>
          <p className="text-xs font-semibold text-[#153d23]">+{(totalPoin ?? 0).toLocaleString('id-ID')} Poin</p>
        </div>
        <p className="text-xs text-gray-400">dari {totalTransaksi ?? 0} transaksi</p>
      </div>
    </div>
  )
}
