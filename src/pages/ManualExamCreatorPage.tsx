import { useState } from 'react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { Pencil, Plus, Eye, Play } from 'lucide-react';
import { QuestionCard } from '../components/manual-exam/QuestionCard';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { PageHeader } from '../components/Common/PageHeader';
import { PublishSettingsArea } from '../components/Common/PublishSettingsArea';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

export type QuestionType = 'Multiple Choice' | 'True/False' | 'Short Answer' | 'Essay';

const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['Multiple Choice', 'True/False', 'Short Answer', 'Essay']),
  points: z.number().min(1, 'Points must be at least 1'),
  text: z.string().min(1, 'Question text is required'),
  options: z.array(optionSchema).optional(),
  idealAnswer: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'Multiple Choice') {
    if (!data.options || data.options.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Multiple Choice requires exactly 4 options',
        path: ['options'],
      });
    } else {
      const hasCorrect = data.options.some(o => o.isCorrect);
      if (!hasCorrect) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a correct option',
          path: ['options'],
        });
      }
    }
  }
});

const examSchema = z.object({
  examTitle: z.string().min(1, 'Exam title is required'),
  targetGroup: z.string().min(1, 'Target group is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  availableFrom: z.date({ message: 'Available from date is required' }).optional(),
  deadline: z.date({ message: 'Deadline date is required' }).optional(),
  allowImmediateAI: z.boolean().optional(),
  allowReview: z.boolean().optional(),
  randomizeQuestions: z.boolean().optional(),
});

export type ExamFormValues = z.infer<typeof examSchema>;

export default function ManualExamCreatorPage() {
  const [step, setStep] = useState<'build' | 'publish'>('build');

  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      examTitle: '',
      targetGroup: '',
      availableFrom: new Date(),
      deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
      allowImmediateAI: false,
      allowReview: false,
      randomizeQuestions: false,
      questions: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'Multiple Choice',
          points: 5,
          text: '',
          options: [
            { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: true },
            { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
            { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
            { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  const { control, handleSubmit, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const totalPoints = methods.watch('questions').reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  const addQuestion = () => {
    append({
      id: Math.random().toString(36).substring(2, 9),
      type: 'Multiple Choice',
      points: 5,
      text: '',
      options: [
        { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: true },
        { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
        { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
        { id: Math.random().toString(36).substring(2, 9), text: '', isCorrect: false },
      ],
    });
  };

  const duplicateQuestion = (index: number) => {
    const qToCopy = methods.getValues(`questions.${index}`);
    append({
      ...qToCopy,
      id: Math.random().toString(36).substring(2, 9),
      options: qToCopy.options?.map(opt => ({ ...opt, id: Math.random().toString(36).substring(2, 9) })),
    });
  };

  const onSubmit = (data: ExamFormValues) => {
    console.log('Publishing Exam with Data:', data);
    toast.success('Exam successfully published!');
  };

  const onInvalid = () => {
    toast.error('Please fix the errors before publishing.');
  };

  const handleProceed = async () => {
    const isValid = await methods.trigger(['examTitle', 'questions']);
    if (isValid) {
      setStep('publish');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fix the errors in your exam before proceeding.');
    }
  };

  return (
    <TeacherLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex-1 flex flex-col overflow-y-auto bg-slate-50 relative">

          {step === 'build' ? (
            <>
              <main className="p-8 mx-auto w-full space-y-6 pb-12 flex-1 max-w-5xl">

                {/* Breadcrumbs */}
                <Breadcrumb
                  items={[
                    { label: 'Dashboard', href: '/teacher/dashboard' },
                    { label: 'Exams', href: '/teacher/exam-management' },
                    { label: 'Create Manual Exam' }
                  ]}
                />

                {/* Header */}
                <PageHeader
                  title="Create New Assessment"
                  subtitle="Design your comprehensive exam questions manually."
                  badge={{ icon: Pencil, text: 'Manual Mode' }}
                />

                {/* Exam Metadata Form */}
                <div className="mt-8">
                  <div className="space-y-1.5 w-full">
                    <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">Exam Title</label>
                    <input
                      type="text"
                      {...methods.register('examTitle')}
                      placeholder="e.g., Intro to Quantum Mechanics - Midterm"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                    {errors.examTitle && <p className="text-red-500 text-xs font-semibold">{errors.examTitle.message}</p>}
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6 mt-8">
                  {fields.map((field, index) => (
                    <QuestionCard
                      key={field.id}
                      index={index}
                      onDelete={() => remove(index)}
                      onDuplicate={() => duplicateQuestion(index)}
                    />
                  ))}
                </div>

                {/* Add Question Button */}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-10 mt-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 flex flex-col items-center justify-center hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-indigo-600 text-base">Add Question</span>
                  <span className="text-sm font-medium text-gray-500 mt-1">MCQ, T/F, Short Answer, or Essay</span>
                </button>

              </main>

              {/* Sticky Footer Action Bar */}
              <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-20">
                <div className="flex items-center gap-10">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Total Questions</span>
                    <span className="font-extrabold text-lg text-gray-900">{fields.length} items</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Total Points</span>
                    <span className="font-extrabold text-lg text-gray-900">{totalPoints} Points</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2.5">
                    Save as Draft
                  </button>
                  <button type="button" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm bg-white">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={handleProceed}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Proceed to Publish
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <main className="flex-1 p-8">
              <PublishSettingsArea onBack={() => setStep('build')} />
            </main>
          )}

        </form>
      </FormProvider>
    </TeacherLayout>
  );
}
