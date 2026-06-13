import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  User,
  FileText,
  GraduationCap,
  BarChart,
} from "lucide-react";
import { useUserStore } from "../../stores/use-user-store";
import { Header } from "./Header";
import CreateGroupModal from "../groups/CreateGroupModal";
import logoIcon from "../../assets/icon-logo.png";

export function AppLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const location = useLocation();
  const { currentUser } = useUserStore();
  const isTeacher = currentUser?.role?.toLowerCase() === "teacher";

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
        { href: "/student/results", icon: BarChart, label: "Results" },
      ];

  const sidebarItems = isTeacher
    ? [
        { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
        { name: "Generate Exam", href: "/teacher/generate-exam", icon: Sparkles },
        { name: "Manage exams", href: "/teacher/exam-management", icon: FileText },
        { name: "My Groups", href: "/teacher/groups", icon: Users },
        {name: "Porfile", href: "/teacher/profile", icon: User},
      ]
    : [
        { name: "My Learning", href: "/student/dashboard", icon: GraduationCap },
        { name: "Generate Exam", href: "/student/generate-exam/ai-generate", icon: Sparkles },
        { name: "My Groups", href: "/student/groups", icon: Users },
        { name: "Practice Exams", href: "/student/practice", icon: FileText },
        { name: "Results", href: "/student/results", icon: BarChart },
        {name: "Porfile", href: "/teacher/profile", icon: User},
      ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-52 lg:w-64 bg-white border-r border-gray-200 flex-col hidden md:flex z-20 shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
  <Link to="/" className="flex items-center gap-3">
    <img
      src={logoIcon}
      alt="Academix"
      className="h-14 w-14 object-contain"
    />

    <div>
      <h1 className="text-lg font-bold text-slate-900">
        Academix
      </h1>
      <p className="hidden lg:block text-xs text-slate-500">
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
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? "text-indigo-700" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
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

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-100 z-50 shadow-[0_-2px_16px_rgba(99,102,241,0.08)]">
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
                      isActive ? "bg-indigo-100 w-12 h-6" : "w-8 h-6"
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-200 ${
                        isActive ? "w-4 h-4 text-indigo-700" : "w-5 h-5 text-gray-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                      isActive ? "text-indigo-700" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      {isTeacher && <CreateGroupModal />}
    </div>
  );
}