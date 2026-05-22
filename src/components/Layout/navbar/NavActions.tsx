import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../../stores/use-theme-store";
import { Link } from "react-router-dom";

export default function NavActions() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="hidden md:flex items-center gap-sm">
      <button
        onClick={toggleTheme}
        className="p-2 mr-2 rounded-lg text-primary hover:bg-primary/10 transition-colors duration-200"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Link
        to="/login"
        className="px-lg py-sm rounded-lg font-label text-label text-primary border border-primary/30 hover:bg-primary/5 hover:border-primary/60 transition-all duration-200 cursor-pointer"
      >
        Sign In
      </Link>

      <Link
        to="/sign-up"
        className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label text-label hover:opacity-90 transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
      >
        Get Started
      </Link>
    </div>
  );
}
