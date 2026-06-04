import { useMemo } from 'react';
import { DataTable } from '../ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { cn } from '../../lib/utils';

type Assessment = {
  id: string;
  title: string;
  course: string;
  status: 'READY' | 'OUT FOR REVIEW' | 'PUBLISHED' | 'DRAFT';
  date: string;
};

const assessmentsData: Assessment[] = [
  { id: '1', title: 'Intro to Quantum Theory', course: 'PHY-101', status: 'READY', date: 'Oct 28, 2023' },
  { id: '2', title: 'Advanced Fluid Dynamics', course: 'MECH-425', status: 'OUT FOR REVIEW', date: 'Oct 28, 2023' },
  { id: '3', title: 'Ethics in AI - Final', course: 'PHIL-220', status: 'PUBLISHED', date: 'Oct 28, 2023' },
  { id: '4', title: 'Macroeconomics Quiz 3', course: 'ECON-102', status: 'DRAFT', date: 'Nov 01, 2023' },
];

const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'title',
    header: 'EXAM TITLE',
    cell: ({ row }) => (
      <span className="font-bold text-gray-900">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'course',
    header: 'COURSE',
    cell: ({ row }) => <span className="text-sm font-semibold text-gray-500">{row.original.course}</span>,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeClass = '';
      if (status === 'READY') badgeClass = 'bg-emerald-100 text-emerald-700';
      else if (status === 'OUT FOR REVIEW') badgeClass = 'bg-orange-100 text-orange-700';
      else if (status === 'PUBLISHED') badgeClass = 'bg-blue-100 text-blue-700';
      else if (status === 'DRAFT') badgeClass = 'bg-gray-100 text-gray-600';

      return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase", badgeClass)}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'DATE',
    cell: ({ row }) => <span className="text-sm font-semibold text-gray-500">{row.original.date}</span>,
  },
  {
    id: 'actions',
    header: () => <div className="text-right w-full font-bold text-gray-400 text-xs tracking-wider">ACTIONS</div>,
    cell: () => (
      <div className="flex justify-end">
        <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>
    )
  }
];

export function ExamsTable() {
  const data = useMemo(() => assessmentsData, []);

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-extrabold text-gray-900">Recent Generations</h3>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          View All Assessments
        </button>
      </div>
      <div className="flex-1 overflow-x-auto p-0">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
