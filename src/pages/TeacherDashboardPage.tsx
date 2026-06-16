import {
  FileText,
  BarChart3,
  Calendar,
  Loader2,
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/ui/data-table';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { useDashboardColumns } from '../hooks/useDashboardColumns';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';

export default function TeacherDashboardPage() {
  const { columns } = useDashboardColumns();
  const { data, growthStats, totalExams, upcomingExams, isLoading } = useTeacherDashboard();

  const totalExamsDisplay = isLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-indigo-700 inline" />
  ) : (
    totalExams
  );

  const upcomingExamsDisplay = isLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-indigo-700 inline" />
  ) : (
    upcomingExams
  );

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
              value={totalExamsDisplay}
              icon={FileText}
              iconClassName="bg-indigo-50 text-indigo-700"
              badgeText={growthStats.badgeText}
              badgeClassName={growthStats.badgeClassName}
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
              value={upcomingExamsDisplay}
              icon={Calendar}
              iconClassName="bg-orange-50 text-orange-700"
              badgeText="Next 7 Days"
              badgeClassName="bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-700"
              bgShapeClassName="bg-orange-100/40"
            />
          </div>

          {/* Recent Exams Section */}
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(30,64,175,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Recent Exam Generations</h3>
            </div>
            <div className="p-0 overflow-x-auto min-h-[150px] flex flex-col justify-center">
              {isLoading ? (
                <div className="flex items-center justify-center p-8 gap-2 text-gray-500 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span>Loading recent generations...</span>
                </div>
              ) : data.length === 0 ? (
                <div className="text-center p-8 text-gray-400 font-medium">
                  No exams generated yet. Start by generating one!
                </div>
              ) : (
                <DataTable columns={columns} data={data} />
              )}
            </div>
          </div>
        </div>
      </main>
    </TeacherLayout>
  );
}