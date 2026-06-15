import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { sendOtp, verifyOtp, resetPassword } from "../api/auth.ts";
import logoIcon from "../assets/icon-logo.png";

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
      await sendOtp(submittedEmail, "reset");
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
      await sendOtp(email, "reset");
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
            purpose="reset"
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
    <div className="min-h-screen bg-gradient-to-tr from-[#f3f5f8] via-[#eef2f9] to-[#f4f2fc] dark:from-[#101214] dark:via-[#131518] dark:to-[#171520] flex flex-col items-center justify-center p-4 selection:bg-[#6b38d4]/10 selection:text-[#6b38d4] dark:selection:bg-[#6b38d4]/20 dark:selection:text-indigo-400">
      <div />

      <div className="w-full max-w-[440px] flex flex-col items-center space-y-6 py-8">
        <div className="flex flex-col items-center space-y-2 select-none">
          <img
            src={logoIcon}
            alt="Academix"
            className="w-14 h-14 object-contain"
          />
          <h1 className="text-xl font-bold text-[#3b2fc9] dark:text-indigo-400 tracking-tight">
            Academix
          </h1>
        </div>

        <div className="w-full bg-white dark:bg-[#1f2226] border border-[#eceff3] dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300">
          {renderCardContent()}
        </div>
      </div>
    </div>
  );
}
