/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Body text
        heading: ['Barlow', 'sans-serif'], // Headings
      },
      colors: {
        // Brand colors from design system
        'primary-red': '#e53935',
        'dark-red': '#c62828',
        'primary-orange': '#e87722',
        'black': '#1a1a1a',
        'white': '#ffffff',
        'gray-light': '#f5f5f5',
        'gray-medium': '#9e9e9e',
        'gray-dark': '#424242',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
