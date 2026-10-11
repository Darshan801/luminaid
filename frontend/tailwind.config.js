/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ====================================
      // TYPOGRAPHY - "Light in Motion" System
      // ====================================
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'], // Body & UI text
        display: ['Space Grotesk', 'Barlow', 'sans-serif'], // Display headings
      },
      fontSize: {
        // Hero/Display (64-96px desktop, 40-54px mobile)
        'display-xl': ['96px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-xs': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        
        // Section Headings (40-60px desktop, 30-40px mobile)
        'heading-xl': ['60px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-lg': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-md': ['40px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-sm': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        
        // Card & Component Headings (20-28px)
        'title-lg': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-md': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'title-sm': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        
        // Body Text (16-18px desktop, 15-17px mobile)
        'body-lg': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        
        // Labels & Metadata (12-14px)
        'label-lg': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'label-md': ['13px', { lineHeight: '1.5', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      
      // ====================================
      // COLORS - "Light in Motion" Palette
      // ====================================
      colors: {
        // Core Brand Colors
        'brand-orange': '#F47721', // Main accent, primary CTA
        'brand-red': '#E74632',    // Secondary emphasis (restrained)
        'brand-white': '#FFFFFF',  // Clean surfaces
        
        // Supporting Neutrals
        'warm-paper': '#F7F4EF',   // Softer editorial background
        'charcoal': '#171717',      // Deep storytelling surfaces
        'muted-neutral': '#77716A', // Secondary text
        
        // Legacy Support (for gradual migration)
        'primary-orange': '#F47721',
        'primary-red': '#E74632',
        'dark-red': '#c62828',
        'black': '#1a1a1a',
        'white': '#ffffff',
        'gray-light': '#f5f5f5',
        'gray-medium': '#9e9e9e',
        'gray-dark': '#424242',
      },
      
      // ====================================
      // SPACING & LAYOUT
      // ====================================
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '128': '32rem',   // 512px
        '144': '36rem',   // 576px
      },
      maxWidth: {
        'content': '1280px',  // Main content width
        'reading': '720px',   // Comfortable reading width
        'wide': '1440px',     // Wide sections
      },
      
      // ====================================
      // BORDERS & RADII
      // ====================================
      borderRadius: {
        'subtle': '2px',
        'soft': '4px',
        'medium': '8px',
        'large': '12px',
        'xl': '16px',
      },
      
      // ====================================
      // SHADOWS - Light-inspired elevation
      // ====================================
      boxShadow: {
        'glow-sm': '0 0 12px rgba(244, 119, 33, 0.15)',
        'glow-md': '0 0 24px rgba(244, 119, 33, 0.2)',
        'glow-lg': '0 0 40px rgba(244, 119, 33, 0.25)',
        'soft': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 40px rgba(0, 0, 0, 0.16)',
        'inner-glow': 'inset 0 0 20px rgba(244, 119, 33, 0.1)',
      },
      
      // ====================================
      // MOTION - Consistent animation system
      // ====================================
      transitionDuration: {
        'micro': '120ms',      // Micro-interactions
        'fast': '200ms',       // Small UI transitions
        'normal': '300ms',     // Standard transitions
        'slow': '450ms',       // Editorial reveals
        'slower': '650ms',     // Cinematic moments
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
        'ease-spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-in-up': 'fadeInUp 450ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 119, 33, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(244, 119, 33, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
