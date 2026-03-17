import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // accent:  '#38bdf8',
        accent:  '#84ff5f',
        accent2: '#ff992c',
        bg:      '#0d1117',
        surface: '#161b22',
        border:  '#21262d',
        text:    '#e6edf3',
        muted:   '#7d8590',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
