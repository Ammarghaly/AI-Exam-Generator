import { FileText, Percent, Calendar } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="TOTAL EXAMS"
        value="124"
        icon={FileText}
        iconClassName="bg-indigo-50 text-indigo-600"
        bgShapeClassName="bg-indigo-50/80"
      />
      <StatsCard
        title="AVG. SCORE"
        value={<>82<span className="text-2xl text-gray-900 ml-0.5">%</span></>}
        icon={Percent}
        iconClassName="bg-emerald-50 text-emerald-600"
        bgShapeClassName="bg-emerald-50/80"
      />
      <StatsCard
        title="UPCOMING"
        value="03"
        icon={Calendar}
        iconClassName="bg-orange-50 text-orange-600"
        bgShapeClassName="bg-orange-50/80"
      />
    </div>
  );
}
