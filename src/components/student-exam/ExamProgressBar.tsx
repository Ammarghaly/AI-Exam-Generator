export function ExamProgressBar({ total, answered }: { total: number; answered: number }) {
  const percentage = Math.round((answered / total) * 100);
  
  return (
    <div className="w-full h-1.5 bg-gray-100 flex-shrink-0">
      <div 
        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
