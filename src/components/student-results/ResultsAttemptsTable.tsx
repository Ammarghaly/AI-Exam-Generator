import { Calendar, Clock, ChevronRight, CheckCircle2 } from "lucide-react";

interface Props {
  recentExams: any[];
  onReview: (attemptId: string) => void;
}

export function ResultsAttemptsTable({ recentExams, onReview }: Props) {
  return (
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
                  <tr key={attempt.attemptId} className="hover:bg-slate-50/30 dark:hover:bg-muted transition-colors">
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

                    <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {examDate}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="font-extrabold text-gray-900 text-sm">
                        {attempt.correctCount} / {attempt.totalQuestions}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPassed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
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

                    <td className="px-6 py-5 text-center">
                      <span className={`text-sm font-black ${isPassed ? "text-indigo-600" : "text-rose-500"}`}>
                        {attempt.grade}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => onReview(attempt.attemptId)}
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
  );
}
