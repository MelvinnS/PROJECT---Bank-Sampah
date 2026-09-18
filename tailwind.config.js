/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8f0',
          100: '#d7eedb',
          200: '#b0ddb9',
          300: '#7fc78e',
          400: '#4fab63',
          500: '#2f8f47',
          600: '#217239',
          700: '#1c5c30',
          800: '#194a29',
          900: '#153d23',
        },
        sand: '#f6f7f3',
        ink: '#12261a',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,38,26,0.06), 0 8px 24px -12px rgba(18,38,26,0.15)',
      },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
}
