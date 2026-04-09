/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#f3ffe6',
          100: '#e3ffc4',
          200: '#c5ff88',
          300: '#a8ef52',
          400: '#82dc23',
          500: '#67b81c',
          600: '#4e9014',
          700: '#3b700e',
          800: '#2d550a',
          900: '#213d08',
        },
        purple: {
          50: '#edfffe',
          100: '#d0fffd',
          200: '#9ffaf8',
          300: '#5eedec',
          400: '#23dcd9',
          500: '#15b3b0',
          600: '#0d8e8b',
          700: '#0a6b69',
          800: '#084f4d',
          900: '#063837',
        },
        pink: {
          50: '#fdf0ff',
          100: '#f5d3ff',
          200: '#ebb0ff',
          300: '#d066ff',
          400: '#ad23dc',
          500: '#8a1ab3',
          600: '#6a138a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'love-gradient': 'linear-gradient(135deg, #f3ffe6 0%, #edfffe 60%, #f3ffe6 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(237,255,254,0.9) 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
