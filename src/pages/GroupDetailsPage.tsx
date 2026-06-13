import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeft, Copy, Users, ClipboardCheck,
  TrendingUp, CheckSquare, Sparkles, ChevronLeft, ChevronRight, Plus
} from "lucide-react";

import { getGroupById, removeStudentFromGroup } from "../api/groups";
import type { GroupDetailsStudent, AssignedExam } from "../types/group.types";
import AddStudentModal from "../components/groups/AddStudentModal";
import StudentRow from "../components/groups/StudentRow";

// ── Mock exams ────────────────────────────────────────────────────────────────
const mockExams: AssignedExam[] = [
  { id: "1", title: "Chapter 3 – Newton's Laws", dueDate: "Sep 10, 2024", status: "Active",  submissions: 28, totalStudents: 32 },
  { id: "2", title: "Midterm Exam",               dueDate: "Oct 5, 2024",  status: "Active",  submissions: 0,  totalStudents: 32 },
  { id: "3", title: "Chapter 1 Quiz",             dueDate: "Aug 20, 2024", status: "Closed",  submissions: 30, totalStudents: 32 },
];

const examStatusStyles: Record<AssignedExam["status"], string> = {
  Active: "bg-blue-100 text-blue-700",
  Closed: "bg-gray-100 text-gray-500",
  Draft:  "bg-purple-100 text-purple-700",
};

// ── Helper ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#4f46e5", "#7c3aed", "#0d9488", "#0ea5e9", "#16a34a", "#dc2626"];

function mapToStudentRow(s: GroupDetailsStudent, i: number) {
  const name = s?.name || s?.email || "Unknown Student";
  const names = name.trim().split(" ");
  const initials = names.length >= 2
    ? names[0][0] + names[names.length - 1][0]
    : name.slice(0, 2);

  return {
    id:          s._id,
    studentId:   `#${s._id.slice(-8).toUpperCase()}`,
    name:        name,
    initials:    initials.toUpperCase(),
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    joinDate:    s.createdAt
      ? new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—",
    status: "Active" as const,
  };
}

const ITEMS_PER_PAGE = 4;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab]       = useState<"students" | "exams">("students");
  const [copied, setCopied]             = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data: group, isLoading, error } = useQuery({
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
  const totalPages     = Math.ceil(mappedStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = mappedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {group.groupName}
            </h1>
            <p className="text-sm text-gray-400">{group.subject}</p>
          </div>

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
              {copied
                ? <span className="text-green-500 text-xs font-medium">Copied!</span>
                : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

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
            {tab === "students" ? <Users size={15} /> : <ClipboardCheck size={15} />}
            {tab === "students" ? "Students List" : "Assigned Exams"}
          </button>
        ))}
      </div>

      {/* ── Students Tab ──────────────────────────────────────────────────── */}
      {activeTab === "students" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Students List</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
            >
              <Plus size={16} />
              Add Student
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Student Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Student ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Join Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onRemove={(id) => removeStudent(id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No students in this group yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, mappedStudents.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, mappedStudents.length)} of {mappedStudents.length} students
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      {/* ── Exams Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "exams" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Exam Title</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Due Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Submissions</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockExams.map((exam) => (
                <tr key={exam.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{exam.title}</td>
                  <td className="px-6 py-4 text-gray-500">{exam.dueDate}</td>
                  <td className="px-6 py-4 text-gray-500">{exam.submissions} / {exam.totalStudents}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${examStatusStyles[exam.status]}`}>
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Group Performance Overview ─────────────────────────────────────── */}
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
            <p className="text-3xl font-extrabold text-gray-900 mb-1">84%</p>
            <p className="text-xs text-indigo-500 font-medium">+4% from last exam</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CheckSquare size={16} className="text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Completion Rate</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">92%</p>
            <p className="text-xs text-gray-400 font-medium">2 pending submissions</p>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Sparkles size={16} className="text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium">AI Recommendations</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">3</p>
            <p className="text-xs text-indigo-500 font-medium">Ready for review</p>
          </div>

        </div>
      </div>

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