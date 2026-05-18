/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-on-primary)",
        },
        "on-primary": "var(--color-on-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-container": "var(--color-on-primary-container)",
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-on-secondary)",
        },
        "on-secondary": "var(--color-on-secondary)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          foreground: "var(--color-on-tertiary)",
        },
        "on-tertiary": "var(--color-on-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        background: "var(--color-background)",
        foreground: "var(--color-on-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-on-surface)",
        },
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-on-error)",
        },
        "on-error": "var(--color-on-error)",
        outline: "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "overlay-10": "var(--color-overlay-10)",
        "overlay-20": "var(--color-overlay-20)",
      },
      fontFamily: {
        primary: ["var(--font-primary)"],
        secondary: ["var(--font-secondary)"],
        display: ["var(--font-primary)"],
        label: ["var(--font-secondary)"],
      },
      fontSize: {
        h2: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-default)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      spacing: {
        base: "var(--spacing-base)",
        "container-max": "var(--spacing-container-max)",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};
