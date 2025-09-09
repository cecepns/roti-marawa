/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF8F0',
          100: '#FAF0E1',
          200: '#F5E6D3',
          300: '#F0DCC5',
          400: '#EBD2B7',
          500: '#E6C8A9',
          600: '#D2691E',
          700: '#8B4513',
          800: '#654321',
          900: '#3E2A15'
        },
        cream: {
          50: '#FFFCF8',
          100: '#FEF9F1',
          200: '#FDF6EA',
          300: '#FCF3E3',
          400: '#FBF0DC',
          500: '#F7E7CE',
          600: '#F5E6D3',
          700: '#E6D4BF',
          800: '#D7C2AB',
          900: '#C8B097'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}