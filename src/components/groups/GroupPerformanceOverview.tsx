import { TrendingUp, CheckSquare, Sparkles } from "lucide-react";

interface Performance {
  avgPerformance?: number;
  completionRate?: number;
  pendingSubmissions?: number;
  aiRecommendationsCount?: number;
}

interface Props {
  performance?: Performance;
}

export default function GroupPerformanceOverview({ performance }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Group Performance Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Avg Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-indigo-500" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Avg. Performance</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mb-1">{performance?.avgPerformance || 0}%</p>
          <p className="text-xs text-indigo-500 font-medium">Average class score</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <CheckSquare size={16} className="text-indigo-500" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Completion Rate</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mb-1">{performance?.completionRate || 0}%</p>
          <p className="text-xs text-gray-400 font-medium">{performance?.pendingSubmissions || 0} pending submissions</p>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Sparkles size={16} className="text-indigo-500" />
            </div>
            <span className="text-sm text-gray-500 font-medium">AI Recommendations</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mb-1">{performance?.aiRecommendationsCount || 0}</p>
          <p className="text-xs text-indigo-500 font-medium">
            {performance?.aiRecommendationsCount ? "Ready for review" : "No recommendations"}
          </p>
        </div>

      </div>
    </div>
  );
}
