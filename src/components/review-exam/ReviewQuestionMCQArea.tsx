import { cn } from "../../lib/utils";

interface Props {
  options: string[];
  setOptions: (opts: string[]) => void;
  correctAnswer: string;
  setCorrectAnswer: (val: string) => void;
  questionId?: string;
}

export function ReviewQuestionMCQArea({
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
  questionId,
}: Props) {
  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
      <label className="text-xs font-bold text-gray-500 uppercase block">
        Options (Select Correct)
      </label>
      {options.map((opt, idx) => (
        <div
          key={idx}
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg border",
            correctAnswer === opt && opt !== ""
              ? "bg-blue-50 border-blue-300"
              : "bg-white border-gray-200",
          )}
        >
          <input
            type="radio"
            name={`correct-${questionId || 'new'}`}
            checked={correctAnswer === opt && opt !== ""}
            onChange={() => setCorrectAnswer(opt)}
            className="w-4 h-4 text-indigo-600 ml-2"
          />
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const newOpts = [...options];
              const oldVal = newOpts[idx];
              newOpts[idx] = e.target.value;
              setOptions(newOpts);
              if (correctAnswer === oldVal) {
                setCorrectAnswer(e.target.value);
              }
            }}
            placeholder={`Option ${idx + 1}`}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none py-1"
          />
        </div>
      ))}
    </div>
  );
}
