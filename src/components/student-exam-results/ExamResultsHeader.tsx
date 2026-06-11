import { ExamSummaryCard } from "./ExamSummaryCard";

interface ExamResultsHeaderProps {
  title: string;
  subject?: string;
  date: string;
  duration: number;
  score: number;
}

export function ExamResultsHeader({ title, subject, date, duration, score }: ExamResultsHeaderProps) {
  return (
    <div className="mb-8">
      <ExamSummaryCard title={title} subject={subject} date={date} duration={duration} score={score} />
    </div>
  );
}
