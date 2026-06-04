import api from './axios';

export interface UploadPDFResponse {
  success: boolean;
  message: string;
  examId: string;
  chunksCount: number;
}

export interface DifficultyRule {
  count: number;
  difficulty: 'Easy' | 'Normal' | 'Hard';
  measures: 'Memorization' | 'Creativity' | 'Thinking';
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
  status: 'Active' | 'Closed' | 'Hidden';
  teacherID: string;
}

export interface ManualQuestion {
  title: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Manual';
  cognitiveLevel: 'Memorization' | 'Creativity' | 'Thinking' | 'Manual';
  typeQue: 'MCQ' | 'TF';
}

export interface GenerateExamManuallyPayload {
  examDetails: ManualExamDetails;
  questions: ManualQuestion[];
}

export const uploadPDF = async (file: File): Promise<UploadPDFResponse> => {
  const formData = new FormData();
  formData.append('pdfFile', file);
  const response = await api.post<UploadPDFResponse>('/exam/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const generateExamAI = async (payload: GenerateExamPayload) => {
  const response = await api.post('/exam/generate', payload);
  return response.data;
};

export const generateExamManually = async (groupId: string, payload: GenerateExamManuallyPayload) => {
  const response = await api.post(`/exam/generate-manually?groupId=${groupId}`, payload);
  return response.data;
};

export interface PublishAIExamPayload {
  examId: string;
  examDetails: ManualExamDetails;
}

export const publishAIExam = async (groupId: string, payload: PublishAIExamPayload) => {
  const response = await api.post(`/exam/publish-ai?groupId=${groupId}`, payload);
  return response.data;
};
