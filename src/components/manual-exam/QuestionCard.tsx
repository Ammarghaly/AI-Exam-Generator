import { Copy, Trash2 } from 'lucide-react';
import type { QuestionType } from '../../pages/ManualExamCreatorPage';
import { cn } from '../../lib/utils';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ExamFormValues } from '../../pages/ManualExamCreatorPage';

interface QuestionCardProps {
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function QuestionCard({ index, onDelete, onDuplicate }: QuestionCardProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ExamFormValues>();
  
  const questionType = watch(`questions.${index}.type`);
  const idealAnswer = watch(`questions.${index}.idealAnswer`);

  const { fields: options, replace: replaceOptions } = useFieldArray({
    name: `questions.${index}.options`
  });

  const setQuestionType = (type: QuestionType) => {
    setValue(`questions.${index}.type`, type);
    
    if (type === 'Multiple Choice') {
       replaceOptions([
         { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: true },
         { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
         { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
         { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
       ]);
    } else {
       // Clear options for non-MCQ
       replaceOptions([]);
       if (type === 'True/False') {
         // Default to true for T/F
         setValue(`questions.${index}.idealAnswer`, 'True');
       }
    }
  };

  const handleOptionCorrectToggle = (optIndex: number) => {
    options.forEach((_, i) => {
      setValue(`questions.${index}.options.${i}.isCorrect`, i === optIndex, { shouldValidate: true });
    });
  };

  const questionErrors = errors.questions?.[index];

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6 hover:shadow-md transition-shadow duration-200">
      
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            {index + 1}
          </div>
          <h3 className="font-extrabold text-lg text-gray-900">Question {index + 1}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onDuplicate} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Duplicate Question">
            <Copy className="w-5 h-5" />
          </button>
          <button type="button" onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Question">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Config Row */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">Question Type</label>
          <QuestionTypeSelector 
            currentType={questionType}
            onChange={setQuestionType}
          />
        </div>
        
        <div className="w-full lg:w-32 space-y-2">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">Points</label>
          <input
            type="number"
            {...register(`questions.${index}.points`, { valueAsNumber: true })}
            min="1"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-center text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
          />
          {questionErrors?.points && <p className="text-red-500 text-xs font-semibold">{questionErrors.points.message}</p>}
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">Question Text</label>
        <textarea
          {...register(`questions.${index}.text`)}
          placeholder="Enter your question here..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px] resize-y shadow-sm transition-all leading-relaxed"
        />
        {questionErrors?.text && <p className="text-red-500 text-xs font-semibold">{questionErrors.text.message}</p>}
      </div>

      {/* Multiple Choice Area */}
      {questionType === 'Multiple Choice' && (
        <div className="space-y-3 pt-2 bg-slate-50/50 p-4 rounded-xl border border-gray-100">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
            Answers (Select the correct one)
          </label>
          <div className="space-y-3">
            {options.map((opt, optIndex) => {
              // we can watch isCorrect for the specific option to render styles correctly
              const isCorrect = watch(`questions.${index}.options.${optIndex}.isCorrect`);
              
              return (
                <div key={opt.id} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  isCorrect ? "bg-blue-50/80 border-blue-300 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                )}>
                  <button
                    type="button"
                    onClick={() => handleOptionCorrectToggle(optIndex)}
                    className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 focus:outline-none transition-colors"
                    style={{
                      borderColor: isCorrect ? '#2563EB' : '#D1D5DB',
                      backgroundColor: isCorrect ? '#2563EB' : 'transparent'
                    }}
                  >
                    {isCorrect && <div className="w-2 h-2 bg-white rounded-full" />}
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
            
            {/* Display options array errors, e.g. no correct option selected */}
            {questionErrors?.options && !Array.isArray(questionErrors.options) && (
              <p className="text-red-500 text-xs font-semibold">{(questionErrors.options as any).message}</p>
            )}
            
            {/* Show individual option errors if any */}
            {Array.isArray(questionErrors?.options) && questionErrors?.options.map((optError, i) => (
              optError?.text && <p key={i} className="text-red-500 text-xs font-semibold">Option {i + 1}: {optError.text.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* True/False Area */}
      {questionType === 'True/False' && (
        <div className="space-y-3 pt-2 bg-slate-50/50 p-4 rounded-xl border border-gray-100">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
            Correct Answer
          </label>
          <div className="flex items-center gap-4">
            <label className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all", idealAnswer === 'True' ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700")}>
              <input type="radio" value="True" {...register(`questions.${index}.idealAnswer`)} className="hidden" />
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: idealAnswer === 'True' ? '#10B981' : '#D1D5DB' }}>
                {idealAnswer === 'True' && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
              </div>
              True
            </label>
            <label className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all", idealAnswer === 'False' ? "bg-rose-50 border-rose-200 text-rose-800 font-bold shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700")}>
              <input type="radio" value="False" {...register(`questions.${index}.idealAnswer`)} className="hidden" />
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: idealAnswer === 'False' ? '#F43F5E' : '#D1D5DB' }}>
                {idealAnswer === 'False' && <div className="w-2 h-2 bg-rose-500 rounded-full" />}
              </div>
              False
            </label>
          </div>
        </div>
      )}

      {/* Essay / Short Answer Area */}
      {(questionType === 'Essay' || questionType === 'Short Answer') && (
        <div className="space-y-2 pt-2">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">Ideal Answer / Grading Rubric</label>
          <textarea
            {...register(`questions.${index}.idealAnswer`)}
            placeholder="Outline the key points students should address..."
            className="w-full bg-indigo-50/30 border border-indigo-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px] resize-y shadow-sm transition-all leading-relaxed"
          />
        </div>
      )}

    </div>
  );
}
