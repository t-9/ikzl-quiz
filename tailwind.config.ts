import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border-base))',
        input: 'hsl(var(--border-base))',
        ring: 'hsl(var(--accent-base))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--accent-base))',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted-foreground))',
          foreground: 'hsl(var(--foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent-strong-base))',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
