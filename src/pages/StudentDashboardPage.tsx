import { StudentLayout } from "../components/Layout/StudentLayout";
import {
  ClipboardList,
  TrendingUp,
  Star,
  ChevronRight,
  Clock,
  Plus,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "../stores/use-user-store";
import { useState } from "react";
import { joinGroup } from "../api/groups";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/auth";
import { getStudentDashboard } from "../api/studentDashboard";

export default function StudentDashboardPage() {
  const { currentUser, setCurrentUser } = useUserStore();
  const [groupCode, setGroupCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  // Automatically sync profile and credits on load
  useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      try {
        const data = await getMe();
        if (data?.success && data?.user) {
          setCurrentUser(data.user);
        }
        return data;
      } catch (err) {
        console.error("Failed to sync profile:", err);
        return null;
      }
    },
  });

  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: getStudentDashboard,
  });

  const dashboardData = dashboardResponse?.data;
  const stats = dashboardData?.stats;
  const assignedExams = dashboardData?.assignedExams || [];

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      toast.error("Please enter a group code");
      return;
    }
    setIsJoining(true);
    try {
      const response = await joinGroup(groupCode.trim());
      if (response.success) {
        toast.success(response.message || "Join request sent successfully!");
        setGroupCode("");
      } else {
        toast.error(response.message || "Failed to join group");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to join group");
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <StudentLayout title="Student Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Student Dashboard">
      <div className="max-w-7xl mx-auto py-8">
        
        {/* Stats Section */}
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

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Assigned by Teachers */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Assigned by Teachers</h2>
                <p className="text-sm text-gray-500 mt-1">Complete your pending assessments.</p>
              </div>
            </div>

            <div className="space-y-4">
              {assignedExams.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500 text-sm font-semibold">No assigned exams yet.</p>
                </div>
              ) : (
                assignedExams.map((exam) => (
                  <div key={exam.examId} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5" /> {exam.dueLabel}
                          </span>
                          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                            {exam.subject || "No Subject"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{exam.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {exam.teacherName ? `Prof. ${exam.teacherName}` : "AI"} • {exam.durationMinutes} Minutes • {exam.numOfQuestion} Questions
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (exam.isAvailable) {
                            navigate(`/student/exam/${exam.examId}`);
                          } else {
                            toast.error("This exam is not available yet.");
                          }
                        }}
                        disabled={!exam.isAvailable}
                        className={`font-semibold text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                          exam.isAvailable 
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Start Exam <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Quick Join & AI Recommendation */}
          <div className="space-y-6">
            
            {/* Quick Join Card */}
            <div dir="auto" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-5">
                <Plus className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Join</h3>
              <p className="text-sm text-gray-500 mt-1 mb-5">Enter a code provided by your instructor to join a new class.</p>
              
              <div className="space-y-3 relative z-10">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Group Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PHY-101-F23" 
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    disabled={isJoining}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <button 
                  onClick={handleJoinGroup}
                  disabled={isJoining}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isJoining ? "Joining..." : "Join Class"}
                </button>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-gray-900">AI Recommendation</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">
                Based on your recent performance, generating a quick 5-question practice set could boost your understanding.
              </p>
              <button 
                onClick={() => navigate("/student/generate-exam/ai-generate")}
                className="w-full bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 font-semibold text-sm py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Generate Quick Practice
              </button>
            </div>

          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
