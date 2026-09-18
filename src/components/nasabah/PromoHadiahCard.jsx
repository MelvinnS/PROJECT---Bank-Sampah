import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PromoHadiahCard() {
  const navigate = useNavigate()
  const { isGuest } = useAuth()

  const handleClick = () => {
    if (isGuest) {
      navigate('/login', { state: { from: '/hadiah' } })
    } else {
      navigate('/hadiah')
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-card hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Left Prev Arrow Button */}
      <button
        type="button"
        aria-label="Previous promo"
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      {/* Center Content: Gift Illustration + Text + Dots */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {/* Gift Box Graphic */}
        <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
          <svg viewBox="0 0 70 70" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="giftBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34a853" />
                <stop offset="100%" stopColor="#1e7034" />
              </linearGradient>
              <linearGradient id="giftLid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#46be66" />
                <stop offset="100%" stopColor="#25833e" />
              </linearGradient>
              <linearGradient id="giftRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <filter id="giftShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#12381e" floodOpacity="0.16" />
              </filter>
            </defs>

            {/* Sparkles around Gift Box */}
            <path d="M12 18 L14 12 L16 18 L22 20 L16 22 L14 28 L12 22 L6 20 Z" fill="#facc15" opacity="0.9" transform="scale(0.65) translate(8, 6)" />
            <path d="M54 14 L55.5 9 L57 14 L62 15.5 L57 17 L55.5 22 L54 17 L49 15.5 Z" fill="#facc15" opacity="0.85" transform="scale(0.65) translate(40, 8)" />
            <path d="M16 52 L17 48 L18 52 L22 53 L18 54 L17 58 L16 54 L12 53 Z" fill="#facc15" opacity="0.8" transform="scale(0.6) translate(10, 42)" />

            <g filter="url(#giftShadow)">
              {/* Gift Box Base Shadow */}
              <ellipse cx="35" cy="58" rx="18" ry="4" fill="#143e21" opacity="0.2" />

              {/* Gift Box Body */}
              <rect x="20" y="28" width="30" height="28" rx="3" fill="url(#giftBody)" />

              {/* Yellow Vertical Ribbon */}
              <rect x="32" y="28" width="6" height="28" fill="url(#giftRibbon)" />

              {/* Gift Box Lid */}
              <rect x="17" y="22" width="36" height="8" rx="2.5" fill="url(#giftLid)" />
              {/* Lid Ribbon */}
              <rect x="32" y="22" width="6" height="8" fill="url(#giftRibbon)" />

              {/* Yellow Ribbon Bow on Top */}
              {/* Left loop */}
              <path
                d="M33 22 C26 14 20 18 25 22 C29 23 32 23 33 22 Z"
                fill="url(#giftRibbon)"
              />
              {/* Right loop */}
              <path
                d="M37 22 C44 14 50 18 45 22 C41 23 38 23 37 22 Z"
                fill="url(#giftRibbon)"
              />
              {/* Center knot */}
              <circle cx="35" cy="22" r="3" fill="#fef08a" />
            </g>
          </svg>
        </div>

        {/* Text and Dots */}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-bold text-ink truncate group-hover:text-brand-700 transition-colors">
            Tukar sampahmu jadi poin!
          </p>
          <p className="text-[11px] sm:text-xs text-gray-500 truncate sm:whitespace-normal">
            Kumpulkan poin dan dapatkan berbagai hadiah menarik.
          </p>
          {/* Pagination Dots */}
          <div className="mt-1.5 flex items-center gap-1">
            <span className="h-1.5 w-3.5 rounded-full bg-brand-600 transition-all" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Right Green Arrow Button */}
      <button
        type="button"
        aria-label="Buka hadiah"
        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-xs group-hover:bg-brand-700 transition-all duration-200 group-hover:scale-105 active:scale-95"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  )
}
