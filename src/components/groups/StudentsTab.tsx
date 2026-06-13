import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import StudentRow from "./StudentRow";
import type { Student } from "../../types/group.types";

interface Props {
  paginatedStudents: Student[];
  mappedStudentsLength: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  itemsPerPage: number;
  removeStudent: (id: string) => void;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StudentsTab({
  paginatedStudents,
  mappedStudentsLength,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  removeStudent,
  setIsAddModalOpen,
}: Props) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Students List</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add Student
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Student Name
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Student ID
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Join Date
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onRemove={(id) => removeStudent(id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                  No students in this group yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, mappedStudentsLength)}–
            {Math.min(currentPage * itemsPerPage, mappedStudentsLength)} of {mappedStudentsLength} students
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
