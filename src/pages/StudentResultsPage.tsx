import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { getStudentReport } from "../api/studentReport";
import {
  Award,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Loader2,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function StudentResultsPage() {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["studentReport"],
    queryFn: getStudentReport,
  });

  const reportData = response?.data;
  const cumulativeAverage = reportData?.cumulativeAverage;
  const recentExams = reportData?.recentExams || [];
  const subjectSummary = reportData?.subjectSummary || [];

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

  // Helper to get status colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Pass":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Need Focus":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Fail":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

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
            
            {/* Top Stats Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cumulative Score Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Cumulative Average</h3>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-5xl font-black text-gray-950">{cumulativeAverage?.percentage || 0}%</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-0.5">
                      {cumulativeAverage && cumulativeAverage.trend >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          +{cumulativeAverage.trend}%
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                          <span className="text-rose-500">{cumulativeAverage?.trend}%</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Current Grade</p>
                    <p className="text-lg font-black text-indigo-600 mt-0.5">{cumulativeAverage?.grade || "N/A"}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Total Exams Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Total Attempts</h3>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-5xl font-black text-gray-950">{recentExams.length}</span>
                    <span className="text-sm font-bold text-gray-500">Exams taken</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Status Summary</p>
                    <p className="text-sm font-bold text-gray-700 mt-0.5">Keep pushing for better results!</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider mb-4">Subject Summary</h3>
                <div className="space-y-3 overflow-y-auto max-h-[140px] pr-1">
                  {subjectSummary.map((sub, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{sub.subject}</span>
                        <span className="text-gray-400 text-[10px]">{sub.examsTaken} exam(s)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-950">{sub.avgScore}%</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getStatusStyle(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Exam Attempts List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Exam Attempts</h2>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Exam Details</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date Completed</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Score</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Percentage</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Grade</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentExams.map((attempt) => {
                        const examDate = attempt.date
                          ? new Date(attempt.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Unknown";

                        const isPassed = attempt.percentage >= 60;

                        return (
                          <tr key={attempt.attemptId} className="hover:bg-slate-50/30 transition-colors">
                            {/* Exam Details */}
                            <td className="px-6 py-5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                    {attempt.subject || "Practice"}
                                  </span>
                                </div>
                                <span className="font-bold text-gray-900 leading-snug">{attempt.examTitle || "Untitled Exam"}</span>
                                <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Time spent: {attempt.timeSpentMins} mins
                                </span>
                              </div>
                            </td>

                            {/* Date Completed */}
                            <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {examDate}
                              </div>
                            </td>

                            {/* Score */}
                            <td className="px-6 py-5 text-center">
                              <span className="font-extrabold text-gray-900 text-sm">
                                {attempt.correctCount} / {attempt.totalQuestions}
                              </span>
                            </td>

                            {/* Percentage */}
                            <td className="px-6 py-5 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  isPassed
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {isPassed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                                )}
                                {attempt.percentage}%
                              </span>
                            </td>

                            {/* Grade */}
                            <td className="px-6 py-5 text-center">
                              <span
                                className={`text-sm font-black ${
                                  isPassed ? "text-indigo-600" : "text-rose-500"
                                }`}
                              >
                                {attempt.grade}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5 text-right">
                              <button
                                onClick={() => navigate(`/student/exam-results/${attempt.attemptId}`)}
                                className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all hover:gap-2 cursor-pointer"
                              >
                                Review Questions
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </StudentLayout>
  );
}
