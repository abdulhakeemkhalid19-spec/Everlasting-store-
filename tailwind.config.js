/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d8',
          300: '#f4a8b8',
          400: '#ed7590',
          500: '#e2486c',
          600: '#cc2952',
          700: '#ac1e43',
          800: '#8b1a3b',
          900: '#6b1530',
        },
        gold: {
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
    },
  },
  plugins: [],
}
