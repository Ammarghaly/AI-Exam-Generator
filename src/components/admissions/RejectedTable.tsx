
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
          <tr className="bg-rose-100/80 dark:bg-rose-950/40 border-b-2 border-rose-200/80 dark:border-rose-900/50">
            {["Student", "Group", "Rejection Date", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left px-6 py-4 font-bold uppercase tracking-wider text-rose-950 dark:text-rose-200"
                style={{
                  fontSize: "var(--text-small)",
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
                  className="transition-all border-t border-gray-100 dark:border-white/5 bg-rose-50/10 dark:bg-rose-950/5 hover:bg-rose-50/40 dark:hover:bg-rose-950/50 opacity-75 hover:opacity-100"
                >
                  {/* Student */}
                  <td className="px-6 py-4 border-l-4 border-l-rose-500/80 dark:border-l-rose-500/60">
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
                        <div className="flex items-center gap-2">
                          <p
                            className="font-semibold"
                            style={{
                              fontSize: "var(--text-label)",
                              color: "var(--color-on-surface-variant)",
                            }}
                          >
                            {student.name}
                          </p>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
                            Rejected
                          </span>
                        </div>
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
                      className="px-3 py-1 rounded-full font-medium border bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/30"
                      style={{
                        fontSize: "var(--text-small)",
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
                      className="flex items-center gap-1.5 font-bold transition-all disabled:opacity-40 cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10"
                      style={{
                        color: "var(--color-primary)",
                        fontFamily: "var(--font-primary)",
                      }}
                    >
                      <UserCheck size={14} />
                      Restore Student
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
