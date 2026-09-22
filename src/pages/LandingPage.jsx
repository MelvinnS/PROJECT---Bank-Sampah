import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Leaf,
  ArrowRight,
  ArrowUpRight,
  Search,
  User,
  Bell,
  Users,
  Gift,
  Star,
  CheckCircle2,
  ChevronRight,
  Recycle,
  Sparkles,
  Package,
} from 'lucide-react'

// Local Assets (6 waste & reward images)
import sampahBotolImg from '../assets/images/sampahbotol.jpg'
import sampahKalengImg from '../assets/images/sampahkaleng.jpg'
import sampahKardusImg from '../assets/images/sampahkardus.jpg'
import hadiahBerasImg from '../assets/images/hadiahberas.jpg'
import hadiahMinyakImg from '../assets/images/hadiahminyak.jpg'
import hadiahPulsaImg from '../assets/images/hadiahpulsa.jpg'

// ── Intersection Observer Hook for Smooth Scroll-Triggered Reveal ──
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

// ── Animated Wrapper: Slides up from bottom with elegant cubic bezier ──
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleEnter = () => {
    sessionStorage.setItem('landingSeen', '1')
    navigate('/')
  }

  return (
    <div className="relative min-h-screen bg-[#fcfdfa] text-[#12261a] font-sans overflow-x-hidden selection:bg-[#153d23] selection:text-white">
      {/* ── Sticky Top Navigation Bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrollY > 30 ? 'rgba(252, 253, 250, 0.92)' : 'transparent',
          backdropFilter: scrollY > 30 ? 'blur(16px)' : 'none',
          borderBottom: scrollY > 30 ? '1px solid rgba(21, 61, 35, 0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleEnter}>
            <div className="h-10 w-10 rounded-2xl bg-[#153d23] flex items-center justify-center text-white shadow-md shadow-[#153d23]/20">
              <Recycle size={20} strokeWidth={2.4} />
            </div>
            <span className="font-display text-xl font-black text-[#0f2e1b] tracking-tight">
              Bank Sampah
            </span>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
            <a href="#hero" className="flex flex-col items-center py-1">
              <span className="text-[#0f2e1b] font-bold">Beranda</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#153d23] mt-0.5" />
            </a>
            <a href="#fitur" className="hover:text-[#153d23] transition-colors py-1">
              Tentang Kami
            </a>
            <a href="#layanan" className="hover:text-[#153d23] transition-colors py-1">
              Layanan &amp; Kategori
            </a>
          </nav>

          {/* Right Action Icons & Masuk Button */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={handleEnter}
              title="Pencarian"
              className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:text-[#153d23] hover:bg-[#153d23]/5 transition-colors cursor-pointer"
            >
              <Search size={17} />
            </button>
            <button
              type="button"
              onClick={handleEnter}
              title="Akun"
              className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:text-[#153d23] hover:bg-[#153d23]/5 transition-colors cursor-pointer"
            >
              <User size={17} />
            </button>
            <button
              type="button"
              onClick={handleEnter}
              title="Notifikasi"
              className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:text-[#153d23] hover:bg-[#153d23]/5 transition-colors cursor-pointer"
            >
              <Bell size={17} />
            </button>
            <button
              type="button"
              onClick={handleEnter}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#153d23] hover:bg-[#0f2e1b] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#153d23]/25 active:scale-95 transition-all cursor-pointer ml-1"
            >
              <span>Masuk</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO / BERANDA (Persis Sesuai Referensi Gambar)
      ════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden text-center">
        {/* Subtle Organic Background Waves on Left & Right */}
        <div className="pointer-events-none absolute top-12 -left-48 w-[450px] h-[550px] rounded-full bg-[#e8f3ec]/80 blur-3xl" />
        <div className="pointer-events-none absolute top-24 -right-48 w-[450px] h-[550px] rounded-full bg-[#edf6f0]/80 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── 1. Centered Big Headline ── */}
          <div className="max-w-3xl mx-auto" style={{ animation: 'slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-[#12361f] tracking-tight leading-[1.08] text-center">
              Welcome<br />
              to Bank Sampah
            </h1>

            {/* Subtitle with Diamond Emoji */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <p className="font-bold text-xs sm:text-sm text-[#1b4332] flex items-center justify-center gap-1.5">
                <span>Platform Digital Pengelolaan Sampah</span>
                <span className="text-xs">💎</span>
              </p>
              <p className="text-xs text-gray-500 max-w-md">
                Setor sampah daur ulang, catat akurat &amp; kumpulkan poin bernilai.
              </p>
            </div>
          </div>

          {/* ── 2. Shelf of 7 Undulating Cards with Left & Right Floating Annotations ── */}
          <div className="relative mt-8 sm:mt-11">
            {/* Left Floating Badge & Curved Arrow */}
            <div className="hidden lg:flex absolute left-8 xl:left-14 -top-3 flex-col items-center z-20 pointer-events-none select-none">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2d6a4f] text-white px-3.5 py-1.5 text-xs font-bold shadow-md transform -rotate-[7deg]">
                <Recycle size={13} strokeWidth={2.4} />
                <span>daur ulang</span>
              </div>
              {/* Hand-drawn style curved arrow pointing to the cards */}
              <svg width="44" height="42" viewBox="0 0 44 42" fill="none" className="text-[#2d6a4f] ml-6 mt-1">
                <path d="M6 4 C16 10, 26 22, 22 36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M15 31 L22 37 L27 30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right Floating Badge & Curved Arrow */}
            <div className="hidden lg:flex absolute right-8 xl:right-14 -top-3 flex-col items-center z-20 pointer-events-none select-none">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2d6a4f] text-white px-3.5 py-1.5 text-xs font-bold shadow-md transform rotate-[7deg]">
                <Star size={13} className="fill-white text-white" />
                <span>jadi poin</span>
              </div>
              {/* Hand-drawn style curved arrow pointing to the cards */}
              <svg width="44" height="42" viewBox="0 0 44 42" fill="none" className="text-[#2d6a4f] mr-6 mt-1">
                <path d="M38 4 C28 10, 18 22, 22 36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M17 30 L22 37 L29 31" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* 7 Cards Shelf Ribbon */}
            <div className="flex items-center justify-center overflow-x-auto py-6 px-2 no-scrollbar">
              <div className="flex items-center justify-center -space-x-3 sm:-space-x-4 md:-space-x-5 lg:-space-x-6">
                
                {/* ── CARD 1: Botol Plastik / Eco Living ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform -rotate-[8deg] translate-y-4 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80"
                    alt="Plastik Daur Ulang"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = sampahBotolImg }}
                  />
                  {/* Top-left circular badge */}
                  <div className="absolute top-2.5 left-2.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#153d23]/80 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
                    <Leaf size={13} strokeWidth={2.4} />
                  </div>
                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                      ECO LIVING
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                      Daur Ulang
                    </p>
                  </div>
                </div>

                {/* ── CARD 2: Kaca Bening Nilai Tinggi ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform -rotate-[4deg] translate-y-1 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1516996087931-5ae405802f9f?w=600&auto=format&fit=crop&q=80"
                    alt="Kaca Bening Nilai Tinggi"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = sampahBotolImg }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Kaca Bening
                    </p>
                    <span className="text-[9px] sm:text-[10px] text-emerald-300 font-medium">
                      Nilai Tinggi
                    </span>
                  </div>
                </div>

                {/* ── CARD 3: Tumpukan Kardus / Lingkungan Bersih ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform -rotate-[1deg] -translate-y-2 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80"
                    alt="Lingkungan Bersih Kardus"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = sampahKardusImg }}
                  />
                  {/* Top-left circular badge */}
                  <div className="absolute top-2.5 left-2.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#153d23]/80 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
                    <Star size={12} className="fill-white" />
                  </div>
                  {/* Top-right points pill */}
                  <div className="absolute top-2.5 right-2.5 bg-[#2d6a4f] text-white text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    +290 Poin
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Lingkungan Bersih
                    </p>
                  </div>
                </div>

                {/* ── CARD 4 (CENTER): Botol Kaca & Kardus ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform rotate-[1deg] -translate-y-3 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80"
                    alt="Kardus & Kertas"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = sampahBotolImg }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Kardus &amp; Kertas
                    </p>
                  </div>
                </div>

                {/* ── CARD 5: Kantong Kaleng / Logam & Kaleng ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform rotate-[3deg] -translate-y-1 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=600&auto=format&fit=crop&q=80"
                    alt="Logam & Kaleng"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = sampahKalengImg }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Logam &amp; Kaleng
                    </p>
                  </div>
                </div>

                {/* ── CARD 6: Minyak Goreng / Tukar Sembako ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform rotate-[5deg] translate-y-1 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80"
                    alt="Tukar Sembako Minyak"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = hadiahMinyakImg }}
                  />
                  {/* Top-right star badge */}
                  <div className="absolute top-2.5 right-2.5 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#153d23]/80 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
                    <Star size={12} className="fill-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Tukar Sembako
                    </p>
                  </div>
                </div>

                {/* ── CARD 7: Box Kardus / Kardus & Kertas ── */}
                <div
                  onClick={handleEnter}
                  className="group relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-[3px] border-white bg-gray-100 cursor-pointer transform rotate-[8deg] translate-y-4 hover:rotate-0 hover:-translate-y-5 hover:scale-108 hover:z-30 transition-all duration-300 ease-out shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80"
                    alt="Kardus & Kertas"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = sampahKardusImg }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Kardus &amp; Kertas
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── 3. Floating 3 Stats Pill Cards ── */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Pill 1: Nasabah Aktif */}
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#153d23]/10 px-4 py-2.5 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-[#153d23]/10 text-[#153d23] flex items-center justify-center shrink-0">
                <User size={17} />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400">
                  NASABAH AKTIF
                </p>
                <p className="font-display text-base sm:text-lg font-black text-[#0f2e1b] tracking-tight">
                  316,457
                </p>
              </div>
            </div>

            {/* Pill 2: Katalog Hadiah */}
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#153d23]/10 px-4 py-2.5 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-[#153d23]/10 text-[#153d23] flex items-center justify-center shrink-0">
                <Gift size={17} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0f2e1b]">Katalog Hadiah</p>
                <p className="text-[10px] text-gray-400">100+ reward tersedia</p>
              </div>
            </div>

            {/* Pill 3: Cek Nilai Poin */}
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#153d23]/10 px-4 py-2.5 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-[#153d23]/10 text-[#153d23] flex items-center justify-center shrink-0">
                <Search size={17} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0f2e1b]">Cek Nilai Poin</p>
                <p className="text-[10px] text-gray-400">Perhitungan per kg</p>
              </div>
            </div>
          </div>

          {/* ── 4. Main CTA Button ── */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleEnter}
              className="group inline-flex items-center gap-2 rounded-full bg-[#153d23] hover:bg-[#0f2e1b] px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-[#153d23]/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Masuk ke Bank Sampah</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — THE BEST PLATFORM (4 Asymmetric Cards)
      ════════════════════════════════════════════════════════ */}
      <section id="fitur" className="py-20 sm:py-28 bg-[#f5f7f2]/70 border-y border-[#153d23]/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Section Header */}
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0f2e1b] tracking-tight">
                The best platform
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-sm text-[#153d23]">🍀</span>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed">
                  Solusi digital modern untuk mempermudah pencatatan, penimbangan, dan penukaran reward sampah daur ulang.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 4 Cards Grid Matching Reference Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            
            {/* ── Card 1 (Top Left: View products easily) ── */}
            <Reveal delay={100}>
              <div className="group rounded-[28px] bg-white border border-[#153d23]/10 p-7 sm:p-9 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[230px] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#153d23]">
                    Adaptasi Untuk Semua Perangkat
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f2e1b] mt-2 max-w-sm leading-snug">
                    Pantau kategori &amp; saldo langsung dari browsermu!
                  </h3>
                </div>
                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={handleEnter}
                    className="inline-flex items-center gap-2 rounded-full border border-[#153d23]/25 bg-white px-5 py-2 text-xs font-bold text-[#153d23] hover:bg-[#153d23] hover:text-white transition-all cursor-pointer"
                  >
                    <span>Pelajari Selengkapnya</span>
                  </button>
                </div>
                {/* Decorative background shape */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-[#153d23]/5 blur-2xl pointer-events-none" />
              </div>
            </Reveal>

            {/* ── Card 2 (Top Right: Stories / Gauge geometric graphic) ── */}
            <Reveal delay={180}>
              <div className="group rounded-[28px] bg-[#fbf5f0] border border-[#153d23]/10 p-7 sm:p-9 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[230px] relative overflow-hidden">
                <div className="relative z-10 max-w-xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Poin &amp; Reward
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f2e1b] mt-2 leading-snug">
                    Lebih dari 10.000 poin ditukarkan setiap bulan
                  </h3>
                </div>
                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={handleEnter}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-900/20 bg-white px-5 py-2 text-xs font-bold text-[#0f2e1b] hover:bg-[#153d23] hover:text-white transition-all cursor-pointer"
                  >
                    <span>Lihat Katalog</span>
                  </button>
                </div>

                {/* Right side geometric arc / speedometer gauge graphic from reference */}
                <div className="absolute right-4 bottom-2 sm:right-6 sm:bottom-4 pointer-events-none select-none">
                  <div className="relative w-36 h-28 flex items-end justify-end">
                    <svg viewBox="0 0 120 90" className="w-32 h-24 stroke-[#153d23] fill-none">
                      <path
                        d="M 15 80 A 50 50 0 0 1 105 80"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="opacity-20"
                      />
                      <path
                        d="M 15 80 A 50 50 0 0 1 85 35"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="stroke-[#153d23]"
                      />
                    </svg>
                    {/* Small squiggly / dots */}
                    <div className="absolute top-1 right-2 text-gray-300 text-xs font-mono">
                      ~~~~~
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Card 3 (Bottom Left: All categories at one platform with contour wave lines) ── */}
            <Reveal delay={260}>
              <div className="group rounded-[28px] bg-[#f0f5f1] border border-[#153d23]/10 p-7 sm:p-9 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[230px] relative overflow-hidden">
                <div className="relative z-10 max-w-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#153d23]">
                    Katalog Sampah
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f2e1b] mt-2 leading-snug">
                    Semua kategori sampah terdata dalam satu platform
                  </h3>
                </div>
                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={handleEnter}
                    className="inline-flex items-center gap-2 rounded-full border border-[#153d23]/25 bg-white px-5 py-2 text-xs font-bold text-[#153d23] hover:bg-[#153d23] hover:text-white transition-all cursor-pointer"
                  >
                    <span>Cek Kategori</span>
                  </button>
                </div>

                {/* Right side contour line graphic from reference */}
                <div className="absolute -right-6 -bottom-6 w-52 h-40 pointer-events-none opacity-40">
                  <svg viewBox="0 0 200 150" className="w-full h-full fill-none stroke-[#153d23]">
                    <path d="M 30 140 Q 90 60 180 80" strokeWidth="2.5" />
                    <path d="M 10 140 Q 110 40 190 110" strokeWidth="2" />
                    <circle cx="90" cy="100" r="5" className="fill-[#153d23]" />
                    <circle cx="130" cy="85" r="4" className="fill-[#1b4332]" />
                  </svg>
                </div>
              </div>
            </Reveal>

            {/* ── Card 4 (Bottom Right: Features with diagonal hashes & arrow button) ── */}
            <Reveal delay={340}>
              <div className="group rounded-[28px] bg-[#faf6f0] border border-[#153d23]/10 p-7 sm:p-9 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[230px] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#153d23]">
                    Fitur Lengkap
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f2e1b] mt-2 max-w-sm leading-snug">
                    Banyak fungsi praktis &amp; verifikasi akurat!
                  </h3>
                </div>

                {/* Bottom row: decorative slanted red/dark-green hashes + circular arrow button */}
                <div className="pt-6 flex items-end justify-between relative z-10">
                  <div className="flex items-center gap-1.5 text-lg font-black text-[#153d23]/70 select-none">
                    <span>/</span>
                    <span className="text-[#1b4332]">/</span>
                    <span className="text-[#0f2e1b]">/</span>
                    <span className="text-[#153d23]">/</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleEnter}
                    aria-label="Masuk ke aplikasi"
                    className="h-12 w-12 rounded-full border border-[#153d23]/20 bg-white flex items-center justify-center text-[#153d23] hover:bg-[#153d23] hover:text-white shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — ORBITAL CARDS (4 Cards along curved line)
      ════════════════════════════════════════════════════════ */}
      <section id="layanan" className="py-24 sm:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Section Header */}
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0f2e1b] tracking-tight leading-snug">
                Empat Kategori Utama Sampah Daur Ulang
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm text-gray-500">
                Setorkan jenis sampah terpilah ini untuk ditimbang oleh petugas dan dikonversikan menjadi poin.
              </p>
            </div>
          </Reveal>

          {/* Connected Orbital Arc Cards Layout */}
          <div className="relative max-w-5xl mx-auto">
            
            {/* Subtle Curved Orbital Dashed Line across the cards */}
            <div className="hidden md:block absolute top-12 left-10 right-10 h-32 border-t-2 border-dashed border-[#153d23]/20 rounded-[50%] pointer-events-none -z-0" />

            {/* 4 Cards Grid with Photo Avatars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 relative z-10">
              
              {/* Item 1: Botol Kaca */}
              <Reveal delay={100}>
                <div className="group rounded-3xl bg-white border border-[#153d23]/10 p-5 shadow-card hover:shadow-xl hover:border-[#153d23]/30 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#153d23]/20 p-1 mb-3 bg-[#153d23]/5 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={sampahBotolImg}
                      alt="Botol Kaca Bening"
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#0f2e1b]">
                    Botol Kaca
                  </h4>
                  <span className="mt-1 inline-block rounded-full bg-[#153d23]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#153d23]">
                    Kaca &amp; Toples
                  </span>
                </div>
              </Reveal>

              {/* Item 2: Logam & Kaleng */}
              <Reveal delay={180}>
                <div className="group rounded-3xl bg-white border border-[#153d23]/10 p-5 shadow-card hover:shadow-xl hover:border-[#153d23]/30 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#153d23]/20 p-1 mb-3 bg-[#153d23]/5 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={sampahKalengImg}
                      alt="Kaleng Aluminium & Besi"
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#0f2e1b]">
                    Logam &amp; Kaleng
                  </h4>
                  <span className="mt-1 inline-block rounded-full bg-[#153d23]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#153d23]">
                    Aluminium &amp; Seng
                  </span>
                </div>
              </Reveal>

              {/* Item 3: Kardus & Kertas */}
              <Reveal delay={260}>
                <div className="group rounded-3xl bg-white border border-[#153d23]/10 p-5 shadow-card hover:shadow-xl hover:border-[#153d23]/30 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#153d23]/20 p-1 mb-3 bg-[#153d23]/5 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={sampahKardusImg}
                      alt="Kardus & Kertas"
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#0f2e1b]">
                    Kardus &amp; Kertas
                  </h4>
                  <span className="mt-1 inline-block rounded-full bg-[#153d23]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#153d23]">
                    Box, Koran, Dupleks
                  </span>
                </div>
              </Reveal>

              {/* Item 4: Hadiah / Sembako */}
              <Reveal delay={340}>
                <div className="group rounded-3xl bg-white border border-[#153d23]/10 p-5 shadow-card hover:shadow-xl hover:border-[#153d23]/30 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#153d23]/20 p-1 mb-3 bg-[#153d23]/5 shadow-sm group-hover:scale-105 transition-transform">
                    <img
                      src={hadiahBerasImg}
                      alt="Beras & Sembako Reward"
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#0f2e1b]">
                    Tukar Hadiah
                  </h4>
                  <span className="mt-1 inline-block rounded-full bg-[#153d23]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#153d23]">
                    Beras, Minyak, Pulsa
                  </span>
                </div>
              </Reveal>

            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — FINAL CTA IN DEEP GREEN
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-[#0f2e1b] text-white relative overflow-hidden">
        {/* Subtle Decorative Leaves / Rings */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#153d23]/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#1b4332]/40 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-white/15 mb-6">
              <Leaf size={13} />
              Mulai Langkah Nyata
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Sederhana. Transparan.
              <br />
              <span className="text-emerald-300">Berdampak Nyata.</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
              Bersama Bank Sampah Digital, pilah sampah dari rumah dan jadikan setiap kilogram bernilai tabungan dan hadiah bermanfaat.
            </p>
            <div className="mt-9 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleEnter}
                className="group inline-flex items-center gap-2.5 rounded-full bg-white text-[#0f2e1b] hover:bg-gray-100 px-8 py-4 text-sm font-bold shadow-2xl active:scale-95 transition-all cursor-pointer"
              >
                <span>Masuk ke Bank Sampah</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#0f2e1b]" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0a1e12] py-8 px-6 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[#153d23] flex items-center justify-center text-white">
              <Leaf size={12} />
            </div>
            <span className="font-bold text-white/80">Bank Sampah Digital</span>
          </div>
          <p>© {new Date().getFullYear()} Bank Sampah Digital · Sampah Jadi Nilai</p>
          <div className="flex items-center gap-5 font-medium">
            <button type="button" onClick={handleEnter} className="hover:text-white transition-colors cursor-pointer">
              Beranda
            </button>
            <button type="button" onClick={handleEnter} className="hover:text-white transition-colors cursor-pointer">
              Kategori
            </button>
            <button type="button" onClick={handleEnter} className="hover:text-white transition-colors cursor-pointer">
              Tukar Hadiah
            </button>
          </div>
        </div>
      </footer>

      {/* ── Global Keyframes for Ultra-Smooth Entrance & Floating ── */}
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatCollage {
          0%, 100% {
            transform: rotate(-11deg) translateY(0px);
          }
          50% {
            transform: rotate(-10deg) translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

