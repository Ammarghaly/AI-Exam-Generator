import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyExams, downloadExamPDF, updateExamStatus } from "../../api/exams";
import { DataTable } from "../ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Eye, MoreVertical, CheckCircle, Download } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSearchStore } from "../../stores/use-search-store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FloatingDropdown } from "../ui/FloatingDropdown";

type Assessment = {
  id: string;
  title: string;
  course: string;
  status: string;
  date: string;
  startDate: string;
  endDate: string;
};

const STATUS_OPTIONS = ["Active", "Closed", "Hidden"] as const;

function ExamActions({ row, navigate }: { row: any; navigate: any }) {
  const queryClient = useQueryClient();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const downloadBtnRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

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
        <FloatingDropdown triggerRef={statusBtnRef} open={showStatusMenu} width={176}>
          <div ref={statusRef}>
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
              Change Status
            </div>
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => handleStatusChange(s)}
                className={cn(
                  "w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-700",
                  row.original.status === s && "bg-indigo-50 text-indigo-700 font-semibold"
                )}>
                <CheckCircle className={cn("w-4 h-4 flex-shrink-0", row.original.status === s ? "opacity-100 text-indigo-600" : "opacity-0")} />
                {s}
              </button>
            ))}
          </div>
        </FloatingDropdown>
      </div>
    </div>
  );
}

export function ExamsTable() {
  const navigate = useNavigate();
  const searchQuery = useSearchStore((state) => state.searchQuery);

  const columns: ColumnDef<Assessment>[] = [
    {
      accessorKey: "title",
      header: "EXAM TITLE",
      cell: ({ row }) => (
        <span className="font-bold text-gray-900">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "groupID",
      header: "GROUP",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-500">
          {row.original.course}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.original.status || "";
        let badgeClass= "";
        const displayStatus = status.toUpperCase();

        if (displayStatus === "READY" || displayStatus === "ACTIVE")
          badgeClass = "bg-emerald-100 text-emerald-700";
        else if (displayStatus === "OUT FOR REVIEW")
          badgeClass = "bg-orange-100 text-orange-700";
        else if (displayStatus === "PUBLISHED")
          badgeClass = "bg-blue-100 text-blue-700";
        else if (displayStatus === "DRAFT" || displayStatus === "HIDDEN")
          badgeClass = "bg-gray-100 text-gray-600";
        else if (displayStatus === "CLOSED")
          badgeClass = "bg-rose-100 text-rose-700";
        else badgeClass = "bg-gray-100 text-gray-600";

        return (
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase",
              badgeClass,
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "CREATION DATE",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-500">
          {row.original.date}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "START DATE",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-500">
          {row.original.startDate}
        </span>
      ),
    },
    {
      accessorKey: "endDate",
      header: "END DATE",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-500">
          {row.original.endDate}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right w-full font-bold text-gray-400 text-xs tracking-wider">
          ACTIONS
        </div>
      ),
      cell: ({ row }) => <ExamActions row={row} navigate={navigate} />,
    },
  ];

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myExams"],
    queryFn: getMyExams,
  });

  const assessmentsData = useMemo(() => {
    if (!response?.data) return [];
    const mapped = response.data.map((exam: any) => {
      let formattedDate = "N/A";
      if (exam.createdAt) {
        formattedDate = new Date(exam.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      let formattedStartDate = "N/A";
      if (exam.openingAt) {
        const startMs =
          exam.openingAt < 9999999999 ? exam.openingAt * 1000 : exam.openingAt;
        formattedStartDate = new Date(startMs).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      let formattedEndDate = "N/A";
      if (exam.closingAt) {
        const endMs =
          exam.closingAt < 9999999999 ? exam.closingAt * 1000 : exam.closingAt;
        formattedEndDate = new Date(endMs).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return {
        id: exam._id,
        title: exam.title,
        course: exam.groupID?.groupName || exam.groupID?.subject || "N/A",
        status: exam.status || "Active",
        date: formattedDate,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    });

    return mapped.filter(
      (exam: any) =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.course.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [response, searchQuery]);

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[200px]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-extrabold text-gray-900">
          Recent Generations
        </h3>
      </div>

      <div className="flex-1 p-0 flex flex-col p-3">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 gap-2 text-gray-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Loading exams...</span>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-rose-600 font-medium">
            Failed to load exams from backend.
          </div>
        ) : assessmentsData.length === 0 ? (
          <div className="text-center p-8 text-gray-400 font-medium">
            No exams found. Start by generating or creating one manually!
          </div>
        ) : (
          <DataTable columns={columns} data={assessmentsData} />
        )}
      </div>
    </div>
  );
}
