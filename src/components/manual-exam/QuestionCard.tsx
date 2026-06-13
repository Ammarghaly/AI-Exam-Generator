import { Copy, Trash2 } from "lucide-react";
import type { QuestionType } from "../../pages/ManualExamCreatorPage";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { ExamFormValues } from "../../pages/ManualExamCreatorPage";
import { MultipleChoiceArea } from "./MultipleChoiceArea";
import { TrueFalseArea } from "./TrueFalseArea";
import { EssayArea } from "./EssayArea";

interface QuestionCardProps {
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function QuestionCard({
  index,
  onDelete,
  onDuplicate,
}: QuestionCardProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ExamFormValues>();

  const questionType = watch(`questions.${index}.type`);
  const idealAnswer = watch(`questions.${index}.idealAnswer`);

  const { fields: options, replace: replaceOptions } = useFieldArray({
    name: `questions.${index}.options`,
  });

  const setQuestionType = (type: QuestionType) => {
    setValue(`questions.${index}.type`, type);

    if (type === "Multiple Choice") {
      replaceOptions([
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: true,
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: false,
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: false,
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: false,
        },
      ]);
    } else {
      // Clear options for non-MCQ
      replaceOptions([]);
      if (type === "True/False") {
        // Default to true for T/F
        setValue(`questions.${index}.idealAnswer`, "True");
      }
    }
  };

  const handleOptionCorrectToggle = (optIndex: number) => {
    options.forEach((_, i) => {
      setValue(`questions.${index}.options.${i}.isCorrect`, i === optIndex, {
        shouldValidate: true,
      });
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
          <h3 className="font-extrabold text-lg text-gray-900">
            Question {index + 1}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Duplicate Question"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Question"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Config Row */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">
            Question Type
          </label>
          <QuestionTypeSelector
            currentType={questionType}
            onChange={setQuestionType}
          />
        </div>

        <div className="w-full lg:w-32 space-y-2">
          <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">
            Points
          </label>
          <input
            type="number"
            {...register(`questions.${index}.points`, { valueAsNumber: true })}
            min="1"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-center text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
          />
          {questionErrors?.points && (
            <p className="text-red-500 text-xs font-semibold">
              {questionErrors.points.message}
            </p>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
          Question Text
        </label>
        <textarea
          {...register(`questions.${index}.text`)}
          placeholder="Enter your question here..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px] resize-y shadow-sm transition-all leading-relaxed"
        />
        {questionErrors?.text && (
          <p className="text-red-500 text-xs font-semibold">
            {questionErrors.text.message}
          </p>
        )}
      </div>

      {/* Multiple Choice Area */}
      {questionType === "Multiple Choice" && (
        <MultipleChoiceArea
          index={index}
          options={options}
          handleOptionCorrectToggle={handleOptionCorrectToggle}
          questionErrors={questionErrors}
        />
      )}

      {/* True/False Area */}
      {questionType === "True/False" && (
        <TrueFalseArea index={index} idealAnswer={idealAnswer} />
      )}

      {/* Essay / Short Answer Area */}
      {(questionType === "Essay" || questionType === "Short Answer") && (
        <EssayArea index={index} />
      )}
    </div>
  );
}
