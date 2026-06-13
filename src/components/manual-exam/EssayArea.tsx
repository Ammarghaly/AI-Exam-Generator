import { useFormContext } from "react-hook-form";

interface Props {
  index: number;
}

export function EssayArea({ index }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-2 pt-2">
      <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
        Ideal Answer / Grading Rubric
      </label>
      <textarea
        {...register(`questions.${index}.idealAnswer`)}
        placeholder="Outline the key points students should address..."
        className="w-full bg-indigo-50/30 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px] resize-y shadow-sm transition-all leading-relaxed"
      />
    </div>
  );
}
