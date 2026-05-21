import { useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export function FileUploadArea() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-6 h-full">
      {!file ? (
        <div className="bg-white shadow-[0px_4px_20px_rgba(30,64,175,0.05)] rounded-xl p-8 border border-gray-200 relative overflow-hidden group hover:border-indigo-600 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[300px] h-full">
          <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl absolute inset-4 pointer-events-none group-hover:border-indigo-600/50 transition-colors"></div>

          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 z-10">
            <UploadCloud className="w-10 h-10" />
          </div>

          <h3 className="text-[20px] font-bold text-gray-900 z-10">Upload your PDF Course Material</h3>
          <p className="text-[16px] text-gray-500 mt-2 z-10">
            Drag & drop your syllabus, lecture notes, or reading materials here, or click to browse.
          </p>
          <p className="text-xs font-semibold text-gray-400 mt-4 z-10">
            Supported formats: PDF, DOCX, TXT (Max 50MB)
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-[0px_4px_20px_rgba(30,64,175,0.05)] rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-rose-100 text-rose-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Biology_101_Syllabus.pdf</p>
              <p className="text-sm font-medium text-gray-500">2.4 MB • Uploaded</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-rose-600 transition-colors" onClick={() => setFile(null)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
