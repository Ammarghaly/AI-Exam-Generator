import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupPlaceholder from "../components/groups/CreateGroupPlaceholder";
import { useSearchStore } from "../stores/use-search-store";
import { useModalStore } from "../stores/use-modal-store";
import { getMyGroups, deleteGroup, updateGroup } from "../api/groups";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { useUserStore } from "../stores/use-user-store";
import { Users } from "lucide-react";
import { getMyExams } from "../api/exams";
import AddExamToGroupModal from "../components/groups/AddExamToGroupModal";
import toast from "react-hot-toast";

export default function MyGroups() {
  const queryClient = useQueryClient();
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const { openModal } = useModalStore();
  const { currentUser } = useUserStore();
  const isStudent = currentUser?.role === "Student";

  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupTitle, setSelectedGroupTitle] = useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
  });

  const handleDeleteGroupClick = (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteMutation.mutate(groupId);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupSubject, setEditGroupSubject] = useState("");

  const updateMutation = useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: { groupName: string; subject: string } }) =>
      updateGroup(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      setIsEditModalOpen(false);
      toast.success("Group updated successfully");
    },
    onError: () => {
      toast.error("Failed to update group");
    },
  });

  const handleEditGroupClick = (groupId: string, groupTitle: string, groupSubject: string) => {
    setEditGroupId(groupId);
    setEditGroupName(groupTitle);
    setEditGroupSubject(groupSubject);
    setIsEditModalOpen(true);
  };

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
      subject: g.subject || "",
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
                onDeleteGroup={handleDeleteGroupClick}
                onEditGroup={handleEditGroupClick}
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

      {/* Edit Group Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-xl">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEditModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-lg border border-outline-variant/30 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-h2 text-h2 text-primary">Edit Group</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editGroupName.trim() || !editGroupSubject.trim()) return;
                updateMutation.mutate({
                  groupId: editGroupId,
                  payload: { groupName: editGroupName, subject: editGroupSubject },
                });
              }}
              className="flex flex-col"
            >
              {/* Form Content */}
              <div className="p-xl flex flex-col gap-lg bg-surface-container-lowest">
                {/* Group Name Field */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label text-label text-on-surface" htmlFor="edit-group-name">
                    Group Name
                  </label>
                  <input
                    className="w-full h-[40px] px-sm bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-primary/20 rounded-lg font-body text-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all"
                    id="edit-group-name"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    placeholder="e.g., Advanced Calculus 101"
                    type="text"
                    required
                    disabled={updateMutation.isPending}
                  />
                </div>

                {/* Subject Field */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label text-label text-on-surface" htmlFor="edit-subject-name">
                    Subject
                  </label>
                  <input
                    className="w-full h-[40px] px-sm bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-primary/20 rounded-lg font-body text-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all"
                    id="edit-subject-name"
                    value={editGroupSubject}
                    onChange={(e) => setEditGroupSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                    type="text"
                    required
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="px-lg py-md border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-sm">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={updateMutation.isPending}
                  className="h-[40px] px-md rounded-lg font-label text-label text-primary border border-outline-variant hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-[40px] px-md rounded-lg font-label text-label text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-xs"
                >
                  {updateMutation.isPending && (
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  )}
                  Save Changes
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
