import { Calendar, Clock } from "lucide-react";

export function ExamInfo() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Advanced Data Structures</h1>
      <p className="text-lg text-gray-500 mt-1 font-medium">Midterm Evaluation Review</p>
      
      <div className="flex items-center gap-3 mt-5">
        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4" /> Oct 24, 2023
        </span>
        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4" /> 45 Mins
        </span>
      </div>
    </div>
  );
}
