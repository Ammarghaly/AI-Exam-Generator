import { cn } from '../../lib/utils';
import { Circle, CheckCircle2 } from 'lucide-react';

interface QuestionOptionProps {
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function QuestionOption({ text, isSelected, onSelect }: QuestionOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group cursor-pointer",
        isSelected 
          ? "border-indigo-600 bg-indigo-50 shadow-sm" 
          : "border-gray-100 hover:border-indigo-300 hover:bg-slate-50"
      )}
    >
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
        isSelected ? "text-indigo-600" : "text-gray-300 group-hover:text-indigo-400"
      )}>
        {isSelected ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </div>
      <span className={cn(
        "text-lg font-medium",
        isSelected ? "text-indigo-900 font-bold" : "text-gray-700"
      )}>
        {text}
      </span>
    </button>
  );
}
