/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        accent: {
          400: '#38bdf8',
          500: '#0ea5e9',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-card': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-green': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-orange': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-purple': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      }
    },
  },
  plugins: [],
}