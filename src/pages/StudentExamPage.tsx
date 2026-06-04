import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, Check } from 'lucide-react';
import { ExamTimer } from '../components/student-exam/ExamTimer';
import { ExamProgressBar } from '../components/student-exam/ExamProgressBar';
import { ExamSidebar } from '../components/student-exam/ExamSidebar';
import { QuestionCard } from '../components/student-exam/QuestionCard';
import { ControlButtons } from '../components/student-exam/ControlButtons';
import type { Question } from '../types/exam';
import { useModalStore } from '../stores/use-modal-store';
import { Modal } from '../components/Common/Modal';

const DUMMY_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'Multiple Choice',
    text: 'What is the capital of France?',
    points: 5,
    options: [
      { id: 'opt1', text: 'Paris' },
      { id: 'opt2', text: 'London' },
      { id: 'opt3', text: 'Berlin' },
      { id: 'opt4', text: 'Madrid' },
    ]
  },
  {
    id: 'q2',
    type: 'True/False',
    text: 'The Earth is flat.',
    points: 5,
  },
  {
    id: 'q3',
    type: 'Short Answer',
    text: 'What does HTML stand for?',
    points: 10,
  },
  {
    id: 'q4',
    type: 'Essay',
    text: 'Explain the importance of responsive design in modern web applications. Provide examples.',
    points: 20,
  },
  {
    id: 'q5',
    type: 'Multiple Choice',
    text: 'Which of the following is a Javascript framework?',
    points: 5,
    options: [
      { id: 'opt1', text: 'React' },
      { id: 'opt2', text: 'Django' },
      { id: 'opt3', text: 'Laravel' },
      { id: 'opt4', text: 'Spring' },
    ]
  }
];

export default function StudentExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { activeModal, openModal, closeModal } = useModalStore();

  const currentQuestion = DUMMY_QUESTIONS[currentIndex];

  const handleAnswerChange = (ans: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
  };

  const handleToggleFlag = () => {
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

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < DUMMY_QUESTIONS.length) {
      openModal('confirmSubmitExam');
    } else {
      setIsSubmitted(true);
    }
  };

  const handleExit = () => {
    openModal('confirmExitExam');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-lg">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Exam Submitted!</h1>
          <p className="text-gray-500 font-medium mb-8">Your exam has been successfully submitted. You can now close this window or return to your dashboard.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-extrabold text-lg text-gray-900 tracking-tight">Midterm Exam: Focus Mode</h1>
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
            ID: {id || '101'}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ExamTimer initialSeconds={3600} />
          <button
            onClick={handleExit}
            className="text-gray-500 hover:text-rose-600 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Exam</span>
          </button>
        </div>
      </header>

      <ExamProgressBar total={DUMMY_QUESTIONS.length} answered={Object.keys(answers).length} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <ExamSidebar
          questions={DUMMY_QUESTIONS}
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
              isLast={currentIndex === DUMMY_QUESTIONS.length - 1}
              onPrev={() => setCurrentIndex(p => Math.max(0, p - 1))}
              onNext={() => setCurrentIndex(p => Math.min(DUMMY_QUESTIONS.length - 1, p + 1))}
              isFlagged={flagged.has(currentQuestion.id)}
              onToggleFlag={handleToggleFlag}
              onSubmit={handleSubmit}
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
            You have only answered {Object.keys(answers).length} out of {DUMMY_QUESTIONS.length} questions. Are you sure you want to submit your exam now?
          </>
        }
        primaryActionText="Submit Anyway"
        primaryActionOnClick={() => {
          closeModal();
          setIsSubmitted(true);
        }}
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
          navigate('/');
        }}
        primaryActionColor="rose"
        secondaryActionText="Cancel"
      />

    </div>
  );
}
