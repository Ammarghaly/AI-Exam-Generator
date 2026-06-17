import api from "./axios";

export interface RecentExam {
  _id: string;
  title: string;
  status: string;
  numOfQuestion: number;
  openingAt: number;
  closingAt: number;
  createdAt: string;
  groupID: any;
  difficulty: string;
}

export interface TeacherDashboardResponse {
  success: boolean;
  message: string;
  data: {
    teacherName: string;
    totalExamsGenerated: number;
    upcomingExamsCount: number;
    recentExams: RecentExam[];
    averageCohortScore: number;
  };
}

export const getTeacherDashboard = async (): Promise<TeacherDashboardResponse> => {
  const response = await api.get<TeacherDashboardResponse>("/dashboard");
  return response.data;
};
