import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getStudentReport } from "../api/studentReport";

export function getStatusStyle(status: string) {
  switch (status) {
    case "Excellent":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pass":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Need Focus":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Fail":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-100";
  }
}

export function useStudentResults() {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["studentReport"],
    queryFn: getStudentReport,
  });

  const reportData = response?.data;
  const cumulativeAverage = reportData?.cumulativeAverage;
  const recentExams = reportData?.recentExams || [];
  const subjectSummary = reportData?.subjectSummary || [];

  return {
    navigate,
    isLoading,
    cumulativeAverage,
    recentExams,
    subjectSummary,
  };
}
