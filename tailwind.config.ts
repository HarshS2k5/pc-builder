import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark base palette
        charcoal: {
          DEFAULT: '#0f0f0f',
          50:  '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#4a4a4a',
          600: '#333333',
          700: '#1a1a1a',
          800: '#111111',
          900: '#0f0f0f',
          950: '#080808',
        },
        // Neon accent colors
        neon: {
          green:  '#00ff88',
          blue:   '#00d4ff',
          purple: '#b347ff',
          orange: '#ff6b35',
        },
        // Semantic aliases for the gaming UI
        background: '#0f0f0f',
        surface:    '#1a1a1a',
        'surface-2':'#111111',
        border:     '#2a2a2a',
        'border-bright': '#3a3a3a',
      },
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Rajdhani', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-glow-green':  'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
        'neon-glow-blue':   'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
        'neon-glow-purple': 'radial-gradient(circle, rgba(179,71,255,0.15) 0%, transparent 70%)',
        'card-gradient':    'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
      },
      boxShadow: {
        'neon-green':  '0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.1)',
        'neon-blue':   '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)',
        'neon-purple': '0 0 20px rgba(179, 71, 255, 0.4), 0 0 40px rgba(179, 71, 255, 0.1)',
        'neon-orange': '0 0 20px rgba(255, 107, 53, 0.4), 0 0 40px rgba(255, 107, 53, 0.1)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover':  '0 8px 40px rgba(0, 0, 0, 0.8)',
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-neon':   'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up':     'slideUp 0.3s ease-out',
        'slide-in':     'slideIn 0.4s ease-out',
        'fade-in':      'fadeIn 0.5s ease-out',
        'shimmer':      'shimmer 1.5s linear infinite',
        'spin-slow':    'spin 3s linear infinite',
        'float':        'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      screens: {
        '3xl': '1920px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Glass-morphism utilities via arbitrary values are ergonomic in Tailwind;
      // we provide the base values here for use via theme()
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config
