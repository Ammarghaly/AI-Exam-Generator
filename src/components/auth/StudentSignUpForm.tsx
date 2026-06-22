import { ChevronDown, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function StudentSignUpForm() {
  const { register, formState: { errors, isSubmitting } } = useFormContext<any>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1b1b24] dark:text-white">Full Name</label>
        <input 
          {...register("name")}
          type="text" 
          placeholder="Enter your full name" 
          className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/45 border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] dark:border-white/10 focus:border-[#3525cd] dark:focus:border-indigo-500 focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] dark:text-white placeholder:text-[#464555]/50 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`} 
        />
        {errors.name?.message && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1b1b24] dark:text-white">Email Address</label>
        <input 
          {...register("email")}
          type="email" 
          placeholder="name@university.edu" 
          className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/45 border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] dark:border-white/10 focus:border-[#3525cd] dark:focus:border-indigo-500 focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] dark:text-white placeholder:text-[#464555]/50 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`} 
        />
        {errors.email?.message && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1b1b24] dark:text-white">Education Level</label>
        <div className="relative">
          <select 
            {...register("educational_level")}
            className={`w-full appearance-none px-4 py-2.5 bg-white dark:bg-zinc-900/45 border ${errors.educational_level ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] dark:border-white/10 focus:border-[#3525cd] dark:focus:border-indigo-500 focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] dark:text-white focus:outline-none focus:ring-2 transition-all cursor-pointer`}
            defaultValue=""
          >
            <option disabled value="" className="dark:bg-zinc-900">Select your current year</option>
            <option value="freshman" className="dark:bg-zinc-900">Freshman</option>
            <option value="sophomore" className="dark:bg-zinc-900">Sophomore</option>
            <option value="junior" className="dark:bg-zinc-900">Junior</option>
            <option value="senior" className="dark:bg-zinc-900">Senior</option>
            <option value="graduate" className="dark:bg-zinc-900">Graduate</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#464555] dark:text-zinc-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {errors.educational_level?.message && <span className="text-xs text-red-500">{errors.educational_level.message as string}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1b1b24] dark:text-white">Password</label>
          <input 
            {...register("password")}
            type="password" 
            placeholder="••••••••" 
            className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/45 border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] dark:border-white/10 focus:border-[#3525cd] dark:focus:border-indigo-500 focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] dark:text-white placeholder:text-[#464555]/50 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.password?.message && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1b1b24] dark:text-white">Confirm Password</label>
          <input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="••••••••" 
            className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-900/45 border ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#c7c4d8] dark:border-white/10 focus:border-[#3525cd] dark:focus:border-indigo-500 focus:ring-[#3525cd]/20"} rounded-lg text-sm text-[#1b1b24] dark:text-white placeholder:text-[#464555]/50 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all`} 
          />
          {errors.confirmPassword?.message && <span className="text-xs text-red-500">{errors.confirmPassword.message as string}</span>}
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-[#3525cd] hover:bg-[#4f46e5] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-base py-3 px-6 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Account..." : "Create Student Account"}
          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </>
  );
}
