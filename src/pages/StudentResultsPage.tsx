import { StudentLayout } from "../components/Layout/StudentLayout";
import { Award, Loader2 } from "lucide-react";
import { useStudentResults } from "../hooks/useStudentResults";
import { ResultsStatsOverview } from "../components/student-results/ResultsStatsOverview";
import { ResultsAttemptsTable } from "../components/student-results/ResultsAttemptsTable";

export default function StudentResultsPage() {
  const { navigate, isLoading, cumulativeAverage, recentExams, subjectSummary } = useStudentResults();

  if (isLoading) {
    return (
      <StudentLayout title="My Results">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-gray-500 font-semibold text-sm">Loading your results history...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Results">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Exam Results</h1>
          <p className="text-sm text-gray-500 mt-1">Review your performance, overall grades, and detailed exam analyses.</p>
        </div>

        {recentExams.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto mt-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No completed exams yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-full">
              Your results and performance analysis will appear here once you take and complete an exam.
            </p>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <ResultsStatsOverview
              cumulativeAverage={cumulativeAverage}
              recentExams={recentExams}
              subjectSummary={subjectSummary}
            />
            <ResultsAttemptsTable
              recentExams={recentExams}
              onReview={(attemptId) => navigate(`/student/exam-results/${attemptId}`)}
            />
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
