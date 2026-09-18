export default function BackgroundFoliage() {
  return (
    <>
      {/* Bottom Left Botanical Leaves */}
      <div className="pointer-events-none fixed bottom-12 -left-8 z-0 w-36 sm:w-44 opacity-25 select-none">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M10 140 C20 100 60 70 95 65 C90 100 65 130 10 140 Z" fill="#2f8f47" />
          <path d="M30 145 C50 115 90 95 130 95 C120 125 90 145 30 145 Z" fill="#4fab63" opacity="0.8" />
          <path d="M5 110 C2 70 30 40 60 35 C55 70 35 95 5 110 Z" fill="#7fc78e" opacity="0.7" />
        </svg>
      </div>

      {/* Bottom Right Botanical Leaves */}
      <div className="pointer-events-none fixed bottom-12 -right-8 z-0 w-36 sm:w-44 opacity-25 select-none">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M140 140 C130 100 90 70 55 65 C60 100 85 130 140 140 Z" fill="#2f8f47" />
          <path d="M120 145 C100 115 60 95 20 95 C30 125 60 145 120 145 Z" fill="#4fab63" opacity="0.8" />
          <path d="M145 110 C148 70 120 40 90 35 C95 70 115 95 145 110 Z" fill="#7fc78e" opacity="0.7" />
        </svg>
      </div>
    </>
  )
}
