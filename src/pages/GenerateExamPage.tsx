import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { StudentLayout } from '../components/Layout/StudentLayout';
import { FileUploadArea } from '../components/generate-exam/FileUploadArea';
import { ExamSettings } from '../components/generate-exam/ExamSettings';
import { PublishSettingsArea } from '../components/Common/PublishSettingsArea';
import { FormProvider } from 'react-hook-form';
import { useGenerateExam } from '../hooks/useGenerateExam';

export default function GenerateExamPage() {
  const {
    step,
    setStep,
    methods,
    onSubmit,
    handleNextStep,
    isStudent,
  } = useGenerateExam();

  const Layout = isStudent ? StudentLayout : TeacherLayout;

  return (
    <Layout title="Generate Exam">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 relative bg-slate-50">
          
          {step === 1 && (
            <div className="max-w-3xl mx-auto flex-grow flex flex-col gap-8">
              
              <div className="mb-4 text-center md:text-left">
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

              {/* Spacious, full-width upload area */}
              <div className="w-full">
                <FileUploadArea />
              </div>

              {/* Next Button Action Area */}
              <div className="mt-4 flex justify-end border-t border-gray-200 pt-8">
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[16px] py-3 px-8 rounded-xl shadow-[0_8px_30px_rgba(79,70,229,0.2)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-4xl mx-auto flex-grow flex flex-col gap-8">
              
              <div className="mb-4 text-center md:text-left">
                <h2 className="text-[32px] leading-[40px] font-bold text-gray-900">AI Question Settings</h2>
                <p className="text-[18px] leading-[28px] text-gray-500 mt-2">
                  Configure cognitive difficulty matrix and formats for the generated exam.
                </p>
              </div>

              {/* Wide and organized exam settings dashboard */}
              <div className="w-full">
                <ExamSettings />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-8 gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full md:w-auto text-[14px] font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Back to Upload
                </button>
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[16px] py-3 px-8 rounded-xl shadow-[0_8px_30px_rgba(79,70,229,0.2)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <PublishSettingsArea 
              onBack={() => setStep(2)} 
              submitLabel="✨ Generate Exam with AI" 
              isSubmitting={false} 
            />
          )}

        </form>
      </FormProvider>
    </Layout>
  );
}
