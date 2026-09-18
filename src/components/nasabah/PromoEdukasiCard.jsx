import { Sprout } from 'lucide-react'

export default function PromoEdukasiCard() {
  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-brand-100/80 bg-gradient-to-r from-[#eef8f1] via-[#f3faf5] to-[#e4f4e9] p-4 sm:p-5 shadow-xs">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-brand-200/40 blur-2xl" />

      {/* Left Content */}
      <div className="relative z-10 flex items-center gap-3.5 pr-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-xs border border-brand-100">
          <Sprout size={20} strokeWidth={2.25} />
        </div>
        <p className="text-xs sm:text-sm font-medium text-ink/85 leading-snug">
          Setiap sampah yang kamu setor berarti langkah kecil untuk bumi yang lebih baik <span className="inline-block">🌱</span>
        </p>
      </div>

      {/* Right Graphic: Stylized Eco Earth Globe */}
      <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="globeOcean" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86d49b" />
              <stop offset="50%" stopColor="#48a661" />
              <stop offset="100%" stopColor="#257538" />
            </linearGradient>
            <linearGradient id="globeContinent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4f4dc" />
              <stop offset="100%" stopColor="#a3e3b3" />
            </linearGradient>
            <filter id="globeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e5f32" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Ambient foliage */}
          <path d="M72 18 C82 8 92 18 85 28 C80 25 76 22 72 18 Z" fill="#38944f" opacity="0.8" />
          <path d="M82 45 C95 42 96 58 84 62 C82 54 81 48 82 45 Z" fill="#2d7e42" opacity="0.7" />

          {/* Earth Sphere */}
          <g filter="url(#globeGlow)">
            <circle cx="48" cy="52" r="34" fill="url(#globeOcean)" />
            {/* Globe Atmosphere highlight */}
            <circle cx="48" cy="52" r="34" stroke="#cbf3d5" strokeWidth="1.5" opacity="0.6" />

            {/* Continents (Stylized Green Island shapes) */}
            {/* Eurasia / Asia shape */}
            <path
              d="M32 30 C38 26 48 28 54 34 C58 38 66 36 68 42 C70 48 64 54 58 52 C52 50 48 56 42 54 C36 52 34 46 38 42 C40 38 30 36 32 30 Z"
              fill="url(#globeContinent)"
            />
            {/* America / Small Island shape */}
            <path
              d="M22 46 C26 42 30 46 28 52 C26 58 20 62 20 54 Z"
              fill="url(#globeContinent)"
            />
            {/* Australia / South Island shape */}
            <path
              d="M52 64 C58 60 66 64 64 72 C60 76 52 74 52 64 Z"
              fill="url(#globeContinent)"
            />

            {/* Atmosphere Sheen */}
            <path
              d="M20 36 A34 34 0 0 1 76 30"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>

          {/* Foreground Leaves growing around globe */}
          <path d="M16 68 C8 58 18 48 24 55 C22 62 19 66 16 68 Z" fill="#45ad5d" />
          <path d="M22 78 C14 74 18 64 26 68 C25 74 23 77 22 78 Z" fill="#2e8544" />
          <path d="M68 76 C78 72 82 84 72 86 C69 82 68 79 68 76 Z" fill="#38944f" />
        </svg>
      </div>
    </div>
  )
}
