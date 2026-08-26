/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f7',
          500: '#0c8de4',
          600: '#0270c2',
          700: '#03599e',
          800: '#074c82',
          900: '#0c3f6d',
          950: '#082848',
        },
        gujarat: {
          saffron: '#FF7722',
          navy: '#002B49',
          gold: '#DAA520',
          emerald: '#059669',
        }
      },
      fontFamily: {
        sans: ['"Hind Vadodara"', '"Noto Sans Gujarati"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif Gujarati"', 'Georgia', 'serif'],
        gujarati: ['"Hind Vadodara"', '"Noto Sans Gujarati"', 'sans-serif'],
      },
      boxShadow: {
        'mobile-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'desktop-card': '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
