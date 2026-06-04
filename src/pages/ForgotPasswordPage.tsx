import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GraduationCap } from "lucide-react";

import { sendOtp, verifyOtp, resetPassword } from "../api/auth.ts";

import ForgotPasswordForm from "../components/auth/ForgotPasswordForm.tsx";
import OtpVerificationForm from "../components/auth/OtpVerificationForm.tsx";
import ResetPasswordForm from "../components/auth/ResetPasswordForm.tsx";
import ResetSuccess from "../components/auth/ResetSuccess.tsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"forgot" | "otp" | "reset" | "success">("forgot");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [otpError, setOtpError] = useState("");

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleForgotPasswordSubmit = async (submittedEmail: string) => {
    setLoading(true);
    try {
      await sendOtp(submittedEmail);
      setEmail(submittedEmail);
      toast.success("Verification code sent to your email!");
      setStep("otp");
      setCooldown(60);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "User not found or failed to send OTP.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (code: string) => {
    setOtpError("");
    setLoading(true);
    try {
      await verifyOtp(email, code);
      setOtpCode(code);
      toast.success("OTP verified successfully!");
      setStep("reset");
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
      await sendOtp(email);
      toast.success("Verification code resent successfully!");
      setCooldown(60);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (password: string) => {
    if (otpCode === null) {
      toast.error("Session expired. Please request a new code.");
      setStep("forgot");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otpCode, password);
      toast.success("Password has been reset successfully!");
      setStep("success");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleChangeEmail = () => {
    setStep("forgot");
    setOtpError("");
    setOtpCode(null);
  };

  const renderCardContent = () => {
    switch (step) {
      case "forgot":
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            loading={loading}
          />
        );
      case "otp":
        return (
          <OtpVerificationForm
            email={email}
            onSubmit={handleOtpVerifySubmit}
            loading={loading}
            error={otpError}
            cooldown={cooldown}
            onResend={handleResendOtp}
            onChangeEmail={handleChangeEmail}
          />
        );
      case "reset":
        return (
          <ResetPasswordForm
            onSubmit={handleResetPasswordSubmit}
            loading={loading}
          />
        );
      case "success":
        return <ResetSuccess onBackToLogin={handleBackToLogin} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f3f5f8] via-[#eef2f9] to-[#f4f2fc] flex flex-col items-center justify-center p-4 selection:bg-[#6b38d4]/10 selection:text-[#6b38d4]">
      <div />

      <div className="w-full max-w-[440px] flex flex-col items-center space-y-6 py-8">
        <div className="flex flex-col items-center space-y-2 select-none">
          <div className="flex items-center justify-center size-12 rounded-xl bg-[#3b2fc9] text-white shadow-md shadow-[#3b2fc9]/20">
            <GraduationCap className="size-7" />
          </div>
          <h1 className="text-xl font-bold text-[#3b2fc9] tracking-tight">
            Academix
          </h1>
        </div>

        <div className="w-full bg-white border border-[#eceff3] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300">
          {renderCardContent()}
        </div>
      </div>
    </div>
  );
}
