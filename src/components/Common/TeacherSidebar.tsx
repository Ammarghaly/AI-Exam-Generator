import {
  LayoutDashboard,
  Sparkles,
  Users,
  History,
  School,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarNavigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "Generate Exam", href: "/teacher/generate-exam", icon: Sparkles },
  { name: "Manage exams", href: "/teacher/exam-management", icon: FileText },
  { name: "My Groups", href: "/teacher/groups", icon: Users },
  { name: "History", href: "/teacher/history", icon: History },
];

export function TeacherSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex z-20 shrink-0">
      <div className="h-20 flex items-center px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-700 truncate">
              EduGenius AI
            </h1>
            <p className="text-xs font-semibold text-gray-500">
              Academic Excellence
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarNavigation.map((item) => {
          const Icon = item.icon;
          const isCurrent =
            location.pathname === item.href ||
            (item.href === "/teacher-dashboard" &&
              location.pathname === "/teacher-dashboard/");
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
              <Icon
                className={`w-5 h-5 ${isCurrent ? "text-indigo-700" : "text-gray-400"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          to="/teacher/generate-exam"
          className="w-full bg-gradient-to-r from-orange-600 to-sky-500 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <Sparkles className="w-5 h-5" />
          Create New Exam
        </Link>
      </div>
    </aside>
  );
}
