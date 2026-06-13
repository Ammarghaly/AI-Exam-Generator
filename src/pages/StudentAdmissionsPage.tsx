import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Clock, Ban } from "lucide-react";

import {
  getPendingRequests,
  getRejectedRequests,
  acceptStudent,
  rejectStudent,
  reAcceptStudent,
} from "../api/admissions";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import { PendingTable } from "../components/admissions/PendingTable";
import { RejectedTable } from "../components/admissions/RejectedTable";

export default function StudentAdmissionsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "rejected">("pending");

  // Fetch Pending Requests
  const {
    data: pending = [],
    isLoading: pendingLoading,
    error: pendingError,
  } = useQuery({
    queryKey: ["admissions", "pending"],
    queryFn: getPendingRequests,
  });

  // Fetch Rejected Requests
  const {
    data: rejected = [],
    isLoading: rejectedLoading,
    error: rejectedError,
  } = useQuery({
    queryKey: ["admissions", "rejected"],
    queryFn: getRejectedRequests,
  });

  // Accept Mutation
  const { mutate: accept, isPending: accepting } = useMutation({
    mutationFn: (studentId: string) => acceptStudent(studentId),
    onSuccess: () => {
      toast.success("Student accepted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: () => toast.error("Failed to accept student."),
  });

  // Reject Mutation
  const { mutate: reject, isPending: rejecting } = useMutation({
    mutationFn: (studentId: string) => rejectStudent(studentId),
    onSuccess: () => {
      toast.success("Student rejected.");
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: () => toast.error("Failed to reject student."),
  });

  // Re-accept Mutation
  const { mutate: reAccept, isPending: reAccepting } = useMutation({
    mutationFn: ({ groupId, studentId }: { groupId: string; studentId: string }) =>
      reAcceptStudent(groupId, studentId),
    onSuccess: () => {
      toast.success("Student re-accepted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: () => toast.error("Failed to re-accept student."),
  });

  const isMutating = accepting || rejecting || reAccepting;
  const hasError  = activeTab === "pending" ? pendingError  : rejectedError;

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1
            className="font-bold mb-1"
            style={{
              fontSize: "var(--text-h2)",
              color: "var(--color-on-surface)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Student Admissions & Requests
          </h1>
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-muted-foreground)",
            }}
          >
            Manage student join requests, rejected applications, and direct group assignments.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Tabs */}
          <div
            className="flex border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            {/* Pending Tab */}
            <button
              onClick={() => setActiveTab("pending")}
              className="flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 -mb-px transition-colors"
              style={{
                borderBottomColor:
                  activeTab === "pending" ? "var(--color-primary)" : "transparent",
                color:
                  activeTab === "pending"
                    ? "var(--color-primary)"
                    : "var(--color-muted-foreground)",
                fontFamily: "var(--font-primary)",
              }}
            >
              <Clock size={15} />
              Pending Requests
              {pending.length > 0 && (
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-on-primary)",
                  }}
                >
                  {pending.length}
                </span>
              )}
            </button>

            {/* Rejected Tab */}
            <button
              onClick={() => setActiveTab("rejected")}
              className="flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 -mb-px transition-colors"
              style={{
                borderBottomColor:
                  activeTab === "rejected" ? "var(--color-primary)" : "transparent",
                color:
                  activeTab === "rejected"
                    ? "var(--color-primary)"
                    : "var(--color-muted-foreground)",
                fontFamily: "var(--font-primary)",
              }}
            >
              <Ban size={15} />
              Rejected Requests
            </button>
          </div>

          {/* Error State */}
          {hasError && (
            <div
              className="m-6 p-6 rounded-2xl text-center text-sm font-medium"
              style={{
                backgroundColor: "var(--color-surface-container-low)",
                color: "var(--color-error)",
              }}
            >
              Failed to load admissions data. Please try again.
            </div>
          )}

          {/* Table Container */}
          {!hasError && (
            <div>
              {activeTab === "pending" ? (
                <PendingTable
                  pending={pending}
                  isLoading={pendingLoading}
                  isMutating={isMutating}
                  onAccept={accept}
                  onReject={reject}
                />
              ) : (
                <RejectedTable
                  rejected={rejected}
                  isLoading={rejectedLoading}
                  isMutating={isMutating}
                  onReAccept={reAccept}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}