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

export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await api.put('/auth/change-password', { currentPassword, newPassword });
  return response.data;
}

export async function resendActivationOtp(email: string): Promise<SendOtpResponse> {
  const response = await api.post<SendOtpResponse>("/auth/send-otp", { email });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function signUp(formData: FormData) {
  const response = await api.post("/auth/signUp", formData);
  return response.data;
}

export async function logout() {
  await api.post("/auth/logout"); // cookie sent automatically
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export async function getMe() {
  const response = await api.get<{ success: boolean; user: any }>("/auth/me");
  return response.data;
}

export async function updateUserProfile(formData: FormData) {
  const response = await api.put<{ success: boolean; user: any }>("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

