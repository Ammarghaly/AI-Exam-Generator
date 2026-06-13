import { cn } from "../../lib/utils";
import { useFormContext } from "react-hook-form";

interface Props {
  index: number;
  idealAnswer: string;
}

export function TrueFalseArea({ index, idealAnswer }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-3 pt-2 bg-slate-50/50 p-4 rounded-xl border border-gray-100">
      <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
        Correct Answer
      </label>
      <div className="flex items-center gap-4">
        <label
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all",
            idealAnswer === "True"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-sm"
              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700",
          )}
        >
          <input
            type="radio"
            value="True"
            {...register(`questions.${index}.idealAnswer`)}
            className="hidden"
          />
          <div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: idealAnswer === "True" ? "#10B981" : "#D1D5DB",
            }}
          >
            {idealAnswer === "True" && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </div>
          True
        </label>
        <label
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all",
            idealAnswer === "False"
              ? "bg-rose-50 border-rose-200 text-rose-800 font-bold shadow-sm"
              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700",
          )}
        >
          <input
            type="radio"
            value="False"
            {...register(`questions.${index}.idealAnswer`)}
            className="hidden"
          />
          <div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: idealAnswer === "False" ? "#F43F5E" : "#D1D5DB",
            }}
          >
            {idealAnswer === "False" && (
              <div className="w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </div>
          False
        </label>
      </div>
    </div>
  );
}
