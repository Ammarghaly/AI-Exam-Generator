interface Props {
  typeQue: "MCQ" | "TF";
  setTypeQue: (val: "MCQ" | "TF") => void;
  correctAnswer: string;
  setCorrectAnswer: (val: string) => void;
  options: string[];
  setOptions: (opts: string[]) => void;
  difficulty: string;
  setDifficulty: (val: any) => void;
  cognitiveLevel: string;
  setCognitiveLevel: (val: any) => void;
}

export function ReviewQuestionSelects({
  typeQue,
  setTypeQue,
  correctAnswer,
  setCorrectAnswer,
  options,
  setOptions,
  difficulty,
  setDifficulty,
  cognitiveLevel,
  setCognitiveLevel,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase">
          Type
        </label>
        <select
          value={typeQue}
          onChange={(e) => {
            setTypeQue(e.target.value as "MCQ" | "TF");
            if (
              e.target.value === "TF" &&
              !["True", "False"].includes(correctAnswer)
            ) {
              setCorrectAnswer("True");
            } else if (e.target.value === "MCQ" && options.length === 0) {
              setOptions(["", "", "", ""]);
            }
          }}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="MCQ">Multiple Choice</option>
          <option value="TF">True / False</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase">
          Difficulty
        </label>
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
        <label className="text-xs font-bold text-gray-500 uppercase">
          Cognitive Level
        </label>
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
  );
}
