import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { resendActivationOtp } from "../../api/auth";

const REMEMBER_EMAIL_KEY = "rememberedEmail";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Priority: email from verify-email redirect → remembered email → empty
  const prefillEmail =
    (location.state as { email?: string } | null)?.email ??
    localStorage.getItem(REMEMBER_EMAIL_KEY) ??
    "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefillEmail,
      rememberMe: !!localStorage.getItem(REMEMBER_EMAIL_KEY),
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post(`/auth/login`, {
        email: data.email,
        password: data.password,
      });

      const { token, user } = res.data;

      // Remember me: save email for next visit, clear if unchecked
      if (data.rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      // Session persistence: localStorage (stays) vs sessionStorage (clears on tab close)
      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));

      toast.success("Welcome back!");
      navigate("/teacher/dashboard");
    } catch (err: any) {
      const resData = err.response?.data;

      // Email not verified → send new OTP and redirect to verify page
      if (resData?.notVerified) {
        try {
          await resendActivationOtp(resData.email);
          toast("Please verify your email. A new code was sent.", { icon: "📧" });
        } catch {
          toast("Please verify your email first.", { icon: "📧" });
        }
        navigate("/verify-email", { state: { email: resData.email } });
        return;
      }

      const message = resData?.message || "Something went wrong";
      toast.error(message);
    }
  };


  return (
    <div className="flex flex-col items-center w-full max-w-[430px]">
      {/* Sparkle icon */}
      <div className="text-[#3730d4] mb-4">
        <svg width="40" height="36" viewBox="0 0 40 36" fill="currentColor">
          <path d="M25 2 L27 10 L35 12 L27 14 L25 22 L23 14 L15 12 L23 10 Z" />
          <path d="M10 18 L11 22 L15 23 L11 24 L10 28 L9 24 L5 23 L9 22 Z" />
        </svg>
      </div>


      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome to Academix AI
      </h1>
      <p className="text-gray-500 mb-8">Sign in to access your academic workspace.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#3730d4] transition-colors bg-white">
            <Mail size={18} className="text-gray-400 shrink-0" />
            <input
              type="email"
              placeholder="name@institution.edu"
              {...register("email")}
              className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
            />
          </div>
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>


        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 gap-3 focus-within:border-[#3730d4] transition-colors bg-white">
            <Lock size={18} className="text-gray-400 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-[#3730d4] font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>


        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="w-4 h-4 rounded border-gray-300 accent-[#3730d4]"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#3730d4] hover:bg-[#2e28b8] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-[#3730d4] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}