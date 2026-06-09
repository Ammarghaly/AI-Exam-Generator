import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyExams, downloadExamPDF } from "../../api/exams";
import { DataTable } from "../ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Loader2, Eye } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSearchStore } from "../../stores/use-search-store";
import { useNavigate } from "react-router-dom";

type Assessment = {
  id: string;
  title: string;
  course: string;
  status: string;
  date: string;
  startDate: string;
  endDate: string;
};

function ExamActions({ row, navigate }: { row: any; navigate: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async (showAnswers: boolean) => {
    try {
      setIsDownloading(true);
      setShowMenu(false);
      const blob = await downloadExamPDF(row.original.id, showAnswers);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${row.original.title.replace(/\s+/g, "_")}_Exam.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2 relative">
      <button
        onClick={() => navigate(`/teacher/exam/${row.original.id}/review`)}
        className="text-indigo-600 hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-50 transition-colors"
        title="View/Edit Questions"
      >
        <Eye className="w-5 h-5" />
      </button>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={isDownloading}
          className={cn(
            "p-2 rounded-full transition-colors",
            isDownloading
              ? "text-indigo-400 cursor-not-allowed"
              : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
          )}
          title="Download PDF"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-lg rounded-xl z-50 overflow-hidden text-sm">
            <button
              onClick={() => handleDownload(true)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors border-b border-gray-50"
            >
              <div className="font-semibold mb-0.5">With Answers</div>
              <div className="text-xs text-gray-500">Includes explanations</div>
            </button>
            <button
              onClick={() => handleDownload(false)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors"
            >
              <div className="font-semibold mb-0.5">Questions Only</div>
              <div className="text-xs text-gray-500">For students</div>
            </button>
          </div>
        )}
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
