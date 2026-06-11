import React from "react";
import {
  Bell,
  Menu,
  GraduationCap,
  UserPlus,
  FileText,
  BarChart,
  Sun,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { StudentSidebar } from "../Common/StudentSidebar";

export function StudentLayout({ children, title = "Student Dashboard" }: { children: React.ReactNode, title?: string }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <StudentSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-slate-50 flex items-center justify-between px-8 z-10 shrink-0">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 hidden md:block">{title}</h2>
            <div className="md:hidden text-base font-extrabold text-indigo-700 truncate">
              EduGenius AI
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="text-gray-500 hover:text-indigo-700 transition-colors p-2 rounded-full hover:bg-gray-200 relative">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-indigo-700 transition-colors p-2 rounded-full hover:bg-gray-200 relative">
              <Sun className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0 cursor-pointer hover:ring-2 ring-indigo-500 transition-all ml-2">
              <img
                src="https://ui-avatars.com/api/?name=Student&background=random"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
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
              { name: "My Learning", href: "/student/dashboard", icon: GraduationCap },
              { name: "Join Group", href: "/student/join-group", icon: UserPlus },
              { name: "Practice Exams", href: "/student/practice", icon: FileText },
              { name: "Results", href: "/student/results", icon: BarChart },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    location.pathname === item.href
                      ? "bg-indigo-100 text-indigo-700"
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
        <div className="flex-1 overflow-auto pb-20 md:pb-0 px-8">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around h-16 px-2">
            <Link
              to="/student/dashboard"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/student/dashboard"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="w-6 h-6 mb-1" />
              <span>Learning</span>
            </Link>
            <Link
              to="/student/join-group"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/student/join-group"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserPlus className="w-6 h-6 mb-1" />
              <span>Groups</span>
            </Link>
            <Link
              to="/student/practice"
              className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-semibold rounded-lg transition-all ${
                location.pathname === "/student/practice"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-6 h-6 mb-1" />
              <span>Practice</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
