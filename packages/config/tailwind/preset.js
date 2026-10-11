/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#a73400',
        'primary-container': '#cb4914',
        'on-primary': '#ffffff',
        'on-primary-container': '#fffbff',
        'primary-fixed': '#ffdbcf',
        'primary-fixed-dim': '#ffb59c',
        'on-primary-fixed': '#390c00',
        'on-primary-fixed-variant': '#822700',
        'inverse-primary': '#ffb59c',

        secondary: '#1b6d24',
        'secondary-container': '#a0f399',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#217128',
        'secondary-fixed': '#a3f69c',
        'secondary-fixed-dim': '#88d982',
        'on-secondary-fixed': '#002204',
        'on-secondary-fixed-variant': '#005312',

        tertiary: '#874e00',
        'tertiary-container': '#aa6400',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#fffbff',
        'tertiary-fixed': '#ffdcbe',
        'tertiary-fixed-dim': '#ffb870',
        'on-tertiary-fixed': '#2d1600',
        'on-tertiary-fixed-variant': '#693c00',

        surface: '#fff8f5',
        'surface-dim': '#efd5c8',
        'surface-bright': '#fff8f5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fff1eb',
        'surface-container': '#ffeadf',
        'surface-container-high': '#fde3d6',
        'surface-container-highest': '#f7ddd0',
        'surface-variant': '#f7ddd0',
        'surface-tint': '#ab3600',

        'on-surface': '#261911',
        'on-surface-variant': '#594139',
        'on-background': '#261911',
        background: '#fff8f5',
        'inverse-surface': '#3c2d25',
        'inverse-on-surface': '#ffede5',

        outline: '#8d7168',
        'outline-variant': '#e1bfb5',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Ethiopic', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Noto Sans Ethiopic', 'sans-serif'],
        ethiopic: ['Noto Sans Ethiopic', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Quiet Luxury type ramp — shared across customer, merchant & rider apps.
      // Floor for meaningful text is 13px (body-sm); micro is uppercase-only.
      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1rem' }], // 11px uppercase micro-labels
        'label-sm': ['0.75rem', { lineHeight: '1.125rem' }], // 12px captions
        'label-md': ['0.875rem', { lineHeight: '1.25rem' }], // 14px form labels
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem' }], // 13px compact body
        'body-md': ['0.9375rem', { lineHeight: '1.4rem' }], // 15px primary body
        'body-lg': ['1rem', { lineHeight: '1.5rem' }], // 16px emphasis body
        'title-sm': ['0.9375rem', { lineHeight: '1.35rem' }], // 15px card titles
        'title-md': ['1.0625rem', { lineHeight: '1.5rem' }], // 17px section titles
        'title-lg': ['1.25rem', { lineHeight: '1.75rem' }], // 20px screen headings
        'title-xl': ['1.5rem', { lineHeight: '2rem' }], // 24px page headings
        display: ['1.625rem', { lineHeight: '2.1rem' }], // 26px hero numbers
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        'level-1': '0 4px 16px rgba(45, 31, 23, 0.05)',
        'level-2': '0 8px 24px -4px rgba(45, 31, 23, 0.08), 0 2px 6px -1px rgba(45, 31, 23, 0.04)',
        'level-3': '0 16px 36px -6px rgba(45, 31, 23, 0.16)',
        floating: '0 20px 40px -10px rgba(167, 52, 0, 0.25)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.85' },
          '50%': { transform: 'scale(1.4)', opacity: '0.15' },
          '100%': { transform: 'scale(0.9)', opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
