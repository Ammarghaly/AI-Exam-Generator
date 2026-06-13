import type { AssignedExam } from "../../types/group.types";

interface Props {
  assignedExams?: AssignedExam[];
  examStatusStyles: Record<string, string>;
}

export default function ExamsTab({ assignedExams, examStatusStyles }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Exam Title</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Due Date</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Submissions</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignedExams && assignedExams.length > 0 ? (
            assignedExams.map((exam) => (
              <tr key={exam.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{exam.title}</td>
                <td className="px-6 py-4 text-gray-500">{exam.dueDate}</td>
                <td className="px-6 py-4 text-gray-500">{exam.submissions} / {exam.totalStudents}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${examStatusStyles[exam.status] || 'bg-blue-100 text-blue-700'}`}>
                    {exam.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                No exams assigned to this group yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
