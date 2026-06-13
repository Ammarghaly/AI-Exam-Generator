import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyExams } from "../../api/exams";
import { DataTable } from "../ui/data-table";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSearchStore } from "../../stores/use-search-store";
import { useNavigate } from "react-router-dom";
import { ExamActions } from "./ExamActions";
import { useExamsColumns } from "./useExamsColumns";

export function ExamsTable() {
  const navigate = useNavigate();
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const columns = useExamsColumns();

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
      <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-extrabold text-gray-900">
          Recent Generations
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
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
          <>
            {/* Mobile / Tablet Card View (hidden on lg+) */}
            <div className="lg:hidden divide-y divide-gray-100">
              {assessmentsData.map((exam: any) => {
                const status = exam.status || "";
                const displayStatus = status.toUpperCase();
                let badgeClass = "bg-gray-100 text-gray-600";
                if (displayStatus === "READY" || displayStatus === "ACTIVE") badgeClass = "bg-emerald-100 text-emerald-700";
                else if (displayStatus === "OUT FOR REVIEW") badgeClass = "bg-orange-100 text-orange-700";
                else if (displayStatus === "PUBLISHED") badgeClass = "bg-blue-100 text-blue-700";
                else if (displayStatus === "CLOSED") badgeClass = "bg-rose-100 text-rose-700";
                else if (displayStatus === "HIDDEN") badgeClass = "bg-gray-100 text-gray-500";

                return (
                  <div key={exam.id} className="p-4 flex flex-col gap-2">
                    {/* Title + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-gray-900 text-sm leading-tight flex-1">{exam.title}</span>
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase shrink-0", badgeClass)}>
                        {status}
                      </span>
                    </div>

                    {/* Group + Dates */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                      {exam.course !== "N/A" && (
                        <span>👥 {exam.course}</span>
                      )}
                      {exam.startDate !== "N/A" && (
                        <span>🟢 {exam.startDate}</span>
                      )}
                      {exam.endDate !== "N/A" && (
                        <span>🔴 {exam.endDate}</span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <ExamActions row={{ original: exam }} navigate={navigate} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (hidden below lg) */}
            <div className="hidden lg:block p-3">
              <DataTable columns={columns} data={assessmentsData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
