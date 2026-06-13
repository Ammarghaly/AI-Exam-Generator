import { useState } from "react";
import { Check, X } from "lucide-react";
import { updateQuestion } from "../../api/exams";
import toast from "react-hot-toast";
import type { ExamQuestion } from "../../types/exam";
import { ReviewQuestionSelects } from "./ReviewQuestionSelects";
import { ReviewQuestionMCQArea } from "./ReviewQuestionMCQArea";
import { ReviewQuestionTFArea } from "./ReviewQuestionTFArea";

interface ReviewQuestionCardEditProps {
  question: ExamQuestion;
  index: number;
  onCancel: () => void;
  onUpdate: (updatedQuestion: ExamQuestion) => void;
}

export function ReviewQuestionCardEdit({
  question,
  index,
  onCancel,
  onUpdate,
}: ReviewQuestionCardEditProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState(question.title);
  const [typeQue, setTypeQue] = useState(question.typeQue);
  const [options, setOptions] = useState(question.options || []);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const [cognitiveLevel, setCognitiveLevel] = useState(question.cognitiveLevel);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload: any = {
        questionId: question._id,
        title,
        typeQue,
        correctAnswer,
        difficulty,
        cognitiveLevel,
      };

      if (typeQue === "MCQ") {
        payload.options = options;
      }

      await updateQuestion(payload);

      onUpdate({
        ...question,
        title,
        typeQue,
        options: typeQue === "MCQ" ? options : question.options,
        correctAnswer,
        difficulty,
        cognitiveLevel,
      });

      toast.success("Question updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update question");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-indigo-300 shadow-md ring-4 ring-indigo-50 space-y-6 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
            {index + 1}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-lg text-gray-900">
              Question {index + 1}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <ReviewQuestionSelects
          typeQue={typeQue}
          setTypeQue={setTypeQue}
          correctAnswer={correctAnswer}
          setCorrectAnswer={setCorrectAnswer}
          options={options}
          setOptions={setOptions}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          cognitiveLevel={cognitiveLevel}
          setCognitiveLevel={setCognitiveLevel}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Question Text
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 min-h-[80px]"
          />
        </div>

        {typeQue === "MCQ" && (
          <ReviewQuestionMCQArea
            options={options}
            setOptions={setOptions}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
            questionId={question._id}
          />
        )}

        {typeQue === "TF" && (
          <ReviewQuestionTFArea
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
          />
        )}
      </div>
    </div>
  );
}
