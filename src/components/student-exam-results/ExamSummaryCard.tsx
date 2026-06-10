import { ExamInfo } from "./ExamInfo";
import { ExamScore } from "./ExamScore";

export function ExamSummaryCard() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between">
      <ExamInfo />
      <ExamScore score={85} />
    </div>
  );
}
