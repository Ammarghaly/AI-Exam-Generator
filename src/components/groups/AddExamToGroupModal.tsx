import React, { useState } from "react";
import toast from "react-hot-toast";
import { publishAIExam } from "../../api/exams";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupTitle: string;
  exams: any[];
  currentUser: any;
}

export default function AddExamToGroupModal({ isOpen, onClose, groupId, groupTitle, exams, currentUser }: Props) {
  const [selectedExamId, setSelectedExamId] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  if (!isOpen) return null;

  const handlePublishExamToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) {
      toast.error("Please select an exam");
      return;
    }
    if (!availableFrom) {
      toast.error("Please select an available from date and time");
      return;
    }
    if (!deadline) {
      toast.error("Please select a deadline date and time");
      return;
    }

    const availableDate = new Date(availableFrom);
    const deadlineDate = new Date(deadline);

    if (deadlineDate <= availableDate) {
      toast.error("Deadline must be after the available start date");
      return;
    }

    setIsSubmittingExam(true);
    try {
      const selectedExam = exams.find((ex: any) => ex._id === selectedExamId);
      const payload = {
        examId: selectedExamId,
        examDetails: {
          title: selectedExam?.title || "Exam",
          openingAt: Math.floor(availableDate.getTime() / 1000),
          closingAt: Math.floor(deadlineDate.getTime() / 1000),
          durationMinutes: selectedExam?.durationMinutes || 60,
          accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          status: "Active" as const,
          teacherID: currentUser?._id || "",
        }
      };

      await publishAIExam(groupId, payload);
      toast.success(`Exam successfully assigned to group "${groupTitle}"!`);
      onClose();
      setSelectedExamId("");
      setAvailableFrom("");
      setDeadline("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to assign exam to group");
    } finally {
      setIsSubmittingExam(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-full md:max-w-[500px] border border-gray-100 shadow-xl text-left w-full">
        <h3 className="text-xl font-bold text-gray-950 mb-2">Add Exam to {groupTitle}</h3>
        <p className="text-sm text-gray-500 mb-6">Select one of your exams and specify the release and deadline times.</p>
        
        <form onSubmit={handlePublishExamToGroup} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Select Exam</label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose an exam...</option>
              {exams.map((ex: any) => (
                <option key={ex._id} value={ex._id}>{ex.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Available From</label>
            <input
              type="datetime-local"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingExam}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingExam ? "Assigning..." : "Add to Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
