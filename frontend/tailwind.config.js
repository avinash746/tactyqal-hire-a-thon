/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0E1635', soft: '#3B4468', mute: '#6B7394' },
        chalk: { DEFAULT: '#F5F4FA', deep: '#E9E7F3' },
        signal: { DEFAULT: '#2F5BFF', dark: '#1D3FD1', tint: '#E4EAFF' },
        marigold: { DEFAULT: '#FFB627', tint: '#FFF1D2' },
        mint: { DEFAULT: '#19C3A0', tint: '#D8F6EE' }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Figtree Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      keyframes: {
        'screen-in': {
          from: { opacity: 0, transform: 'translateY(10px) scale(.98)' },
          to: { opacity: 1, transform: 'none' }
        },
        progress: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } }
      },
      animation: {
        'screen-in': 'screen-in .45s cubic-bezier(.2,.8,.2,1) both',
        progress: 'progress 4.5s linear both'
      }
    }
  },
  plugins: []
};
