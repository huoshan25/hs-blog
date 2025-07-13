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
      gridTemplateColumns: {
        '53': 'repeat(53, minmax(0, 1fr))',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'wave-flow': 'waveFlow 1s linear infinite',
        'slideDownAndFade': 'slideDownAndFade 150ms ease-out',
        'slideLeftAndFade': 'slideLeftAndFade 150ms ease-out',
        'slideUpAndFade': 'slideUpAndFade 150ms ease-out',
        'slideRightAndFade': 'slideRightAndFade 150ms ease-out',
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
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },

      colors: {
        primary: 'var(--theme-primary)',
        text: 'var(--theme-text)',
        bg: 'var(--theme-bg)',
        hover: 'var(--theme-hover)',
        body: 'var(--theme-body)',
        border: 'var(--theme-border)',
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
