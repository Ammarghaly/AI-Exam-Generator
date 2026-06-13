import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeft, Copy, Users, ClipboardCheck, Plus
} from "lucide-react";

import { getGroupById, removeStudentFromGroup } from "../api/groups";
import type { GroupDetailsStudent, AssignedExam } from "../types/group.types";
import AddStudentModal from "../components/groups/AddStudentModal";
import StudentsTab from "../components/groups/StudentsTab";
import ExamsTab from "../components/groups/ExamsTab";
import GroupPerformanceOverview from "../components/groups/GroupPerformanceOverview";



const examStatusStyles: Record<AssignedExam["status"], string> = {
  Active: "bg-blue-100 text-blue-700",
  Closed: "bg-gray-100 text-gray-500",
  Draft:  "bg-purple-100 text-purple-700",
};

// ── Helper ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#4f46e5", "#7c3aed", "#0d9488", "#0ea5e9", "#16a34a", "#dc2626"];

export function mapToStudentRow(s: GroupDetailsStudent, i: number) {
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
    avatar:      s.avatar,
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
        <StudentsTab
          paginatedStudents={paginatedStudents as any}
          mappedStudentsLength={mappedStudents.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          removeStudent={removeStudent as any}
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