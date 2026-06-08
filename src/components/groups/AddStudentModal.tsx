// src/components/groups/AddStudentModal.tsx

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, Search, UserPlus, ArrowLeft, Sparkles } from "lucide-react";

import { searchStudents, addStudentToGroup } from "../../api/groups";
import type { SearchedStudent } from "../../types/group.types";

// ── Avatar helpers ────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-orange-100", text: "text-orange-500" },
  { bg: "bg-teal-100",   text: "text-teal-600"   },
  { bg: "bg-pink-100",   text: "text-pink-600"   },
  { bg: "bg-sky-100",    text: "text-sky-600"    },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function getColor(name: string) {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AddStudentModal({
  isOpen,
  onClose,
  groupId,
  groupName,
}: AddStudentModalProps) {
  const queryClient = useQueryClient();

  // View: "search" | "success"
  const [view, setView]               = useState<"search" | "success">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput]   = useState("");
  const [addedName, setAddedName]     = useState("");
  const [debouncedQ, setDebouncedQ]   = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setView("search");
      setSearchQuery("");
      setEmailInput("");
      setAddedName("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQuery.trim()), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Fetch suggestions ───────────────────────────────────────────────────────
  const { data: suggestions = [], isFetching } = useQuery<SearchedStudent[]>({
    queryKey: ["studentSearch", debouncedQ],
    queryFn: () => searchStudents(debouncedQ),
    enabled: debouncedQ.length >= 2,
    staleTime: 30_000,
  });

  // Static fallback shown when no query typed yet
  const FALLBACK_SUGGESTIONS: SearchedStudent[] = [
    { _id: "f1", name: "Alice Sterling",  email: "a.sterling@physics.edu" },
    { _id: "f2", name: "Ben Jamieson",    email: "ben.j@quantum.org"      },
    { _id: "f3", name: "Clara Rodriguez", email: "clara.rod@university.ac" },
  ];

  const displayed = debouncedQ.length >= 2 ? suggestions : FALLBACK_SUGGESTIONS;

  // ── Add student mutation ────────────────────────────────────────────────────
  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (email: string) => addStudentToGroup(groupId, email),
    onSuccess: (data, email) => {
      // Try to get name from search results, fallback to email prefix
      const found = displayed.find((s) => s.email === email);
      setAddedName(found?.name ?? data?.addedStudent?.name ?? email.split("@")[0]);
      setView("success");
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: () => toast.error("Failed to add student. Check the email and try again."),
  });

  const handleAddByEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    addStudent(trimmed);
  };

  const handleAddSuggested = (student: SearchedStudent) => {
    addStudent(student.email);
  };

  const handleAddAnother = () => {
    setView("search");
    setSearchQuery("");
    setEmailInput("");
    setAddedName("");
  };

  if (!isOpen) return null;

  // ── Modal markup ─────────────────────────────────────────────────────────────
  const modalContent = (
    // ── Backdrop ──────────────────────────────────────────────────────────────
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ maxWidth: '32rem', width: '100%', margin: '0 1rem' }} className="bg-white rounded-3xl shadow-2xl">

        {/* ══════════════════════ SEARCH VIEW ══════════════════════ */}
        {view === "search" && (
          <>
            {/* Header */}
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
              {/* Search input */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-indigo-400 focus:border-indigo-600 focus:outline-none text-sm text-gray-700 placeholder-gray-400 transition-colors"
                />
              </div>

              {/* Suggestions list */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Suggested Students
                </p>
                <div className="space-y-1">
                  {isFetching ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : displayed.length > 0 ? (
                    displayed.map((student) => {
                      const color = getColor(student.name);
                      return (
                        <div
                          key={student._id}
                          className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${color.bg} ${color.text}`}
                          >
                            {getInitials(student.name)}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{student.email}</p>
                          </div>
                          {/* Add button */}
                          <button
                            onClick={() => handleAddSuggested(student)}
                            disabled={isPending}
                            className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-40"
                          >
                            Add
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No students found.
                    </p>
                  )}
                </div>
              </div>

              {/* Add by Email */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Add by Email</p>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddByEmail()}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-400 focus:outline-none text-sm text-gray-700 placeholder-gray-400 transition-colors"
                />
              </div>

              {/* Footer buttons */}
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
                  Invite to Group
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════ SUCCESS VIEW ══════════════════════ */}
        {view === "success" && (
          <div className="px-8 py-10 flex flex-col items-center text-center">
            {/* Illustration card */}
            <div className="w-48 h-44 bg-gray-50 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-inner">
              {/* Graduation cap illustration via SVG */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" rx="16" fill="#EEF2FF"/>
                {/* Cap base */}
                <path d="M40 22L16 34L40 46L64 34L40 22Z" fill="#4338CA" opacity="0.9"/>
                {/* Left brim shadow */}
                <path d="M16 34L16 48L40 46L16 34Z" fill="#312E81" opacity="0.3"/>
                {/* Cap top */}
                <rect x="36" y="16" width="8" height="8" rx="2" fill="#4F46E5"/>
                {/* Tassel */}
                <line x1="64" y1="34" x2="64" y2="48" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="64" cy="51" r="3" fill="#6366F1"/>
                {/* Check badge */}
                <circle cx="54" cy="24" r="10" fill="#4F46E5"/>
                <path d="M49 24L52.5 27.5L59 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">
                Academic Growth
              </p>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Student Added Successfully
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">{addedName}</span> has been
              invited to{" "}
              <span className="font-bold text-indigo-600">{groupName}</span>.
              <br />
              They will receive an email notification shortly.
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent my-7" />

            {/* Actions */}
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

            {/* Footer note */}
            <div className="flex items-center gap-1.5 mt-6 text-xs text-indigo-400 font-medium">
              <Sparkles size={13} />
              Profile automatically synced with school database
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // ── Render via Portal so `fixed` positioning is never trapped by a
  //    parent with transform/filter/will-change on it ─────────────────────────
  return createPortal(modalContent, document.body);
}