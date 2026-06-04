export type QuestionType =
  | "Multiple Choice"
  | "True/False"
  | "Short Answer"
  | "Essay";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points?: number;
  options?: QuestionOption[];
}

export interface ExamQuestion {
  _id: string;
  title: string;
  options: string[];
  correctAnswer: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Manual";
  cognitiveLevel: "Memorization" | "Creativity" | "Thinking" | "Manual";
  typeQue: "MCQ" | "TF";
  ai_explanation?: string;
  examID: string;
  createdAt?: string;
  updatedAt?: string;
}
