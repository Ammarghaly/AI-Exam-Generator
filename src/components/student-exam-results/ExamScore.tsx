export function ExamScore({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="mt-6 md:mt-0 flex flex-col items-center justify-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke="#f3f4f6" 
            strokeWidth="8" 
          />
          <circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke="#4f46e5" 
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-indigo-700">{score}<span className="text-xl">%</span></span>
        </div>
      </div>
      <span className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">Score</span>
    </div>
  );
}
