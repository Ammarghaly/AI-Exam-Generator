import React, { useMemo } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  History,
  Search,
  Bell,
  Settings,
  ArrowRight,
  FileText,
  MoreVertical,
  LogOut,
  BarChart3,
  Calendar,
  School,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '../lib/utils';

const sidebarNavigation = [
  { name: 'Dashboard', href: '#', icon: LayoutDashboard, current: true },
  { name: 'Generate Exam', href: '#', icon: Sparkles, current: false },
  { name: 'My Groups', href: '#', icon: Users, current: false },
  { name: 'History', href: '#', icon: History, current: false },
];

type Generation = {
  id: number;
  title: string;
  timeAgo: string;
  subject: string;
  difficulty: 'Hard' | 'Medium' | 'Varied';
  status: 'Ready for Review' | 'Draft' | 'AI Optimizing...';
};

const recentGenerationsData: Generation[] = [
  { id: 1, title: 'Midterm Assessment v2', timeAgo: 'Generated 2 hrs ago', subject: 'Advanced Calculus', difficulty: 'Hard', status: 'Ready for Review' },
  { id: 2, title: 'Weekly Quiz 04', timeAgo: 'Generated yesterday', subject: 'Intro to Physics', difficulty: 'Medium', status: 'Draft' },
  { id: 3, title: 'Final Exam - Section B', timeAgo: 'Generated 3 days ago', subject: 'Computer Science 101', difficulty: 'Varied', status: 'AI Optimizing...' },
];

const columns: ColumnDef<Generation>[] = [
  {
    accessorKey: 'title',
    header: 'Exam Title',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.original.title}</span>
        <span className="text-xs text-gray-500 mt-0.5">{row.original.timeAgo}</span>
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.subject}</span>,
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => {
      const diff = row.original.difficulty;
      let badgeClass = '';
      if (diff === 'Hard') badgeClass = 'bg-rose-100 text-rose-800';
      else if (diff === 'Medium') badgeClass = 'bg-indigo-100 text-indigo-800';
      else if (diff === 'Varied') badgeClass = 'bg-sky-100 text-sky-800';
      return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", badgeClass)}>
          {diff}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === 'Ready for Review') {
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            <span className="text-sm text-gray-700">{status}</span>
          </div>
        );
      } else if (status === 'Draft') {
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-700">{status}</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Sparkles className="w-4 h-4 animate-pulse text-orange-600" />
            <span className="text-sm italic text-orange-600">{status}</span>
          </div>
        );
      }
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right w-full">Actions</div>,
    cell: () => (
      <div className="flex justify-end">
        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    )
  }
];

export default function TeacherDashboardPage() {
  const data = useMemo(() => recentGenerationsData, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex z-20">
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
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${item.current
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${item.current ? 'text-indigo-700' : 'text-gray-400'}`} />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full bg-gradient-to-r from-orange-600 to-sky-500 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <Sparkles className="w-5 h-5" />
            Create New Exam
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-10">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="md:hidden text-lg font-extrabold text-indigo-700 truncate">
            EduGenius AI
          </div>

          {/* Navigation Links (Web) */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <a className="h-full flex items-center text-indigo-700 font-bold border-b-2 border-indigo-700 text-sm" href="#">
              Dashboard
            </a>
            <a className="h-full flex items-center text-gray-500 hover:text-indigo-700 transition-colors text-sm font-semibold" href="#">
              Exams
            </a>
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
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Welcome Section */}
            <div>
              <h2 className="text-4xl md:text-[40px] font-bold text-gray-900 tracking-tight mb-2">Welcome back, Professor</h2>
              <p className="text-lg text-gray-500">Here is an overview of your academic activities for this semester.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Exams Generated"
                value="142"
                icon={FileText}
                iconClassName="bg-indigo-50 text-indigo-700"
                badgeText="+12% this month"
                badgeClassName="bg-indigo-100 text-indigo-800"
                bgShapeClassName="bg-indigo-100/40"
              />
              <StatsCard
                title="Average Cohort Score"
                value={<>76.4<span className="text-xl text-gray-500 ml-1">%</span></>}
                icon={BarChart3}
                iconClassName="bg-sky-50 text-sky-700"
                badgeText="Stable"
                badgeClassName="bg-sky-100 text-sky-800"
                bgShapeClassName="bg-sky-100/40"
              />
              <StatsCard
                title="Upcoming Scheduled Exams"
                value="04"
                icon={Calendar}
                iconClassName="bg-orange-50 text-orange-700"
                badgeText="Next 7 Days"
                badgeClassName="bg-gray-100 text-gray-700"
                bgShapeClassName="bg-orange-100/40"
              />
            </div>

            {/* Recent Exams Section */}
            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(30,64,175,0.03)] border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Recent Exam Generations</h3>
                <button className="text-sm font-bold text-indigo-700 hover:text-indigo-800 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="p-0">
                <DataTable columns={columns} data={data} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

