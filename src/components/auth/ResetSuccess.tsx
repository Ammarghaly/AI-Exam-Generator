import { CheckCircle2 } from "lucide-react";

interface ResetSuccessProps {
  onBackToLogin: () => void;
}

export default function ResetSuccess({ onBackToLogin }: ResetSuccessProps) {
  return (
    <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="mx-auto flex items-center justify-center size-16 rounded-full bg-[#e8fbf1] text-[#10b981]">
        <CheckCircle2 className="size-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#191c1e]">
          Password Reset Successful!
        </h2>
        <p className="text-sm text-[#5f6470] max-w-[300px] mx-auto leading-relaxed">
          Your password has been changed. You can now login with your new password.
        </p>
      </div>
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full inline-flex items-center justify-center py-3 px-4 bg-[#6b38d4] hover:bg-[#5225af] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all"
      >
        Go to Login
      </button>
    </div>
  );
}
