/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f4f6f4',
          100: '#e8ebe8',
          200: '#d1d7d1',
          300: '#b9c3b9',
          400: '#8b9b8b',
          500: '#374F29', // Couleur principale
          600: '#324726',
          700: '#2a3b20',
          800: '#222f1a',
          900: '#1b2615',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};