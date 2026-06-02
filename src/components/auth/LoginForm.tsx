import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, EyeOff, Eye } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
const navigate = useNavigate();

const onSubmit = async (data: LoginFormData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { email: data.email, password: data.password }
    );
    localStorage.setItem("token", res.data.token);
    toast.success("Welcome back! ");
    navigate("/dashboard");
  } catch (err) {
  const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong";
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

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-[#3730d4] font-medium hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}