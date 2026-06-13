import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyExams } from '../../api/exams';

export function useTeacherDashboard() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['myExams'],
    queryFn: getMyExams,
  });

  const data = useMemo(() => {
    if (!response?.data) return [];
    
    const timeAgo = (dateString?: string) => {
      if (!dateString) return 'N/A';
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    };

    return response.data.slice(0, 5).map((exam: any) => {
      let diff = 'Varied';
      if (exam.difficulty) {
        if (typeof exam.difficulty === 'string') {
          diff = exam.difficulty;
        } else if (Array.isArray(exam.difficulty)) {
          diff = exam.difficulty.map((d: any) => d.difficulty || d).join(', ');
        }
      }

      return {
        id: exam._id || exam.id,
        title: exam.title || 'Untitled Exam',
        timeAgo: timeAgo(exam.createdAt),
        subject: exam.groupID?.subject || exam.subject || 'N/A',
        difficulty: diff,
        status: exam.status || 'Draft'
      };
    });
  }, [response]);

  const growthStats = useMemo(() => {
    if (!response?.data || response.data.length === 0) {
      return {
        badgeText: 'No exams yet',
        badgeClassName: 'bg-gray-100 text-gray-600'
      };
    }

    const now = Date.now();
    const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - MS_IN_30_DAYS;
    const sixtyDaysAgo = now - (2 * MS_IN_30_DAYS);

    let last30DaysCount = 0;
    let previous30DaysCount = 0;

    response.data.forEach((exam: any) => {
      if (!exam.createdAt) return;
      const createdTime = new Date(exam.createdAt).getTime();
      if (createdTime >= thirtyDaysAgo && createdTime <= now) {
        last30DaysCount++;
      } else if (createdTime >= sixtyDaysAgo && createdTime < thirtyDaysAgo) {
        previous30DaysCount++;
      }
    });

    if (previous30DaysCount === 0) {
      if (last30DaysCount > 0) {
        return {
          badgeText: `+${last30DaysCount} new this month`,
          badgeClassName: 'bg-emerald-100 text-emerald-800'
        };
      }
      return {
        badgeText: '0 new this month',
        badgeClassName: 'bg-gray-100 text-gray-600'
      };
    }

    const pctChange = Math.round(((last30DaysCount - previous30DaysCount) / previous30DaysCount) * 100);
    const sign = pctChange >= 0 ? '+' : '';
    const colorClass = pctChange >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800';

    return {
      badgeText: `${sign}${pctChange}% this month`,
      badgeClassName: colorClass
    };
  }, [response]);

  const totalExams = response?.data?.length ?? 0;

  const upcomingExams = response?.data?.filter((exam: any) => {
    if (!exam.openingAt) return false;
    const timeMs = exam.openingAt < 9999999999 ? exam.openingAt * 1000 : exam.openingAt;
    return timeMs > Date.now();
  }).length ?? 0;

  return {
    data,
    growthStats,
    totalExams,
    upcomingExams,
    isLoading
  };
}
