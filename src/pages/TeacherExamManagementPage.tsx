import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { PageHeader } from '../components/Common/PageHeader';
import { StatsCards } from '../components/teacher-exam-management/StatsCards';
import { CreateExamBanner } from '../components/teacher-exam-management/CreateExamBanner';
import { ExamsTable } from '../components/teacher-exam-management/ExamsTable';
import { useSearchStore } from '../stores/use-search-store';
import { getMyExams } from '../api/exams';

export default function TeacherExamManagementPage() {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);

  const { data: response } = useQuery({
    queryKey: ['myExams'],
    queryFn: getMyExams,
  });

  const exams = response?.data || [];

  return (
    <TeacherLayout>
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <PageHeader
            title="Welcome back, Professor"
            subtitle="Here is an overview of your academic performance and active assessments for the Spring 2026 semester."
            rightContent={
              <div className="relative w-full md:w-64 hidden md:block mt-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assessments..."
                    value={searchQuery}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpen(true);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm shadow-sm"
                  />
                </div>
                {isOpen && exams.length > 0 && (
                  <div className="absolute right-0 left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 py-1.5">
                    <div className="px-3 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                      Recent Exams
                    </div>
                    {exams
                      .filter((exam: any) =>
                        exam.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 8)
                      .map((exam: any) => (
                        <button
                          key={exam._id}
                          onClick={() => {
                            setSearchQuery(exam.title);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium flex flex-col"
                        >
                          <span className="font-bold">{exam.title}</span>
                          <span className="text-[11px] text-gray-400 mt-0.5">
                            {exam.groupID?.groupName || 'No Group'}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            }
          />

          <StatsCards />

          <CreateExamBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ExamsTable />
          </div>

        </div>
      </main>
    </TeacherLayout>
  );
}
