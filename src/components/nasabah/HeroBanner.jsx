import { ChevronRight, Leaf } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HeroBanner() {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f0f9f3] via-[#e5f5ea] to-[#d3ecd9] p-6 sm:p-8 md:p-9 shadow-sm border border-[#cbe8d2]/70">
      {/* Background Decorative Shapes */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-white/40 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-brand-200/30 blur-xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Column: Greeting & CTA */}
        <div className="flex-1 max-w-xl">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight flex items-center gap-2">
            Selamat datang <span className="inline-block animate-wave text-2xl sm:text-3xl">👋</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-medium text-ink/75 leading-relaxed">
            Yuk mulai jaga lingkungan dari hal kecil, tukar sampahmu jadi poin.
          </p>

          {/* Embedded CTA Card */}
          <div
            onClick={() => navigate('/login')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/login')}
            className="group mt-5 flex items-center gap-3.5 rounded-2xl bg-white/85 backdrop-blur-md p-3.5 sm:p-4 border border-white shadow-[0_2px_8px_rgba(18,38,26,0.06)] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Leaf size={18} strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-ink group-hover:text-brand-700 transition-colors">
                Belum punya akun?
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 font-normal truncate sm:whitespace-normal">
                Daftar sekarang untuk mulai menyetor sampah dan kumpulkan poin.
              </p>
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all">
              <ChevronRight size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Right Column: Recycle Bin Illustration with Leaves & Motto */}
        <div className="relative shrink-0 flex items-center justify-center md:justify-end self-center md:self-auto w-full md:w-auto">
          <div className="relative w-[280px] sm:w-[320px] md:w-[340px] h-[190px] sm:h-[210px] flex items-center justify-center">
            {/* Handwritten Motto Tag */}
            <div className="absolute top-1 right-2 sm:right-4 z-20 transform rotate-1">
              <span className="font-handwriting text-xl sm:text-2xl font-bold text-brand-900 leading-none tracking-wide text-right block drop-shadow-xs">
                Sampah<br />Hari Ini,<br /><span className="text-brand-700">Poin Esok</span>
              </span>
            </div>

            {/* SVG Illustration: Recycle Bin & Lush Foliage */}
            <svg
              viewBox="0 0 340 210"
              className="w-full h-full object-contain overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Bin Gradients */}
                <linearGradient id="binBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#43a059" />
                  <stop offset="50%" stopColor="#2e8544" />
                  <stop offset="100%" stopColor="#1e6430" />
                </linearGradient>
                <linearGradient id="binLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#56ba6f" />
                  <stop offset="100%" stopColor="#2a7c3e" />
                </linearGradient>
                <linearGradient id="binRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6fd187" />
                  <stop offset="100%" stopColor="#358b4b" />
                </linearGradient>
                <linearGradient id="leafDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38944f" />
                  <stop offset="100%" stopColor="#164d25" />
                </linearGradient>
                <linearGradient id="leafLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8ee19d" />
                  <stop offset="100%" stopColor="#45ad5d" />
                </linearGradient>
                <linearGradient id="leafMid" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5fc877" />
                  <stop offset="100%" stopColor="#257538" />
                </linearGradient>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#153d23" floodOpacity="0.18" />
                </filter>
                <filter id="glowFoliage" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e5f32" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Floating Wind & Air Leaves in Background */}
              <g opacity="0.85">
                {/* Wind trail lines */}
                <path d="M70 70 Q120 45 160 55 T230 40" stroke="#7ecb8f" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.6" />
                <path d="M120 95 Q170 75 220 90" stroke="#7ecb8f" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.4" />

                {/* Floating single leaves */}
                <path d="M100 50 C95 38 108 30 118 35 C122 45 110 55 100 50 Z" fill="url(#leafLight)" transform="rotate(-15 110 40)" />
                <path d="M101 49 Q110 42 117 36" stroke="#257538" strokeWidth="0.8" />

                <path d="M165 42 C158 32 168 22 178 28 C182 38 174 46 165 42 Z" fill="url(#leafMid)" transform="rotate(25 170 35)" />
                <path d="M225 65 C220 55 230 48 238 52 C242 60 234 68 225 65 Z" fill="url(#leafLight)" transform="rotate(-30 230 58)" />
                
                <path d="M75 120 C70 110 82 105 88 112 C90 120 82 126 75 120 Z" fill="url(#leafMid)" transform="rotate(10 80 115)" />
              </g>

              {/* Deep Background Foliage Behind Bin */}
              <g filter="url(#glowFoliage)">
                {/* Left high leaf */}
                <path d="M135 150 C120 100 145 60 165 52 C175 75 170 120 135 150 Z" fill="url(#leafDark)" />
                <path d="M136 148 Q150 95 164 54" stroke="#68cf81" strokeWidth="1.2" opacity="0.6" />

                {/* Right high leaf */}
                <path d="M205 155 C225 110 210 70 195 58 C180 80 182 125 205 155 Z" fill="url(#leafDark)" />
                <path d="M204 153 Q198 100 196 60" stroke="#68cf81" strokeWidth="1.2" opacity="0.6" />

                {/* Left spread leaf */}
                <path d="M125 165 C95 140 100 100 120 90 C135 110 140 145 125 165 Z" fill="url(#leafMid)" />
                <path d="M126 163 Q110 125 119 92" stroke="#1c5c30" strokeWidth="1" opacity="0.7" />

                {/* Right spread leaf */}
                <path d="M220 170 C250 145 248 105 228 92 C215 112 205 148 220 170 Z" fill="url(#leafMid)" />
                <path d="M219 168 Q238 128 227 94" stroke="#1c5c30" strokeWidth="1" opacity="0.7" />
              </g>

              {/* RECYCLING BIN (Wheelie Trash Bin) */}
              <g filter="url(#softShadow)">
                {/* Bin Shadow at base */}
                <ellipse cx="172" cy="195" rx="38" ry="7" fill="#153d23" opacity="0.25" />

                {/* Small Wheel left & right */}
                <circle cx="146" cy="190" r="7" fill="#1b3d22" />
                <circle cx="146" cy="190" r="3" fill="#88c595" />
                <circle cx="198" cy="190" r="7" fill="#1b3d22" />
                <circle cx="198" cy="190" r="3" fill="#88c595" />

                {/* Bin Body (Tapered) */}
                <path
                  d="M142 88 L149 186 C149.5 190 153 192 157 192 L187 192 C191 192 194.5 190 195 186 L202 88 Z"
                  fill="url(#binBodyGrad)"
                />

                {/* Vertical styling ribs / highlights on body */}
                <path d="M152 92 L157 186" stroke="#52b469" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
                <path d="M192 92 L187 186" stroke="#134720" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                <path d="M172 90 L172 186" stroke="#4fb467" strokeWidth="1.5" opacity="0.3" />

                {/* Prominent White Recycle Symbol ♻️ */}
                <g transform="translate(160, 122) scale(0.65)">
                  {/* Arrow 1 (Top right going down-left) */}
                  <path
                    d="M18 2 L13 11 L16 11 C15 16 12 20 8 22 L10 25 C15 23 19 18 20 11 L23 11 Z"
                    fill="#ffffff"
                  />
                  {/* Arrow 2 (Bottom right going left-up) */}
                  <path
                    d="M30 26 L20 26 L22 29 C18 32 13 32 8 30 L6 33 C12 36 19 36 24 32 L26 35 Z"
                    fill="#ffffff"
                  />
                  {/* Arrow 3 (Left side going up-right) */}
                  <path
                    d="M2 20 L7 12 L5 12 C9 7 14 5 19 6 L19 3 C13 2 6 5 2 10 L0 8 Z"
                    fill="#ffffff"
                  />
                </g>

                {/* Bin Rim Upper collar */}
                <rect x="139" y="80" width="66" height="10" rx="3.5" fill="url(#binRimGrad)" />
                <rect x="140" y="81" width="64" height="2" rx="1" fill="#9de6ae" opacity="0.7" />

                {/* Bin Handle on back */}
                <rect x="144" y="73" width="6" height="9" rx="2" fill="#256e36" />
                <rect x="194" y="73" width="6" height="9" rx="2" fill="#256e36" />
                <rect x="142" y="72" width="60" height="4" rx="2" fill="#3aa052" />

                {/* Bin Lid / Top Cover */}
                <path
                  d="M137 77 C137 74 140 73 143 73 L201 73 C204 73 207 74 207 77 L205 82 L139 82 Z"
                  fill="url(#binLidGrad)"
                />
                <rect x="138" y="79" width="68" height="3" rx="1.5" fill="#58c474" opacity="0.8" />
              </g>

              {/* Foreground Lush Leaves Wrapping the Bin Base */}
              <g filter="url(#glowFoliage)">
                {/* Left low curved leaf */}
                <path d="M120 195 C110 165 128 140 148 145 C152 165 140 190 120 195 Z" fill="url(#leafLight)" />
                <path d="M122 193 Q132 165 146 147" stroke="#257538" strokeWidth="1" />

                {/* Right low curved leaf */}
                <path d="M224 195 C235 168 218 142 198 146 C194 166 205 190 224 195 Z" fill="url(#leafLight)" />
                <path d="M222 193 Q212 166 200 148" stroke="#257538" strokeWidth="1" />

                {/* Center-left front leaf */}
                <path d="M138 200 C130 175 145 155 160 162 C162 180 152 198 138 200 Z" fill="url(#leafMid)" />
                <path d="M140 198 Q146 178 158 164" stroke="#164d25" strokeWidth="0.8" />

                {/* Center-right front leaf */}
                <path d="M206 200 C214 176 199 156 184 163 C182 181 192 198 206 200 Z" fill="url(#leafMid)" />
                <path d="M204 198 Q198 178 186 165" stroke="#164d25" strokeWidth="0.8" />

                {/* Far left sprouting foliage */}
                <path d="M98 185 C85 165 92 145 106 142 C116 155 112 178 98 185 Z" fill="url(#leafDark)" />
                <path d="M100 183 Q102 162 105 144" stroke="#68cf81" strokeWidth="0.8" opacity="0.6" />

                {/* Far right sprouting foliage */}
                <path d="M246 185 C259 165 252 145 238 142 C228 155 232 178 246 185 Z" fill="url(#leafDark)" />
                <path d="M244 183 Q242 162 239 144" stroke="#68cf81" strokeWidth="0.8" opacity="0.6" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Dot Pagination Indicator */}
      <div className="mt-4 sm:mt-2 flex items-center justify-center md:justify-end gap-1.5 pr-2">
        <span className="h-1.5 w-4 rounded-full bg-brand-700 transition-all" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-400/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-400/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-400/50" />
      </div>
    </div>
  )
}
