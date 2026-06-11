import {
  GraduationCap,
  UserPlus,
  FileText,
  BarChart,
  School,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarNavigation = [
  { name: "My Learning", href: "/student/dashboard", icon: GraduationCap },
  { name: "Join Group", href: "/student/join-group", icon: UserPlus },
  { name: "Practice Exams", href: "/student/practice", icon: FileText },
  { name: "Results", href: "/student/results", icon: BarChart },
];

export function StudentSidebar() {
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
          const isCurrent = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                isCurrent
                  ? "bg-indigo-100 text-indigo-700"
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
        <button
          className="w-full bg-orange-600 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors shadow-sm"
        >
          <Sparkles className="w-5 h-5" />
          AI Study Plan
        </button>
      </div>
    </aside>
  );
}
