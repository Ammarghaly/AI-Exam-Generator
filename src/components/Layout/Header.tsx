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
    if (pathname.includes("/generate-exam")) return "Generate";
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/exam-management")) return "Exams";
    if (pathname.includes("/groups")) return role === "teacher" ? "Groups" : "My Groups";
    if (pathname.includes("/practice")) return "Practice Exams";
    if (pathname.includes("/exam-results") || pathname.includes("/results")) return "Results";
    if (pathname.includes("/exam/")) return pathname.includes("/review") ? "Exam Review" : "Take Exam";
    return role === "teacher" ? "Dashboard" : "Dashboard";
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
          <div
            className="relative group select-none cursor-pointer"
            onClick={() => navigate(role === "teacher" ? "/teacher/pricing" : "/student/pricing")}
          >
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100/20 text-yellow-600 text-xs font-bold border border-yellow-500/30 hover:bg-yellow-100/30 transition-colors">
              <img src={img} className="w-6 h-6" alt="Bolt" />
              {currentUser.available_credits}
            </span>
            
            {role === "student" && (
              <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-border shadow-xl hidden group-hover:block z-50 text-xs text-foreground space-y-2 pointer-events-none">
                <div className="font-bold text-sm border-b border-border pb-1.5 mb-1.5 text-primary flex items-center gap-1">
                  <img src={img} className="w-4 h-4" alt="Bolt" />
                  Credits Breakdown
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Subscription Credits:</span>
                  <span className="font-bold text-foreground">{currentUser.subscription_credits ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Purchased Credits:</span>
                  <span className="font-bold text-foreground">{currentUser.purchased_credits ?? 0}</span>
                </div>
                <div className="text-[10px] text-muted-foreground border-t border-border pt-1.5 leading-relaxed">
                  * Subscription credits reset at renewal. Purchased credits never expire and are used after subscription credits are depleted.
                </div>
              </div>
            )}
          </div>
        )}


        <div
          onClick={() => navigate(profilePath)}
          className={`w-8 h-8 rounded-full overflow-hidden shrink-0 cursor-pointer transition-all duration-300
                  ${
                    currentUser?.subscription_type === "lite"
                      ? "p-[2px] bg-gradient-to-tr from-zinc-300 via-slate-100 to-zinc-400 shadow-[0_0_6px_rgba(200,200,200,0.5)] hover:scale-105"
                      : currentUser?.subscription_type === "premium"
                      ? "p-[2px] bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 shadow-[0_0_8px_rgba(245,158,11,0.5)] hover:scale-105"
                      : currentUser?.subscription_type === "institution"
                      ? "p-[2px] bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-pulse hover:scale-110"
                      : "border border-border hover:border-primary hover:ring-2 hover:ring-primary/20"
                  }`}
        >
          <img
            src={
              currentUser?.avatar ||
              "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png"
            }
            alt="Profile"
            className="w-full h-full rounded-full object-cover bg-surface"
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
