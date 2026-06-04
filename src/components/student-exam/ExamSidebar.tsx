import { Flag, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Question } from '../../types/exam';

interface ExamSidebarProps {
  questions: Question[];
  currentIndex: number;
  onSelect: (index: number) => void;
  answers: Record<string, any>;
  flagged: Set<string>;
}

export function ExamSidebar({ questions, currentIndex, onSelect, answers, flagged }: ExamSidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-extrabold text-gray-900 text-lg">Questions Overview</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">
          {Object.keys(answers).length} of {questions.length} answered
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
          const isFlagged = flagged.has(q.id);
          const isCurrent = currentIndex === idx;

          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group cursor-pointer",
                isCurrent ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-100 hover:border-indigo-300 hover:bg-slate-50",
                !isCurrent && isAnswered && "bg-emerald-50/30 border-emerald-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                  isCurrent ? "bg-indigo-600 text-white" :
                    isAnswered ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                )}>
                  {idx + 1}
                </div>
                <span className={cn(
                  "font-bold text-sm truncate max-w-[120px]",
                  isCurrent ? "text-indigo-900" : isAnswered ? "text-emerald-900" : "text-gray-700"
                )}>
                  Question {idx + 1}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isFlagged && <Flag className="w-4 h-4 text-orange-500 fill-orange-500" />}
                {isAnswered && !isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {!isAnswered && !isCurrent && <Circle className="w-4 h-4 text-gray-300" />}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
