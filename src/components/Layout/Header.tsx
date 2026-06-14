import { LogOut, Sun, Moon } from "lucide-react";
import img from "../../assets/img.svg";
import iconLogo from "../../assets/icon-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/use-user-store";
import { useThemeStore } from "../../stores/use-theme-store";
import { logout } from "../../api/auth";
import toast from "react-hot-toast";

interface HeaderProps {
  title?: string;
  role: "teacher" | "student";
}

export function Header({ title, role }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getPageTitle = () => {
    if (title) return title;
    const pathname = location.pathname.toLowerCase();
    if (pathname.includes("/profile")) return "Profile";
    if (pathname.includes("/generate-exam")) return "Generate Exam";
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/exam-management")) return "Exams";
    if (pathname.includes("/groups")) return role === "teacher" ? "Groups" : "My Groups";
    if (pathname.includes("/practice")) return "Practice Exams";
    if (pathname.includes("/exam-results") || pathname.includes("/results")) return "Results";
    if (pathname.includes("/exam/")) return pathname.includes("/review") ? "Exam Review" : "Take Exam";
    return role === "teacher" ? "Teacher Dashboard" : "Student Dashboard";
  };

  const displayTitle = getPageTitle();
  const profilePath = role === "teacher" ? "/teacher/profile" : "/student/profile";

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-2 md:px-6 z-10 shrink-0">
      <div className="flex items-center gap-2">
        <img src={iconLogo} alt="Logo" className="w-8 h-8 md:hidden object-contain shrink-0" />
        <h2 className="text-md md:text-xl font-bold text-foreground truncate">
          {displayTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 ml-auto">
       
        <span
          onClick={() => navigate(profilePath)}
          className="hidden md:block text-sm font-medium text-foreground/85 cursor-pointer hover:text-primary transition-colors select-none"
        >
          {currentUser?.name || ""}
        </span>


         {currentUser?.available_credits !== undefined && (
          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100/20 text-yellow-600 text-xs font-bold border border-yellow-500/30">
            <img src={img} className="w-6 h-6" alt="Bolt" />
            {currentUser.available_credits}
          </span>
        )}


        <div
          onClick={() => navigate(profilePath)}
          className={`w-8 h-8 rounded-full overflow-hidden shrink-0 cursor-pointer transition-all duration-300
                  ${
                    currentUser?.subscription_type !== "free"
                      ? "border-2 border-transparent bg-gradient-to-tr from-yellow-400 via-amber-500 to-gold-600 bg-origin-border hover:from-amber-500 hover:to-yellow-300 hover:scale-105"
                      : "border border-border hover:border-primary hover:ring-2 hover:ring-primary/20"
                  }`}
        >
          <img
            src={
              currentUser?.avatar ||
              "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors p-2 rounded-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
