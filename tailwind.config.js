/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/public/**/*.html",
    "./frontend/src/**/*.js",
    "./frontend/public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'gtx-dark': '#0a0a0a',
        'gtx-panel': 'rgba(20, 20, 20, 0.8)',
        'gtx-glass': 'rgba(255, 255, 255, 0.05)',
        'gtx-border': 'rgba(255, 255, 255, 0.1)',
        'gtx-accent': '#007AFF',
        'gtx-accent-hover': '#0051D5'
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}


