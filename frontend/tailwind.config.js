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
        display: ['Space Grotesk', 'sans-serif'], // Display headings
      },
      colors: {
        // Brand colors from design system
        'primary-red': '#e53935',
        'dark-red': '#c62828',
        'primary-orange': '#e87722',
        'brand-orange': '#F47721',
        'brand-red': '#E74632',
        'brand-white': '#FFFFFF',
        'black': '#1a1a1a',
        'white': '#ffffff',
        'gray-light': '#f5f5f5',
        'gray-medium': '#9e9e9e',
        'gray-dark': '#424242',
        'warm-paper': '#F7F4EF',
        'charcoal': '#171717',
        'muted-neutral': '#77716A',
      },
      fontSize: {
        // Display sizes
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        // Heading sizes
        'heading-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-md': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-sm': ['1.875rem', { lineHeight: '1.3' }],
        // Title sizes
        'title-lg': ['1.5rem', { lineHeight: '1.4' }],
        'title-md': ['1.25rem', { lineHeight: '1.5' }],
        'title-sm': ['1.125rem', { lineHeight: '1.5' }],
        // Body sizes
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        // Label sizes
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.025em' }],
        'label-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        'soft': '0.5rem',
        'subtle': '0.25rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 40px rgba(0, 0, 0, 0.16)',
        'glow': '0 0 24px rgba(244, 119, 33, 0.2)',
      },
      transitionDuration: {
        'micro': '120ms',
        'fast': '200ms',
        'normal': '300ms',
        'slow': '450ms',
        'slower': '650ms',
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

