import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { FileUploadArea } from '../components/generate-exam/FileUploadArea';
import { ExamSettings } from '../components/generate-exam/ExamSettings';
import { PublishSettingsArea } from '../components/Common/PublishSettingsArea';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { uploadPDF, generateExamAI, publishAIExam } from '../api/exams';

const generateExamSchema = z.object({
  examTitle: z.string().min(1, 'Exam title is required'),
  file: z.instanceof(File, { message: 'Course material PDF is required to generate an exam' }),
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
  targetGroup: z.string().min(1, 'Please select a target group'),
  availableFrom: z.date({ message: 'Available from date is required' }),
  deadline: z.date({ message: 'Deadline date is required' }),
  allowImmediateAI: z.boolean(),
  allowReview: z.boolean(),
  randomizeQuestions: z.boolean(),
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
});

type GenerateExamFormValues = z.infer<typeof generateExamSchema>;

export default function GenerateExamPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [examId, setExamId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  
  const methods = useForm<GenerateExamFormValues>({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      examTitle: '',
      difficultyDistribution: {
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
      mcqCount: 15,
      targetGroup: '',
      availableFrom: undefined,
      deadline: undefined,
      allowImmediateAI: true,
      allowReview: true,
      randomizeQuestions: false,
    }
  });

  const onSubmit = async (data: GenerateExamFormValues) => {
    setIsGenerating(true);
    const toastId = toast.loading('Uploading material and generating exam with AI... This might take up to a minute.');

    try {
      // Step 1: Upload PDF
      const uploadRes = await uploadPDF(data.file);
      const generatedId = uploadRes.examId;
      setExamId(generatedId);

      // Step 2: Calculate total questions
      const totalQuestions = Object.values(data.difficultyDistribution).reduce((sum, val) => sum + val, 0);

      // Step 3: Map difficulties dynamically from the grid
      const difficultyRules = [
        { key: 'Easy_Memorization', difficulty: 'Easy' as const, measures: 'Memorization' as const },
        { key: 'Easy_Creativity', difficulty: 'Easy' as const, measures: 'Creativity' as const },
        { key: 'Easy_Thinking', difficulty: 'Easy' as const, measures: 'Thinking' as const },
        { key: 'Normal_Memorization', difficulty: 'Normal' as const, measures: 'Memorization' as const },
        { key: 'Normal_Creativity', difficulty: 'Normal' as const, measures: 'Creativity' as const },
        { key: 'Normal_Thinking', difficulty: 'Normal' as const, measures: 'Thinking' as const },
        { key: 'Hard_Memorization', difficulty: 'Hard' as const, measures: 'Memorization' as const },
        { key: 'Hard_Creativity', difficulty: 'Hard' as const, measures: 'Creativity' as const },
        { key: 'Hard_Thinking', difficulty: 'Hard' as const, measures: 'Thinking' as const },
      ].map(item => {
        const count = data.difficultyDistribution[item.key as keyof typeof data.difficultyDistribution] || 0;
        return {
          count,
          difficulty: item.difficulty,
          measures: item.measures,
        };
      }).filter(rule => rule.count > 0);

      // Step 4: Call AI Exam Generation API
      await generateExamAI({
        examId: generatedId,
        totalQuestions,
        mcqCount: data.mcqCount,
        difficulty: difficultyRules,
      });

      toast.success('AI questions generated successfully!', { id: toastId });

      // Step 5: Publish Exam
      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
      );
      const teacherID = user._id ;

      const openingAt = Math.floor(new Date(data.availableFrom).getTime() / 1000);
      const closingAt = Math.floor(new Date(data.deadline).getTime() / 1000);

      const payload = {
        examId: generatedId,
        examDetails: {
          title: data.examTitle,
          openingAt,
          closingAt,
          durationMinutes: 60,
          accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          status: 'Active' as const,
          teacherID,
        }
      };

      await publishAIExam(data.targetGroup, payload);
      toast.success('Exam successfully generated and published!');
      navigate('/teacher/exam-management');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error.message || 'Failed to generate and publish exam', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = async () => {
    const isStep1Valid = await methods.trigger(['examTitle', 'file', 'difficultyDistribution', 'mcqCount']);
    if (!isStep1Valid) return;
    setStep(2);
  };

  return (
    <TeacherLayout>
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
                  <p className="text-red-500 text-xs font-semibold">{methods.formState.errors.examTitle.message}</p>
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
              isSubmitting={isGenerating} 
            />
          )}

        </form>
      </FormProvider>
    </TeacherLayout>
  );
}
