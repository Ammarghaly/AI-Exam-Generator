import type { Question } from '../../types/exam';
import { QuestionTitle } from './QuestionTitle';
import { QuestionOptions } from './QuestionOptions';

interface QuestionCardProps {
  question: Question;
  number: number;
  answer: any;
  onChange: (answer: any) => void;
}

export function QuestionCard({ question, number, answer, onChange }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 h-full flex flex-col">
      <QuestionTitle number={number} text={question.text} points={question.points} />

      <div className="flex-1 mt-6">
        {question.type === 'Multiple Choice' && question.options && (
          <QuestionOptions
            options={question.options}
            selectedId={answer}
            onChange={onChange}
          />
        )}

        {question.type === 'True/False' && (
          <QuestionOptions
            options={[{ id: 'True', text: 'True' }, { id: 'False', text: 'False' }]}
            selectedId={answer}
            onChange={onChange}
          />
        )}

        {question.type === 'Short Answer' && (
          <div className="w-full">
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-5 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all text-lg font-medium text-gray-900 placeholder-gray-400"
            />
          </div>
        )}

        {question.type === 'Essay' && (
          <div className="w-full h-full min-h-[300px]">
            <textarea
              value={answer || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your essay here..."
              className="w-full h-full min-h-[300px] p-5 bg-slate-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all text-lg font-medium text-gray-900 placeholder-gray-400 resize-y"
            />
          </div>
        )}
      </div>
    </div>
  );
}
