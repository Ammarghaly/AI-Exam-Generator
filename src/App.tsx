import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyGroups from "./pages/MyGroups";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./stores/use-theme-store";
import SignUpPage from "./pages/SignUpPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import GenerateExamPage from "./pages/GenerateExamPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Guest-only routes — redirect to dashboard if already logged in */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/sign-up" element={<GuestRoute><SignUpPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/verify-email" element={<GuestRoute><VerifyEmailPage /></GuestRoute>} />
        {/* Protected routes — redirect to login if not logged in */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboardPage /></ProtectedRoute>} />
        <Route path="/teacher/generate-exam" element={<ProtectedRoute><GenerateExamPage /></ProtectedRoute>} />
        <Route path="/teacher/groups" element={<ProtectedRoute><MyGroups /></ProtectedRoute>} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
