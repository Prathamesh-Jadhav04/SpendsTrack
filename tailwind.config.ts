import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        /* Design token extras */
        "ds-ink":         "var(--ds-ink)",
        "ds-body":        "var(--ds-body)",
        "ds-mute":        "var(--ds-mute)",
        "ds-hairline":    "var(--ds-hairline)",
        "ds-hairline-strong": "var(--ds-hairline-strong)",
        "ds-canvas":      "var(--ds-canvas)",
        "ds-canvas-soft": "var(--ds-canvas-soft)",
        "ds-canvas-soft-2": "var(--ds-canvas-soft-2)",
        "ds-link":        "var(--ds-link)",
        "ds-error":       "var(--ds-error)",
        "ds-warning":     "var(--ds-warning)",
        "ds-cyan":        "var(--ds-cyan)",
        "ds-violet":      "var(--ds-violet)",
        "ds-pink":        "var(--ds-highlight-pink)",
        "expense":        "var(--expense)",
        "expense-soft":   "var(--expense-soft)",
        "income":         "var(--income)",
        "income-soft":    "var(--income-soft)",
        "savings":        "var(--savings)",
        "savings-soft":   "var(--savings-soft)",
      },
      fontFamily: {
        sans:  ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono:  ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
      fontSize: {
        "display-xl": ["3rem",   { lineHeight: "1",     letterSpacing: "-0.15rem", fontWeight: "600" }],
        "display-lg": ["2rem",   { lineHeight: "1.25",  letterSpacing: "-0.08rem", fontWeight: "600" }],
        "display-md": ["1.5rem", { lineHeight: "1.333", letterSpacing: "-0.06rem", fontWeight: "600" }],
        "display-sm": ["1.25rem",{ lineHeight: "1.4",   letterSpacing: "-0.04rem", fontWeight: "600" }],
        "body-lg":    ["1.125rem",{ lineHeight: "1.556", letterSpacing: "0" }],
        "body-sm":    ["0.875rem",{ lineHeight: "1.429", letterSpacing: "-0.017rem" }],
        "caption":    ["0.75rem", { lineHeight: "1.333", letterSpacing: "0" }],
      },
      borderRadius: {
        none:    "0px",
        xs:      "4px",
        sm:      "6px",    /* --geist-radius base */
        md:      "8px",    /* --geist-marketing-radius */
        lg:      "12px",
        xl:      "16px",
        "pill-sm": "64px",
        pill:    "100px",
        full:    "9999px",
        /* keep shadcn aliases */
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        /* Vercel stacked shadow system (aliased for direct use) */
        "level-1": "inset 0 0 0 1px rgba(0,0,0,0.08)",
        "level-2": "inset 0 0 0 1px rgba(0,0,0,0.08), 0px 1px 1px rgba(0,0,0,0.02), 0px 2px 2px rgba(0,0,0,0.04)",
        "level-3": "inset 0 0 0 1px rgba(0,0,0,0.08), 0px 2px 2px rgba(0,0,0,0.04), 0px 8px 8px -8px rgba(0,0,0,0.04)",
        "level-4": "inset 0 0 0 1px rgba(0,0,0,0.08), 0px 2px 2px rgba(0,0,0,0.04), 0px 8px 16px -4px rgba(0,0,0,0.04)",
        "level-5": "inset 0 0 0 1px rgba(0,0,0,0.08), 0px 1px 1px rgba(0,0,0,0.02), 0px 8px 16px -4px rgba(0,0,0,0.04), 0px 24px 32px -8px rgba(0,0,0,0.06)",
        /* legacy aliases */
        fintech: "inset 0 0 0 1px rgba(0,0,0,0.08), 0px 2px 2px rgba(0,0,0,0.04), 0px 8px 16px -4px rgba(0,0,0,0.04)",
        soft:    "inset 0 0 0 1px rgba(0,0,0,0.08), 0px 1px 1px rgba(0,0,0,0.02), 0px 2px 2px rgba(0,0,0,0.04)",
      },
      spacing: {
        xxs: "4px",
        xs:  "8px",
        sm:  "12px",
        md:  "16px",
        lg:  "24px",
        xl:  "32px",
        "2xl": "40px",
        "3xl": "48px",
        "4xl": "64px",
        "5xl": "96px",
        "6xl": "128px",
      },
    }
  },
  plugins: [animate]
};

export default config;
