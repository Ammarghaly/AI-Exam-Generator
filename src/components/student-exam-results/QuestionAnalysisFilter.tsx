export type FilterOption = "all" | "correct" | "incorrect";

export interface QuestionAnalysisFilterProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  counts: {
    all: number;
    correct: number;
    incorrect: number;
  };
}

export function QuestionAnalysisFilter({ currentFilter, onFilterChange, counts }: QuestionAnalysisFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
      <button 
        onClick={() => onFilterChange("all")}
        className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${currentFilter === "all" ? "bg-gray-200 text-gray-900" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
      >
        All ({counts.all})
      </button>
      <button 
        onClick={() => onFilterChange("correct")}
        className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${currentFilter === "correct" ? "bg-green-200 text-green-900" : "bg-green-50 hover:bg-green-100 text-green-700"}`}
      >
        Correct ({counts.correct})
      </button>
      <button 
        onClick={() => onFilterChange("incorrect")}
        className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${currentFilter === "incorrect" ? "bg-red-200 text-red-900" : "bg-red-50 hover:bg-red-100 text-red-700"}`}
      >
        Incorrect ({counts.incorrect})
      </button>
    </div>
  );
}
