import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      display: ['group-hover'],
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'wave-flow': 'waveFlow 1s linear infinite',
      },
      keyframes: {
        blink: {
          '50%': {
            opacity: '0',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        waveFlow: {
          '0%': { transform: 'translateX(-10%)' },
          '50%': { transform: 'translateX(10%)' },
          '100%': { transform: 'translateX(-10%)' }
        }
      },

      colors: {
        primary: 'var(--theme-primary)',
        text: 'var(--theme-text)',
        bg: 'var(--theme-bg)',
        hover: 'var(--theme-hover)',
        body: 'var(--theme-body)',
        border: 'var(--theme-border)',
      },
    },
  },
  plugins: [
    plugin(function({ addComponents, addUtilities }) {
      addComponents({
        '.bg-base': {
          backgroundColor: 'var(--theme-bg)'
        },
        '.text-base': {
          color: 'var(--theme-text)'
        },
        '.border-base': {
          borderColor: 'var(--theme-border)'
        },
        '.hover-base': {
          '&:hover': {
            color: 'var(--theme-hover)'
          }
        },
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '.bg-primary': {
          backgroundColor: 'var(--theme-primary)'
        },
        '.text-primary': {
          color: 'var(--theme-primary)'
        },
        '.border-primary': {
          borderColor: 'var(--theme-primary)'
        },
        '.hover-primary': {
          '&:hover': {
            color: 'var(--theme-primary)'
          }
        },
      });

      addUtilities({
        '.rounded-circle': {
          'border-radius': '50%'
        },
      });
    }),
  ],
  experimental: {
    optimizeUniversalDefaults: true
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
