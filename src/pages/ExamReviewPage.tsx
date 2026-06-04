import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import { Breadcrumb } from "../components/Common/Breadcrumb";
import { PageHeader } from "../components/Common/PageHeader";
import { Modal } from "../components/Common/Modal";
import { ClipboardList, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { getQuestionsByExamId, deleteQuestion } from "../api/exams";
import toast from "react-hot-toast";
import { ReviewQuestionCard } from "../components/review-exam/ReviewQuestionCard";
import type { ExamQuestion } from "../types/exam";

export default function ExamReviewPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchQuestions = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getQuestionsByExamId(id);
      if (res.data) {
        setQuestions(res.data);
      } else {
        setError(res.message || "Failed to load questions");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching questions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!examId) return;

    void Promise.resolve().then(() => {
      fetchQuestions(examId);
    });
  }, [examId]);

  const handleDeleteRequest = (questionId: string) => {
    setDeleteTargetId(questionId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteQuestion(deleteTargetId);
      setQuestions((prev) => prev.filter((q) => q._id !== deleteTargetId));
      toast.success("Question deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete question");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleUpdate = (updatedQuestion: ExamQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
    );
  };

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/teacher/dashboard" },
            { label: "Exam Management", href: "/teacher/exam-management" },
            { label: "Review Questions" },
          ]}
        />

        <PageHeader
          title="Review & Edit Questions"
          subtitle="View and manage the questions generated for your exam."
          badge={{ icon: ClipboardList, text: `${questions.length} Questions` }}
          rightContent={
            <button
              onClick={() => navigate("/teacher/exam-management")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Exams
            </button>
          }
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-10 h-10" />
            <p className="font-bold text-center">{error}</p>
            <button
              onClick={() => fetchQuestions(examId!)}
              className="mt-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                No questions found
              </h3>
              <p className="text-gray-500">
                This exam currently has no questions.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <ReviewQuestionCard
                key={question._id}
                question={question}
                index={index}
                onDelete={handleDeleteRequest}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        primaryActionText="Delete"
        primaryActionOnClick={handleDeleteConfirm}
        primaryActionColor="rose"
        secondaryActionText="Cancel"
      />
    </TeacherLayout>
  );
}
