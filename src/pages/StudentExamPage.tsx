import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { ExamTimer } from '../components/student-exam/ExamTimer';
import { ExamProgressBar } from '../components/student-exam/ExamProgressBar';
import { ExamSidebar } from '../components/student-exam/ExamSidebar';
import { QuestionCard } from '../components/student-exam/QuestionCard';
import { ControlButtons } from '../components/student-exam/ControlButtons';
import type { Question } from '../types/exam';
import { useModalStore } from '../stores/use-modal-store';
import { Modal } from '../components/Common/Modal';
import { startExam, submitExam } from '../api/exams';
import toast from 'react-hot-toast';

export default function StudentExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeModal, openModal, closeModal } = useModalStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState("");
  const [examInfo, setExamInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);

  const startExamSession = async () => {
    setIsLoading(true);
    try {
      const res = await startExam({ examId: id! });
      if (res.data) {
        setAttemptId(res.data.attemptId);
        setExamInfo(res.data.exam);
        const remaining = res.data.exam.closingAt - Math.floor(Date.now() / 1000);
        setTimeLeft(Math.max(0, remaining));
        
        // Map backend questions to frontend format
        const mapped = res.data.questions.map((q: any) => ({
          id: q._id,
          type: q.typeQue === "MCQ" ? "Multiple Choice" : "True/False",
          text: q.title,
          points: 1,
          options: q.typeQue === "MCQ" ? q.options.map((opt: string) => ({ id: opt, text: opt })) : undefined
        }));
        setQuestions(mapped);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to load exam");
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      startExamSession();
    }
  }, [id]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (ans: any) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestion.id)) {
        newFlagged.delete(currentQuestion.id);
      } else {
        newFlagged.add(currentQuestion.id);
      }
      return newFlagged;
    });
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      openModal('confirmSubmitExam');
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    closeModal();
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ansVal]) => ({
        questionId: qId,
        studentAnswer: String(ansVal),
      }));

      const res = await submitExam({
        attemptId,
        answers: formattedAnswers,
      });

      toast.success("Exam submitted successfully!");
      // Navigate to results page immediately
      const resultAttemptId = res?.data?.attemptId || attemptId;
      navigate(`/student/exam-results/${resultAttemptId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to submit exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    openModal('confirmExitExam');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-semibold text-sm">Starting exam session, please wait...</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-semibold text-sm">Submitting exam session, please wait...</p>
      </div>
    );
  }


  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <p className="text-gray-500 font-semibold text-sm">No questions found for this exam.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-extrabold text-lg text-gray-900 tracking-tight">{examInfo?.title || "Exam"}</h1>
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
            Practice
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ExamTimer key={timeLeft} initialSeconds={timeLeft} />
          <button
            onClick={handleExit}
            className="text-gray-500 hover:text-rose-600 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Exam</span>
          </button>
        </div>
      </header>

      <ExamProgressBar total={questions.length} answered={Object.keys(answers).length} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <ExamSidebar
          questions={questions}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          answers={answers}
          flagged={flagged}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-50/50">
          <div className="w-full max-w-4xl flex flex-col h-full">
            <div className="flex-1">
              <QuestionCard
                question={currentQuestion}
                number={currentIndex + 1}
                answer={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
              />
            </div>
            <ControlButtons
              isFirst={currentIndex === 0}
              isLast={currentIndex === questions.length - 1}
              onPrev={() => setCurrentIndex(p => Math.max(0, p - 1))}
              onNext={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
              isFlagged={flagged.has(currentQuestion.id)}
              onToggleFlag={handleToggleFlag}
              onSubmit={handleSubmitClick}
            />
          </div>
        </main>
      </div>

      {/* Confirmation Modals */}
      <Modal 
        isOpen={activeModal === 'confirmSubmitExam'}
        onClose={closeModal}
        title="Unanswered Questions"
        description={
          <>
            You have only answered {Object.keys(answers).length} out of {questions.length} questions. Are you sure you want to submit your exam now?
          </>
        }
        primaryActionText="Submit Anyway"
        primaryActionOnClick={executeSubmit}
        primaryActionColor="indigo"
        secondaryActionText="Go Back"
      />

      <Modal 
        isOpen={activeModal === 'confirmExitExam'}
        onClose={closeModal}
        title="Exit Exam?"
        description="Are you sure you want to exit? Your progress may be lost if you leave before submitting."
        primaryActionText="Exit Exam"
        primaryActionOnClick={() => {
          closeModal();
          navigate('/student/dashboard');
        }}
        primaryActionColor="rose"
        secondaryActionText="Cancel"
      />

    </div>
  );
}
