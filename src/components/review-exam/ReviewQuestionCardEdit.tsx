import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { updateQuestion } from '../../api/exams';
import toast from 'react-hot-toast';
import type { ExamQuestion } from '../../types/exam';

interface ReviewQuestionCardEditProps {
  question: ExamQuestion;
  index: number;
  onCancel: () => void;
  onUpdate: (updatedQuestion: ExamQuestion) => void;
}

export function ReviewQuestionCardEdit({ question, index, onCancel, onUpdate }: ReviewQuestionCardEditProps) {
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
      await updateQuestion({
        questionId: question._id,
        title,
        typeQue,
        options: typeQue === 'MCQ' ? options : [],
        correctAnswer,
        difficulty,
        cognitiveLevel
      });

      onUpdate({
        ...question,
        title,
        typeQue,
        options: typeQue === 'MCQ' ? options : [],
        correctAnswer,
        difficulty,
        cognitiveLevel
      });

      toast.success('Question updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update question');
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
            <h3 className="font-extrabold text-lg text-gray-900">Question {index + 1}</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
            <select
              value={typeQue}
              onChange={(e) => {
                setTypeQue(e.target.value as 'MCQ' | 'TF');
                if (e.target.value === 'TF' && !['True', 'False'].includes(correctAnswer)) {
                  setCorrectAnswer('True');
                } else if (e.target.value === 'MCQ' && options.length === 0) {
                  setOptions(['', '', '', '']);
                }
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TF">True / False</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Easy">Easy</option>
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Cognitive Level</label>
            <select
              value={cognitiveLevel}
              onChange={(e) => setCognitiveLevel(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Memorization">Memorization</option>
              <option value="Thinking">Thinking</option>
              <option value="Creativity">Creativity</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase">Question Text</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 min-h-[80px]"
          />
        </div>

        {typeQue === 'MCQ' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
            <label className="text-xs font-bold text-gray-500 uppercase block">Options (Select Correct)</label>
            {options.map((opt, idx) => (
              <div key={idx} className={cn(
                "flex items-center gap-3 p-2 rounded-lg border",
                correctAnswer === opt && opt !== '' ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
              )}>
                <input
                  type="radio"
                  name={`correct-${question._id}`}
                  checked={correctAnswer === opt && opt !== ''}
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
        )}

        {typeQue === 'TF' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
            <label className="text-xs font-bold text-gray-500 uppercase block">Correct Answer</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={correctAnswer === 'True'}
                  onChange={() => setCorrectAnswer('True')}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm font-medium">True</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={correctAnswer === 'False'}
                  onChange={() => setCorrectAnswer('False')}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm font-medium">False</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
