import { create } from 'zustand';

export type Theme = 'light' | 'dark';

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (e) {
    console.error("Failed to read theme from localStorage:", e);
  }
  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error("Failed to save theme to localStorage:", e);
    }
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {
        console.error("Failed to save theme to localStorage:", e);
      }
      return { theme: newTheme };
    }),
}));
