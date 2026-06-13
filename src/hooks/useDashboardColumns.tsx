import { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateExamStatus } from '../api/exams';
import { MoreVertical, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';
import { FloatingDropdown } from '../components/ui/FloatingDropdown';

export type Generation = {
  id: string | number;
  title: string;
  timeAgo: string;
  subject: string;
  difficulty: string;
  status: string;
};

const STATUS_OPTIONS = ['Active', 'Closed', 'Hidden'] as const;

export function DashboardExamActions({ row }: { row: any }) {
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

export function useDashboardColumns() {
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

  return { columns };
}
