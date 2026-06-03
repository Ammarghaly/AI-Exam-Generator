export type QuestionType = 'Multiple Choice' | 'True/False' | 'Short Answer' | 'Essay';

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
