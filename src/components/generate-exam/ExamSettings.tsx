import { Settings2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFormContext } from 'react-hook-form';

export function ExamSettings() {
  const { watch, setValue, formState: { errors } } = useFormContext();

  const difficulty = watch('difficulty');
  const questionTypes = watch('questionTypes') || [];
  const questionsCount = watch('questionsCount');

  const toggleQuestionType = (id: string) => {
    if (questionTypes.includes(id)) {
      setValue('questionTypes', questionTypes.filter((t: string) => t !== id), { shouldValidate: true });
    } else {
      setValue('questionTypes', [...questionTypes, id], { shouldValidate: true });
    }
  };

  const questionTypesList = [
    { id: 'mcq', label: 'Multiple Choice' },
    { id: 'tf', label: 'True / False' },
    { id: 'sa', label: 'Short Answer' },
    { id: 'essay', label: 'Essay' },
  ];

  return (
    <div className="bg-white shadow-[0px_4px_20px_rgba(30,64,175,0.05)] rounded-xl p-6 border border-gray-200 flex flex-col h-full">
      <h3 className="text-[20px] font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Settings2 className="w-6 h-6 text-orange-600" />
        AI Settings
      </h3>

      {/* Difficulty */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Difficulty Level</label>
        <div className="flex p-1 bg-slate-50 rounded-lg border border-gray-200">
          {['Easy', 'Medium', 'Hard'].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setValue('difficulty', level, { shouldValidate: true })}
              className={cn(
                "flex-1 py-2 text-sm rounded transition-colors",
                difficulty === level
                  ? "bg-white shadow-sm text-indigo-700 font-bold"
                  : "text-gray-500 hover:bg-gray-100 font-medium"
              )}
            >
              {level}
            </button>
          ))}
        </div>
        {errors.difficulty && (
          <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.difficulty.message as string}
          </p>
        )}
      </div>

      {/* Question Types */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Question Types</label>
        <div className="grid grid-cols-2 gap-3">
          {questionTypesList.map(type => (
            <label 
              key={type.id} 
              className={`flex items-center gap-3 p-3 rounded-lg border ${errors.questionTypes ? 'border-rose-500' : 'border-gray-200'} hover:border-indigo-600 transition-colors cursor-pointer bg-white`}
            >
              <input
                type="checkbox"
                checked={questionTypes.includes(type.id)}
                onChange={() => toggleQuestionType(type.id)}
                className="w-5 h-5 rounded text-indigo-600 border-gray-300 focus:ring-indigo-600 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-900">{type.label}</span>
            </label>
          ))}
        </div>
        {errors.questionTypes && (
          <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.questionTypes.message as string}
          </p>
        )}
      </div>

      {/* Number of Questions */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-900">Number of Questions</label>
          <span className="text-sm text-indigo-700 font-bold bg-indigo-50 px-2 py-1 rounded">
            {questionsCount}
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={questionsCount || 25}
          onChange={(e) => setValue('questionsCount', parseInt(e.target.value), { shouldValidate: true })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
          <span>5</span>
          <span>100</span>
        </div>
        {errors.questionsCount && (
          <p className="text-sm font-semibold text-rose-500 mt-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.questionsCount.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
