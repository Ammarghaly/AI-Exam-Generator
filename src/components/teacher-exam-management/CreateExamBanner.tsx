import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateExamBanner() {
  return (
    <div className="bg-indigo-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-600/20">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-bold text-white mb-2">Ready for a new assessment?</h3>
        <p className="text-indigo-100 font-medium leading-relaxed">Leverage our AI engine to generate high-quality exam questions based on your lecture notes and course curriculum in seconds.</p>
      </div>
      <Link to="/teacher/generate-exam" className="whitespace-nowrap bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Create New Exam
      </Link>
    </div>
  );
}
