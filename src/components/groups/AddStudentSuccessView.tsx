import { UserPlus, ArrowLeft, Sparkles } from "lucide-react";

interface Props {
  addedName: string;
  groupName: string;
  handleAddAnother: () => void;
  onClose: () => void;
}

export default function AddStudentSuccessView({
  addedName,
  groupName,
  handleAddAnother,
  onClose,
}: Props) {
  return (
    <div className="px-8 py-10 flex flex-col items-center text-center">
      <div className="w-48 h-44 bg-gray-50 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-inner">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="80" rx="16" fill="#EEF2FF" />
          <path d="M40 22L16 34L40 46L64 34L40 22Z" fill="#4338CA" opacity="0.9" />
          <path d="M16 34L16 48L40 46L16 34Z" fill="#312E81" opacity="0.3" />
          <rect x="36" y="16" width="8" height="8" rx="2" fill="#4F46E5" />
          <line x1="64" y1="34" x2="64" y2="48" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="64" cy="51" r="3" fill="#6366F1" />
          <circle cx="54" cy="24" r="10" fill="#4F46E5" />
          <path d="M49 24L52.5 27.5L59 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">
          Academic Growth
        </p>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
        Student Added Successfully
      </h2>

      <p className="text-sm text-gray-500 leading-relaxed">
        <span className="font-semibold text-gray-700">{addedName}</span> has been
        added to{" "}
        <span className="font-bold text-indigo-600">{groupName}</span>.
      </p>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent my-7" />

      <div className="w-full space-y-3">
        <button
          onClick={handleAddAnother}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[.98] text-white font-bold rounded-2xl shadow-md transition-all"
        >
          <UserPlus size={17} />
          Add Another Student
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-gray-200 hover:bg-gray-50 active:scale-[.98] text-gray-700 font-semibold rounded-2xl transition-all"
        >
          <ArrowLeft size={16} />
          Back to Group
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-6 text-xs text-indigo-400 font-medium">
        <Sparkles size={13} />
        Profile automatically synced with school database
      </div>
    </div>
  );
}
