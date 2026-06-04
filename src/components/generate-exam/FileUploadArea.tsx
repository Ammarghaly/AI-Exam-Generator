import React, { useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export function FileUploadArea() {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const file = watch('file') as File | null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('file', e.target.files[0], { shouldValidate: true });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('file', null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.txt"
      />
      
      {!file ? (
        <div className="h-full flex flex-col gap-2">
          <div 
            onClick={handleClick}
            className={`bg-white shadow-[0px_4px_20px_rgba(30,64,175,0.05)] rounded-xl p-8 border ${errors.file ? 'border-rose-500' : 'border-gray-200'} relative overflow-hidden group hover:border-indigo-600 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[300px] flex-1`}
          >
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl absolute inset-4 pointer-events-none group-hover:border-indigo-600/50 transition-colors"></div>

            <div className={`w-20 h-20 rounded-full ${errors.file ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-center mb-6 z-10`}>
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
          {errors.file && (
            <p className="text-sm font-semibold text-rose-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errors.file.message as string}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-[0px_4px_20px_rgba(30,64,175,0.05)] rounded-xl p-4 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-900 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {formatFileSize(file.size)} • Uploaded
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="text-gray-400 hover:text-rose-600 transition-colors shrink-0 p-2" 
            onClick={handleRemoveFile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
