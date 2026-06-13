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
import { getMyExams } from "../api/exams";
import AddExamToGroupModal from "../components/groups/AddExamToGroupModal";

export default function MyGroups() {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const { openModal } = useModalStore();
  const { currentUser } = useUserStore();
  const isStudent = currentUser?.role === "Student";

  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupTitle, setSelectedGroupTitle] = useState("");

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


  const backendGroups = response?.data || [];

  const styles = [
    { icon: "functions", bg: "bg-primary-fixed-dim", text: "text-primary" },
    { icon: "terminal", bg: "bg-secondary-container", text: "text-on-secondary-container" },
    { icon: "biotech", bg: "bg-tertiary-fixed-dim", text: "text-tertiary" },
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
      <AddExamToGroupModal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        groupId={selectedGroupId}
        groupTitle={selectedGroupTitle}
        exams={exams}
        currentUser={currentUser}
      />
    </div>
  );

  if (isStudent) {
    return <StudentLayout title="My Groups">{content}</StudentLayout>;
  }
  return <TeacherLayout>{content}</TeacherLayout>;
}
