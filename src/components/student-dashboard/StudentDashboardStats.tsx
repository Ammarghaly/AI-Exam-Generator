import { ClipboardList, TrendingUp, Star } from "lucide-react";

export function StudentDashboardStats({ stats, currentUser }: { stats: any, currentUser: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Stat Card 1 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm font-semibold">Total Exams Assigned</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
            {stats?.totalExamsAssigned || 0}
          </h3>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm font-semibold">Overall Progress</p>
          <div className="flex items-end gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-gray-900">
              {stats?.overallProgress || 0}<span className="text-2xl">%</span>
            </h3>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4">
            <div 
              className="bg-cyan-600 h-2 rounded-full" 
              style={{ width: `${stats?.overallProgress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm font-semibold">Credits Available</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
            {currentUser?.available_credits !== undefined ? currentUser.available_credits : "0"}
          </h3>
        </div>
      </div>
    </div>
  );
}
