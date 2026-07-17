import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wasabi: {
          50: '#f3f8f5',
          100: '#e1eee6',
          300: '#9ac5a9',
          500: '#4d9369',
          700: '#286044',
          900: '#153e35'
        }
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 18px 50px rgba(21, 62, 53, 0.08)' }
    }
  },
  plugins: []
} satisfies Config;
