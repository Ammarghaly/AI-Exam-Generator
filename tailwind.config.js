/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-on-primary)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-on-secondary)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          foreground: 'var(--color-on-tertiary)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-on-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          foreground: 'var(--color-on-surface)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          foreground: 'var(--color-on-error)',
        },
        outline: 'var(--color-outline)',
      },
      fontFamily: {
        primary: ['var(--font-primary)'],
        secondary: ['var(--font-secondary)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-default)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      spacing: {
        base: 'var(--spacing-base)',
        'container-max': 'var(--spacing-container-max)',
      },
    },
  },
  plugins: [],
}
