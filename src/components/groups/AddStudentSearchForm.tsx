import { X, UserPlus } from "lucide-react";

interface Props {
  onClose: () => void;
  emailInput: string;
  setEmailInput: (val: string) => void;
  handleAddByEmail: () => void;
  isPending: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function AddStudentSearchForm({
  onClose,
  emailInput,
  setEmailInput,
  handleAddByEmail,
  isPending,
  inputRef,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between px-7 pt-7 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Add Student</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-7 pb-7 space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Student Email</p>
          <input
            ref={inputRef}
            type="email"
            placeholder="student@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddByEmail()}
            className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-400 focus:border-indigo-600 focus:outline-none text-sm text-gray-700 placeholder-gray-400 transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddByEmail}
            disabled={isPending || !emailInput.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UserPlus size={15} />
            )}
            Add to Group
          </button>
        </div>
      </div>
    </>
  );
}
