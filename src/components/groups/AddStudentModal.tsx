import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, UserPlus,  Sparkles } from "lucide-react";

import { addStudentToGroup } from "../../api/groups";



// ── Props ─────────────────────────────────────────────────────────────────────
interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  groupId,
  groupName,
}: AddStudentModalProps) {
  const queryClient = useQueryClient();

  const [view, setView] = useState<"search" | "success">("search");
  const [emailInput, setEmailInput] = useState("");
  const [addedName, setAddedName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setView("search");
      setEmailInput("");
      setAddedName("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // ── Add student mutation ────────────────────────────────────────────────────
  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (email: string) => addStudentToGroup(groupId, email),
    onSuccess: (data, email) => {
      setAddedName(
        data?.addedStudent?.name ?? email.split("@")[0]
      );

      setView("success");

      queryClient.invalidateQueries({
        queryKey: ["groupDetails", groupId],
      });
    },
    onError: () =>
      toast.error("Failed to add student. Check the email and try again."),
  });



  const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleAddByEmail = () => {
  const trimmed = emailInput.trim();

  if (!trimmed) {
    toast.error("Email is required.");
    return;
  }

  if (!isValidEmail(trimmed)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  addStudent(trimmed);
};

  const handleAddAnother = () => {
    setView("search");
    setEmailInput("");
    setAddedName("");
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div
        style={{ maxWidth: "32rem", width: "100%", margin: "0 1rem" }}
        className="bg-white rounded-3xl shadow-2xl"
      >
        {/* ══════════════════════ SEARCH VIEW ══════════════════════ */}
        {view === "search" && (
          <>
            <div className="flex items-center justify-between px-7 pt-7 pb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Add Student
              </h2>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-7 pb-7 space-y-6">
              {/* Email input فقط */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Add by Email
                </p>

                <input
                  ref={inputRef}
                  type="email"
                  placeholder="student@example.com"
                  value={emailInput}
                  onChange={(e) =>
                    setEmailInput(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleAddByEmail()
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-400 focus:outline-none text-sm"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-500"
                >
                  Cancel
                </button>

                <button
  onClick={handleAddByEmail}
  disabled={isPending || !isValidEmail(emailInput.trim())}
  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl disabled:opacity-40"
>
                  {isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus size={15} />
                  )}
                  Invite to Group
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════ SUCCESS VIEW ══════════════════════ */}
        {view === "success" && (
          <div className="px-8 py-10 flex flex-col items-center text-center">
            <div className="w-48 h-44 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
              >
                <rect width="80" height="80" rx="16" fill="#EEF2FF" />
                <path
                  d="M40 22L16 34L40 46L64 34L40 22Z"
                  fill="#4338CA"
                />
                <circle
                  cx="54"
                  cy="24"
                  r="10"
                  fill="#4F46E5"
                />
                <path
                  d="M49 24L52.5 27.5L59 21"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>

              <p className="text-xs font-bold text-gray-400 mt-3">
                Success
              </p>
            </div>

            <h2 className="text-2xl font-extrabold mb-2">
              Student Added Successfully
            </h2>

            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">
                {addedName}
              </span>{" "}
              has been invited to{" "}
              <span className="font-bold text-indigo-600">
                {groupName}
              </span>
            </p>

            <div className="w-full h-px bg-gray-200 my-7" />

            <button
              onClick={handleAddAnother}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl mb-3"
            >
              Add Another Student
            </button>

            <button
              onClick={onClose}
              className="w-full py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-2xl"
            >
              Back to Group
            </button>

            <div className="flex items-center gap-2 mt-6 text-xs text-indigo-400">
              <Sparkles size={12} />
              Synced with database
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}