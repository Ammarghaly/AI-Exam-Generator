export function QuestionTitle({ number, text, points }: { number: number, text: string, points?: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-extrabold text-sm rounded-lg">
          Question {number}
        </span>
        {points && (
          <span className="text-sm font-bold text-gray-500">{points} points</span>
        )}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">{text}</h2>
    </div>
  );
}
