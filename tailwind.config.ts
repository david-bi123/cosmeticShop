import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E5CFA0',
          dark: '#9B7D4A'
        },
        blush: { 50: '#FDF2F8', 100: '#FCE7F3', 200: '#FBCFE8', 300: '#F9A8D4', 400: '#F472B6', 500: '#EC4899' },
        cream: { 50: '#FDFBF7', 100: '#FAF5EC', 200: '#F5EAD7' }
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
        'glass-dark': 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        'gradient-luxe': 'linear-gradient(135deg, #6B5344 0%, #C9A96E 50%, #F9A8D4 100%)'
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31,38,135,0.15)',
        'luxe': '0 10px 40px rgba(201,169,110,0.25)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'shimmer': { '100%': { transform: 'translateX(100%)' } }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'shimmer': 'shimmer 1.5s infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
export default config;
