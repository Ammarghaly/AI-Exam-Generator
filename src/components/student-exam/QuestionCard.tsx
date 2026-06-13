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
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
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
      </div>
    </div>
  );
}
