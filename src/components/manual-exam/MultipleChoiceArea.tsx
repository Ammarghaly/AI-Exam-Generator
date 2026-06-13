import { cn } from "../../lib/utils";
import { useFormContext } from "react-hook-form";

interface Props {
  index: number;
  options: any[];
  handleOptionCorrectToggle: (optIndex: number) => void;
  questionErrors: any;
}

export function MultipleChoiceArea({
  index,
  options,
  handleOptionCorrectToggle,
  questionErrors,
}: Props) {
  const { register, watch } = useFormContext();

  return (
    <div className="space-y-3 pt-2 bg-slate-50/50 p-4 rounded-xl border border-gray-100">
      <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
        Answers (Select the correct one)
      </label>
      <div className="space-y-3">
        {options.map((opt, optIndex) => {
          const isCorrect = watch(`questions.${index}.options.${optIndex}.isCorrect`);

          return (
            <div
              key={opt.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                isCorrect
                  ? "bg-blue-50/80 border-blue-300 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
              )}
            >
              <button
                type="button"
                onClick={() => handleOptionCorrectToggle(optIndex)}
                className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: isCorrect ? "#2563EB" : "#D1D5DB",
                  backgroundColor: isCorrect ? "#2563EB" : "transparent",
                }}
              >
                {isCorrect && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  {...register(`questions.${index}.options.${optIndex}.text`)}
                  placeholder={`Option ${optIndex + 1}`}
                  className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>
          );
        })}

        {questionErrors?.options && !Array.isArray(questionErrors.options) && (
          <p className="text-red-500 text-xs font-semibold">
            {(questionErrors.options as any).message}
          </p>
        )}

        {Array.isArray(questionErrors?.options) &&
          questionErrors?.options.map(
            (optError: any, i: number) =>
              optError?.text && (
                <p key={i} className="text-red-500 text-xs font-semibold">
                  Option {i + 1}: {optError.text.message}
                </p>
              ),
          )}
      </div>
    </div>
  );
}
