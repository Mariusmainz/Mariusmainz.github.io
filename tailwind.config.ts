import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:  '#38bdf8',   // was #00d4ff
        accent2: '#f59e0b',   // new amber
        bg:      '#0d1117',   // was #0a0a0a
        surface: '#161b22',   // was #111111
        border:  '#21262d',   // was #1f1f1f
        text:    '#e6edf3',   // was #e5e5e5
        muted:   '#7d8590',   // was #6b7280
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
