import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeacherDashboard } from '../api/teacherDashboard';

export function useTeacherDashboard() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: getTeacherDashboard,
  });

  const dashboardData = response?.data;
  const recentExams = dashboardData?.recentExams || [];
  const totalExams = dashboardData?.totalExamsGenerated ?? 0;
  const upcomingExams = dashboardData?.upcomingExamsCount ?? 0;
  const averageCohortScore = dashboardData?.averageCohortScore ?? 0;
  const teacherName = dashboardData?.teacherName ?? 'Professor';

  const data = useMemo(() => {
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

    return recentExams.map((exam: any) => {
      let diff = 'Varied';
      if (exam.difficulty) {
        if (typeof exam.difficulty === 'string') {
          diff = exam.difficulty;
        } else if (Array.isArray(exam.difficulty)) {
          diff = exam.difficulty.map((d: any) => d.difficulty || d).join(', ');
        }
      }

      let subjectName = 'N/A';
      if (exam.groupID) {
        if (Array.isArray(exam.groupID)) {
          if (exam.groupID.length > 0) {
            subjectName = exam.groupID[0]?.groupName || exam.groupID[0]?.subject || 'N/A';
          }
        } else {
          subjectName = exam.groupID.groupName || exam.groupID.subject || 'N/A';
        }
      }

      return {
        id: exam._id || exam.id,
        title: exam.title || 'Untitled Exam',
        timeAgo: timeAgo(exam.createdAt),
        subject: subjectName,
        difficulty: diff,
        status: exam.status || 'Draft'
      };
    });
  }, [recentExams]);

  const growthStats = useMemo(() => {
    if (recentExams.length === 0) {
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

    recentExams.forEach((exam: any) => {
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
  }, [recentExams]);

  return {
    data,
    growthStats,
    totalExams,
    upcomingExams,
    averageCohortScore,
    teacherName,
    isLoading
  };
}
