import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { getMyExams, downloadExamPDF, toggleKeepForever } from "../api/exams";
import {
  FileText,
  Clock,
  Sparkles,
  Search,
  ArrowRight,
  Loader2,
  BookOpen,
  MoreVertical,
  ShieldCheck,
} from "lucide-react";
import { useUserStore } from "../stores/use-user-store";
import toast from "react-hot-toast";
import { FloatingDropdown } from "../components/ui/FloatingDropdown";

interface PracticeExamCardActionsProps {
  examId: string;
  examTitle: string;
  deletionAt?: string;
}

function PracticeExamCardActions({ examId, examTitle, deletionAt }: PracticeExamCardActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTogglingKeepForever, setIsTogglingKeepForever] = useState(false);
  const { updateUser } = useUserStore();
  const queryClient = useQueryClient();
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async (showAnswers: boolean) => {
    try {
      setIsDownloading(true);
      setShowMenu(false);
      const blob = await downloadExamPDF(examId, showAnswers);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${examTitle.replace(/\s+/g, "_")}_Exam.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Exam PDF downloaded successfully!");
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleToggleKeepForever = useCallback(async () => {
    try {
      setIsTogglingKeepForever(true);
      setShowMenu(false);
      const res = await toggleKeepForever(examId);
      
      if (res.remainingCredits !== undefined && res.remainingCredits !== null) {
        updateUser({ available_credits: res.remainingCredits });
      }

      await queryClient.invalidateQueries({ queryKey: ["myPracticeExams"] });
      toast.success(res.message || "Exam preservation status updated.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Failed to update preservation status.");
    } finally {
      setIsTogglingKeepForever(false);
    }
  }, [examId, queryClient, updateUser]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setShowMenu((v) => !v)}
        disabled={isDownloading || isTogglingKeepForever}
        className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center"
        title="More Actions"
      >
        {isDownloading || isTogglingKeepForever ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MoreVertical className="w-4 h-4" />
        )}
      </button>

      <FloatingDropdown triggerRef={btnRef} open={showMenu} width={192}>
        <div ref={menuRef} className="py-1">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
            Download PDF
          </div>
          <button
            onClick={() => handleDownload(true)}
            className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors border-b border-gray-50 cursor-pointer"
          >
            <div>
              <div className="font-semibold text-xs mb-0.5">With Answers</div>
              <div className="text-[10px] text-gray-500">Includes explanations</div>
            </div>
          </button>
          <button
            onClick={() => handleDownload(false)}
            className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors cursor-pointer"
          >
            <div>
              <div className="font-semibold text-xs mb-0.5">Questions Only</div>
              <div className="text-[10px] text-gray-500">For students</div>
            </div>
          </button>

          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
            Preservation
          </div>
          <button
            onClick={handleToggleKeepForever}
            disabled={isTogglingKeepForever}
            className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-xs disabled:opacity-50 cursor-pointer"
          >
            {isTogglingKeepForever ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            )}
            {deletionAt ? "Keep Forever" : "Cancel Keep Forever"}
          </button>
        </div>
      </FloatingDropdown>
    </div>
  );
}

interface Exam {
  _id: string;
  title: string;
  numOfQuestion: number;
  durationMinutes: number;
  createdAt: string;
  subject?: string;
  deletion_at?: string;
  groupID?: Array<{
    _id: string;
    groupName: string;
    subject: string;
  }>;
}

export default function StudentPracticeExamsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useUserStore();

  const showDownloadButton = currentUser?.subscription_type && currentUser?.subscription_type !== "free";

  const { data: response, isLoading } = useQuery({
    queryKey: ["myPracticeExams"],
    queryFn: getMyExams,
  });

  const exams: Exam[] = response?.data || [];

  // Filter exams based on search query
  const filteredExams = exams.filter((exam) => {
    const titleMatch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = exam.subject
      ? exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const groupSubjectMatch = exam.groupID?.some((g) =>
      g.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return titleMatch || subjectMatch || groupSubjectMatch;
  });

  if (isLoading) {
    return (
      <StudentLayout title="My Practice Exams">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-gray-500 font-semibold text-sm">Loading your practice exams...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Practice Exams">
      <div className="max-w-7xl mx-auto py-8">
        
        {/* Header and Generate Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Practice Exams</h1>
            <p className="text-sm text-gray-500 mt-1">Practice exams you generated for yourself to boost your learning.</p>
          </div>
          <button
            onClick={() => navigate("/student/generate-exam/ai-generate")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Generate Practice Exam
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search practice exams by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto mt-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No practice exams found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-fit">
              {searchQuery
                ? "We couldn't find any exams matching your search query. Try typing something else!"
                : "You haven't generated any practice exams yet. Let AI generate one tailored to your learning needs."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/student/generate-exam/ai-generate")}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Get Started
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              // Extract subject
              const subject =
                exam.subject ||
                (exam.groupID && exam.groupID.length > 0
                  ? exam.groupID[0].subject
                  : "General Practice");

              // Format date
              const formattedDate = new Date(exam.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={exam._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        {subject}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {exam.title}
                    </h3>

                    <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {exam.durationMinutes} Mins
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        {exam.numOfQuestion} Questions
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 bg-slate-50/50 dark:bg-gray-900 border-t dark:border-gray-50/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600/80">Self-Practice</span>
                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => navigate(`/student/exam/${exam._id}`)}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Start Exam
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {showDownloadButton && (
                        <PracticeExamCardActions 
                          examId={exam._id} 
                          examTitle={exam.title} 
                          deletionAt={exam.deletion_at} 
                        />
                      )}
                     
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
