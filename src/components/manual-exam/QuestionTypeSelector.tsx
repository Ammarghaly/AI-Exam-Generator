import { CircleDot, CheckSquare, AlignLeft, FileText } from "lucide-react";
import type { QuestionType } from "../../pages/ManualExamCreatorPage";
import { cn } from "../../lib/utils";

interface QuestionTypeSelectorProps {
  currentType: QuestionType;
  onChange: (type: QuestionType) => void;
}

const QUESTION_TYPES: { type: QuestionType; icon: any }[] = [
  { type: "Multiple Choice", icon: CircleDot },
  { type: "True/False", icon: CheckSquare },
  { type: "Short Answer", icon: AlignLeft },
  { type: "Essay", icon: FileText },
];

export function QuestionTypeSelector({ currentType, onChange }: QuestionTypeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 inline-flex">
      {QUESTION_TYPES.map((question_type) => {
        const Icon = question_type.icon;
        const isActive = currentType === question_type.type;
        return (
          <button
            type="button"
            key={question_type.type}
            onClick={() => onChange(question_type.type)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            )}
          >
            <Icon className="w-4 h-4" />
            {question_type.type}
          </button>
        );
      })}
    </div>
  );
}
