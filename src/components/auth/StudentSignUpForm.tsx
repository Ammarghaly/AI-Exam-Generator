import { ChevronDown, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function StudentSignUpForm() {
  const { register, formState: { errors } } = useFormContext<any>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1b1b24]">Full Name</label>
        <input 
          {...register("fullName")}
          type="text" 
          placeholder="Enter your full name" 
          className={`w-full px-4 py-2.5 bg-white border ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] placeholder:text-[#464555]/50 focus:outline-none focus:ring-2 transition-all`} 
        />
        {errors.fullName?.message && <span className="text-xs text-red-500">{errors.fullName.message as string}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1b1b24]">Email Address</label>
        <input 
          {...register("email")}
          type="email" 
          placeholder="name@university.edu" 
          className={`w-full px-4 py-2.5 bg-white border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] placeholder:text-[#464555]/50 focus:outline-none focus:ring-2 transition-all`} 
        />
        {errors.email?.message && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1b1b24]">Education Level</label>
        <div className="relative">
          <select 
            {...register("educationLevel")}
            className={`w-full appearance-none px-4 py-2.5 bg-white border ${errors.educationLevel ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] focus:outline-none focus:ring-2 transition-all cursor-pointer`}
            defaultValue=""
          >
            <option disabled value="">Select your current year</option>
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
            <option value="graduate">Graduate</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#464555]">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {errors.educationLevel?.message && <span className="text-xs text-red-500">{errors.educationLevel.message as string}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1b1b24]">Password</label>
          <input 
            {...register("password")}
            type="password" 
            placeholder="••••••••" 
            className={`w-full px-4 py-2.5 bg-white border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] placeholder:text-[#464555]/50 focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.password?.message && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1b1b24]">Confirm Password</label>
          <input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="••••••••" 
            className={`w-full px-4 py-2.5 bg-white border ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] focus:border-[#3525cd] focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] placeholder:text-[#464555]/50 focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.confirmPassword?.message && <span className="text-xs text-red-500">{errors.confirmPassword.message as string}</span>}
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          className="w-full bg-[#3525cd] hover:bg-[#4f46e5] text-white font-semibold text-base py-3 px-6 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Create Student Account
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
