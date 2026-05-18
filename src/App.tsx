import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './stores/use-theme-store';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors">
      <div className="rounded-lg border border-border bg-card p-8 text-card-foreground shadow-md transition-colors">
        <h1 className="mb-4 rounded-md bg-primary/10 p-4 text-3xl font-bold text-primary">
          AI Exam Generator
        </h1>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
      <Toaster />
    </div>
  )
}

export default App
