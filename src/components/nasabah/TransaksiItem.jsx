import { Recycle, Gift } from 'lucide-react'

const TYPE_CONFIG = {
  setor: { icon: Recycle, bg: 'bg-brand-50', fg: 'text-brand-600', sign: '+' },
  tukar: { icon: Gift, bg: 'bg-amber-50', fg: 'text-amber-600', sign: '-' },
}

// Formats an ISO date string (or any Date-parseable value) into a short,
// human-readable Indonesian date like "18 Sep 2026". Falls back to the
// original value untouched if it can't be parsed, so already-formatted
// strings (e.g. dummy data) are left as-is.
function formatTanggal(value) {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function TransaksiItem({ type, title, subtitle, date, poin }) {
  const cfg = TYPE_CONFIG[type]
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4">
      <span className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full ${cfg.bg} ${cfg.fg}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        <p className="truncate text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="text-right shrink-0 pl-2">
        <p className={`text-sm font-bold whitespace-nowrap ${cfg.fg}`}>
          {cfg.sign} {Math.abs(poin).toLocaleString('id-ID')} Poin
        </p>
        <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{formatTanggal(date)}</p>
      </div>
    </div>
  )
}
