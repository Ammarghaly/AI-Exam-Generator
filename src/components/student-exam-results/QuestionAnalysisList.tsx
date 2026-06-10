import { QuestionAnalysisCard, type QuestionData } from "./QuestionAnalysisCard";

interface QuestionAnalysisListProps {
  questions: QuestionData[];
}

export function QuestionAnalysisList({ questions }: QuestionAnalysisListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">No questions found for this filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <QuestionAnalysisCard key={question.id} question={question} />
      ))}
    </div>
  );
}
