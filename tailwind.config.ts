import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chalk: '#fffaf0',
        ink: '#263238',
        meadow: '#2f7d6d',
        sun: '#f3b33d',
        coral: '#d96c5f',
        sky: '#4b8fbd',
        grape: '#7666a8',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(38, 50, 56, 0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.96)' },
          '65%': { transform: 'scale(1.035)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(47, 125, 109, 0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(47, 125, 109, 0.16)' },
        },
      },
      animation: {
        pop: 'pop 260ms ease-out',
        glow: 'glow 600ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
