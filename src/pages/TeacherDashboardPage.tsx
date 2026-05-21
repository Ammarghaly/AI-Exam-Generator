import { useMemo } from 'react';
import {
  ArrowRight,
  FileText,
  MoreVertical,
  BarChart3,
  Calendar,
  Sparkles
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '../lib/utils';
import { TeacherLayout } from '../components/Layout/TeacherLayout';

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
    <TeacherLayout>
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
    </TeacherLayout>
  );
}

