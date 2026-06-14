import { Link } from 'react-router-dom';
import { Sparkles, PencilLine, ArrowRight } from 'lucide-react';
import { TeacherLayout } from '../components/Layout/TeacherLayout';
import { PageHeader } from '../components/Common/PageHeader';

export default function ExamCreationSelectionPage() {
  return (
    <TeacherLayout>
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 relative">
        <main className="p-8 mx-auto w-full space-y-8 flex-1">

          <PageHeader
            title="Create New Assessment"
            subtitle="Choose how you would like to generate your exam."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full">
            {/* AI Generation Card */}
            <Link
              to="/teacher/generate-exam/ai-generate"
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-indigo-600 transition-colors duration-300">
                <Sparkles className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Generation</h3>
              <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                Save time by letting our AI generate comprehensive questions based on your syllabus, topics, and difficulty requirements.
              </p>

              <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                <span>Start AI Generator</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>

            {/* Manual Creation Card */}
            <Link
              to="/teacher/generate-exam/manual-create"
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-600 transition-colors duration-300">
                <PencilLine className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">Manual Creation</h3>
              <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                Have full control. Build your exam question by question with our powerful manual editor and specialized question types.
              </p>

              <div className="flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                <span>Open Manual Editor</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>
          </div>

        </main>
      </div>
    </TeacherLayout>
  );
}
