import { FileText, Percent, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyExams } from '../../api/exams';
import { StatsCard } from '../dashboard/StatsCard';

export function StatsCards() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['myExams'],
    queryFn: getMyExams,
  });

  const totalExams = isLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 inline" />
  ) : (
    response?.data?.length ?? 0
  );

  const upcomingExams = isLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 inline" />
  ) : (
    response?.data?.filter((exam: any) => {
      if (!exam.openingAt) return false;
      const timeMs = exam.openingAt < 9999999999 ? exam.openingAt * 1000 : exam.openingAt;
      return timeMs > Date.now();
    }).length ?? 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="TOTAL EXAMS"
        value={totalExams}
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
        value={upcomingExams}
        icon={Calendar}
        iconClassName="bg-orange-50 text-orange-600"
        bgShapeClassName="bg-orange-50/80"
      />
    </div>
  );
}
