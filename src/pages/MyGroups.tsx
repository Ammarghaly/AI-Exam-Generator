import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupPlaceholder from "../components/groups/CreateGroupPlaceholder";
import { useSearchStore } from "../stores/use-search-store";
import { useModalStore } from "../stores/use-modal-store";
import { getMyGroups } from "../api/groups";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { useUserStore } from "../stores/use-user-store";
import { Users } from "lucide-react";
import { getMyExams, publishAIExam } from "../api/exams";
import toast from "react-hot-toast";

export default function MyGroups() {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const { openModal } = useModalStore();
  const { currentUser } = useUserStore();
  const isStudent = currentUser?.role === "Student";

  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupTitle, setSelectedGroupTitle] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });

  const { data: examsResponse } = useQuery({
    queryKey: ["myExams"],
    queryFn: getMyExams,
    enabled: !isStudent,
  });
  const exams = examsResponse?.data || [];

  const handleAddExamClick = (groupId: string, groupTitle: string) => {
    setSelectedGroupId(groupId);
    setSelectedGroupTitle(groupTitle);
    setIsAddExamModalOpen(true);
  };

  const handlePublishExamToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) {
      toast.error("Please select an exam");
      return;
    }
    if (!availableFrom) {
      toast.error("Please select an available from date and time");
      return;
    }
    if (!deadline) {
      toast.error("Please select a deadline date and time");
      return;
    }

    const availableDate = new Date(availableFrom);
    const deadlineDate = new Date(deadline);

    if (deadlineDate <= availableDate) {
      toast.error("Deadline must be after the available start date");
      return;
    }

    setIsSubmittingExam(true);
    try {
      const selectedExam = exams.find((ex: any) => ex._id === selectedExamId);
      const payload = {
        examId: selectedExamId,
        examDetails: {
          title: selectedExam?.title || "Exam",
          openingAt: Math.floor(availableDate.getTime() / 1000),
          closingAt: Math.floor(deadlineDate.getTime() / 1000),
          durationMinutes: selectedExam?.durationMinutes || 60,
          accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          status: "Active" as const,
          teacherID: currentUser?._id || "",
        }
      };

      await publishAIExam(selectedGroupId, payload);
      toast.success(`Exam successfully assigned to group "${selectedGroupTitle}"!`);
      setIsAddExamModalOpen(false);
      setSelectedExamId("");
      setAvailableFrom("");
      setDeadline("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to assign exam to group");
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const backendGroups = response?.data || [];

  const styles = [
    { icon: "functions", bg: "bg-primary-fixed-dim", text: "text-primary" },
    { icon: "terminal", bg: "bg-secondary-container", text: "text-on-secondary-container" },
    { icon: "biotech", bg: "bg-tertiary-fixed-dim", text: "text-tertiary" },
    { icon: "history_edu", bg: "bg-primary-fixed-dim", text: "text-primary" },
    { icon: "calculate", bg: "bg-secondary-container", text: "text-on-secondary-container" },
  ];

  const groups = backendGroups.map((g: any, index: number) => {
    const style = styles[index % styles.length];
    return {
      id: g._id,
      title: g.groupName,
      studentsCount: g.students?.length || 0,
      examsCount: 0,
      isActive: true,
      icon: style.icon,
      iconBgClass: style.bg,
      iconTextClass: style.text,
      avatars: [],
      extraAvatarsCount: g.students?.length || 0,
    };
  });

  const filteredGroups = groups.filter((group: any) =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const content = (
    <div className="w-full relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-h1 text-h1 text-on-surface">My Groups</h2>
            <p className="text-on-surface-variant font-body text-body mt-xs">
              {isStudent
                ? "Groups you have joined"
                : "Manage and monitor your active learning communities"}
            </p>
          </div>
          {/* Only teachers can create groups */}
          {!isStudent && (
            <button
              onClick={() => openModal("createGroup")}
              className="hidden md:flex w-full md:w-auto bg-primary text-on-primary px-lg py-md rounded-xl font-h3 text-h3 items-center justify-center md:justify-start gap-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">group_add</span>
              <span>Create New Group</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-xl">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-lg rounded-xl text-center">
            Failed to load groups. Please try again.
          </div>
        ) : filteredGroups.length === 0 && isStudent ? (
          /* Empty state for students who haven't joined any groups */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Groups Yet</h3>
            <p className="text-gray-500 max-w-full leading-relaxed mb-6">
              You haven't joined any group yet. Ask your instructor for an access code and join from your dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredGroups.map((group: any) => (
              <GroupCard
                key={group.id}
                {...group}
                isTeacher={!isStudent}
                onAddExam={handleAddExamClick}
              />
            ))}
            {/* Only teachers see the create placeholder */}
            {!isStudent && (
              <div
                onClick={() => openModal("createGroup")}
                className="cursor-pointer"
              >
                <CreateGroupPlaceholder />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {isAddExamModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-full w-full border border-gray-100 shadow-xl text-left">
            <h3 className="text-xl font-bold text-gray-950 mb-2">Add Exam to {selectedGroupTitle}</h3>
            <p className="text-sm text-gray-500 mb-6">Select one of your exams and specify the release and deadline times.</p>
            
            <form onSubmit={handlePublishExamToGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Select Exam</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose an exam...</option>
                  {exams.map((ex: any) => (
                    <option key={ex._id} value={ex._id}>{ex.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Available From</label>
                <input
                  type="datetime-local"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddExamModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExam}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingExam ? "Assigning..." : "Add to Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  if (isStudent) {
    return <StudentLayout title="My Groups">{content}</StudentLayout>;
  }
  return <TeacherLayout>{content}</TeacherLayout>;
}
