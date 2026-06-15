import api from "./axios";

export interface StudentDashboardStats {
  totalExamsAssigned: number;
  totalCompleted: number;
  overallProgress: number;
  pointsEarned: number;
}

export interface AssignedExam {
  examId: string;
  title: string;
  subject: string;
  teacherName: string;
  durationMinutes: number;
  numOfQuestion: number;
  openingAt: number;
  closingAt: number;
  dueLabel: string;
  isAvailable: boolean;
  status: string;
}

export interface StudentDashboardResponse {
  success: boolean;
  message: string;
  data: {
    studentName: string;
    stats: StudentDashboardStats;
    assignedExams: AssignedExam[];
  };
}

export const getStudentDashboard = async (): Promise<StudentDashboardResponse> => {
  const response = await api.get<StudentDashboardResponse>("/student-dashboard");
  return response.data;
};
