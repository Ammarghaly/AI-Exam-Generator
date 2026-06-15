import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Copy,
  Users,
  ClipboardCheck,
  Plus,
  Clock,
} from "lucide-react";
import { useUserStore } from "../stores/use-user-store";

import { getGroupById, removeStudentFromGroup } from "../api/groups";
import type { AssignedExam } from "../types/group.types";
import { mapToStudentRow } from "../utils/group.helpers";
import AddStudentModal from "../components/groups/AddStudentModal";
import StudentsTab from "../components/groups/StudentsTab";
import ExamsTab from "../components/groups/ExamsTab";
import GroupPerformanceOverview from "../components/groups/GroupPerformanceOverview";


const examStatusStyles: Record<AssignedExam["status"], string> = {
  Active: "bg-blue-100 text-blue-700",
  Closed: "bg-gray-100 text-gray-500",
  Draft: "bg-purple-100 text-purple-700",
};

// ── Helper ────────────────────────────────────────────────────────────────────


const ITEMS_PER_PAGE = 4;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"students" | "exams">("students");
  const [copied, setCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { currentUser } = useUserStore();
  const isStudent = currentUser?.role === "Student";

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groupDetails", id],
    queryFn: () => getGroupById(id!),
    enabled: !!id,
  });

  // ── Remove student ─────────────────────────────────────────────────────────
  const { mutate: removeStudent } = useMutation({
    mutationFn: (studentId: string) => removeStudentFromGroup(id!, studentId),
    onSuccess: () => {
      toast.success("Student removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["groupDetails", id] });
    },
    onError: () => toast.error("Failed to remove student."),
  });

  // ── Copy ───────────────────────────────────────────────────────────────────
  const handleCopy = () => {
    navigator.clipboard.writeText(group?.inviteCode ?? "");
    setCopied(true);
    toast.success("Invite code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const mappedStudents = (group?.students ?? []).map(mapToStudentRow);
  const totalPages = Math.ceil(mappedStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = mappedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !group) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center text-sm font-medium">
        Failed to load group details. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ── Back ──────────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 font-medium mb-5 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to My Groups
      </button>

      {/* ── Header card ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left side */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {group.groupName}
            </h1>
            <p className="text-sm text-gray-400">{group.subject}</p>
            {isStudent && group.teacher && (
              <p className="text-sm font-semibold text-indigo-600 mt-2">
                Teacher: {group.teacher.name}
              </p>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isStudent ? (
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl px-4 py-3 shrink-0">
                <ClipboardCheck size={20} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5">
                    Pending Exams
                  </p>
                  <p
                    className="text-base font-extrabold font-sans"
                    dir="ltr"
                    lang="en"
                  >
                    {group.pendingExamsCount} Upcoming
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Invite code */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shrink-0">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                      Invite Code
                    </p>
                    <p className="text-base font-extrabold text-gray-800 tracking-widest">
                      {group.inviteCode}
                    </p>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-indigo-600 transition-colors ml-2"
                  >
                    {copied ? (
                      <span className="text-green-500 text-xs font-medium">
                        Copied!
                      </span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isStudent ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Assigned Exams</h2>
          <div className="space-y-4">
            {!group.assignedExams || group.assignedExams.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 text-sm font-semibold">
                  No exams assigned to this group yet.
                </p>
              </div>
            ) : (
              group.assignedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-md font-sans"
                          dir="ltr"
                          lang="en"
                        >
                          <Clock className="w-3.5 h-3.5" /> {exam.dueLabel}
                        </span>
                        <span
                          className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md font-sans"
                          dir="ltr"
                          lang="en"
                        >
                          {exam.durationMinutes} Mins • {exam.numOfQuestion}{" "}
                          Questions
                        </span>
                        {exam.isCompleted && (
                          <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                            Completed
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Due date: {exam.dueDate}
                        </p>
                      </div>
                    </div>

                    <div>
                      {exam.isCompleted ? (
                        <button
                          onClick={() =>
                            navigate(`/student/exam-results/${exam.attemptId}`)
                          }
                          className="font-semibold text-sm px-6 py-2.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        >
                          View Results
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (exam.status === "Closed") {
                              toast.error("This exam is closed.");
                            } else if (exam.isAvailable) {
                              navigate(`/student/exam/${exam.id}`);
                            } else {
                              toast.error("This exam is not available yet.");
                            }
                          }}
                          className={`font-semibold text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                            exam.isAvailable || exam.status === "Closed"
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Start Exam{" "}
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ── Tabs ──────────────────────────────────────────────────────────── */}
          <div className="flex gap-0 mb-6 border-b border-gray-200">
            {(["students", "exams"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "students" ? (
                  <Users size={15} />
                ) : (
                  <ClipboardCheck size={15} />
                )}
                {tab === "students" ? "Students List" : "Assigned Exams"}
              </button>
            ))}
          </div>

          {/* ── Students Tab ──────────────────────────────────────────────────── */}
          {activeTab === "students" && (
            <StudentsTab
              paginatedStudents={paginatedStudents}
              mappedStudentsLength={mappedStudents.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              removeStudent={(studentId) => removeStudent(studentId)}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          )}

          {/* ── Exams Tab ─────────────────────────────────────────────────────── */}
          {activeTab === "exams" && (
            <ExamsTab
              assignedExams={group.assignedExams}
              examStatusStyles={examStatusStyles}
            />
          )}

          {/* ── Group Performance Overview ─────────────────────────────────────── */}
          <GroupPerformanceOverview performance={group.performance} />

          {/* Floating New Exam Button */}
          <div className="fixed bottom-8 left-6">
            <button
              onClick={() => navigate("/teacher/generate-exam")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg transition-all"
            >
              <Plus size={16} />
              Create New Exam
            </button>
          </div>
        </>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        groupId={id!}
        groupName={group.groupName}
      />
    </div>
  );
}
