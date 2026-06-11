import { useState, useMemo } from 'react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { StudentLayout } from '../components/Layout/StudentLayout';
import { useUserStore } from '../stores/use-user-store';
import { FileUploadArea } from '../components/generate-exam/FileUploadArea';
import { ExamSettings } from '../components/generate-exam/ExamSettings';
import { PublishSettingsArea } from '../components/Common/PublishSettingsArea';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';

type GenerateExamFormValues = {
  examTitle: string;
  file: File;
  difficultyDistribution: {
    Easy_Memorization: number;
    Easy_Creativity: number;
    Easy_Thinking: number;
    Normal_Memorization: number;
    Normal_Creativity: number;
    Normal_Thinking: number;
    Hard_Memorization: number;
    Hard_Creativity: number;
    Hard_Thinking: number;
  };
  mcqCount: number;
  targetGroup?: string;
  availableFrom?: Date;
  deadline?: Date;
  allowImmediateAI: boolean;
  allowReview: boolean;
  randomizeQuestions: boolean;
  keepForever: boolean;
};

export default function GenerateExamPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as Partial<GenerateExamFormValues> | null;
  const { currentUser } = useUserStore();

  const isStudent = currentUser?.role?.toLowerCase() === 'student';

  const schema = useMemo(() => {
    return z.object({
      examTitle: z.string().min(1, 'Exam title is required'),
      file: z.instanceof(File, { message: 'Course material PDF is required to generate an exam' })
        .refine((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'), {
          message: 'Only PDF files are supported',
        }),
      difficultyDistribution: z.object({
        Easy_Memorization: z.number().min(0),
        Easy_Creativity: z.number().min(0),
        Easy_Thinking: z.number().min(0),
        Normal_Memorization: z.number().min(0),
        Normal_Creativity: z.number().min(0),
        Normal_Thinking: z.number().min(0),
        Hard_Memorization: z.number().min(0),
        Hard_Creativity: z.number().min(0),
        Hard_Thinking: z.number().min(0),
      }),
      mcqCount: z.number().min(0, 'MCQ Count cannot be negative'),
      targetGroup: isStudent ? z.string().optional() : z.string().min(1, 'Please select a target group'),
      availableFrom: isStudent ? z.date().optional() : z.date({ message: 'Available from date is required' }),
      deadline: isStudent ? z.date().optional() : z.date({ message: 'Deadline date is required' }),
      allowImmediateAI: z.boolean(),
      allowReview: z.boolean(),
      randomizeQuestions: z.boolean(),
      keepForever: z.boolean().default(false),
    }).refine((data) => {
      const total = Object.values(data.difficultyDistribution).reduce((sum, val) => sum + val, 0);
      return total >= 5 && total <= 100;
    }, {
      message: 'Total questions must be between 5 and 100',
      path: ['difficultyDistribution'],
    }).refine((data) => {
      const total = Object.values(data.difficultyDistribution).reduce((sum, val) => sum + val, 0);
      return data.mcqCount <= total;
    }, {
      message: 'MCQ count cannot exceed the total questions count',
      path: ['mcqCount'],
    }).refine((data) => {
      if (data.availableFrom && data.deadline) {
        return data.deadline > data.availableFrom;
      }
      return true;
    }, {
      message: 'Deadline must be after the start (Available From) date',
      path: ['deadline'],
    });
  }, [isStudent]);
  
  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      examTitle: stateData?.examTitle || '',
      file: stateData?.file || undefined,
      difficultyDistribution: stateData?.difficultyDistribution || {
        Easy_Memorization: 3,
        Easy_Creativity: 2,
        Easy_Thinking: 2,
        Normal_Memorization: 3,
        Normal_Creativity: 3,
        Normal_Thinking: 3,
        Hard_Memorization: 3,
        Hard_Creativity: 3,
        Hard_Thinking: 3,
      },
      mcqCount: stateData?.mcqCount ?? 15,
      targetGroup: stateData?.targetGroup || '',
      availableFrom: stateData?.availableFrom ? new Date(stateData.availableFrom) : undefined,
      deadline: stateData?.deadline ? new Date(stateData.deadline) : undefined,
      allowImmediateAI: stateData?.allowImmediateAI ?? true,
      allowReview: stateData?.allowReview ?? true,
      randomizeQuestions: stateData?.randomizeQuestions ?? false,
      keepForever: stateData?.keepForever ?? false,
    }
  });

  const onSubmit = async (data: any) => {
    const redirectUrl = isStudent ? '/student/generate-exam/processing' : '/teacher/generate-exam/processing';
    navigate(redirectUrl, { state: data });
  };

  const handleNextStep = async () => {
    const isStep1Valid = await methods.trigger(['examTitle', 'file', 'difficultyDistribution', 'mcqCount']);
    
    const values = methods.getValues();
    const total = Object.values(values.difficultyDistribution || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0) as number;
    
    let hasCustomError = false;

    if (total < 5 || total > 100) {
      methods.setError('difficultyDistribution', {
        type: 'manual',
        message: 'Total questions must be between 5 and 100',
      });
      hasCustomError = true;
    } else if (isStudent && total > 10) {
      methods.setError('difficultyDistribution', {
        type: 'manual',
        message: 'Students are limited to 10 questions per exam. Please subscribe to PRO to unlock larger exams!',
      });
      hasCustomError = true;
    } else {
      methods.clearErrors('difficultyDistribution');
    }
    
    const mcqCount = Number(values.mcqCount) || 0;
    if (mcqCount > total) {
      methods.setError('mcqCount', {
        type: 'manual',
        message: 'MCQ count cannot exceed the total questions count',
      });
      hasCustomError = true;
    } else if (mcqCount < 0) {
      methods.setError('mcqCount', {
        type: 'manual',
        message: 'MCQ Count cannot be negative',
      });
      hasCustomError = true;
    } else {
      methods.clearErrors('mcqCount');
    }
    
    if (!isStep1Valid || hasCustomError) return;
    setStep(2);
  };

  const Layout = isStudent ? StudentLayout : TeacherLayout;

  return (
    <Layout title="Generate Exam">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 relative bg-slate-50">
          
          {step === 1 && (
            <div className="max-w-[1280px] mx-auto flex-grow flex flex-col gap-8">
              
              <div className="mb-4">
                <h2 className="text-[32px] leading-[40px] font-bold text-gray-900">Generate New Exam</h2>
                <p className="text-[18px] leading-[28px] text-gray-500 mt-2">
                  Configure AI parameters and upload your materials to generate a customized assessment.
                </p>
              </div>

              {/* Exam Title Block */}
              <div className="space-y-1.5 w-full bg-white rounded-xl p-6 border border-gray-200 shadow-[0px_4px_20px_rgba(30,64,175,0.05)]">
                <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">Exam Title</label>
                <input
                  type="text"
                  {...methods.register('examTitle')}
                  placeholder="e.g., Intro to Chemistry - AI Generated Quiz"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
                {methods.formState.errors.examTitle && (
                  <p className="text-red-500 text-xs font-semibold">{String(methods.formState.errors.examTitle.message)}</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Upload */}
                <div className="lg:col-span-7">
                  <FileUploadArea />
                </div>

                {/* Right Column: Settings */}
                <div className="lg:col-span-5">
                  <ExamSettings />
                </div>
              </div>

              {/* Next Button Action Area */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-8">
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[18px] py-3.5 px-10 rounded-xl shadow-[0_8px_30px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 flex items-center gap-2 w-full md:w-auto justify-center group"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <PublishSettingsArea 
              onBack={() => setStep(1)} 
              submitLabel="✨ Generate Exam with AI" 
              isSubmitting={false} 
            />
          )}

        </form>
      </FormProvider>
    </Layout>
  );
}
