import api from "./axios";

export interface CumulativeAverage {
  percentage: number;
  grade: string;
  trend: number;
}

export interface PerformanceTrendItem {
  month: string;
  avgScore: number;
}

export interface RecentExamAttempt {
  attemptId: string;
  examTitle: string;
  subject: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  timeSpentMins: number;
  grade: string;
}

export interface SubjectSummaryItem {
  subject: string;
  examsTaken: number;
  avgScore: number;
  status: "Excellent" | "Pass" | "Need Focus" | "Fail";
}

export interface StudentReportResponse {
  success: boolean;
  message: string;
  data: {
    performanceTrend: PerformanceTrendItem[];
    cumulativeAverage: CumulativeAverage;
    recentExams: RecentExamAttempt[];
    subjectSummary: SubjectSummaryItem[];
  };
}

export const getStudentReport = async (): Promise<StudentReportResponse> => {
  const response = await api.get<StudentReportResponse>("/student-report");
  return response.data;
};
