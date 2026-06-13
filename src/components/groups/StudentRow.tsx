import { UserMinus } from "lucide-react";

import type { Student } from "../../types/group.types";

interface Props {
  student: Student;
  onRemove: (id: string) => void;
}

export default function StudentRow({ student, onRemove }: Props) {
  return (
    <tr className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors group">
      {/* Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={
              student.avatar ||
              "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png"
            }
            alt={student.name}
            className="w-9 h-9 rounded-full object-cover shrink-0 border-2"
            style={{ borderColor: student.avatarColor + "55" }}
          />
          <span className="text-sm font-semibold text-gray-800">
            {student.name}
          </span>
        </div>
      </td>

      {/* Student ID */}
      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
        {student.studentId}
      </td>

      {/* Join Date */}
      <td className="px-6 py-4 text-sm text-gray-600">{student.joinDate}</td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            student.status === "Active"
              ? "bg-green-100 text-green-700"
              : student.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {student.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <button
          onClick={() => onRemove(student.id)}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors opacity-100 group-hover:opacity-100"
        >
          <UserMinus size={14} />
          Remove
        </button>
      </td>
    </tr>
  );
}