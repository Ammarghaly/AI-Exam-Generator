import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, UserCheck, Clock, Ban } from "lucide-react";

import {
  getPendingRequests,
  getRejectedRequests,
  acceptStudent,
  rejectStudent,
  reAcceptStudent,
} from "../api/admissions";
import type { PendingRequest, RejectedRequest } from "../types/admissions.types";
import { TeacherLayout } from "../components/Layout/TeacherLayout";

// ── Avatar helpers ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "bg-[var(--color-primary-container)]",   text: "text-[var(--color-on-primary-container)]"   },
  { bg: "bg-[var(--color-secondary-container)]", text: "text-[var(--color-on-secondary-container)]" },
  { bg: "bg-[var(--color-tertiary-container)]",  text: "text-[var(--color-on-tertiary-container)]"  },
  { bg: "bg-[var(--color-muted)]",               text: "text-[var(--color-muted-foreground)]"        },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs  = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (hrs < 1)   return "Just now";
  if (hrs < 24)  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-t" style={{ borderColor: "var(--color-border)" }}>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-6 py-4">
          <div
            className="h-4 rounded-lg animate-pulse"
            style={{
              backgroundColor: "var(--color-surface-container)",
              width: i === 1 ? "60%" : i === 4 ? "40%" : "50%",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function StudentAdmissionsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "rejected">("pending");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const {
    data: pending = [],
    isLoading: pendingLoading,
    error: pendingError,
  } = useQuery({
    queryKey: ["admissions", "pending"],
    queryFn: getPendingRequests,
  });

  const {
    data: rejected = [],
    isLoading: rejectedLoading,
    error: rejectedError,
  } = useQuery({
    queryKey: ["admissions", "rejected"],
    queryFn: getRejectedRequests,
  });

  // ── Accept mutation ────────────────────────────────────────────────────────
  const { mutate: accept, isPending: accepting } = useMutation({
    mutationFn: (studentId: string) => acceptStudent(studentId),
    onSuccess: () => {
      toast.success("Student accepted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: () => toast.error("Failed to accept student."),
  });

  // ── Reject mutation ────────────────────────────────────────────────────────
  const { mutate: reject, isPending: rejecting } = useMutation({
    mutationFn: (studentId: string) => rejectStudent(studentId),
    onSuccess: () => {
      toast.success("Student rejected.");
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
    onError: () => toast.error("Failed to reject student."),
  });

  // ── Re-accept mutation ─────────────────────────────────────────────────────
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
  const isLoading = activeTab === "pending" ? pendingLoading : rejectedLoading;
  const hasError  = activeTab === "pending" ? pendingError  : rejectedError;

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── Page header ───────────────────────────────────────────────────── */}
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

        {/* ── Main card ─────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <div
            className="flex border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            {/* Pending tab */}
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

            {/* Rejected tab */}
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

          {/* ── Error state ───────────────────────────────────────────────── */}
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

          {/* ── Table ─────────────────────────────────────────────────────── */}
          {!hasError && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* ── Pending thead ──────────────────────────────────────────── */}
                {activeTab === "pending" && (
                  <>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        {["Student", "Requested Group", "Date Applied", "Actions"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-6 py-4 font-semibold uppercase tracking-widest"
                            style={{
                              fontSize: "var(--text-small)",
                              color: "var(--color-muted-foreground)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <>
                          <SkeletonRow />
                          <SkeletonRow />
                          <SkeletonRow />
                        </>
                      ) : pending.length === 0 ? (
                        <EmptyState
                          icon={<Clock size={32} />}
                          message="No pending requests right now."
                        />
                      ) : (
                        pending.map((req: PendingRequest) => {
                          const student = req.studentId;
                          const group   = req.groupId;
                          const color   = getAvatarColor(student.name);
                          return (
                            <tr
                              key={`${student._id}-${group._id}`}
                              className="transition-colors"
                              style={{ borderTop: "1px solid var(--color-border)" }}
                              onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLElement).style.backgroundColor =
                                  "var(--color-surface-container-low)")
                              }
                              onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.backgroundColor =
                                  "transparent")
                              }
                            >
                              {/* Student */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color.bg} ${color.text}`}
                                  >
                                    {getInitials(student.name)}
                                  </div>
                                  <div>
                                    <p
                                      className="font-semibold"
                                      style={{
                                        fontSize: "var(--text-label)",
                                        color: "var(--color-on-surface)",
                                      }}
                                    >
                                      {student.name}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "var(--text-small)",
                                        color: "var(--color-muted-foreground)",
                                      }}
                                    >
                                      {student.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Group */}
                              <td className="px-6 py-4">
                                <span
                                  className="px-3 py-1 rounded-full font-medium"
                                  style={{
                                    fontSize: "var(--text-small)",
                                    backgroundColor: "var(--color-surface-container)",
                                    color: "var(--color-on-surface-variant)",
                                  }}
                                >
                                  {group.groupName}
                                </span>
                              </td>

                              {/* Date */}
                              <td
                                className="px-6 py-4"
                                style={{
                                  fontSize: "var(--text-label)",
                                  color: "var(--color-muted-foreground)",
                                }}
                              >
                                {timeAgo(req.requestedAt)}
                              </td>

                              {/* Actions */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {/* Accept */}
                                  <button
                                    disabled={isMutating}
                                    onClick={() => accept(student._id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-40"
                                    style={{ color: "var(--color-chart-2)" }}
                                    title="Accept student"
                                    onMouseEnter={(e) =>
                                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                                        "var(--color-surface-container)")
                                    }
                                    onMouseLeave={(e) =>
                                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                                        "transparent")
                                    }
                                  >
                                    <CheckCircle size={20} />
                                  </button>

                                  {/* Reject */}
                                  <button
                                    disabled={isMutating}
                                    onClick={() => reject(student._id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-40"
                                    style={{ color: "var(--color-error)" }}
                                    title="Reject student"
                                    onMouseEnter={(e) =>
                                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                                        "var(--color-surface-container)")
                                    }
                                    onMouseLeave={(e) =>
                                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                                        "transparent")
                                    }
                                  >
                                    <XCircle size={20} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </>
                )}

                {/* ── Rejected thead ─────────────────────────────────────────── */}
                {activeTab === "rejected" && (
                  <>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        {["Student", "Group", "Rejection Date", "Actions"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-6 py-4 font-semibold uppercase tracking-widest"
                            style={{
                              fontSize: "var(--text-small)",
                              color: "var(--color-muted-foreground)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <>
                          <SkeletonRow />
                          <SkeletonRow />
                          <SkeletonRow />
                        </>
                      ) : rejected.length === 0 ? (
                        <EmptyState
                          icon={<Ban size={32} />}
                          message="No rejected requests."
                        />
                      ) : (
                        rejected.map((req: RejectedRequest) => {
                          const student = req.studentId;
                          const group   = req.groupId;
                          const color   = getAvatarColor(student.name);
                          return (
                            <tr
                              key={`${student._id}-${group._id}`}
                              className="transition-colors"
                              style={{ borderTop: "1px solid var(--color-border)" }}
                              onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLElement).style.backgroundColor =
                                  "var(--color-surface-container-low)")
                              }
                              onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.backgroundColor =
                                  "transparent")
                              }
                            >
                              {/* Student */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color.bg} ${color.text} opacity-60`}
                                  >
                                    {getInitials(student.name)}
                                  </div>
                                  <div>
                                    <p
                                      className="font-semibold"
                                      style={{
                                        fontSize: "var(--text-label)",
                                        color: "var(--color-on-surface-variant)",
                                      }}
                                    >
                                      {student.name}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "var(--text-small)",
                                        color: "var(--color-muted-foreground)",
                                      }}
                                    >
                                      {student.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Group */}
                              <td className="px-6 py-4">
                                <span
                                  className="px-3 py-1 rounded-full font-medium"
                                  style={{
                                    fontSize: "var(--text-small)",
                                    backgroundColor: "var(--color-surface-container)",
                                    color: "var(--color-on-surface-variant)",
                                  }}
                                >
                                  {group.groupName}
                                </span>
                              </td>

                              {/* Date */}
                              <td
                                className="px-6 py-4"
                                style={{
                                  fontSize: "var(--text-label)",
                                  color: "var(--color-muted-foreground)",
                                }}
                              >
                                {timeAgo(req.rejectedAt)}
                              </td>

                              {/* Re-accept */}
                              <td className="px-6 py-4">
                                <button
                                  disabled={isMutating}
                                  onClick={() =>
                                    reAccept({ groupId: group._id, studentId: student._id })
                                  }
                                  className="flex items-center gap-1.5 font-semibold transition-colors disabled:opacity-40"
                                  style={{
                                    fontSize: "var(--text-label)",
                                    color: "var(--color-primary)",
                                    fontFamily: "var(--font-primary)",
                                  }}
                                  onMouseEnter={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color =
                                      "var(--color-primary-container)")
                                  }
                                  onMouseLeave={(e) =>
                                    ((e.currentTarget as HTMLElement).style.color =
                                      "var(--color-primary)")
                                  }
                                >
                                  <UserCheck size={15} />
                                  Accept Student
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}

// ── Empty state helper ────────────────────────────────────────────────────────
function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <tr>
      <td colSpan={4} className="px-6 py-16 text-center">
        <div
          className="flex flex-col items-center gap-3"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          <div style={{ opacity: 0.4 }}>{icon}</div>
          <p style={{ fontSize: "var(--text-body)" }}>{message}</p>
        </div>
      </td>
    </tr>
  );
}