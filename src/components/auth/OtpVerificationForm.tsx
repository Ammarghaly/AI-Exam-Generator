import { useRef, useState } from "react";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface OtpVerificationFormProps {
  email: string;
  onSubmit: (code: string) => void;
  loading: boolean;
  error: string;
  cooldown: number;
  onResend: () => void;
  onChangeEmail: () => void;
}

export default function OtpVerificationForm({
  email,
  onSubmit,
  loading,
  error,
  cooldown,
  onResend,
  onChangeEmail,
}: OtpVerificationFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [localError, setLocalError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value;
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const char = cleanValue[cleanValue.length - 1];
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputsRef.current[5]?.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = otp.join("");
    if (codeString.length < 6) {
      setLocalError("Please enter all 6 digits");
      return;
    }
    setLocalError("");
    onSubmit(codeString);
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-[#f1e8ff] text-[#6b38d4]">
          <Mail className="size-6" />
        </div>
        <h2 className="text-[28px] font-bold text-[#191c1e] tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-sm text-[#5f6470] max-w-[340px] mx-auto leading-relaxed">
          Enter the 6-digit code we sent to <span className="font-semibold text-[#191c1e]">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={loading}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className={`size-11 sm:size-12 text-center text-lg font-bold bg-[#f1e8ff]/20 border ${displayError ? "border-red-500 ring-1 ring-red-500" : "border-[#c7ccd4]"
                } rounded-lg focus:outline-none focus:border-[#6b38d4] focus:ring-2 focus:ring-[#6b38d4]/20 transition-all`}
            />
          ))}
        </div>
        {displayError && (
          <p className="text-xs text-red-500 font-medium text-center">{displayError}</p>
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
            Verify & Continue
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <div className="text-center pt-2 space-y-3">
        <div className="text-xs text-[#5f6470]">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={onResend}
            disabled={loading || cooldown > 0}
            className="font-semibold text-[#6b38d4] hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={onChangeEmail}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5f6470] hover:text-[#191c1e] transition-colors"
          >
            <ArrowLeft className="size-3" />
            Change Email Address
          </button>
        </div>
      </div>
    </form>
  );
}
