import { useMemo } from 'react';
import {
  FileText,
  Percent,
  Calendar,
  Download,
  Search,
  Plus
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '../lib/utils';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { Link } from 'react-router-dom';

// Mock Data
type Assessment = {
  id: string;
  title: string;
  course: string;
  status: 'READY' | 'OUT FOR REVIEW' | 'PUBLISHED' | 'DRAFT';
  date: string;
};

const assessmentsData: Assessment[] = [
  { id: '1', title: 'Intro to Quantum Theory', course: 'PHY-101', status: 'READY', date: 'Oct 28, 2023' },
  { id: '2', title: 'Advanced Fluid Dynamics', course: 'MECH-425', status: 'OUT FOR REVIEW', date: 'Oct 28, 2023' },
  { id: '3', title: 'Ethics in AI - Final', course: 'PHIL-220', status: 'PUBLISHED', date: 'Oct 28, 2023' },
  { id: '4', title: 'Macroeconomics Quiz 3', course: 'ECON-102', status: 'DRAFT', date: 'Nov 01, 2023' },
];

const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'title',
    header: 'EXAM TITLE',
    cell: ({ row }) => (
      <span className="font-bold text-gray-900">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'course',
    header: 'COURSE',
    cell: ({ row }) => <span className="text-sm font-semibold text-gray-500">{row.original.course}</span>,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeClass = '';
      if (status === 'READY') badgeClass = 'bg-emerald-100 text-emerald-700';
      else if (status === 'OUT FOR REVIEW') badgeClass = 'bg-orange-100 text-orange-700';
      else if (status === 'PUBLISHED') badgeClass = 'bg-blue-100 text-blue-700';
      else if (status === 'DRAFT') badgeClass = 'bg-gray-100 text-gray-600';

      return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase", badgeClass)}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'DATE',
    cell: ({ row }) => <span className="text-sm font-semibold text-gray-500">{row.original.date}</span>,
  },
  {
    id: 'actions',
    header: () => <div className="text-right w-full font-bold text-gray-400 text-xs tracking-wider">ACTIONS</div>,
    cell: () => (
      <div className="flex justify-end">
        <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>
    )
  }
];

export default function TeacherExamManagementPage() {
  const data = useMemo(() => assessmentsData, []);

  return (
    <TeacherLayout>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, Professor</h2>
              <p className="text-gray-500 mt-2 font-medium">Here is an overview of your academic performance and active assessments for the Spring 2024 semester.</p>
            </div>

            <div className="relative w-full md:w-64 hidden md:block mt-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assessments..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm shadow-sm"
              />
            </div>
          </div>

          {/* StatsCards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="TOTAL EXAMS"
              value="124"
              icon={FileText}
              iconClassName="bg-indigo-50 text-indigo-600"
              bgShapeClassName="bg-indigo-50/80"
            />
            <StatsCard
              title="AVG. SCORE"
              value={<>82<span className="text-2xl text-gray-900 ml-0.5">%</span></>}
              icon={Percent}
              iconClassName="bg-emerald-50 text-emerald-600"
              bgShapeClassName="bg-emerald-50/80"
            />
            <StatsCard
              title="UPCOMING"
              value="03"
              icon={Calendar}
              iconClassName="bg-orange-50 text-orange-600"
              bgShapeClassName="bg-orange-50/80"
            />
          </div>

          {/* AI Banner */}
          <div className="bg-indigo-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-600/20">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Ready for a new assessment?</h3>
              <p className="text-indigo-100 font-medium leading-relaxed">Leverage our AI engine to generate high-quality exam questions based on your lecture notes and course curriculum in seconds.</p>
            </div>
            <Link to="/teacher/generate-exam" className="whitespace-nowrap bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Exam
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Class Performance Trends */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h3 className="text-lg font-extrabold text-gray-900 mb-8">Class Performance Trends</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502" strokeDashoffset="125" className="text-indigo-600" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-extrabold text-indigo-600">A-</span>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Class Mean</span>
                  </div>
                </div>
                <div className="flex gap-4 w-full">
                  <div className="flex-1 bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 text-center">
                    <div className="text-emerald-700 font-extrabold text-lg">+4.2%</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-wider">vs Last Term</div>
                  </div>
                  <div className="flex-1 bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 text-center">
                    <div className="text-blue-700 font-extrabold text-lg">92%</div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-wider">Participation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Generations Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-extrabold text-gray-900">Recent Generations</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  View All Assessments
                </button>
              </div>
              <div className="flex-1 overflow-x-auto p-0">
                <DataTable columns={columns} data={data} />
              </div>
            </div>
          </div>

          {/* Active Courses Grid */}
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-6">Active Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Quantum Mechanics', assessments: '4 Active Assessments', students: '32 Students', color: 'from-blue-600/30 to-indigo-600/30' },
                { title: 'Macroeconomics 101', assessments: '2 Active Assessments', students: '48 Students', color: 'from-emerald-600/30 to-teal-600/30' },
                { title: 'Intro to AI Ethics', assessments: '1 Active Assessment', students: '25 Students', color: 'from-purple-600/30 to-pink-600/30' },
                { title: 'UX Design Principles', assessments: '3 Active Assessments', students: '18 Students', color: 'from-orange-600/30 to-rose-600/30' },
              ].map((course, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer">
                  <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${course.color} mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                    {/* Placeholder for the aesthetic images like digital servers, globes, etc. */}
                    <div className="w-16 h-16 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-500 bg-white/5 backdrop-blur-sm shadow-inner"></div>
                  </div>
                  <div className="p-5 relative">
                    <div className="absolute -top-6 left-5">
                      <span className="bg-white/95 backdrop-blur-md shadow-sm text-gray-900 text-[11px] font-bold px-3 py-1.5 rounded-full border border-gray-100/80">
                        {course.students}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-gray-900 mt-2">{course.title}</h4>
                    <p className="text-sm font-medium text-gray-500 mt-1">{course.assessments}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </TeacherLayout>
  );
}
