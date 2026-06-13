interface Props {
  correctAnswer: string;
  setCorrectAnswer: (val: string) => void;
}

export function ReviewQuestionTFArea({ correctAnswer, setCorrectAnswer }: Props) {
  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-100">
      <label className="text-xs font-bold text-gray-500 uppercase block">
        Correct Answer
      </label>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={correctAnswer === "True"}
            onChange={() => setCorrectAnswer("True")}
            className="w-4 h-4 text-indigo-600"
          />
          <span className="text-sm font-medium">True</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={correctAnswer === "False"}
            onChange={() => setCorrectAnswer("False")}
            className="w-4 h-4 text-indigo-600"
          />
          <span className="text-sm font-medium">False</span>
        </label>
      </div>
    </div>
  );
}
