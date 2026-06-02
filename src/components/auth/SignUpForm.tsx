import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentSignUpForm from "./StudentSignUpForm";
import TeacherSignUpForm from "./TeacherSignUpForm";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, signUp } from "../../api/auth.ts";
import OtpVerificationForm from "./OtpVerificationForm";
import { signUpSchema } from "./signUpSchema";
import type { SignUpFormData } from "./signUpSchema";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "Student",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      educational_level: "",
    } as SignUpFormData,
    mode: "onTouched",
  });

  const { handleSubmit, reset, watch, setError } = methods;
  const currentRole = watch("role");

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (data.role === "Teacher") {
        formData.append("subjects_taught", data.subjects_taught);
        if (data.file && data.file[0]) {
          formData.append("file", data.file[0]);
        }
      } else if (data.role === "Student") {
        formData.append("educational_level", data.educational_level);
      }

      const response = await signUp(formData);
      console.log("Registration successful", response);
      
      setEmailForOtp(data.email);
      setIsOtpStep(true);
      setCooldown(60);
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message;
      if (errorMsg) {
        setError("root", { message: errorMsg });
      } else {
        setError("root", { message: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (code: string) => {
    setOtpError("");
    setLoading(true);
    try {
      await verifyOtp(emailForOtp, code);
      toast.success("Account verified successfully! You can now log in.");
      navigate("/login");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Invalid or expired OTP code.";
      toast.error(errorMsg);
      setOtpError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await sendOtp(emailForOtp);
      toast.success("Verification code resent successfully!");
      setCooldown(60);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setIsOtpStep(false);
    setOtpError("");
  };

  const handleRoleChange = (newRole: "Student" | "Teacher") => {
    if (newRole === currentRole) return;
    if (newRole === "Student") {
      reset({
        role: "Student",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        educational_level: "",
      } as SignUpFormData);
    } else {
      reset({
        role: "Teacher",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        subjects_taught: "",
        file: undefined,
      } as SignUpFormData);
    }
  };

  if (isOtpStep) {
    return (
      <OtpVerificationForm
        email={emailForOtp}
        onSubmit={handleOtpVerifySubmit}
        loading={loading}
        error={otpError}
        cooldown={cooldown}
        onResend={handleResendOtp}
        onChangeEmail={handleChangeEmail}
      />
    );
  }

  return (
    <div className="flex flex-col w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1b1b24] mb-1">
          {currentRole === "Student" ? "Join as a Student" : "Join as a Teacher"}
        </h1>
        <p className="text-sm text-[#464555]">
          {currentRole === "Student"
            ? "Start your journey towards academic excellence today."
            : "Empower your classroom with AI-driven academic excellence."}
        </p>
      </header>

      <div className="flex p-1 bg-[#f0ecf9] rounded-lg mb-6">
        <button
          onClick={() => handleRoleChange("Student")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${currentRole === "Student"
            ? "bg-white text-[#3525cd] shadow-sm ring-1 ring-black/5"
            : "text-[#464555] hover:bg-[#eae6f4]"
            }`}
        >
          Student
        </button>
        <button
          onClick={() => handleRoleChange("Teacher")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${currentRole === "Teacher"
            ? "bg-white text-[#3525cd] shadow-sm ring-1 ring-black/5"
            : "text-[#464555] hover:bg-[#eae6f4]"
            }`}
        >
          Teacher
        </button>
      </div>

      <div className="min-h-[360px]">
        <FormProvider {...methods}>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            {methods.formState.errors.root && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {methods.formState.errors.root.message}
              </div>
            )}
            {currentRole === "Student" ? <StudentSignUpForm /> : <TeacherSignUpForm />}
          </form>
        </FormProvider>
      </div>

      {/* Footer Links */}
      <footer className="mt-8 pt-6 border-t border-[#c7c4d8] flex flex-col items-center gap-4">
        <p className="text-sm text-[#464555] text-center">
          Already have an account?{" "}
          <Link className="text-[#3525cd] font-semibold hover:underline" to="/login">Back to Login</Link>
        </p>
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-12 bg-[#c7c4d8]"></span>
          <span className="text-xs text-[#464555] uppercase tracking-wider">Secure Access</span>
          <span className="h-[1px] w-12 bg-[#c7c4d8]"></span>
        </div>
      </footer>

    </div>
  );
}
