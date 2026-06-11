
import { QuestionAnalysisTitle } from "./QuestionAnalysisTitle";
import { QuestionAnalysisFilter, type FilterOption, type QuestionAnalysisFilterProps } from "./QuestionAnalysisFilter";

export type { FilterOption };

export function QuestionAnalysisHeader(props: QuestionAnalysisFilterProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <QuestionAnalysisTitle />
      <QuestionAnalysisFilter {...props} />
    </div>
  );
}
