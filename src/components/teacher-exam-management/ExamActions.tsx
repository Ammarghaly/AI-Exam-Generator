import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { downloadExamPDF, updateExamStatus, toggleKeepForever } from "../../api/exams";
import { Loader2, Eye, MoreVertical, CheckCircle, Download, ShieldCheck } from "lucide-react";
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
          </div>
        </FloatingDropdown>
      </div>
    </div>
  );
}
