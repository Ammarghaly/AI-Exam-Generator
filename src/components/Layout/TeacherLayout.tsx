import React from "react";
import {
  Bell,
  Menu,
  LayoutDashboard,
  Sparkles,
  Users,
  History,
  LogOut,
  FileText,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TeacherSidebar } from "../Common/TeacherSidebar";
import { logout } from "../../api/auth";
import toast from "react-hot-toast";
import CreateGroupModal from "../groups/CreateGroupModal";

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );

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
            <span className="hidden md:block text-sm font-medium text-gray-600">
              {user?.name || ""}
            </span>
            <button className="text-gray-500 hover:text-indigo-700 transition-colors p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 cursor-pointer hover:ring-2 ring-indigo-500 transition-all">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClV69JP-p7elXa9NogBaPuSgkuywgg4vHFnxFeyfexJSY-YqigSFPXNC9sfjg9VWKaWIt26dbbUSM1T_qozvoASbhvYrgxA6fBWgUWTc87zyYf6tTTWeJqMXyw_X8b1YAc8znzfvUJsHHYE3sHLhbV4FWOin6Ha6HwL8XLlzGq3FPW4btU0sqbSJNVgH8q78q0mATyn3mltJ87EQHjCk0uWXfPngSlcrUzCnLLojWoqYtrPspFR1LYyiL_e9uG35TjJM2EF_OneZY"
                alt="Profile"
                className="w-full h-full object-cover"
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
