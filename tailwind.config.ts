import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: 'rgb(var(--c-void) / <alpha-value>)',
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        ash: 'rgb(var(--c-ash) / <alpha-value>)',
        blood: 'rgb(var(--c-blood) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        gauze: 'rgb(var(--c-gauze) / <alpha-value>)',
        char: 'rgb(var(--c-char) / <alpha-value>)',
        smoke: 'rgb(var(--c-smoke) / <alpha-value>)',
        edge: 'rgb(var(--c-edge) / <alpha-value>)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        ui: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        body: ['"DM Mono"', 'ui-monospace', 'monospace'],
        jp: ['"Noto Serif JP"', '"Noto Sans JP"', 'serif'],
        jpSans: ['"Noto Sans JP"', 'sans-serif'],
      },
      letterSpacing: {
        hud: '0.18em',
        wide2: '0.08em',
      },
      fontSize: {
        '2xs': ['0.625rem', '0.875rem'],
        '3xs': ['0.625rem', '0.875rem'],
      },
    },
  },
  plugins: [],
} satisfies Config;
