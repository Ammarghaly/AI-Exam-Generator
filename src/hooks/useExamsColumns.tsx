import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "../lib/utils";
import { ExamActions } from "../components/teacher-exam-management/ExamActions";
import { useNavigate } from "react-router-dom";

export type Assessment = {
  id: string;
  title: string;
  course: string;
  status: string;
  date: string;
  startDate: string;
  endDate: string;
};

export function useExamsColumns() {
  const navigate = useNavigate();

  const columns: ColumnDef<Assessment>[] = useMemo(
    () => [
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
          let badgeClass = "";
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
    ],
    [navigate]
  );

  return columns;
}
