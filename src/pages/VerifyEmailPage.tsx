import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GraduationCap } from "lucide-react";

import { verifyOtp, resendActivationOtp } from "../api/auth";
import OtpVerificationForm from "../components/auth/OtpVerificationForm";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from LoginForm via navigate state
  const email: string = location.state?.email ?? "";

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // If no email in state, redirect back to login
  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (code: string) => {
    setOtpError("");
    setLoading(true);
    try {
      await verifyOtp(email, code);
      toast.success("Email verified! You can now log in.");
      navigate("/login", { replace: true, state: { email } });
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid or expired OTP.";
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await resendActivationOtp(email);
      toast.success("A new verification code was sent to your email.");
      setCooldown(60);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to resend code. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f3f5f8] via-[#eef2f9] to-[#f4f2fc] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col items-center space-y-6 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 select-none">
          <div className="flex items-center justify-center size-12 rounded-xl bg-[#3b2fc9] text-white shadow-md shadow-[#3b2fc9]/20">
            <GraduationCap className="size-7" />
          </div>
          <h1 className="text-xl font-bold text-[#3b2fc9] tracking-tight">
            Academix
          </h1>
        </div>

        {/* Card */}
        <div className="w-full bg-white border border-[#eceff3] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <OtpVerificationForm
            email={email}
            onSubmit={handleVerify}
            loading={loading}
            error={otpError}
            cooldown={cooldown}
            onResend={handleResend}
            onChangeEmail={handleChangeEmail}
          />
        </div>
      </div>
    </div>
  );
}
