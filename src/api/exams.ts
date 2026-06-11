import api from "./axios";

export interface UploadPDFResponse {
  success: boolean;
  message: string;
  examId: string;
  chunksCount: number;
}

export interface DifficultyRule {
  count: number;
  difficulty: "Easy" | "Normal" | "Hard";
  measures: "Memorization" | "Creativity" | "Thinking";
}

export interface GenerateExamPayload {
  examId: string;
  totalQuestions: number;
  mcqCount: number;
  difficulty: DifficultyRule[];
}

export interface ManualExamDetails {
  title: string;
  openingAt: number;
  closingAt: number;
  durationMinutes: number;
  accessCode: string;
  status: "Active" | "Closed" | "Hidden";
  teacherID: string;
}

export interface ManualQuestion {
  title: string;
  options: string[];
  correctAnswer: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Manual";
  cognitiveLevel: "Memorization" | "Creativity" | "Thinking" | "Manual";
  typeQue: "MCQ" | "TF";
}

export interface GenerateExamManuallyPayload {
  examDetails: ManualExamDetails;
  questions: ManualQuestion[];
}

export const uploadPDF = async (file: File): Promise<UploadPDFResponse> => {
  const formData = new FormData();
  formData.append("pdfFile", file);
  const response = await api.post<UploadPDFResponse>("/exam/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const generateExamAI = async (payload: GenerateExamPayload) => {
  const response = await api.post("/exam/generate", payload);
  return response.data;
};

export const generateExamManually = async (
  groupId: string,
  payload: GenerateExamManuallyPayload,
) => {
  const response = await api.post(
    `/exam/generate-manually?groupId=${groupId}`,
    payload,
  );
  return response.data;
};

export interface PublishAIExamPayload {
  examId: string;
  examDetails: ManualExamDetails;
}

export const publishAIExam = async (
  groupId: string,
  payload: PublishAIExamPayload,
) => {
  const response = await api.post(
    `/exam/publish-ai?groupId=${groupId}`,
    payload,
  );
  return response.data;
};

export const getMyExams = async () => {
  const response = await api.get("/exam/myExams");
  return response.data;
};

export const updateExamStatus = async (examId: string, status: "Active" | "Closed" | "Hidden") => {
  const response = await api.patch(`/exam/${examId}/status`, { status });
  return response.data;
};

export const getQuestionsByExamId = async (examId: string) => {
  const response = await api.get(`/question/questions/${examId}`);
  return response.data;
};

export const updateQuestion = async (payload: {
  questionId: string;
  title?: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: "Easy" | "Normal" | "Hard" | "Manual";
  cognitiveLevel?: "Memorization" | "Creativity" | "Thinking" | "Manual";
  typeQue?: "MCQ" | "TF";
}) => {
  const response = await api.put("/question/update-question", payload);
  return response.data;
};

export const deleteQuestion = async (questionId: string) => {
  const response = await api.delete("/question/delete-question", {
    data: { questionId },
  });
  return response.data;
};

export const downloadExamPDF = async (examId: string, showAnswers: boolean) => {
  const response = await api.get(`/exam/${examId}/download-pdf?showAnswers=${showAnswers}`, {
    responseType: "blob",
  });
  return response.data;
};

export interface StartExamPayload {
  examId: string;
  accessCode?: string;
}

export const startExam = async (payload: StartExamPayload) => {
  const response = await api.post("/exam-session/start", payload);
  return response.data;
};

export interface SubmitExamPayload {
  attemptId: string;
  answers: {
    questionId: string;
    studentAnswer: string;
  }[];
}

export const submitExam = async (payload: SubmitExamPayload) => {
  const response = await api.post("/exam-session/submit", payload);
  return response.data;
};

export const getAttemptResult = async (attemptId: string) => {
  const response = await api.get(`/exam-session/result/${attemptId}`);
  return response.data;
};

