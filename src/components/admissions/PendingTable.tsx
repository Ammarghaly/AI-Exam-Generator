
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { PendingRequest } from "../../types/admissions.types";
import { EmptyState } from "./EmptyState";
import { getInitials, getAvatarColor, timeAgo } from "./helpers";

interface PendingTableProps {
  pending: PendingRequest[];
  isLoading: boolean;
  isMutating: boolean;
  onAccept: (params: { groupId: string; studentId: string }) => void;
  onReject: (params: { groupId: string; studentId: string }) => void;
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
          <tr className="bg-indigo-100/80 dark:bg-indigo-950/40 border-b-2 border-indigo-200/80 dark:border-indigo-900/50">
            {["Student", "Requested Group", "Date Applied", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left px-6 py-4 font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200"
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
                  className="transition-colors border-t border-gray-100 dark:border-white/5 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/50"
                >
                  {/* Student */}
                  <td className="px-6 py-4 border-l-4 border-l-amber-500/80 dark:border-l-amber-500/60">
                    <div className="flex items-center gap-3">
                      {student.avatar !== "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png" ? (
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color.bg} ${color.text}`}
                        >
                          {getInitials(student.name)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className="font-semibold text-foreground"
                            style={{
                              fontSize: "var(--text-label)",
                              color: "var(--color-on-surface)",
                            }}
                          >
                            {student.name}
                          </p>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
                            Pending
                          </span>
                        </div>
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
                      className="px-3 py-1 rounded-full font-medium border bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/30"
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
                    {timeAgo(req.requestedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      {/* Accept */}
                      <button
                        disabled={isMutating}
                        onClick={() => onAccept({ groupId: group._id, studentId: student._id })}
                        className="h-8 px-3.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                        title="Accept student"
                      >
                        <CheckCircle size={14} />
                        Accept
                      </button>

                      {/* Reject */}
                      <button
                        disabled={isMutating}
                        onClick={() => onReject({ groupId: group._id, studentId: student._id })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/30 transition-all disabled:opacity-40 cursor-pointer"
                        title="Reject student"
                      >
                        <XCircle size={16} />
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
