import { Search } from 'lucide-react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { PageHeader } from '../components/Common/PageHeader';
import { StatsCards } from '../components/teacher-exam-management/StatsCards';
import { CreateExamBanner } from '../components/teacher-exam-management/CreateExamBanner';
import { ExamsTable } from '../components/teacher-exam-management/ExamsTable';
import { ActiveCourses } from '../components/teacher-exam-management/ActiveCourses';

export default function TeacherExamManagementPage() {
  return (
    <TeacherLayout>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <PageHeader
            title="Welcome back, Professor"
            subtitle="Here is an overview of your academic performance and active assessments for the Spring 2024 semester."
            rightContent={
              <div className="relative w-full md:w-64 hidden md:block mt-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm shadow-sm"
                />
              </div>
            }
          />

          <StatsCards />

          <CreateExamBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ExamsTable />
          </div>

          <ActiveCourses />

        </div>
      </main>
    </TeacherLayout>
  );
}
