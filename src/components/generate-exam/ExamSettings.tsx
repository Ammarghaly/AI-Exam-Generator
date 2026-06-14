import { Settings2, AlertCircle, Plus, Minus } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function ExamSettings() {
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const distribution = watch("difficultyDistribution") || {};
  const mcqCount = watch("mcqCount") || 0;

  // Calculate total questions dynamically
  const totalQuestions: number = Object.values(
    distribution as Record<string, number>,
  ).reduce((sum: number, val) => sum + (Number(val) || 0), 0);

  // Automatically calculate TF count
  const tfCount = Math.max(0, totalQuestions - mcqCount);

  useEffect(() => {
    if (mcqCount > totalQuestions) {
      setError("mcqCount", {
        type: "manual",
        message: "MCQ count cannot exceed the total questions count",
      });
    } else {
      if (errors.mcqCount?.type === "manual") {
        clearErrors("mcqCount");
      }
    }
  }, [mcqCount, totalQuestions, setError, clearErrors, errors.mcqCount]);

  const incrementCell = (key: string) => {
    const currentVal = Number(distribution[key]) || 0;
    setValue(`difficultyDistribution.${key}`, currentVal + 1, {
      shouldValidate: true,
    });
  };

  const decrementCell = (key: string) => {
    const currentVal = Number(distribution[key]) || 0;
    if (currentVal > 0) {
      setValue(`difficultyDistribution.${key}`, currentVal - 1, {
        shouldValidate: true,
      });
    }
  };

  const gridCells = [
    { label: "Easy", prefix: "Easy" },
    { label: "Normal", prefix: "Normal" },
    { label: "Hard", prefix: "Hard" },
  ];

  const cognitiveLevels = [
    { label: "Memorization", key: "Memorization" },
    { label: "Creativity", key: "Creativity" },
    { label: "Thinking", key: "Thinking" },
  ];

  return (
    <div className="bg-white shadow-[0px_4px_20px_rgba(30,64,175,0.05)] rounded-xl p-6 border border-gray-200 flex flex-col h-full space-y-6">
      <h3 className="text-[20px] font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
        <Settings2 className="w-6 h-6 text-orange-600" />
        AI Question Settings
      </h3>

      {/* 3x3 Distribution Matrix */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-900">
            Cognitive & Difficulty Matrix
          </label>
          <span className="text-xs font-bold text-gray-500 bg-slate-100 px-2 py-1 rounded font-sans" dir="ltr" lang="en">
            Total: {totalQuestions} Questions
          </span>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                {cognitiveLevels.map((cog) => (
                  <th
                    key={cog.key}
                    className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"
                  >
                    {cog.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridCells.map((row) => (
                <tr
                  key={row.prefix}
                  className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="p-3 text-sm font-bold text-gray-700">
                    {row.label}
                  </td>
                  {cognitiveLevels.map((cog) => {
                    const cellKey = `${row.prefix}_${cog.key}`;
                    return (
                      <td key={cog.key} className="p-3">
                        <div className="flex items-center justify-center gap-1.5 mx-auto max-w-[100px]">
                          <button
                            type="button"
                            onClick={() => decrementCell(cellKey)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-600 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            {...register(`difficultyDistribution.${cellKey}`, {
                              valueAsNumber: true,
                            })}
                            className="w-10 text-center text-sm font-bold text-gray-900 focus:outline-none bg-transparent font-sans"
                            dir="ltr"
                            lang="en"
                          />
                          <button
                            type="button"
                            onClick={() => incrementCell(cellKey)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-gray-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {errors.difficultyDistribution?.message && (
          <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {String(errors.difficultyDistribution.message)}
          </p>
        )}
      </div>

      {/* Question Formats Configuration */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <label className="block text-sm font-semibold text-gray-900">
          Format Distribution
        </label>

        <div className="grid grid-cols-2 gap-4">
          {/* MCQ Count */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/60 space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
              MCQ Questions
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max={totalQuestions}
              {...register("mcqCount", { valueAsNumber: true })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
              dir="ltr"
              lang="en"
            />
            {errors.mcqCount?.message && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {String(errors.mcqCount.message)}
              </p>
            )}
          </div>

          {/* TF Count (Calculated) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/60 space-y-1.5 opacity-85">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
              True / False
            </label>
            <div className="w-full bg-slate-100 border border-gray-200/70 rounded-lg px-3 py-2 text-sm font-extrabold text-gray-600 select-none font-sans" dir="ltr" lang="en">
              {tfCount} Questions
            </div>
            <span className="text-[10px] text-gray-400 block font-medium">
              Auto-computed from total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
