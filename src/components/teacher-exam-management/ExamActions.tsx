import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { downloadExamPDF, updateExamStatus, toggleKeepForever, updateExam, deleteExam } from "../../api/exams";
import { getMyGroups } from "../../api/groups";
import { Loader2, Eye, MoreVertical, CheckCircle, Download, ShieldCheck, Edit, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";
import { FloatingDropdown } from "../ui/FloatingDropdown";
import { useUserStore } from "../../stores/use-user-store";

const STATUS_OPTIONS = ["Active", "Closed", "Hidden"] as const;

export function ExamActions({ row, navigate }: { row: any; navigate: any }) {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isTogglingKeepForever, setIsTogglingKeepForever] = useState(false);
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const downloadBtnRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState(60);
  const [editOpeningAt, setEditOpeningAt] = useState("");
  const [editClosingAt, setEditClosingAt] = useState("");
  const [editGroupId, setEditGroupId] = useState("");
  const [isUpdatingExam, setIsUpdatingExam] = useState(false);
  const [isDeletingExam, setIsDeletingExam] = useState(false);

  const { data: groupsResponse } = useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
  });
  const groupsList = groupsResponse?.data || [];

  const formatEpochToDatetimeLocal = (epoch: number | undefined) => {
    if (!epoch) return "";
    const ms = epoch < 9999999999 ? epoch * 1000 : epoch;
    const date = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const datetimeLocalToEpoch = (val: string) => {
    if (!val) return 0;
    return Math.floor(new Date(val).getTime() / 1000);
  };

  const handleEditClick = () => {
    setEditTitle(row.original.title || "");
    setEditDuration(row.original.durationMinutes || 60);
    setEditOpeningAt(formatEpochToDatetimeLocal(row.original.openingAt));
    setEditClosingAt(formatEpochToDatetimeLocal(row.original.closingAt));
    setEditGroupId(row.original.rawGroupID || "");
    setIsEditModalOpen(true);
    setShowStatusMenu(false);
  };

  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingExam(true);
      await updateExam(row.original.id, {
        title: editTitle,
        durationMinutes: editDuration,
        openingAt: datetimeLocalToEpoch(editOpeningAt),
        closingAt: datetimeLocalToEpoch(editClosingAt),
        groupID: editGroupId || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["myExams"] });
      setIsEditModalOpen(false);
      toast.success("Exam updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Failed to update exam");
    } finally {
      setIsUpdatingExam(false);
    }
  };

  const handleDeleteExam = async () => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      setIsDeletingExam(true);
      setShowStatusMenu(false);
      await deleteExam(row.original.id);
      await queryClient.invalidateQueries({ queryKey: ["myExams"] });
      toast.success("Exam deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Failed to delete exam");
    } finally {
      setIsDeletingExam(false);
    }
  };

  const handleToggleKeepForever = useCallback(async () => {
    try {
      setIsTogglingKeepForever(true);
      setShowStatusMenu(false);
      const res = await toggleKeepForever(row.original.id);
      
      if (res.remainingCredits !== undefined && res.remainingCredits !== null) {
        updateUser({ available_credits: res.remainingCredits });
      }

      await queryClient.invalidateQueries({ queryKey: ["myExams"] });
      toast.success(res.message || "Exam preservation status updated.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Failed to update preservation status.");
    } finally {
      setIsTogglingKeepForever(false);
    }
  }, [row.original.id, queryClient, updateUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const t = event.target as Node;
      if (statusRef.current && !statusRef.current.contains(t) &&
          statusBtnRef.current && !statusBtnRef.current.contains(t)) {
        setShowStatusMenu(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(t) &&
          downloadBtnRef.current && !downloadBtnRef.current.contains(t)) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = useCallback(async (showAnswers: boolean) => {
    try {
      setIsDownloading(true);
      setShowDownloadMenu(false);
      const blob = await downloadExamPDF(row.original.id, showAnswers);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${row.original.title.replace(/\s+/g, "_")}_Exam.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  }, [row.original.id, row.original.title]);

  const handleStatusChange = useCallback(async (status: "Active" | "Closed" | "Hidden") => {
    if (status === row.original.status) { setShowStatusMenu(false); return; }
    try {
      setIsUpdatingStatus(true);
      setShowStatusMenu(false);
      await updateExamStatus(row.original.id, status);
      await queryClient.invalidateQueries({ queryKey: ["myExams"] });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [row.original.id, row.original.status, queryClient]);

  return (
    <div className="flex justify-end gap-1 items-center">
      {/* View */}
      <button
        onClick={() => navigate(`/teacher/exam/${row.original.id}/review`)}
        className="text-indigo-600 hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-50 transition-colors"
        title="View/Edit Questions"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Download PDF */}
      <div className="relative">
        <button
          ref={downloadBtnRef}
          onClick={() => { setShowDownloadMenu((v) => !v); setShowStatusMenu(false); }}
          disabled={isDownloading}
          className={cn(
            "p-2 rounded-full transition-colors",
            isDownloading ? "text-indigo-400 cursor-not-allowed" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
          )}
          title="Download PDF"
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        </button>
        <FloatingDropdown triggerRef={downloadBtnRef} open={showDownloadMenu} width={192}>
          <div ref={downloadRef}>
            <button onClick={() => handleDownload(true)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors border-b border-gray-50">
              <div className="font-semibold mb-0.5">With Answers</div>
              <div className="text-xs text-gray-500">Includes explanations</div>
            </button>
            <button onClick={() => handleDownload(false)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors">
              <div className="font-semibold mb-0.5">Questions Only</div>
              <div className="text-xs text-gray-500">For students</div>
            </button>
          </div>
        </FloatingDropdown>
      </div>

      {/* Change Status */}
      <div className="relative">
        <button
          ref={statusBtnRef}
          onClick={() => { setShowStatusMenu((v) => !v); setShowDownloadMenu(false); }}
          disabled={isUpdatingStatus}
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          title="Change Status"
        >
          {isUpdatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
        </button>
        <FloatingDropdown triggerRef={statusBtnRef} open={showStatusMenu} width={200}>
          <div ref={statusRef}>
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
              Change Status
            </div>
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => handleStatusChange(s)}
                className={cn(
                  "w-full text-left px-4 py-2 flex items-center gap-2 transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 text-xs",
                  row.original.status === s && "bg-indigo-50 text-indigo-700 font-semibold"
                )}>
                <CheckCircle className={cn("w-3.5 h-3.5 flex-shrink-0", row.original.status === s ? "opacity-100 text-indigo-600" : "opacity-0")} />
                {s}
              </button>
            ))}
            
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
              Preservation
            </div>
            <button
              onClick={handleToggleKeepForever}
              disabled={isTogglingKeepForever}
              className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 text-xs disabled:opacity-50 cursor-pointer"
            >
              {isTogglingKeepForever ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              )}
              {row.original.deletion_at ? "Keep Forever" : "Cancel Keep Forever"}
            </button>

            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
              Manage
            </div>
            <button
              onClick={handleEditClick}
              className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 text-xs cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              Edit Exam Details
            </button>
            <button
              onClick={handleDeleteExam}
              disabled={isDeletingExam}
              className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors text-rose-600 hover:bg-rose-50 text-xs cursor-pointer disabled:opacity-50"
            >
              {isDeletingExam ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 shrink-0" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              )}
              Delete Exam
            </button>
          </div>
        </FloatingDropdown>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEditModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden text-left">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-indigo-700">Edit Exam Details</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors rounded-full p-1 cursor-pointer"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateExam} className="flex flex-col">
              <div className="p-6 flex flex-col gap-4 bg-white">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide" htmlFor="edit-exam-title">
                    Exam Title
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
                    id="edit-exam-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g., Final Exam 2026"
                    type="text"
                    required
                    disabled={isUpdatingExam}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide" htmlFor="edit-exam-duration">
                    Duration (Minutes)
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
                    id="edit-exam-duration"
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    placeholder="e.g., 60"
                    type="number"
                    min={1}
                    required
                    disabled={isUpdatingExam}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide" htmlFor="edit-exam-group">
                    Group (Class)
                  </label>
                  <select
                    className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all"
                    id="edit-exam-group"
                    value={editGroupId}
                    onChange={(e) => setEditGroupId(e.target.value)}
                    disabled={isUpdatingExam}
                  >
                    <option value="">No Group (Unassigned)</option>
                    {groupsList.map((g: any) => (
                      <option key={g._id} value={g._id}>
                        {g.groupName} ({g.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide" htmlFor="edit-exam-opening">
                    Start Date & Time
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
                    id="edit-exam-opening"
                    value={editOpeningAt}
                    onChange={(e) => setEditOpeningAt(e.target.value)}
                    type="datetime-local"
                    required
                    disabled={isUpdatingExam}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide" htmlFor="edit-exam-closing">
                    End Date & Time
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
                    id="edit-exam-closing"
                    value={editClosingAt}
                    onChange={(e) => setEditClosingAt(e.target.value)}
                    type="datetime-local"
                    required
                    disabled={isUpdatingExam}
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdatingExam}
                  className="h-10 px-4 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingExam}
                  className="h-10 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUpdatingExam && (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
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
}
