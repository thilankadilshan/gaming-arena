import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#090a0f',
        'cyber-surface': '#121420',
        'cyber-border': '#1e2438',
        'cyber-cyan': '#00f0ff',
        'cyber-pink': '#ff0055',
        'cyber-yellow': '#ffe600',
        'cyber-purple': '#8a2be2',
        'cyber-green': '#00ff66',
        'cyber-muted': '#4a5568',
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-pink': '0 0 15px rgba(255, 0, 85, 0.5), 0 0 30px rgba(255, 0, 85, 0.2)',
        'neon-yellow': '0 0 15px rgba(255, 230, 0, 0.5), 0 0 30px rgba(255, 230, 0, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.9))' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
