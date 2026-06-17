import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  User,
  FileText,
  GraduationCap,
  BarChart,
  UserCheck,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { useUserStore } from "../../stores/use-user-store";
import { Header } from "./Header";
import CreateGroupModal from "../groups/CreateGroupModal";
import logoIcon from "../../assets/icon-logo.png";
import { getMe } from "../../api/auth";

export function AppLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useUserStore();
  const isTeacher = currentUser?.role?.toLowerCase() === "teacher";
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      getMe()
        .then((data) => {
          if (data?.success && data?.user) {
            setCurrentUser(data.user);
          }
        })
        .catch((err) => {
          console.error("Failed to sync profile in AppLayout:", err);
        });
    }
  }, [setCurrentUser]);

  const navItems = isTeacher
    ? [
        { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/teacher/generate-exam", icon: Sparkles, label: "Generate" },
        { href: "/teacher/exam-management", icon: FileText, label: "Exams" },
        { href: "/teacher/groups", icon: Users, label: "Groups" },
      ]
    : [
        { href: "/student/dashboard", icon: GraduationCap, label: "Learning" },
        { href: "/student/generate-exam/ai-generate", icon: Sparkles, label: "Generate" },
        { href: "/student/groups", icon: Users, label: "Groups" },
        { href: "/student/practice", icon: FileText, label: "Practice" },
      ];

  const moreItems = isTeacher
    ? [
        { href: "/teacher/admissions", icon: UserCheck, label: "Requests" },
        { href: "/teacher/pricing", icon: CreditCard, label: "Plans" },
        { href: "/teacher/profile", icon: User, label: "Profile" },
      ]
    : [
        { href: "/student/results", icon: BarChart, label: "Results" },
        { href: "/student/pricing", icon: CreditCard, label: "Plans" },
        { href: "/student/profile", icon: User, label: "Profile" },
      ];

  const sidebarItems = isTeacher
    ? [
        { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
        { name: "Generate Exam", href: "/teacher/generate-exam", icon: Sparkles },
        { name: "Manage exams", href: "/teacher/exam-management", icon: FileText },
        { name: "My Groups", href: "/teacher/groups", icon: Users },
        { name: "Requests", href: "/teacher/admissions", icon: UserCheck },
        { name: "Pricing Plans", href: "/teacher/pricing", icon: CreditCard },
        { name: "Profile", href: "/teacher/profile", icon: User },
      ]
    : [
        { name: "My Learning", href: "/student/dashboard", icon: GraduationCap },
        { name: "Generate Exam", href: "/student/generate-exam/ai-generate", icon: Sparkles },
        { name: "My Groups", href: "/student/groups", icon: Users },
        { name: "Practice Exams", href: "/student/practice", icon: FileText },
        { name: "Results", href: "/student/results", icon: BarChart },
        { name: "Pricing Plans", href: "/student/pricing", icon: CreditCard },
        { name: "Profile", href: "/student/profile", icon: User },
      ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-52 lg:w-64 bg-surface border-r border-border flex-col hidden md:flex z-20 shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
     <Link to={isTeacher ? "/teacher/dashboard" : "/student/dashboard"} className="flex items-center gap-3">
    <img
      src={logoIcon}
      alt="Academix"
      className="h-14 w-14 object-contain"
    />

    <div>
      <h1 className="text-lg font-bold text-foreground">
        Academix
      </h1>
      <p className="hidden lg:block text-xs text-muted-foreground">
        AI Exam Platform
      </p>
    </div>
  </Link>
</div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isCurrent =
              location.pathname === item.href ||
              (item.href.includes("dashboard") && location.pathname.includes("dashboard"));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isCurrent
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to={isTeacher ? "/teacher/generate-exam" : "/student/generate-exam/ai-generate"}
            className="w-full bg-gradient-to-r from-orange-600 to-sky-500 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            {isTeacher ? "Create New Exam" : "AI Study Plan"}
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Header role={isTeacher ? "teacher" : "student"} title={title} />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0 px-4 md:px-8">
          {children}
        </div>

        {showMoreMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs md:hidden"
              onClick={() => setShowMoreMenu(false)}
            />
            <div className="fixed bottom-20 right-4 left-4 md:hidden bg-surface border border-border rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-200">
              <div className="text-xs font-bold text-muted-foreground px-2 uppercase tracking-wider">
                More Options
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreItems.map(({ href, icon: Icon, label }) => {
                  const isActive = location.pathname === href || location.pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setShowMoreMenu(false)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl gap-1.5 transition-all ${
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-bold">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-surface border-t border-border z-50 shadow-[0_-2px_16px_rgba(99,102,241,0.08)]">
          <div className="flex items-end justify-around h-16 px-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = location.pathname === href || location.pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  to={href}
                  className="flex flex-col items-center justify-end pb-2 w-full h-full gap-0.5 transition-all"
                >
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                      isActive ? "bg-primary/20 w-12 h-6" : "w-8 h-6"
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-200 ${
                        isActive ? "w-4 h-4 text-primary" : "w-5 h-5 text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="flex flex-col items-center justify-end pb-2 w-full h-full gap-0.5 transition-all cursor-pointer"
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                  showMoreMenu || moreItems.some(({ href }) => location.pathname === href || location.pathname.startsWith(href + "/"))
                    ? "bg-primary/20 w-12 h-6"
                    : "w-8 h-6"
                }`}
              >
                <MoreHorizontal
                  className={`transition-all duration-200 ${
                    showMoreMenu || moreItems.some(({ href }) => location.pathname === href || location.pathname.startsWith(href + "/"))
                      ? "w-4 h-4 text-primary"
                      : "w-5 h-5 text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                  showMoreMenu || moreItems.some(({ href }) => location.pathname === href || location.pathname.startsWith(href + "/"))
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                More
              </span>
            </button>
          </div>
        </nav>
      </div>
      {isTeacher && <CreateGroupModal />}
    </div>
  );
}