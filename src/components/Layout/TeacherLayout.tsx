import React, { useState, useEffect } from "react";
import {
  Menu,
  LayoutDashboard,
  Sparkles,
  Users,
  History,
  LogOut,
  FileText,
} from "lucide-react";
import img from "../../assets/img.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TeacherSidebar } from "../Common/TeacherSidebar";
import { logout } from "../../api/auth";
import toast from "react-hot-toast";
import CreateGroupModal from "../groups/CreateGroupModal";

import { useUserStore } from "../../stores/use-user-store";

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { currentUser } = useUserStore();

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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <TeacherSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="md:hidden text-base md:text-lg font-extrabold text-indigo-700 truncate">
            EduGenius AI
          </div>

          {/* Navigation Links (Web) */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <Link
              to="/teacher-dashboard"
              className={`h-full flex items-center font-bold text-sm ${location.pathname === "/teacher-dashboard" ? "text-indigo-700 border-b-2 border-indigo-700" : "text-gray-500 hover:text-indigo-700 transition-colors"}`}
            >
              Dashboard
            </Link>
            <Link
              to="/teacher/generate-exam"
              className={`h-full flex items-center font-bold text-sm ${location.pathname === "/teacher/generate-exam" ? "text-indigo-700 border-b-2 border-indigo-700" : "text-gray-500 hover:text-indigo-700 transition-colors"}`}
            >
              Exams
            </Link>
          </nav>

          <div className="flex items-center gap-4 ml-auto">
            <span
              onClick={() => navigate("/teacher/profile")}
              className="hidden md:block text-sm font-medium text-gray-600 cursor-pointer hover:text-indigo-700 transition-colors select-none"
            >
              {currentUser?.name || ""}
            </span>
            {currentUser?.available_credits !== undefined && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                <img src={img} className="w-8 h-8" alt="Bolt" />
                {currentUser.available_credits}
              </span>
            )}
            <div
              onClick={() => navigate("/teacher/profile")}
              className={`w-8 h-8 rounded-full overflow-hidden shrink-0 cursor-pointer transition-all duration-300
                      ${
                        currentUser?.subscription_type !== "free"
                          ? "border-2 border-transparent bg-gradient-to-tr from-yellow-400 via-amber-500 to-gold-600 bg-origin-border hover:from-amber-500 hover:to-yellow-300 hover:scale-105"
                          : "border border-gray-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100"
                      }`}
            >
              <img
                src={
                  currentUser?.avatar ||
                  "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png"
                }
                alt="Profile"
                className={`w-full h-full object-cover `}
              />
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation Drawer */}
        <nav
          className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 md:hidden transition-transform duration-300 overflow-y-auto ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-4 py-6 space-y-2">
            {[
              {
                name: "Dashboard",
                href: "/teacher/dashboard",
                icon: LayoutDashboard,
              },
              {
                name: "Generate Exam",
                href: "/teacher/generate-exam",
                icon: Sparkles,
              },
              {
                name: "Manage exams",
                href: "/teacher/exam-management",
                icon: FileText,
              },
              { name: "My Groups", href: "/teacher/groups", icon: Users },
              { name: "History", href: "/teacher/history", icon: History },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    location.pathname === item.href
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${location.pathname === item.href ? "text-indigo-700" : "text-gray-400"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">{children}</div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around h-16 px-2">
            <Link
              to="/teacher/dashboard"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/teacher/dashboard"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard className="w-6 h-6 mb-1" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/teacher/generate-exam"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/teacher/generate-exam"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Sparkles className="w-6 h-6 mb-1" />
              <span>Generate</span>
            </Link>
            <Link
              to="/teacher/groups"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/teacher/groups"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users className="w-6 h-6 mb-1" />
              <span>Groups</span>
            </Link>
            <Link
              to="/teacher/history"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/teacher/history"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <History className="w-6 h-6 mb-1" />
              <span>History</span>
            </Link>
          </div>
        </nav>
      </div>
      <CreateGroupModal />
    </div>
  );
}
