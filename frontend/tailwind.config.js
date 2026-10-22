import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#1a1a2e',
        dark: '#0f0c29',
        accent: '#ff006e',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [
    // `can-hover:` applies only on devices with a real mouse, so controls that
    // appear on hover stay visible on phones/tablets
    plugin(({ addVariant }) => {
      addVariant('can-hover', '@media (hover: hover)')
    }),
  ],
}
