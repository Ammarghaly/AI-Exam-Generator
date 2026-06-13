import { Award, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getStatusStyle } from "./useStudentResults";

interface Props {
  cumulativeAverage: any;
  recentExams: any[];
  subjectSummary: any[];
}

export function ResultsStatsOverview({ cumulativeAverage, recentExams, subjectSummary }: Props) {
  return (
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
  );
}
