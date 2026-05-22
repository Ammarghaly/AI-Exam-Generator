import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function TeacherSignUpForm() {
  const [dragActive, setDragActive] = useState(false);
  const { register, formState: { errors }, watch, setValue, trigger } = useFormContext<any>();
  
  const files_ = watch("file");
  const fileName = files_ && files_.length > 0 ? files_[0].name : null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue("file", e.dataTransfer.files);
      trigger("file");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#464555] ml-1">Full Name</label>
          <input 
            {...register("name")}
            type="text" 
            placeholder="Dr. Jane Smith" 
            className={`w-full h-11 px-4 border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg bg-[#fcf8ff] text-sm text-[#1b1b24] focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.name?.message && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#464555] ml-1">Email Address</label>
          <input 
            {...register("email")}
            type="email" 
            placeholder="jane.smith@university.edu" 
            className={`w-full h-11 px-4 border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg bg-[#fcf8ff] text-sm text-[#1b1b24] focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.email?.message && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#464555] ml-1">Password</label>
          <input 
            {...register("password")}
            type="password" 
            placeholder="••••••••" 
            className={`w-full h-11 px-4 border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg bg-[#fcf8ff] text-sm text-[#1b1b24] focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.password?.message && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#464555] ml-1">Confirm Password</label>
          <input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="••••••••" 
            className={`w-full h-11 px-4 border ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg bg-[#fcf8ff] text-sm text-[#1b1b24] focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.confirmPassword?.message && <span className="text-xs text-red-500">{errors.confirmPassword.message as string}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#464555] ml-1">Subject Taught</label>
        <input 
          {...register("subjects_taught")}
          type="text" 
          placeholder="Advanced Mathematics, Applied Physics" 
          className={`w-full h-11 px-4 border ${errors.subjects_taught ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg bg-[#fcf8ff] text-sm text-[#1b1b24] focus:outline-none focus:ring-2 transition-all`} 
        />
        {errors.subjects_taught?.message && <span className="text-xs text-red-500">{errors.subjects_taught.message as string}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#464555] ml-1">College Certificate</label>
        <label
          className={`w-full py-6 px-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            errors.file ? "border-red-500 bg-red-50" : dragActive ? "bg-[#4f46e5]/10 border-[#3525cd]" : "border-[#C7D2FE] hover:bg-[#C7D2FE]/10 hover:border-[#3525cd]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-10 h-10 rounded-full bg-[#f0ecf9] flex items-center justify-center text-[#3525cd]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className={`text-sm font-semibold ${fileName ? "text-[#006591]" : "text-[#3525cd]"}`}>
              {fileName ? `File selected: ${fileName}` : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-[#464555]">PDF, PNG, or JPG (max. 10MB)</p>
          </div>
          <input 
            {...register("file")}
            type="file" 
            className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </label>
        {errors.file && <span className="text-xs text-red-500">{errors.file.message as string}</span>}
      </div>

      <button 
        type="submit" 
        className="w-full h-12 bg-[#3525cd] text-white text-sm rounded-lg hover:shadow-md active:scale-[0.98] transition-all font-bold mt-2"
      >
        Apply for Teacher Account
      </button>
    </>
  );
}
