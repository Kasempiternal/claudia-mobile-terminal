/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1e1e1e",
        foreground: "#cccccc",
        primary: {
          DEFAULT: "#007acc",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#3c3c3c",
          foreground: "#cccccc",
        },
        muted: {
          DEFAULT: "#2d2d2d",
          foreground: "#8c8c8c",
        },
        accent: {
          DEFAULT: "#007acc",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#f44747",
          foreground: "#ffffff",
        },
        border: "#3c3c3c",
        input: "#3c3c3c",
        ring: "#007acc",
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}