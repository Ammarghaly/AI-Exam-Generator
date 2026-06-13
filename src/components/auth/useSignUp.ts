import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, signUp } from "../../api/auth.ts";
import { signUpSchema } from "./signUpSchema";
import type { SignUpFormData } from "./signUpSchema";

export function useSignUp() {
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
        formData.append("subjects_taught", data.subjects_taught!);
        if (data.file && data.file[0]) {
          formData.append("file", data.file[0]);
        }
      } else if (data.role === "Student") {
        formData.append("educational_level", data.educational_level!);
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

  return {
    methods,
    currentRole,
    isOtpStep,
    emailForOtp,
    loading,
    otpError,
    cooldown,
    onSubmit,
    handleOtpVerifySubmit,
    handleResendOtp,
    handleChangeEmail,
    handleRoleChange,
    handleSubmit
  };
}
