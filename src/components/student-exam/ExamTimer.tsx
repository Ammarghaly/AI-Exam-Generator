import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ExamTimer({ initialSeconds }: { initialSeconds: number }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 300; // less than 5 minutes

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-bold border transition-colors",
      isWarning ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-gray-50 border-gray-200 text-gray-700"
    )}>
      <Clock className="w-5 h-5" />
      <span className="tabular-nums tracking-widest">
        {hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
