import { LogOut, Loader2 } from 'lucide-react';
import { ExamTimer } from '../components/student-exam/ExamTimer';
import { ExamProgressBar } from '../components/student-exam/ExamProgressBar';
import { ExamSidebar } from '../components/student-exam/ExamSidebar';
import { QuestionCard } from '../components/student-exam/QuestionCard';
import { ControlButtons } from '../components/student-exam/ControlButtons';
import { Modal } from '../components/Common/Modal';
import { useStudentExam } from '../hooks/useStudentExam';

export default function StudentExamPage() {
  const {
    navigate,
    currentIndex,
    setCurrentIndex,
    answers,
    flagged,
    isSubmitting,
    activeModal,
    closeModal,
    questions,
    examInfo,
    isLoading,
    timeLeft,
    currentQuestion,
    handleAnswerChange,
    handleToggleFlag,
    handleSubmitClick,
    executeSubmit,
    handleExit,
  } = useStudentExam();

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
