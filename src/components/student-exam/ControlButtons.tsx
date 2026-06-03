import { Flag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ControlButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  isFlagged: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleFlag: () => void;
  onSubmit: () => void;
}

export function ControlButtons({ isFirst, isLast, isFlagged, onPrev, onNext, onToggleFlag, onSubmit }: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
      <button
        onClick={onToggleFlag}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 cursor-pointer",
          isFlagged 
            ? "border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100" 
            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        )}
      >
        <Flag className={cn("w-5 h-5", isFlagged && "fill-orange-500")} />
        {isFlagged ? "Flagged for Review" : "Flag for Review"}
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {!isLast ? (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Submit Exam
            <Check className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
