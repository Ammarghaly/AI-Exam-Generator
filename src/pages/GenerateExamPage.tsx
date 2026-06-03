import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { FileUploadArea } from '../components/generate-exam/FileUploadArea';
import { ExamSettings } from '../components/generate-exam/ExamSettings';
import { PublishSettingsArea } from '../components/Common/PublishSettingsArea';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const generateExamSchema = z.object({
  file: z.instanceof(File, { message: 'Course material PDF is required to generate an exam' }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], { message: 'Difficulty level is required' }),
  questionTypes: z.array(z.string()).min(1, 'Please select at least one question type'),
  questionsCount: z.number().min(5, 'Minimum 5 questions').max(100, 'Maximum 100 questions'),
  targetGroup: z.string().min(1, 'Please select a target group'),
  availableFrom: z.date({ message: 'Available from date is required' }),
  deadline: z.date({ message: 'Deadline date is required' }),
  allowImmediateAI: z.boolean(),
  allowReview: z.boolean(),
  randomizeQuestions: z.boolean(),
});

type GenerateExamFormValues = z.infer<typeof generateExamSchema>;

export default function GenerateExamPage() {
  const [step, setStep] = useState<1 | 2>(1);
  
  const methods = useForm<GenerateExamFormValues>({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      difficulty: 'Medium',
      questionTypes: ['mcq', 'tf'],
      questionsCount: 25,
      targetGroup: '',
      availableFrom: undefined,
      deadline: undefined,
      allowImmediateAI: true,
      allowReview: true,
      randomizeQuestions: false,
    }
  });

  const onSubmit = (data: GenerateExamFormValues) => {
    console.log('Publishing Exam with Data:', data);
    toast.success('Exam successfully published!');
  };

  const handleNextStep = async () => {
    const isStep1Valid = await methods.trigger(['file', 'difficulty', 'questionTypes', 'questionsCount']);
    if (isStep1Valid) {
      setStep(2);
    }
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

              {/* Generate Button Action Area */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-8">
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-orange-600 to-sky-600 hover:from-orange-500 hover:to-sky-500 text-white font-bold text-[20px] py-4 px-10 rounded-xl shadow-[0_8px_30px_rgba(95,0,209,0.3)] transition-all transform hover:-translate-y-1 flex items-center gap-3 w-full md:w-auto justify-center group"
                >
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  ✨ Generate Exam with AI
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <PublishSettingsArea onBack={() => setStep(1)} />
          )}

        </form>
      </FormProvider>
    </TeacherLayout>
  );
}
