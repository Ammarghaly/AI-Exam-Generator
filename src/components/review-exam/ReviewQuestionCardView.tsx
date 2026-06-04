import { Pencil, Trash2, Check, BrainCircuit } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ExamQuestion } from '../../types/exam';

interface ReviewQuestionCardViewProps {
  question: ExamQuestion;
  index: number;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function ReviewQuestionCardView({ question, index, onDelete, onEdit }: ReviewQuestionCardViewProps) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md shadow-sm space-y-6 transition-all duration-200">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
            {index + 1}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-lg text-gray-900">Question {index + 1}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
              {question.typeQue}
            </span>
            <span className={cn(
              "px-2 py-1 text-xs font-bold rounded-md",
              question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'Normal' ? 'bg-blue-100 text-blue-700' :
                  question.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
            )}>
              {question.difficulty}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md">
              {question.cognitiveLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(question._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <p dir='auto' className="text-gray-800 font-medium text-base leading-relaxed">
          {question.title}
        </p>

        {question.typeQue === 'MCQ' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {question.options.map((opt, idx) => {
              const isCorrect = opt === question.correctAnswer;
              return (
                <div key={idx} dir='auto' className={cn(
                  "px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2",
                  isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 border-gray-100 text-gray-600"
                )}>
                  {isCorrect ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 shrink-0" />}
                  {opt}
                </div>
              );
            })}
          </div>
        )}

        {question.typeQue === 'TF' && (
          <div className="flex gap-4 mt-4">
            <div className={cn(
              "px-6 py-3 rounded-xl border text-sm font-bold flex items-center gap-2",
              question.correctAnswer === 'True' ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 border-gray-100 text-gray-400"
            )}>
              {question.correctAnswer === 'True' && <Check className="w-4 h-4" />} True
            </div>
            <div className={cn(
              "px-6 py-3 rounded-xl border text-sm font-bold flex items-center gap-2",
              question.correctAnswer === 'False' ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-gray-50 border-gray-100 text-gray-400"
            )}>
              {question.correctAnswer === 'False' && <Check className="w-4 h-4" />} False
            </div>
          </div>
        )}

        {question.ai_explanation && (
          <div className="mt-6 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50 flex gap-3 items-start">
            <BrainCircuit className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">AI Explanation</h4>
              <p className="text-sm text-indigo-900/80 leading-relaxed">
                {question.ai_explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
