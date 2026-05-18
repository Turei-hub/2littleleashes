import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#edf7f3',   // sage/mint light bg
          100: '#cce9de',
          200: '#9fe1cb',   // light mint brand
          300: '#6dcdb2',
          400: '#48b897',
          500: '#32977c',
          600: '#267862',
          700: '#1a5c4a',   // primary dark (navbar, footer)
          800: '#0f3c30',
          900: '#071e18',
        },
        amber: {
          50:  '#eaf7f2',   // light mint bg (replaces warm cream)
          100: '#c5ead9',
          200: '#9fe1cb',   // light mint
          300: '#9fe1cb',   // accent text on dark bg
          400: '#5dcaa5',   // brand mid-teal
          500: '#4ab896',   // CTA buttons
          600: '#32977c',
          700: '#267862',
          800: '#124030',
          900: '#071e18',
        },
        cream: {
          DEFAULT: '#faf8f4',
          dark:    '#f0ede6',
        },
        mint: {
          DEFAULT: '#E0FFF7',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease both',
        'fade-in':   'fadeIn 0.4s ease both',
        'slide-in':  'slideIn 0.4s ease both',
        'marquee':   'marquee 40s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
export default config
