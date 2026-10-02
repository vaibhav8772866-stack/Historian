/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F9F4BC',
          surface: '#FFFFFF',
          border: '#E8E4D0',
          hover: '#FFF0E0',
        },
        primary: {
          50: '#FFF8F0',
          100: '#FFF0E0',
          200: '#FFE0C2',
          300: '#FFC285',
          400: '#FFA147',
          500: '#FF8000',
          600: '#E67300',
          700: '#CC6600',
          800: '#B35900',
          900: '#804000',
        },
        brand: {
          orange: '#FF8000',
          orangeHover: '#E67300',
          orangeLight: '#FFF0E0',
        },
        slate: {
          850: '#15202b',
        }
      },
      borderRadius: {
        'card': '16px',
        'xl2': '18px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 12px 30px rgba(0, 0, 0, 0.12)',
        'sidebar-active': '0 4px 14px rgba(255, 128, 0, 0.35)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
