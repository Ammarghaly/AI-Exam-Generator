import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const emailSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
});


interface ForgotPasswordFormProps { 
  onSubmit: (email: string) => void;
  loading: boolean;
}

export default function ForgotPasswordForm({ onSubmit, loading }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const handleFormSubmit = (data: z.infer<typeof emailSchema>) => {
    onSubmit(data.email);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-[28px] font-bold text-[#191c1e] tracking-tight">
          Forgot Password
        </h2>
        <p className="text-sm text-[#5f6470] max-w-[340px] mx-auto leading-relaxed">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs font-semibold text-[#191c1e]">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6470]">
            <Mail className="size-4" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="name@university.edu"
            className={`w-full pl-9 pr-4 py-2.5 bg-[#f1e8ff]/20 border ${
              errors.email ? "border-red-500 ring-1 ring-red-500" : "border-[#c7ccd4]"
            } rounded-lg text-sm placeholder-[#5f6470]/70 focus:outline-none focus:border-[#6b38d4] focus:ring-2 focus:ring-[#6b38d4]/20 transition-all`}
            disabled={loading}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#6b38d4] hover:bg-[#5225af] active:bg-[#441a98] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Send Reset Link
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b38d4] hover:text-[#5225af] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>
      </div>
    </form>
  );
}
