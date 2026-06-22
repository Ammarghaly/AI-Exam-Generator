import { CheckCircle2, XCircle, AlertCircle, Lightbulb } from "lucide-react";

export type QuestionType = "MCQ" | "TF";

export interface QuestionData {
  id: string;
  number: number;
  text: string;
  tags: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  type: QuestionType;
  isCorrect: boolean;
  correctAnswer: string;
  studentAnswer?: string;
  explanation: string;
}

interface QuestionAnalysisCardProps {
  question: QuestionData;
}

export function QuestionAnalysisCard({ question }: QuestionAnalysisCardProps) {
  const isCorrect = question.isCorrect;

  return (
    <div dir="auto" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
      <div   dir="auto" className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
      
      <div  dir="auto" className="flex justify-between items-start mb-4">
        <div  dir="auto" className="flex items-center gap-2">
          <span  dir="auto" className="text-sm font-bold text-gray-400">Q{question.number}</span>
          <h3  dir="auto" className="text-lg font-bold text-gray-900">{question.text}</h3>
        </div>
        <div  dir="auto" className="flex items-center gap-2 shrink-0 ml-4">
          {question.tags.map(tag => (
            <span key={tag} className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-md">
              {tag}
            </span>
          ))}
          {question.difficulty && (
            <span  dir="auto" className={`text-xs font-bold px-3 py-1 rounded-md ${
              question.difficulty === 'Hard' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300' : 
              question.difficulty === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' : 
              'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300'
            }`}>
              {question.difficulty}
            </span>
          )}
        </div>
      </div>

      {isCorrect ? (
        <div dir="auto" className="mt-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4 flex items-start justify-between">
          <div>
            <p  dir="auto" className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">Correct Answer</p>
            <p  dir="auto" className="text-gray-900 dark:text-gray-200 font-semibold">{question.correctAnswer}</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
        </div>
      ) : (
        <div dir="auto" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div dir="auto" className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-start justify-between">
            <div>
              <p dir="auto" className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">Your Answer</p>
              <p dir="auto" className="text-gray-900 dark:text-gray-200 font-semibold line-through">{question.studentAnswer}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
          </div>

          <div dir="auto" className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4 flex items-start justify-between">
            <div>
              <p dir="auto" className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">Correct Answer</p>
              <p dir="auto" className="text-gray-900 dark:text-gray-200 font-semibold">{question.correctAnswer}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
          </div>
        </div>
      )}

      <div dir="auto" className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-3">
        {isCorrect ? (
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        )}
        <p dir="auto" className="text-sm text-gray-600 leading-relaxed">
          <span  dir="auto" className="font-bold text-gray-800">Explanation:</span> {question.explanation}
        </p>
      </div>
    </div>
  );
}
