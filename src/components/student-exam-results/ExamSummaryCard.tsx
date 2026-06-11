import { ExamInfo } from "./ExamInfo";
import { ExamScore } from "./ExamScore";

interface ExamSummaryCardProps {
  title: string;
  subject?: string;
  date: string;
  duration: number;
  score: number;
}

export function ExamSummaryCard({ title, subject, date, duration, score }: ExamSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between">
      <ExamInfo title={title} subject={subject} date={date} duration={duration} />
      <ExamScore score={score} />
    </div>
  );
}
