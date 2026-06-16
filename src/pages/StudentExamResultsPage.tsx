import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StudentLayout } from "../components/Layout/StudentLayout";

import { QuestionAnalysisHeader, type FilterOption } from "../components/student-exam-results/QuestionAnalysisHeader";
import { QuestionAnalysisList } from "../components/student-exam-results/QuestionAnalysisList";
import { type QuestionData } from "../components/student-exam-results/QuestionAnalysisCard";
import { getAttemptResult, downloadExamPDF } from "../api/exams";
import { Loader2, Download } from "lucide-react";
import { useUserStore } from "../stores/use-user-store";
import toast from "react-hot-toast";

export default function StudentExamResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterOption>("all");
  const [isDownloading, setIsDownloading] = useState(false);
  const { currentUser } = useUserStore();

  const { data: resultResponse, isLoading } = useQuery({
    queryKey: ["attemptResult", id],
    queryFn: () => getAttemptResult(id!),
    enabled: !!id,
  });

  const resultData = resultResponse?.data;

  const showDownloadButton = currentUser?.subscription_type && currentUser?.subscription_type !== "free";

  const handleDownloadPDF = async () => {
    const examId = resultData?.exam?.id;
    if (!examId) {
      toast.error("Exam ID not found.");
      return;
    }
    try {
      setIsDownloading(true);
      const blob = await downloadExamPDF(examId, true);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${resultData.exam.title.replace(/\s+/g, "_")}_Exam.pdf`);
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

  const questions: QuestionData[] = useMemo(() => {
    if (!resultData?.answers) return [];
    return resultData.answers.map((q: any, index: number) => ({
      id: `${id}_${index}`,
      number: q.questionNumber || index + 1,
      text: q.question || "",
      tags: q.cognitiveLevel ? [q.cognitiveLevel] : [],
      difficulty: q.difficulty || "Normal",
      type: q.typeQue || "MCQ",
      isCorrect: q.isCorrect,
      correctAnswer: q.correctAnswer || "",
      studentAnswer: q.studentAnswer || "",
      explanation: q.ai_explanation || "",
    }));
  }, [resultData?.answers, id]);

  const filteredQuestions = useMemo(() => {
    if (filter === "correct") return questions.filter(q => q.isCorrect);
    if (filter === "incorrect") return questions.filter(q => !q.isCorrect);
    return questions;
  }, [filter, questions]);

  const counts = useMemo(() => {
    if (!questions.length) return { all: 0, correct: 0, incorrect: 0 };
    const correct = questions.filter(q => q.isCorrect).length;
    const incorrect = questions.length - correct;
    return {
      all: questions.length,
      correct,
      incorrect
    };
  }, [questions]);

  if (isLoading) {
    return (
      <StudentLayout title="Results & Review">
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-semibold text-sm">Fetching your exam results, please wait...</p>
        </div>
      </StudentLayout>
    );
  }

  if (!resultData) {
    return (
      <StudentLayout title="Results & Review">
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-4">
          <h3 className="text-lg font-bold text-gray-950 mb-2">No results found</h3>
          <p className="text-sm text-gray-500 mb-6">We couldn't retrieve the details for this exam attempt.</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2 px-6 rounded-lg transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </StudentLayout>
    );
  }

  const examDate = resultData.exam?.date
    ? new Date(resultData.exam.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const isPractice = resultData.exam?.isPractice;
  const groupName = resultData.exam?.groupName;

  return (
    <StudentLayout title="Results & Review">
      <div className="max-w-5xl mx-auto py-8 px-4">

        {/* Exam Header Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {isPractice && (
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                  ✦ Personal Practice
                </span>
              )}
              {groupName && !isPractice && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                  {groupName}
                </span>
              )}
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
                {resultData.exam?.subject || "General"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">{resultData.exam?.title || "Exam"}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-medium">
              <span>📅 {examDate}</span>
              <span>⏱ {resultData.exam?.durationMinutes || 60} Mins</span>
              <span>📝 {resultData.totalQuestions} Questions</span>
            </div>
            {showDownloadButton && (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="mt-4 flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Export to PDF
              </button>
            )}
          </div>

          {/* Score Circle */}
          <div className="flex flex-col items-center gap-3 min-w-[160px]">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke={resultData.percentage >= 60 ? "#6366f1" : "#f43f5e"}
                  strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(resultData.percentage / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{resultData.percentage}%</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm font-semibold">
              <span className="text-emerald-600">✓ {resultData.correctCount} Correct</span>
              <span className="text-rose-500">✗ {resultData.incorrectCount} Wrong</span>
            </div>
          </div>
        </div>

        {resultData.exam?.allowReview !== false ? (
          <>
            <QuestionAnalysisHeader
              currentFilter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />
            <QuestionAnalysisList questions={filteredQuestions} />
          </>
        ) : (
          <div className="bg-white dark:bg-[#1f2226] rounded-2xl p-8 border border-gray-100 dark:border-white/5 shadow-sm text-center">
            <p className="text-gray-500 dark:text-zinc-400 font-medium">
              Review and correct answers for this exam are disabled by the instructor.
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
