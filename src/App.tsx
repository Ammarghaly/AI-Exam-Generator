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
import AIProcessingPage from "./pages/AIProcessingPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TeacherExamManagementPage from "./pages/TeacherExamManagementPage";
import ManualExamCreatorPage from "./pages/ManualExamCreatorPage";
import ExamCreationSelectionPage from "./pages/ExamCreationSelectionPage";
import StudentExamPage from "./pages/StudentExamPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserProfilePage from "./pages/UserProfilePage";

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
        <Route path="/teacher/exam-management" element={<ProtectedRoute><TeacherExamManagementPage /></ProtectedRoute>} />
        <Route path="/teacher/generate-exam" element={<ProtectedRoute><ExamCreationSelectionPage /></ProtectedRoute>} />
        <Route path="/teacher/generate-exam/manual-create" element={<ProtectedRoute><ManualExamCreatorPage /></ProtectedRoute>} />
        <Route path="/teacher/generate-exam/ai-generate" element={<ProtectedRoute><GenerateExamPage /></ProtectedRoute>} />
        <Route path="/teacher/generate-exam/processing" element={<ProtectedRoute><AIProcessingPage /></ProtectedRoute>} />
        <Route path="/teacher/groups" element={<ProtectedRoute><MyGroups /></ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/student/exam/:id" element={<StudentExamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
