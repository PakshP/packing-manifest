import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "rgb(var(--bg-base) / <alpha-value>)",
          paper: "rgb(var(--bg-paper) / <alpha-value>)",
          elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
        },
        border: {
          soft: "rgb(var(--border-soft) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        ink: {
          primary: "rgb(var(--ink-primary) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--ink-tertiary) / <alpha-value>)",
        },
        accent: {
          moss: "rgb(var(--accent-moss) / <alpha-value>)",
          rust: "rgb(var(--accent-rust) / <alpha-value>)",
          river: "rgb(var(--accent-river) / <alpha-value>)",
          summit: "rgb(var(--accent-summit) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.18em",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
      },
      keyframes: {
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 8s linear infinite",
        "fade-in": "fadeIn 200ms ease-out",
        "scale-in": "scaleIn 180ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
