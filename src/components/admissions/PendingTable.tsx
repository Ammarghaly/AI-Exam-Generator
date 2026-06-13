
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { PendingRequest } from "../../types/admissions.types";
import { EmptyState } from "./EmptyState";
import { getInitials, getAvatarColor, timeAgo } from "./helpers";

interface PendingTableProps {
  pending: PendingRequest[];
  isLoading: boolean;
  isMutating: boolean;
  onAccept: (studentId: string) => void;
  onReject: (studentId: string) => void;
}

export function PendingTable({
  pending,
  isLoading,
  isMutating,
  onAccept,
  onReject,
}: PendingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
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
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm font-medium">Loading requests...</span>
                </div>
              </td>
            </tr>
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
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color.bg} ${color.text}`}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p
                          className="font-semibold text-foreground"
                          style={{
                            fontSize: "var(--text-label)",
                            color: "var(--color-on-surface)",
                          }}
                        >
                          {student.name}
                        </p>
                        <p
                          className="text-muted-foreground"
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
                        onClick={() => onAccept(student._id)}
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
                        onClick={() => onReject(student._id)}
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
      </table>
    </div>
  );
}
