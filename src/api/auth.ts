import api from "../api/axios.ts";

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export async function sendOtp(email: string): Promise<SendOtpResponse> {
  const response = await api.post<SendOtpResponse>("/auth/send-otp", { email });
  return response.data;
}

export async function verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
    email,
    code,
  });
  return response.data;
}

export async function resetPassword(
  email: string,
  code: string,
  password: string
): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>("/auth/reset-password", {
    email,
    code,
    password,
  });
  return response.data;
}
