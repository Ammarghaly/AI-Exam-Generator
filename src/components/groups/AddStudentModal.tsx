// src/components/groups/AddStudentModal.tsx

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { X, UserPlus, ArrowLeft, Sparkles } from "lucide-react";

import { addStudentToGroup } from "../../api/groups";
import AddStudentSearchForm from "./AddStudentSearchForm";
import AddStudentSuccessView from "./AddStudentSuccessView";

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

  const [view, setView]             = useState<"search" | "success">("search");
  const [emailInput, setEmailInput] = useState("");
  const [addedName, setAddedName]   = useState("");

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

  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: (email: string) => addStudentToGroup(groupId, email),
    onSuccess: (data, email) => {
      setAddedName(data?.addedStudent?.name || email.split("@")[0]);
      setView("success");
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
    },
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || "Failed to add student. Check the email and try again.";
      toast.error(errMsg);
    },
  });

  const handleAddByEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes("@")) {
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

        {/* ══════════════════════ FORM VIEW ══════════════════════ */}
        {view === "search" && (
          <AddStudentSearchForm
            onClose={onClose}
            emailInput={emailInput}
            setEmailInput={setEmailInput}
            handleAddByEmail={handleAddByEmail}
            isPending={isPending}
            inputRef={inputRef}
          />
        )}

        {/* ══════════════════════ SUCCESS VIEW ══════════════════════ */}
        {view === "success" && (
          <AddStudentSuccessView
            addedName={addedName}
            groupName={groupName}
            handleAddAnother={handleAddAnother}
            onClose={onClose}
          />
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}