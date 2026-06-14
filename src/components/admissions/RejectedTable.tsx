
import { Ban, UserCheck, Loader2 } from "lucide-react";
import type { RejectedRequest } from "../../types/admissions.types";
import { EmptyState } from "./EmptyState";
import { getInitials, getAvatarColor, timeAgo } from "./helpers";

interface RejectedTableProps {
  rejected: RejectedRequest[];
  isLoading: boolean;
  isMutating: boolean;
  onReAccept: (params: { groupId: string; studentId: string }) => void;
}

export function RejectedTable({
  rejected,
  isLoading,
  isMutating,
  onReAccept,
}: RejectedTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
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
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm font-medium">Loading requests...</span>
                </div>
              </td>
            </tr>
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
                  className="transition-colors border-t"
                  style={{ borderColor: "var(--color-border)" }}
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
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 opacity-60"
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color.bg} ${color.text} opacity-60`}
                        >
                          {getInitials(student.name)}
                        </div>
                      )}
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
                        onReAccept({ groupId: group._id, studentId: student._id })
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
      </table>
    </div>
  );
}
