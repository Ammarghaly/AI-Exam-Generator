import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  History,
  Bell,
  School,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sidebarNavigation = [
  { name: 'Dashboard', href: '/teacher-dashboard', icon: LayoutDashboard },
  { name: 'Generate Exam', href: '/teacher/generate-exam', icon: Sparkles },
  { name: 'My Groups', href: '#', icon: Users },
  { name: 'History', href: '#', icon: History },
];

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex z-20 shrink-0">
        <div className="h-20 flex items-center px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-700 truncate">EduGenius AI</h1>
              <p className="text-xs font-semibold text-gray-500">Academic Excellence</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarNavigation.map((item) => {
            const Icon = item.icon;
            const isCurrent = location.pathname === item.href || (item.href === '/teacher-dashboard' && location.pathname === '/teacher-dashboard/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${isCurrent
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'text-indigo-700' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link to="/teacher/generate-exam" className="w-full bg-gradient-to-r from-orange-600 to-sky-500 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <Sparkles className="w-5 h-5" />
            Create New Exam
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-10 shrink-0">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="md:hidden text-lg font-extrabold text-indigo-700 truncate">
            EduGenius AI
          </div>

          {/* Navigation Links (Web) */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <Link to="/teacher-dashboard" className={`h-full flex items-center font-bold text-sm ${location.pathname === '/teacher-dashboard' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:text-indigo-700 transition-colors'}`}>
              Dashboard
            </Link>
            <Link to="/teacher/generate-exam" className={`h-full flex items-center font-bold text-sm ${location.pathname === '/teacher/generate-exam' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:text-indigo-700 transition-colors'}`}>
              Exams
            </Link>
          </nav>

          <div className="flex items-center gap-4 ml-auto">
            <button className="text-gray-500 hover:text-indigo-700 transition-colors p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 cursor-pointer hover:ring-2 ring-indigo-500 transition-all ml-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuClV69JP-p7elXa9NogBaPuSgkuywgg4vHFnxFeyfexJSY-YqigSFPXNC9sfjg9VWKaWIt26dbbUSM1T_qozvoASbhvYrgxA6fBWgUWTc87zyYf6tTTWeJqMXyw_X8b1YAc8znzfvUJsHHYE3sHLhbV4FWOin6Ha6HwL8XLlzGq3FPW4btU0sqbSJNVgH8q78q0mATyn3mltJ87EQHjCk0uWXfPngSlcrUzCnLLojWoqYtrPspFR1LYyiL_e9uG35TjJM2EF_OneZY" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {children}
      </div>
    </div>
  );
}
