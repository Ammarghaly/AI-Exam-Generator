import { useState } from "react";
import { useUserStore } from "../stores/use-user-store";
import { joinGroup } from "../api/groups";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";
import { getStudentDashboard } from "../api/studentDashboard";

export function useStudentDashboard() {
  const { currentUser, setCurrentUser } = useUserStore();
  const [groupCode, setGroupCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

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

  return {
    currentUser,
    groupCode,
    setGroupCode,
    isJoining,
    isLoading,
    stats,
    assignedExams,
    handleJoinGroup,
  };
}
