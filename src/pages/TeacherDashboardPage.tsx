import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyExams, updateExamStatus } from '../api/exams';
import {
  FileText,
  MoreVertical,
  BarChart3,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '../lib/utils';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import toast from 'react-hot-toast';
import { FloatingDropdown } from '../components/ui/FloatingDropdown';

type Generation = {
  id: string | number;
  title: string;
  timeAgo: string;
  subject: string;
  difficulty: string;
  status: string;
};

const STATUS_OPTIONS = ['Active', 'Closed', 'Hidden'] as const;

function DashboardExamActions({ row }: { row: any }) {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const t = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(t) &&
        btnRef.current && !btnRef.current.contains(t)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = useCallback(async (status: 'Active' | 'Closed' | 'Hidden') => {
    if (status === row.original.status) { setShowMenu(false); return; }
    try {
      setIsUpdating(true);
      setShowMenu(false);
      await updateExamStatus(String(row.original.id), status);
      await queryClient.invalidateQueries({ queryKey: ['myExams'] });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  }, [row.original.id, row.original.status, queryClient]);

  return (
    <div className="flex justify-end">
      <button
        ref={btnRef}
        onClick={() => setShowMenu((v) => !v)}
        disabled={isUpdating}
        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
      </button>
      <FloatingDropdown triggerRef={btnRef} open={showMenu} width={176}>
        <div ref={menuRef}>
          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
            Change Status
          </div>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={cn(
                'w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-700',
                row.original.status === s && 'bg-indigo-50 text-indigo-700 font-semibold'
              )}
            >
              <CheckCircle className={cn('w-4 h-4 flex-shrink-0', row.original.status === s ? 'opacity-100 text-indigo-600' : 'opacity-0')} />
              {s}
            </button>
          ))}
        </div>
      </FloatingDropdown>
    </div>
  );
}

const columns: ColumnDef<Generation>[] = [
  {
    accessorKey: 'title',
    header: 'Exam Title',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.original.title}</span>
        <span className="text-xs text-gray-500 mt-0.5">{row.original.timeAgo}</span>
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.subject}</span>,
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => {
      const diff = row.original.difficulty;
      let badgeClass = '';
      if (diff === 'Hard') badgeClass = 'bg-rose-100 text-rose-800';
      else if (diff === 'Medium' || diff === 'Normal') badgeClass = 'bg-indigo-100 text-indigo-800';
      else badgeClass = 'bg-sky-100 text-sky-800';
      return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", badgeClass)}>
          {diff}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === 'Ready for Review' || status === 'Ready' || status === 'Active' || status === 'Published') {
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            <span className="text-sm text-gray-700">{status}</span>
          </div>
        );
      } else if (status === 'Draft' || status === 'Hidden') {
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-700">{status}</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Sparkles className="w-4 h-4 animate-pulse text-orange-600" />
            <span className="text-sm italic text-orange-600">{status}</span>
          </div>
        );
      }
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right w-full">Actions</div>,
    cell: ({ row }) => <DashboardExamActions row={row} />,
  }
];

export default function TeacherDashboardPage() {
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

  const totalExams = isLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-indigo-700 inline" />
  ) : (
    response?.data?.length ?? 0
  );

  const upcomingExams = isLoading ? (
    <Loader2 className="w-5 h-5 animate-spin text-indigo-700 inline" />
  ) : (
    response?.data?.filter((exam: any) => {
      if (!exam.openingAt) return false;
      const timeMs = exam.openingAt < 9999999999 ? exam.openingAt * 1000 : exam.openingAt;
      return timeMs > Date.now();
    }).length ?? 0
  );

  return (
    <TeacherLayout>
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Welcome Section */}
          <div>
            <h2 className="text-4xl md:text-[40px] font-bold text-gray-900 tracking-tight mb-2">Welcome back, Professor</h2>
            <p className="text-lg text-gray-500">Here is an overview of your academic activities for this semester.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Exams Generated"
              value={totalExams}
              icon={FileText}
              iconClassName="bg-indigo-50 text-indigo-700"
              badgeText={growthStats.badgeText}
              badgeClassName={growthStats.badgeClassName}
              bgShapeClassName="bg-indigo-100/40"
            />
            <StatsCard
              title="Average Cohort Score"
              value={<>76.4<span className="text-xl text-gray-500 ml-1">%</span></>}
              icon={BarChart3}
              iconClassName="bg-sky-50 text-sky-700"
              badgeText="Stable"
              badgeClassName="bg-sky-100 text-sky-800"
              bgShapeClassName="bg-sky-100/40"
            />
            <StatsCard
              title="Upcoming Scheduled Exams"
              value={upcomingExams}
              icon={Calendar}
              iconClassName="bg-orange-50 text-orange-700"
              badgeText="Next 7 Days"
              badgeClassName="bg-gray-100 text-gray-700"
              bgShapeClassName="bg-orange-100/40"
            />
          </div>

          {/* Recent Exams Section */}
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(30,64,175,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Recent Exam Generations</h3>
              {/* <button className="text-sm font-bold text-indigo-700 hover:text-indigo-800 transition-colors flex items-center gap-1 mt-2 sm:mt-0">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button> */}
            </div>
            <div className="p-0 overflow-x-auto min-h-[150px] flex flex-col justify-center">
              {isLoading ? (
                <div className="flex items-center justify-center p-8 gap-2 text-gray-500 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span>Loading recent generations...</span>
                </div>
              ) : data.length === 0 ? (
                <div className="text-center p-8 text-gray-400 font-medium">
                  No exams generated yet. Start by generating one!
                </div>
              ) : (
                <DataTable columns={columns} data={data} />
              )}
            </div>
          </div>
        </div>
      </main>
    </TeacherLayout>
  );
}