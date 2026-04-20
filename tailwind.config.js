/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#FD4766',
        accent:  '#7644FF',
        blue:    '#1C99FE',
        // dark mode
        dark:    '#091020',
        surface: '#131d30',
        bg:      '#0e1525',
        muted:   '#c6c9d8bf',
        // light mode
        'light-bg':      '#f0f4ff',
        'light-surface': '#ffffff',
        'light-dark':    '#e2e8f8',
        'light-muted':   '#64748b',
      },
      backgroundImage: {
        hero: "url('/images/bg-image.jpg')",
      },
      animation: {
        blink:       'blink 0.8s step-end infinite',
        'fade-up':   'fadeUp 0.6s ease forwards',
        glow:        'glow 3s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        blink:  { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glow:   { '0%,100%': { boxShadow: '0 0 20px #FD476640' }, '50%': { boxShadow: '0 0 40px #7644FF40' } },
      },
    },
  },
  plugins: [],
}
